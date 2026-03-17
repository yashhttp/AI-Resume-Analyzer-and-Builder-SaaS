import { renderSidebar, initSidebarEvents } from '../components/sidebar.js';

let resumeData = {
  basics: {
    name: '',
    label: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: ''
  },
  summary: '',
  objective: '',
  work: [],
  education: [],
  skills: [],
  projects: [],
  achievements: [],
  certifications: [],
  extraCurricular: [],
  coCurricular: []
};

// Try to load preserved state from localStorage
const savedData = localStorage.getItem('resumeBuilderData');
if (savedData) {
  try {
    const parsedData = JSON.parse(savedData);
    // Merge nested basics carefully, and ensure new top-level arrays exist
    resumeData = {
      ...resumeData,
      ...parsedData,
      basics: { ...resumeData.basics, ...(parsedData.basics || {}) }
    };
    
    // Safety check: ensure all new sections are arrays
    ['achievements', 'certifications', 'extraCurricular', 'coCurricular'].forEach(key => {
        if (!Array.isArray(resumeData[key])) {
            resumeData[key] = [];
        }
    });
  } catch (e) {
    console.error("Failed to parse saved resume data", e);
  }
}

// Try to load preserved template setting
const savedTemplate = localStorage.getItem('resumeBuilderTemplate');
let activeTemplate = savedTemplate || 'Professional';

let activeTab = 'personal';

const templates = {
  'Professional': { category: 'Classic', desc: 'Clean & traditional layout', color: '#374151' },
  'Executive': { category: 'Classic', desc: 'Elegant centered layout', color: '#6b7280' },
  'Modern': { category: 'Modern', desc: 'Gradient accents & clean lines', color: '#2563eb' },
  'Minimal': { category: 'Modern', desc: 'Ultra-clean with max whitespace', color: '#9ca3af' },
  'Creative': { category: 'Creative', desc: 'Dark sidebar with amber accents', color: '#d97706' },
  'Developer': { category: 'Tech', desc: 'Terminal-inspired dark theme', color: '#10b981' },
  'Elegant': { category: 'Premium', desc: 'Gold accents & serif typography', color: '#b8860b' }
};

// --- Helper Functions (Defined before use to avoid ReferenceError) ---

const renderDropdownItems = () => {
    let html = '';
    const categories = ['Classic', 'Modern', 'Creative', 'Tech', 'Premium'];
    
    categories.forEach(cat => {
        html += `<div class="dropdown-category">${cat.toUpperCase()}</div>`;
        Object.entries(templates).forEach(([name, data]) => {
            if (data.category === cat) {
                const isActive = activeTemplate === name;
                html += `
                    <div class="dropdown-item ${isActive ? 'active' : ''}" data-tpl="${name}">
                        <div class="item-icon-wrapper">
                            <div class="item-circle" style="border-color: ${data.color}; background: ${isActive ? data.color : 'transparent'}"></div>
                        </div>
                        <div class="item-info">
                            <div class="item-name">${name}</div>
                            <div class="item-desc">${data.desc}</div>
                        </div>
                    </div>
                `;
            }
        });
    });
    return html;
};

const renderWorkFormItem = (work, index) => `
  <div class="repeater-item" data-index="${index}">
    <span class="remove-btn" onclick="removeWork(${index})">Remove</span>
    <div class="grid-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div class="form-group">
            <label style="font-size: 0.75rem;">Job Title</label>
            <input type="text" value="${work.position || ''}" placeholder="Software Engineer" oninput="updateWork(${index}, 'position', this.value)">
        </div>
        <div class="form-group">
            <label style="font-size: 0.75rem;">Company</label>
            <input type="text" value="${work.company || ''}" placeholder="Google" oninput="updateWork(${index}, 'company', this.value)">
        </div>
    </div>
    <div class="grid-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
      <div class="form-group">
        <label style="font-size: 0.75rem;">Location</label>
        <input type="text" value="${work.location || ''}" placeholder="Bangalore, India" oninput="updateWork(${index}, 'location', this.value)">
      </div>
      <div class="form-group">
        <label style="font-size: 0.75rem;">Duration</label>
        <input type="text" value="${work.startDate || ''}" placeholder="Jan 2022 - Present" oninput="updateWork(${index}, 'startDate', this.value)">
      </div>
    </div>
    <div class="form-group">
      <label style="font-size: 0.75rem;">Description</label>
      <textarea rows="4" placeholder="• Led a team of 5 to build..." oninput="updateWork(${index}, 'summary', this.value)">${work.summary || ''}</textarea>
    </div>
  </div>
`;

const renderEduFormItem = (edu, index) => `
  <div class="repeater-item" data-index="${index}">
    <span class="remove-btn" onclick="removeEdu(${index})">Remove</span>
    <div class="grid-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div class="form-group">
            <label style="font-size: 0.75rem;">Degree</label>
            <input type="text" value="${edu.degree || ''}" placeholder="B.Tech Computer Science" oninput="updateEdu(${index}, 'degree', this.value)">
        </div>
        <div class="form-group">
            <label style="font-size: 0.75rem;">Institution</label>
            <input type="text" value="${edu.institution || ''}" placeholder="IIT Delhi" oninput="updateEdu(${index}, 'institution', this.value)">
        </div>
    </div>
    <div class="grid-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
      <div class="form-group">
        <label style="font-size: 0.75rem;">Year</label>
        <input type="text" value="${edu.year || ''}" placeholder="2019 - 2023" oninput="updateEdu(${index}, 'year', this.value)">
      </div>
      <div class="form-group">
        <label style="font-size: 0.75rem;">GPA</label>
        <input type="text" value="${edu.gpa || ''}" placeholder="8.5/10" oninput="updateEdu(${index}, 'gpa', this.value)">
      </div>
    </div>
  </div>
`;

const renderActiveTabContent = () => {
    switch (activeTab) {
        case 'personal':
            return `
                <div class="animate-fade-in">
                    <h2 style="margin-bottom: 2rem; font-size: 1.25rem;">Personal Information</h2>
                    <div class="grid-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
                        <div class="form-group">
                            <label style="font-size: 0.75rem;">Full Name</label>
                            <input type="text" value="${resumeData.basics.name}" oninput="updateBasics('name', this.value)" placeholder="John Doe">
                        </div>
                        <div class="form-group">
                            <label style="font-size: 0.75rem;">Email</label>
                            <input type="email" value="${resumeData.basics.email}" oninput="updateBasics('email', this.value)" placeholder="john@example.com">
                        </div>
                    </div>
                    <div class="grid-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
                        <div class="form-group">
                            <label style="font-size: 0.75rem;">Phone</label>
                            <input type="text" value="${resumeData.basics.phone}" oninput="updateBasics('phone', this.value)" placeholder="+91 9876543210">
                        </div>
                        <div class="form-group">
                            <label style="font-size: 0.75rem;">Location</label>
                            <input type="text" value="${resumeData.basics.location}" oninput="updateBasics('location', this.value)" placeholder="Mumbai, India">
                        </div>
                    </div>
                    <div class="grid-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                        <div class="form-group">
                            <label style="font-size: 0.75rem;">LinkedIn</label>
                            <input type="text" value="${resumeData.basics.linkedin || ''}" oninput="updateBasics('linkedin', this.value)" placeholder="linkedin.com/in/johndoe">
                        </div>
                        <div class="form-group">
                            <label style="font-size: 0.75rem;">Portfolio</label>
                            <input type="text" value="${resumeData.basics.website || ''}" oninput="updateBasics('website', this.value)" placeholder="johndoe.dev">
                        </div>
                    </div>
                </div>
            `;
        case 'summary':
            return `
                <div class="animate-fade-in">
                    <h2 style="margin-bottom: 2rem; font-size: 1.25rem;">Summary & Objective</h2>
                    <div class="form-group" style="margin-bottom: 2rem;">
                        <label style="display: flex; justify-content: space-between; font-size: 0.75rem;">
                            <span>Professional Summary</span>
                            <span style="color: #888; font-weight: normal; font-style: italic;">For Experienced</span>
                        </label>
                        <textarea rows="6" oninput="updateSummary(this.value)" placeholder="A results-driven software engineer with 3+ years of experience...">${resumeData.summary || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label style="display: flex; justify-content: space-between; font-size: 0.75rem;">
                            <span>Career Objective</span>
                            <span style="color: #888; font-weight: normal; font-style: italic;">For Fresher</span>
                        </label>
                        <textarea rows="4" oninput="updateObjective(this.value)" placeholder="Aspiring software engineer seeking to leverage...">${resumeData.objective || ''}</textarea>
                    </div>
                </div>
            `;
        case 'experience':
            return `
                <div class="animate-fade-in">
                    <h2 style="margin-bottom: 2rem; font-size: 1.25rem;">Work Experience</h2>
                    <div id="workItems">
                        ${resumeData.work.map((w, i) => renderWorkFormItem(w, i)).join('')}
                    </div>
                    <button class="btn btn-secondary btn-sm w-100" id="addWorkBtn">+ Add Experience</button>
                </div>
            `;
        case 'education':
            return `
                <div class="animate-fade-in">
                    <h2 style="margin-bottom: 2rem; font-size: 1.25rem;">Education</h2>
                    <div id="eduItems">
                        ${resumeData.education.map((e, i) => renderEduFormItem(e, i)).join('')}
                    </div>
                    <button class="btn btn-secondary btn-sm w-100" id="addEduBtn">+ Add Education</button>
                </div>
            `;
        case 'projects':
            return `
                <div class="animate-fade-in">
                    <h2 style="margin-bottom: 2rem; font-size: 1.25rem;">Projects</h2>
                    <div id="projectItems">
                        ${resumeData.projects.map((p, i) => `
                            <div class="repeater-item" data-index="${i}">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                                    <h3 style="font-size: 1rem; color: #fff; margin: 0;">Project ${i + 1}</h3>
                                    ${resumeData.projects.length > 1 ? `<span class="remove-btn" onclick="removeProject(${i})">Remove</span>` : ''}
                                </div>
                                <div class="form-group" style="margin-bottom: 1.5rem;">
                                    <label>Project Name</label>
                                    <input type="text" value="${p.name || ''}" placeholder="E-commerce App" oninput="updateProject(${i}, 'name', this.value)">
                                </div>
                                <div class="form-group" style="margin-bottom: 1.5rem;">
                                    <label>Description</label>
                                    <textarea rows="4" placeholder="• Built a full-stack e-commerce platform..." oninput="updateProject(${i}, 'description', this.value)">${p.description || ''}</textarea>
                                </div>
                                <div class="grid-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                                    <div class="form-group">
                                        <label>Technologies Used</label>
                                        <input type="text" value="${p.tech || ''}" placeholder="React, Node.js, MongoDB" oninput="updateProject(${i}, 'tech', this.value)">
                                    </div>
                                    <div class="form-group">
                                        <label>Project Link (Optional)</label>
                                        <input type="text" value="${p.link || ''}" placeholder="github.com/username/project" oninput="updateProject(${i}, 'link', this.value)">
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <button class="btn btn-secondary btn-sm w-100 neon-border" id="addProjectBtn" style="background: rgba(0, 217, 255, 0.05); color: #00d9ff; border-style: dashed;">+ Add Project</button>
                </div>
            `;
        case 'skills':
            return `
                <div class="animate-fade-in">
                    <h2 style="margin-bottom: 2rem; font-size: 1.25rem;">Skills</h2>
                    <div class="form-group">
                        <label style="font-size: 0.75rem;">Technical Skills (comma separated)</label>
                        <textarea rows="6" oninput="updateSkills(this.value)" placeholder="React, Node.js, Python, AWS, SQL, Git, Docker, TypeScript...">${resumeData.skills.join(', ')}</textarea>
                        <p style="margin-top: 0.5rem; font-size: 0.75rem; color: #888;">Comma separated skills likhein</p>
                    </div>
                </div>
            `;
        case 'achievements':
            return `
                <div class="animate-fade-in">
                    <h2 style="margin-bottom: 2rem; font-size: 1.25rem;">Achievements</h2>
                    <div id="achievementItems">
                        ${resumeData.achievements.map((item, i) => `
                            <div class="repeater-item" data-index="${i}">
                                <span class="remove-btn" onclick="removeAchievement(${i})">Remove</span>
                                <div class="form-group">
                                    <label style="font-size: 0.75rem;">Achievement #${i + 1}</label>
                                    <textarea rows="2" placeholder="Won first place in Hackathon 2023..." oninput="updateAchievement(${i}, this.value)">${item || ''}</textarea>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <button class="btn btn-secondary btn-sm w-100 neon-border" id="addAchievementBtn" style="background: rgba(0, 217, 255, 0.05); color: #00d9ff; border-style: dashed;">+ Add Achievement</button>
                </div>
            `;
        case 'certifications':
            return `
                <div class="animate-fade-in">
                    <h2 style="margin-bottom: 2rem; font-size: 1.25rem;">Certifications</h2>
                    <div id="certItems">
                        ${resumeData.certifications.map((item, i) => `
                            <div class="repeater-item" data-index="${i}">
                                <span class="remove-btn" onclick="removeCert(${i})">Remove</span>
                                <div class="form-group">
                                    <label style="font-size: 0.75rem;">Certification #${i + 1}</label>
                                    <textarea rows="2" placeholder="AWS Certified Solutions Architect..." oninput="updateCert(${i}, this.value)">${item || ''}</textarea>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <button class="btn btn-secondary btn-sm w-100 neon-border" id="addCertBtn" style="background: rgba(0, 217, 255, 0.05); color: #00d9ff; border-style: dashed;">+ Add Certification</button>
                </div>
            `;
        case 'extraCurricular':
            return `
                <div class="animate-fade-in">
                    <h2 style="margin-bottom: 2rem; font-size: 1.25rem;">Extra-curricular Achievements</h2>
                    <div id="extraCurricularItems">
                        ${resumeData.extraCurricular.map((item, i) => `
                            <div class="repeater-item" data-index="${i}">
                                <span class="remove-btn" onclick="removeExtraCurricular(${i})">Remove</span>
                                <div class="form-group">
                                    <label style="font-size: 0.75rem;">Achievement #${i + 1}</label>
                                    <textarea rows="2" placeholder="Volunteer at Local Food Bank..." oninput="updateExtraCurricular(${i}, this.value)">${item || ''}</textarea>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <button class="btn btn-secondary btn-sm w-100 neon-border" id="addExtraCurricularBtn" style="background: rgba(0, 217, 255, 0.05); color: #00d9ff; border-style: dashed;">+ Add Achievement</button>
                </div>
            `;
        case 'coCurricular':
            return `
                <div class="animate-fade-in">
                    <h2 style="margin-bottom: 2rem; font-size: 1.25rem;">Co-curricular Achievements</h2>
                    <div id="coCurricularItems">
                        ${resumeData.coCurricular.map((item, i) => `
                            <div class="repeater-item" data-index="${i}">
                                <span class="remove-btn" onclick="removeCoCurricular(${i})">Remove</span>
                                <div class="form-group">
                                    <label style="font-size: 0.75rem;">Achievement #${i + 1}</label>
                                    <textarea rows="2" placeholder="Member of College Coding Club..." oninput="updateCoCurricular(${i}, this.value)">${item || ''}</textarea>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <button class="btn btn-secondary btn-sm w-100 neon-border" id="addCoCurricularBtn" style="background: rgba(0, 217, 255, 0.05); color: #00d9ff; border-style: dashed;">+ Add Achievement</button>
                </div>
            `;
        default: return '';
    }
};

const renderResumeTemplate = () => {
    const { 
        basics: personal = {}, 
        summary = '', 
        work: experience = [], 
        education = [], 
        projects = [], 
        skills = [] 
    } = resumeData;

    if (activeTemplate === 'Creative') {
        const { 
            basics: personal = {}, 
            summary = '', 
            objective = '', 
            work: experience = [], 
            education = [], 
            projects = [], 
            skills = [], 
            achievements = [], 
            certifications = [], 
            extraCurricular = [], 
            coCurricular = [] 
        } = resumeData;
        const summaryContent = summary || objective;
        const summaryHeader = summary ? "Profile" : "Objective";
        
        return `
            <div id="resume-preview-root">
                <div class="resume-page" style="font-family: 'Segoe UI', 'Roboto', sans-serif; font-size: 10.5pt; line-height: 1.6; display: flex; padding: 0;">
                <!-- Sidebar -->
                <div style="width: 72mm; background: linear-gradient(to bottom, #0f172a, #1e293b); color: white; padding: 40px 24px; display: flex; flex-direction: column; gap: 24px;">
                    <div>
                        <h1 style="font-size: 1.5rem; font-weight: 700; line-height: 1.25; margin: 0;">${personal.name || "Your Name"}</h1>
                        <div style="margin-top: 16px; display: flex; flex-direction: column; gap: 8px; font-size: 0.75rem; color: #cbd5e1;">
                            ${personal.email ? `<p style="margin: 0;">✉ ${personal.email}</p>` : ''}
                            ${personal.phone ? `<p style="margin: 0;">☎ ${personal.phone}</p>` : ''}
                            ${personal.location ? `<p style="margin: 0;">📍 ${personal.location}</p>` : ''}
                            ${personal.linkedin ? `<p style="margin: 0;">🔗 ${personal.linkedin}</p>` : ''}
                            ${personal.website ? `<p style="margin: 0;">🌐 ${personal.website}</p>` : ''}
                        </div>
                    </div>
                </div>

                <!-- Main Content -->
                <div style="flex: 1; padding: 40px 32px; display: flex; flex-direction: column; gap: 24px;">
                    ${summaryContent ? `
                        <section>
                            <h2 style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #d97706; margin-bottom: 8px;">${summaryHeader}</h2>
                            <p style="font-size: 0.875rem; color: #4b5563; line-height: 1.625; margin: 0;">${summaryContent}</p>
                        </section>
                    ` : ''}

                    ${experience.length > 0 && experience[0].company ? `
                        <section>
                            <h2 style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #d97706; margin-bottom: 12px;">Work Experience</h2>
                            <div style="display: flex; flex-direction: column; gap: 16px;">
                                ${experience.map(exp => `
                                    <div class="page-break-avoid" style="position: relative; padding-left: 16px; border-left: 2px solid #fbbf24;">
                                        <div style="display: flex; justify-content: space-between; align-items: baseline;">
                                            <h3 style="font-size: 0.875rem; font-weight: 700; color: #111827; margin: 0;">${exp.position}</h3>
                                            <span style="font-size: 0.75rem; color: #9ca3af; margin-left: 16px;">${exp.startDate} - ${exp.endDate}</span>
                                        </div>
                                        <p style="font-size: 0.875rem; color: #d97706; margin: 0;">${exp.company}${exp.location ? ` • ${exp.location}` : ""}</p>
                                        ${exp.summary ? `<p style="font-size: 0.875rem; color: #4b5563; margin-top: 4px; white-space: pre-line;">${exp.summary}</p>` : ""}
                                    </div>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${education.length > 0 && education[0].institution ? `
                        <section>
                            <h2 style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #d97706; margin-bottom: 12px;">Education</h2>
                            <div style="display: flex; flex-direction: column; gap: 12px;">
                                ${education.map(edu => `
                                    <div class="page-break-avoid" style="font-size: 0.75rem;">
                                        <h3 style="font-size: 0.875rem; font-weight: 600; color: #111827; margin: 0;">${edu.degree}</h3>
                                        <p style="color: #4b5563; margin: 0;">${edu.institution}</p>
                                        <p style="color: #6b7280; margin: 0;">${edu.year}</p>
                                        ${edu.gpa ? `<p style="color: #9ca3af; font-size: 0.7rem; margin: 0;">GPA: ${edu.gpa}</p>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${projects.length > 0 && projects[0].name ? `
                        <section style="margin-top: 8px;">
                            <h2 style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #d97706; margin-bottom: 12px;">Projects</h2>
                            <div style="display: flex; flex-direction: column; gap: 12px;">
                                ${projects.map(proj => `
                                    <div class="page-break-avoid" style="position: relative; padding-left: 16px; border-left: 2px solid #fbbf24;">
                                        <div style="display: flex; justify-content: space-between; align-items: baseline;">
                                            <h3 style="font-size: 0.875rem; font-weight: 700; color: #111827; margin: 0;">${proj.name}</h3>
                                            ${proj.link ? `<span style="font-size: 0.75rem; color: #2563eb; flex-shrink: 0; margin-left: 16px;">${proj.link}</span>` : ""}
                                        </div>
                                        ${proj.tech ? `<p style="font-size: 0.75rem; color: #6b7280; font-style: italic; margin: 0;">Tech: ${proj.tech}</p>` : ""}
                                        ${proj.description ? `<p style="font-size: 0.875rem; color: #4b5563; margin-top: 4px; white-space: pre-line;">${proj.description}</p>` : ""}
                                    </div>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${skills.length > 0 ? `
                        <section style="margin-top: 8px;">
                            <h2 style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #d97706; margin-bottom: 10px;">Skills</h2>
                            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                                ${skills.map(skill => `
                                    <span style="background: #fffbeb; color: #92400e; padding: 2px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; border: 1px solid #fde68a;">${skill.trim()}</span>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${achievements.length > 0 && achievements[0] ? `
                        <section style="margin-top: 8px;">
                            <h2 style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #d97706; margin-bottom: 8px;">Achievements</h2>
                            <div style="display: flex; flex-direction: column; gap: 4px;">
                                ${achievements.map(item => `
                                    <p style="font-size: 0.875rem; color: #4b5563; margin: 0;">• ${item}</p>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${certifications.length > 0 && certifications[0] ? `
                        <section style="margin-top: 8px;">
                            <h2 style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #d97706; margin-bottom: 8px;">Certifications</h2>
                            <div style="display: flex; flex-direction: column; gap: 4px;">
                                ${certifications.map(item => `
                                    <p style="font-size: 0.875rem; color: #4b5563; margin: 0;">• ${item}</p>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${extraCurricular.length > 0 && extraCurricular[0] ? `
                        <section style="margin-top: 8px;">
                            <h2 style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #d97706; margin-bottom: 8px;">Extra-curricular</h2>
                            <div style="display: flex; flex-direction: column; gap: 4px;">
                                ${extraCurricular.map(item => `
                                    <p style="font-size: 0.875rem; color: #4b5563; margin: 0;">• ${item}</p>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${coCurricular.length > 0 && coCurricular[0] ? `
                        <section style="margin-top: 8px;">
                            <h2 style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #d97706; margin-bottom: 8px;">Co-curricular</h2>
                            <div style="display: flex; flex-direction: column; gap: 4px;">
                                ${coCurricular.map(item => `
                                    <p style="font-size: 0.875rem; color: #4b5563; margin: 0;">• ${item}</p>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}
                </div>
            </div>
        `;
    }

    if (activeTemplate === 'Elegant') {
        const { 
            basics: personal = {}, 
            summary = '', 
            objective = '', 
            work: experience = [], 
            education = [], 
            projects = [], 
            skills = [], 
            achievements = [], 
            certifications = [], 
            extraCurricular = [], 
            coCurricular = [] 
        } = resumeData;
        const summaryContent = summary || objective;
        const summaryHeader = summary ? "Professional Summary" : "Career Objective";

        const contactItems = [personal.email, personal.phone, personal.location, personal.linkedin, personal.website].filter(Boolean);

        return `
            <div id="resume-preview-root">
                <div class="resume-page" style="font-family: 'Palatino Linotype', 'Book Antiqua', serif; font-size: 10.5pt; line-height: 1.6;">
                <!-- Elegant Header -->
                <div style="padding: 40px 48px 24px 48px; border-bottom: 3px double #b8860b; text-align: center;">
                    <h1 style="font-size: 1.875rem; font-weight: 300; tracking: 0.2em; text-transform: uppercase; color: #1a1a2e; margin: 0; -webkit-text-fill-color: #1a1a2e; background: none;">
                        ${personal.name || "Your Name"}
                    </h1>
                    <div style="margin-top: 12px; display: flex; flex-wrap: wrap; justify-content: center; gap: 0 8px; font-size: 0.75rem; color: #6b6b6b;">
                        ${contactItems.map((item, i) => `
                            <span>${item}${i < contactItems.length - 1 ? '<span style="margin: 0 4px; color: #b8860b;">✦</span>' : ''}</span>
                        `).join('')}
                    </div>
                </div>

                <div style="padding: 28px 48px; display: flex; flex-direction: column; gap: 24px;">
                    ${summaryContent ? `
                        <section style="text-align: center;">
                            <h2 style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.25em; color: #b8860b; margin-bottom: 8px;">${summaryHeader}</h2>
                            <p style="font-size: 0.875rem; color: #444; line-height: 1.625; margin: 0;">${summaryContent}</p>
                        </section>
                    ` : ''}

                    ${experience.length > 0 && experience[0].company ? `
                        <section>
                            <h2 style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.25em; color: #b8860b; border-bottom: 1px solid #e8d5a3; padding-bottom: 4px; margin-bottom: 16px;">Professional Experience</h2>
                            <div style="display: flex; flex-direction: column; gap: 16px;">
                                ${experience.map(exp => `
                                    <div class="page-break-avoid">
                                        <div style="display: flex; justify-content: space-between; align-items: baseline;">
                                            <h3 style="font-size: 0.875rem; font-weight: 600; color: #1a1a2e; margin: 0;">${exp.position}</h3>
                                            <span style="font-size: 0.75rem; color: #888; font-style: italic; margin-left: 16px;">${exp.startDate} - ${exp.endDate}</span>
                                        </div>
                                        <p style="font-size: 0.875rem; color: #b8860b; margin: 0;">${exp.company}${exp.location ? ` — ${exp.location}` : ""}</p>
                                        ${exp.summary ? `<p style="font-size: 0.875rem; color: #555; margin-top: 4px; white-space: pre-line;">${exp.summary}</p>` : ""}
                                    </div>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${education.length > 0 && education[0].institution ? `
                        <section>
                            <h2 style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.25em; color: #b8860b; border-bottom: 1px solid #e8d5a3; padding-bottom: 4px; margin-bottom: 16px;">Education</h2>
                            <div style="display: flex; flex-direction: column; gap: 12px;">
                                ${education.map(edu => `
                                    <div class="page-break-avoid">
                                        <div style="display: flex; justify-content: space-between; align-items: baseline;">
                                            <h3 style="font-size: 0.875rem; font-weight: 600; color: #1a1a2e; margin: 0;">${edu.degree}</h3>
                                            <span style="font-size: 0.75rem; color: #888; font-style: italic; margin-left: 16px;">${edu.year}</span>
                                        </div>
                                        <p style="font-size: 0.875rem; color: #666; margin: 0;">${edu.institution}</p>
                                        ${edu.gpa ? `<p style="font-size: 0.75rem; color: #888; margin: 0;">GPA: ${edu.gpa}</p>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${projects.length > 0 && projects[0].name ? `
                        <section>
                            <h2 style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.25em; color: #b8860b; border-bottom: 1px solid #e8d5a3; padding-bottom: 4px; margin-bottom: 16px;">Projects</h2>
                            <div style="display: flex; flex-direction: column; gap: 12px;">
                                ${projects.map(proj => `
                                    <div>
                                        <div style="display: flex; justify-content: space-between; align-items: baseline;">
                                            <h3 style="font-size: 0.875rem; font-weight: 600; color: #1a1a2e; margin: 0;">${proj.name}</h3>
                                            ${proj.link ? `<span style="font-size: 0.75rem; color: #888; margin-left: 16px;">${proj.link}</span>` : ""}
                                        </div>
                                        ${proj.tech ? `<p style="font-size: 0.75rem; color: #b8860b; font-style: italic; margin-top: 2px;">Tech: ${proj.tech}</p>` : ""}
                                        ${proj.description ? `<p style="font-size: 0.875rem; color: #555; margin-top: 4px; white-space: pre-line;">${proj.description}</p>` : ""}
                                    </div>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${skills.length > 0 ? `
                        <section>
                            <h2 style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.25em; color: #b8860b; border-bottom: 1px solid #e8d5a3; padding-bottom: 4px; margin-bottom: 16px;">Skills</h2>
                            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                ${skills.map(skill => `
                                    <span style="background: #fdf6e3; color: #8b7355; padding: 2px 12px; border-radius: 2px; font-size: 0.75rem; border: 1px solid #e8d5a3;">${skill.trim()}</span>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}



                    ${projects.length > 0 && projects[0].name ? `
                        <section>
                            <h2 style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.25em; color: #b8860b; border-bottom: 1px solid #e8d5a3; padding-bottom: 4px; margin-bottom: 16px;">Projects</h2>
                            <div style="display: flex; flex-direction: column; gap: 12px;">
                                ${projects.map(proj => `
                                    <div>
                                        <div style="display: flex; justify-content: space-between; align-items: baseline;">
                                            <h3 style="font-size: 0.875rem; font-weight: 600; color: #1a1a2e; margin: 0;">${proj.name}</h3>
                                            ${proj.link ? `<span style="font-size: 0.75rem; color: #888; margin-left: 16px;">${proj.link}</span>` : ""}
                                        </div>
                                        ${proj.tech ? `<p style="font-size: 0.75rem; color: #b8860b; font-style: italic; margin-top: 2px;">Tech: ${proj.tech}</p>` : ""}
                                        ${proj.description ? `<p style="font-size: 0.875rem; color: #555; margin-top: 4px; white-space: pre-line;">${proj.description}</p>` : ""}
                                    </div>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${skills.length > 0 ? `
                        <section>
                            <h2 style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.25em; color: #b8860b; border-bottom: 1px solid #e8d5a3; padding-bottom: 4px; margin-bottom: 16px;">Skills</h2>
                            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                ${skills.map(skill => `
                                    <span style="background: #fdf6e3; color: #8b7355; padding: 2px 12px; border-radius: 2px; font-size: 0.75rem; border: 1px solid #e8d5a3;">${skill.trim()}</span>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${achievements.length > 0 && achievements[0] ? `
                        <section>
                            <h2 style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.25em; color: #b8860b; border-bottom: 1px solid #e8d5a3; padding-bottom: 4px; margin-bottom: 16px;">Achievements</h2>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                ${achievements.map(item => `
                                    <p style="font-size: 0.875rem; color: #555; margin: 0;">• ${item}</p>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${certifications.length > 0 && certifications[0] ? `
                        <section>
                            <h2 style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.25em; color: #b8860b; border-bottom: 1px solid #e8d5a3; padding-bottom: 4px; margin-bottom: 16px;">Certifications</h2>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                ${certifications.map(item => `
                                    <p style="font-size: 0.875rem; color: #555; margin: 0;">• ${item}</p>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${extraCurricular.length > 0 && extraCurricular[0] ? `
                        <section>
                            <h2 style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.25em; color: #b8860b; border-bottom: 1px solid #e8d5a3; padding-bottom: 4px; margin-bottom: 16px;">Extra-curricular</h2>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                ${extraCurricular.map(item => `
                                    <p style="font-size: 0.875rem; color: #555; margin: 0;">• ${item}</p>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${coCurricular.length > 0 && coCurricular[0] ? `
                        <section>
                            <h2 style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.25em; color: #b8860b; border-bottom: 1px solid #e8d5a3; padding-bottom: 4px; margin-bottom: 16px;">Co-curricular</h2>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                ${coCurricular.map(item => `
                                    <p style="font-size: 0.875rem; color: #555; margin: 0;">• ${item}</p>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}
                </div>
            </div>
        `;
    }

    if (activeTemplate === 'Executive') {
        const { 
            basics: personal = {}, 
            summary = '', 
            objective = '', 
            work: experience = [], 
            education = [], 
            projects = [], 
            skills = [], 
            achievements = [], 
            certifications = [], 
            extraCurricular = [], 
            coCurricular = [] 
        } = resumeData;
        const summaryContent = summary || objective;
        const summaryHeader = summary ? "Executive Summary" : "Objective";

        return `
            <div id="resume-preview-root">
                <div class="resume-page" style="font-family: 'Times New Roman', 'Garamond', serif; font-size: 11pt; line-height: 1.5;">
                <!-- Elegant Header -->
                <div style="padding: 48px 56px 32px 56px; text-align: center; border-bottom: 1px solid #d1d5db;">
                    <h1 style="font-size: 2.25rem; font-weight: 300; letter-spacing: 0.15em; color: #1f2937; text-transform: uppercase; margin: 0; -webkit-text-fill-color: #1f2937; background: none;">
                        ${personal.name || "Your Name"}
                    </h1>
                    <div style="margin: 4px auto 0 auto; height: 1px; width: 96px; background: #9ca3af;"></div>
                    <div style="margin-top: 12px; display: flex; flex-wrap: wrap; justify-content: center; gap: 4px 20px; font-size: 0.75rem; color: #6b7280;">
                        ${personal.email ? `<span>${personal.email}</span>` : ''}
                        ${personal.phone ? `<span>${personal.phone}</span>` : ''}
                        ${personal.location ? `<span>${personal.location}</span>` : ''}
                        ${personal.linkedin ? `<span>${personal.linkedin}</span>` : ''}
                        ${personal.website ? `<span>${personal.website}</span>` : ''}
                    </div>
                </div>

                <div style="padding: 32px 56px; display: flex; flex-direction: column; gap: 28px;">
                    ${summaryContent ? `
                        <section>
                            <h2 style="text-align: center; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3em; color: #9ca3af; margin-bottom: 12px;">${summaryHeader}</h2>
                            <p style="font-size: 0.875rem; color: #374151; leading: 1.625; text-align: center; font-style: italic; margin: 0;">${summaryContent}</p>
                        </section>
                    ` : ''}

                    ${experience.length > 0 && experience[0].company ? `
                        <section>
                            <h2 style="text-align: center; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3em; color: #9ca3af; margin-bottom: 16px;">Professional Experience</h2>
                            <div style="display: flex; flex-direction: column; gap: 20px;">
                                ${experience.map(exp => `
                                    <div class="page-break-avoid">
                                        <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid #f3f4f6; padding-bottom: 4px;">
                                            <h3 style="font-size: 0.875rem; font-weight: 600; color: #1f2937; text-transform: uppercase; letter-spacing: 0.05em; margin: 0;">${exp.position}</h3>
                                            <span style="font-size: 0.75rem; color: #9ca3af; font-style: italic; margin-left: 16px;">${exp.startDate} - ${exp.endDate}</span>
                                        </div>
                                        <p style="font-size: 0.875rem; color: #6b7280; margin: 2px 0 0 0;">${exp.company}${exp.location ? ` — ${exp.location}` : ""}</p>
                                        ${exp.summary ? `<p style="font-size: 0.875rem; color: #4b5563; margin-top: 8px; white-space: pre-line;">${exp.summary}</p>` : ""}
                                    </div>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${education.length > 0 && education[0].institution ? `
                        <section>
                            <h2 style="text-align: center; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3em; color: #9ca3af; margin-bottom: 16px;">Education</h2>
                            <div style="display: flex; flex-direction: column; gap: 12px;">
                                ${education.map(edu => `
                                    <div class="page-break-avoid" style="text-align: center;">
                                        <h3 style="font-size: 0.875rem; font-weight: 600; color: #1f2937; margin: 0;">${edu.degree}</h3>
                                        <p style="font-size: 0.875rem; color: #6b7280; margin: 0;">${edu.institution} • ${edu.year}</p>
                                        ${edu.gpa ? `<p style="font-size: 0.75rem; color: #9ca3af; margin: 0;">GPA: ${edu.gpa}</p>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${projects.length > 0 && projects[0].name ? `
                        <section>
                            <h2 style="text-align: center; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3em; color: #9ca3af; margin-bottom: 16px;">Projects</h2>
                            <div style="display: flex; flex-direction: column; gap: 20px;">
                                ${projects.map(proj => `
                                    <div class="page-break-avoid">
                                        <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid #f3f4f6; padding-bottom: 4px;">
                                            <h3 style="font-size: 0.875rem; font-weight: 600; color: #1f2937; text-transform: uppercase; letter-spacing: 0.05em; margin: 0;">${proj.name}</h3>
                                            ${proj.link ? `<span style="font-size: 0.75rem; color: #9ca3af; margin-left: 16px;">${proj.link}</span>` : ""}
                                        </div>
                                        ${proj.tech ? `<p style="font-size: 0.75rem; color: #6b7280; font-style: italic; margin-top: 4px;">Tech: ${proj.tech}</p>` : ""}
                                        ${proj.description ? `<p style="font-size: 0.875rem; color: #4b5563; margin-top: 4px; white-space: pre-line;">${proj.description}</p>` : ""}
                                    </div>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${skills.length > 0 ? `
                        <section>
                            <h2 style="text-align: center; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3em; color: #9ca3af; margin-bottom: 12px;">Core Competencies</h2>
                            <p style="font-size: 0.875rem; color: #4b5563; text-align: center; margin: 0;">
                                ${skills.map(s => s.trim()).join("  •  ")}
                            </p>
                        </section>
                    ` : ''}

                    ${achievements.length > 0 && achievements[0] ? `
                        <section>
                            <h2 style="text-align: center; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3em; color: #9ca3af; margin-bottom: 16px;">Achievements</h2>
                            <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
                                ${achievements.map(item => `
                                    <p style="font-size: 0.875rem; color: #374151; margin: 0; text-align: center;">${item}</p>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${certifications.length > 0 && certifications[0] ? `
                        <section>
                            <h2 style="text-align: center; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3em; color: #9ca3af; margin-bottom: 16px;">Certifications</h2>
                            <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
                                ${certifications.map(item => `
                                    <p style="font-size: 0.875rem; color: #374151; margin: 0; text-align: center;">${item}</p>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${extraCurricular.length > 0 && extraCurricular[0] ? `
                        <section>
                            <h2 style="text-align: center; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3em; color: #9ca3af; margin-bottom: 16px;">Extra-curricular</h2>
                            <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
                                ${extraCurricular.map(item => `
                                    <p style="font-size: 0.875rem; color: #374151; margin: 0; text-align: center;">${item}</p>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${coCurricular.length > 0 && coCurricular[0] ? `
                        <section>
                            <h2 style="text-align: center; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3em; color: #9ca3af; margin-bottom: 16px;">Co-curricular</h2>
                            <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
                                ${coCurricular.map(item => `
                                    <p style="font-size: 0.875rem; color: #374151; margin: 0; text-align: center;">${item}</p>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}
                </div>
            </div>
        `;
    }

    if (activeTemplate === 'Minimal') {
        const { 
            basics: personal = {}, 
            summary = '', 
            objective = '', 
            work: experience = [], 
            education = [], 
            projects = [], 
            skills = [], 
            achievements = [], 
            certifications = [], 
            extraCurricular = [], 
            coCurricular = [] 
        } = resumeData;
        const summaryContent = summary || objective;
        const summaryHeader = summary ? "Summary" : "Objective";

        const contactItems = [personal.email, personal.phone, personal.location, personal.linkedin, personal.website].filter(Boolean);

        return `
            <div id="resume-preview-root">
                <div class="resume-page" style="font-family: 'Inter', 'Helvetica', sans-serif; font-size: 10pt; line-height: 1.7;">
                <div style="padding: 56px 64px; display: flex; flex-direction: column; gap: 32px;">
                    <!-- Minimal Header -->
                    <div>
                        <h1 style="font-size: 1.5rem; font-weight: 500; color: #111827; margin: 0; -webkit-text-fill-color: #111827; background: none;">${personal.name || "Your Name"}</h1>
                        <div style="margin-top: 4px; display: flex; flex-wrap: wrap; gap: 0 12px; font-size: 0.75rem; color: #9ca3af;">
                            ${contactItems.map(item => `<span>${item}</span>`).join('')}
                        </div>
                    </div>

                    ${summaryContent ? `
                        <section>
                            <h2 style="font-size: 0.75rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.2em; color: #d1d5db; margin-bottom: 12px;">${summary ? "Summary" : "Objective"}</h2>
                            <p style="font-size: 0.875rem; color: #6b7280; leading: 1.625; margin: 0;">${summaryContent}</p>
                        </section>
                    ` : ''}

                    ${experience.length > 0 && experience[0].company ? `
                        <section>
                            <h2 style="font-size: 0.75rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.2em; color: #d1d5db; margin-bottom: 16px;">Experience</h2>
                            <div style="display: flex; flex-direction: column; gap: 20px;">
                                ${experience.map(exp => `
                                    <div class="page-break-avoid">
                                        <div style="display: flex; justify-content: space-between; align-items: baseline;">
                                            <div>
                                                <span style="font-size: 0.875rem; font-weight: 500; color: #111827;">${exp.position}</span>
                                                <span style="font-size: 0.875rem; color: #9ca3af; margin-left: 8px;">${exp.company}${exp.location ? `, ${exp.location}` : ""}</span>
                                            </div>
                                            <span style="font-size: 0.75rem; color: #d1d5db; flex-shrink: 0; margin-left: 16px;">${exp.startDate} - ${exp.endDate}</span>
                                        </div>
                                        ${exp.summary ? `<p style="font-size: 0.875rem; color: #6b7280; margin-top: 4px; white-space: pre-line;">${exp.summary}</p>` : ""}
                                    </div>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${education.length > 0 && education[0].institution ? `
                        <section>
                            <h2 style="font-size: 0.75rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.2em; color: #d1d5db; margin-bottom: 16px;">Education</h2>
                            <div style="display: flex; flex-direction: column; gap: 16px;">
                                ${education.map(edu => `
                                    <div class="page-break-avoid" style="display: flex; justify-content: space-between; align-items: baseline;">
                                        <div>
                                            <span style="font-size: 0.875rem; font-weight: 500; color: #111827;">${edu.degree}</span>
                                            <span style="font-size: 0.875rem; color: #9ca3af; margin-left: 8px;">${edu.institution}</span>
                                            ${edu.gpa ? `<span style="font-size: 0.75rem; color: #9ca3af; margin-left: 8px;">(GPA: ${edu.gpa})</span>` : ''}
                                        </div>
                                        <span style="font-size: 0.75rem; color: #d1d5db; flex-shrink: 0; margin-left: 16px;">${edu.year}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${projects.length > 0 && projects[0].name ? `
                        <section>
                            <h2 style="font-size: 0.75rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.2em; color: #d1d5db; margin-bottom: 16px;">Projects</h2>
                            <div style="display: flex; flex-direction: column; gap: 20px;">
                                ${projects.map(proj => `
                                    <div class="page-break-avoid">
                                        <div style="display: flex; justify-content: space-between; align-items: baseline;">
                                            <span style="font-size: 0.875rem; font-weight: 500; color: #111827;">${proj.name}</span>
                                            ${proj.link ? `<span style="font-size: 0.75rem; color: #9ca3af; margin-left: 16px;">${proj.link}</span>` : ""}
                                        </div>
                                        ${proj.tech ? `<p style="font-size: 0.75rem; color: #9ca3af; margin-top: 2px;">Tech: ${proj.tech}</p>` : ""}
                                        ${proj.description ? `<p style="font-size: 0.875rem; color: #6b7280; margin-top: 4px; white-space: pre-line;">${proj.description}</p>` : ""}
                                    </div>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${skills.length > 0 ? `
                        <section>
                            <h2 style="font-size: 0.75rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.2em; color: #d1d5db; margin-bottom: 8px;">Skills</h2>
                            <p style="font-size: 0.875rem; color: #6b7280; margin: 0;">${skills.join(', ')}</p>
                        </section>
                    ` : ''}

                    ${achievements.length > 0 && achievements[0] ? `
                        <section>
                            <h2 style="font-size: 0.75rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.2em; color: #d1d5db; margin-bottom: 12px;">Achievements</h2>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                ${achievements.map(item => `
                                    <p style="font-size: 0.875rem; color: #6b7280; margin: 0;">• ${item}</p>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${certifications.length > 0 && certifications[0] ? `
                        <section>
                            <h2 style="font-size: 0.75rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.2em; color: #d1d5db; margin-bottom: 12px;">Certifications</h2>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                ${certifications.map(item => `
                                    <p style="font-size: 0.875rem; color: #6b7280; margin: 0;">• ${item}</p>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${extraCurricular.length > 0 && extraCurricular[0] ? `
                        <section>
                            <h2 style="font-size: 0.75rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.25em; color: #d1d5db; margin-bottom: 12px;">Extra-curricular</h2>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                ${extraCurricular.map(item => `
                                    <p style="font-size: 0.875rem; color: #6b7280; margin: 0;">• ${item}</p>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${coCurricular.length > 0 && coCurricular[0] ? `
                        <section>
                            <h2 style="font-size: 0.75rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.25em; color: #d1d5db; margin-bottom: 12px;">Co-curricular</h2>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                ${coCurricular.map(item => `
                                    <p style="font-size: 0.875rem; color: #6b7280; margin: 0;">• ${item}</p>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}
                </div>
            </div>
        `;
    }

    if (activeTemplate === 'Modern') {
        const { 
            basics: personal = {}, 
            summary = '', 
            objective = '', 
            work: experience = [], 
            education = [], 
            projects = [], 
            skills = [], 
            achievements = [], 
            certifications = [], 
            extraCurricular = [], 
            coCurricular = [] 
        } = resumeData;
        const summaryContent = summary || objective;
        const summaryHeader = summary ? "About" : "Objective";

        return `
            <div id="resume-preview-root">
                <div class="resume-page" style="font-family: 'Helvetica Neue', 'Arial', sans-serif; font-size: 10.5pt; line-height: 1.6;">
                <!-- Modern Header with accent bar -->
                <div style="position: relative;">
                    <div style="height: 8px; background: linear-gradient(90deg, #2563eb, #7c3aed, #ec4899);"></div>
                    <div style="padding: 12px 40px 12px 40px;">
                        <h1 style="font-size: 2.25rem; font-weight: 200; tracking: -0.025em; color: #111827; margin: 0; -webkit-text-fill-color: #111827; background: none;">
                            ${personal.name || "Your Name"}
                        </h1>
                        <div style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 4px 12px; font-size: 0.75rem; color: #6b7280;">
                            ${personal.email ? `<span style="display: flex; align-items: center; gap: 4px;">✉ ${personal.email}</span>` : ''}
                            ${personal.phone ? `<span style="display: flex; align-items: center; gap: 4px;">☎ ${personal.phone}</span>` : ''}
                            ${personal.location ? `<span style="display: flex; align-items: center; gap: 4px;">📍 ${personal.location}</span>` : ''}
                            ${personal.linkedin ? `<span style="display: flex; align-items: center; gap: 4px;">🔗 ${personal.linkedin}</span>` : ''}
                            ${personal.website ? `<span style="display: flex; align-items: center; gap: 4px;">🌐 ${personal.website}</span>` : ''}
                        </div>
                    </div>
                </div>

                <div style="padding: 0 40px 32px 40px; display: flex; flex-direction: column; gap: 24px;">
                    ${summaryContent ? `
                        <section>
                            <h2 style="font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #2563eb; margin-bottom: 8px;">${summaryHeader}</h2>
                            <p style="font-size: 0.875rem; color: #4b5563; leading: 1.625; border-left: 2px solid #60a5fa; padding-left: 16px; margin: 0;">${summaryContent}</p>
                        </section>
                    ` : ''}

                    ${experience.length > 0 && experience[0].company ? `
                        <section>
                            <h2 style="font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #2563eb; margin-bottom: 12px;">Experience</h2>
                            <div style="display: flex; flex-direction: column; gap: 16px;">
                                ${experience.map(exp => `
                                    <div class="page-break-avoid" style="border-left: 2px solid #e5e7eb; padding-left: 16px;">
                                        <div style="display: flex; justify-content: space-between; align-items: baseline;">
                                            <h3 style="font-size: 0.875rem; font-weight: 600; color: #111827; margin: 0;">${exp.position}</h3>
                                            <span style="font-size: 0.75rem; color: #9ca3af; font-family: monospace; margin-left: 16px;">${exp.startDate} - ${exp.endDate}</span>
                                        </div>
                                        <p style="font-size: 0.875rem; color: #2563eb; margin: 0;">${exp.company}${exp.location ? ` · ${exp.location}` : ""}</p>
                                        ${exp.summary ? `<p style="font-size: 0.875rem; color: #4b5563; margin-top: 4px; white-space: pre-line;">${exp.summary}</p>` : ""}
                                    </div>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${education.length > 0 && education[0].institution ? `
                        <section>
                            <h2 style="font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #2563eb; margin-bottom: 12px;">Education</h2>
                            <div style="display: flex; flex-direction: column; gap: 16px;">
                                ${education.map(edu => `
                                    <div class="page-break-avoid" style="border-left: 2px solid #e5e7eb; padding-left: 16px;">
                                        <div style="display: flex; justify-content: space-between; align-items: baseline;">
                                            <h3 style="font-size: 0.875rem; font-weight: 600; color: #111827; margin: 0;">${edu.degree}</h3>
                                            <span style="font-size: 0.75rem; color: #9ca3af; font-family: monospace; margin-left: 16px;">${edu.year}</span>
                                        </div>
                                        <p style="font-size: 0.875rem; color: #4b5563; margin: 0;">${edu.institution}</p>
                                        ${edu.gpa ? `<p style="font-size: 0.75rem; color: #6b7280; margin-top: 2px;">GPA: ${edu.gpa}</p>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${projects.length > 0 && projects[0].name ? `
                        <section>
                            <h2 style="font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #2563eb; margin-bottom: 12px;">Projects</h2>
                            <div style="display: flex; flex-direction: column; gap: 16px;">
                                ${projects.map(proj => `
                                    <div class="page-break-avoid" style="border-left: 2px solid #e5e7eb; padding-left: 16px;">
                                        <div style="display: flex; justify-content: space-between; align-items: baseline;">
                                            <h3 style="font-size: 0.875rem; font-weight: 600; color: #111827; margin: 0;">${proj.name}</h3>
                                            ${proj.link ? `<span style="font-size: 0.75rem; color: #2563eb; font-family: monospace; margin-left: 16px;">${proj.link}</span>` : ""}
                                        </div>
                                        ${proj.tech ? `<p style="font-size: 0.75rem; color: #6b7280; font-style: italic; margin-top: 2px;">Tech: ${proj.tech}</p>` : ""}
                                        ${proj.description ? `<p style="font-size: 0.875rem; color: #4b5563; margin-top: 4px; white-space: pre-line;">${proj.description}</p>` : ""}
                                    </div>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${skills.length > 0 ? `
                        <section>
                            <h2 style="font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #2563eb; margin-bottom: 8px;">Skills</h2>
                            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                ${skills.map(skill => `
                                    <span style="background: #eff6ff; color: #1d4ed8; padding: 4px 12px; border-radius: 9999px; font-size: 0.75rem; font-weight: 500;">${skill.trim()}</span>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${achievements.length > 0 && achievements[0] ? `
                        <section>
                            <h2 style="font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #2563eb; margin-bottom: 8px;">Achievements</h2>
                            <div style="display: flex; flex-direction: column; gap: 8px; border-left: 2px solid #e5e7eb; padding-left: 16px;">
                                ${achievements.map(item => `
                                    <p style="font-size: 0.875rem; color: #4b5563; margin: 0;">• ${item}</p>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${certifications.length > 0 && certifications[0] ? `
                        <section>
                            <h2 style="font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #2563eb; margin-bottom: 8px;">Certifications</h2>
                            <div style="display: flex; flex-direction: column; gap: 8px; border-left: 2px solid #e5e7eb; padding-left: 16px;">
                                ${certifications.map(item => `
                                    <p style="font-size: 0.875rem; color: #4b5563; margin: 0;">• ${item}</p>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${extraCurricular.length > 0 && extraCurricular[0] ? `
                        <section>
                            <h2 style="font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #2563eb; margin-bottom: 8px;">Extra-curricular</h2>
                            <div style="display: flex; flex-direction: column; gap: 8px; border-left: 2px solid #e5e7eb; padding-left: 16px;">
                                ${extraCurricular.map(item => `
                                    <p style="font-size: 0.875rem; color: #4b5563; margin: 0;">• ${item}</p>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${coCurricular.length > 0 && coCurricular[0] ? `
                        <section>
                            <h2 style="font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #2563eb; margin-bottom: 8px;">Co-curricular</h2>
                            <div style="display: flex; flex-direction: column; gap: 8px; border-left: 2px solid #e5e7eb; padding-left: 16px;">
                                ${coCurricular.map(item => `
                                    <p style="font-size: 0.875rem; color: #4b5563; margin: 0;">• ${item}</p>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}
                </div>
            </div>
        `;
    }

    if (activeTemplate === 'Developer') {
        const { 
            basics: personal = {}, 
            summary = '', 
            objective = '', 
            work: experience = [], 
            education = [], 
            projects = [], 
            skills = [], 
            achievements = [], 
            certifications = [], 
            extraCurricular = [], 
            coCurricular = [] 
        } = resumeData;
        const summaryContent = summary || objective;
        const summaryHeader = summary ? "README.md" : "objective.sh";

        return `
            <div id="resume-preview-root">
                <div class="resume-page" style="background: #020617; color: #e2e8f0; font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace; font-size: 10pt; line-height: 1.6;">
                <!-- Terminal-style Header -->
                <div style="padding: 32px 40px 24px 40px; border-bottom: 1px solid rgba(16, 185, 129, 0.3);">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                        <span style="height: 12px; width: 12px; border-radius: 50%; background: #ef4444;"></span>
                        <span style="height: 12px; width: 12px; border-radius: 50%; background: #eab308;"></span>
                        <span style="height: 12px; width: 12px; border-radius: 50%; background: #22c55e;"></span>
                        <span style="font-size: 0.75rem; color: #64748b; margin-left: 8px;">resume.dev</span>
                    </div>
                    <h1 style="font-size: 1.875rem; font-weight: 700; color: #34d399; margin: 0; -webkit-text-fill-color: #34d399; background: none;">
                        &gt; ${personal.name || "Your Name"}
                    </h1>
                    <div style="margin-top: 8px; display: flex; flex-wrap: wrap; gap: 4px 16px; font-size: 0.75rem; color: #94a3b8;">
                        ${personal.email ? `<span style="color: #22d3ee;">${personal.email}</span>` : ''}
                        ${personal.phone ? `<span>| ${personal.phone}</span>` : ''}
                        ${personal.location ? `<span>| ${personal.location}</span>` : ''}
                        ${personal.linkedin ? `<span style="color: #22d3ee;">| ${personal.linkedin}</span>` : ''}
                        ${personal.website ? `<span style="color: #22d3ee;">| ${personal.website}</span>` : ''}
                    </div>
                </div>

                <div style="padding: 24px 40px; display: flex; flex-direction: column; gap: 20px;">
                    ${summaryContent ? `
                        <section>
                            <h2 style="font-size: 0.75rem; font-weight: 700; color: #34d399; margin-bottom: 8px;"><span style="color: #64748b;">// </span>${summaryHeader}</h2>
                            <p style="font-size: 0.875rem; color: #cbd5e1; leading: 1.625; border-left: 1px solid rgba(16, 185, 129, 0.3); padding-left: 16px; margin: 0;">${summaryContent}</p>
                        </section>
                    ` : ''}

                    ${experience.length > 0 && experience[0].company ? `
                        <section>
                            <h2 style="font-size: 0.75rem; font-weight: 700; color: #34d399; margin-bottom: 12px;"><span style="color: #64748b;">// </span>work_history</h2>
                            <div style="display: flex; flex-direction: column; gap: 16px;">
                                ${experience.map(exp => `
                                    <div class="page-break-avoid" style="border-left: 1px solid #334155; padding-left: 16px;">
                                        <div style="display: flex; justify-content: space-between; align-items: baseline;">
                                            <h3 style="font-size: 0.875rem; font-weight: 700; color: #fde047; margin: 0;">${exp.position}</h3>
                                            <span style="font-size: 0.75rem; color: #64748b; margin-left: 16px;">${exp.startDate} - ${exp.endDate}</span>
                                        </div>
                                        <p style="font-size: 0.875rem; color: #22d3ee; margin: 0;">${exp.company}${exp.location ? ` @ ${exp.location}` : ""}</p>
                                        ${exp.summary ? `<p style="font-size: 0.875rem; color: #94a3b8; margin-top: 4px; white-space: pre-line;">${exp.summary}</p>` : ""}
                                    </div>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${education.length > 0 && education[0].institution ? `
                        <section>
                            <h2 style="font-size: 0.75rem; font-weight: 700; color: #34d399; margin-bottom: 12px;"><span style="color: #64748b;">// </span>education</h2>
                            <div style="display: flex; flex-direction: column; gap: 16px;">
                                ${education.map(edu => `
                                    <div class="page-break-avoid" style="border-left: 1px solid #334155; padding-left: 16px;">
                                        <div style="display: flex; justify-content: space-between; align-items: baseline;">
                                            <h3 style="font-size: 0.875rem; font-weight: 700; color: #fde047; margin: 0;">${edu.degree}</h3>
                                            <span style="font-size: 0.75rem; color: #64748b; margin-left: 16px;">${edu.year}</span>
                                        </div>
                                        <p style="font-size: 0.875rem; color: #22d3ee; margin: 0;">${edu.institution}</p>
                                        ${edu.gpa ? `<p style="font-size: 0.75rem; color: #64748b; margin-top: 2px;">GPA: ${edu.gpa}</p>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${projects.length > 0 && projects[0].name ? `
                        <section>
                            <h2 style="font-size: 0.75rem; font-weight: 700; color: #34d399; margin-bottom: 12px;"><span style="color: #64748b;">// </span>projects</h2>
                            <div style="display: flex; flex-direction: column; gap: 16px;">
                                ${projects.map(proj => `
                                    <div class="page-break-avoid" style="border-left: 1px solid #334155; padding-left: 16px;">
                                        <div style="display: flex; justify-content: space-between; align-items: baseline;">
                                            <h3 style="font-size: 0.875rem; font-weight: 700; color: #fde047; margin: 0;">${proj.name}</h3>
                                            ${proj.link ? `<span style="font-size: 0.75rem; color: #22d3ee; margin-left: 16px;">${proj.link}</span>` : ""}
                                        </div>
                                        ${proj.tech ? `<p style="font-size: 0.75rem; color: #64748b; font-style: italic; margin-top: 4px;">tech: ${proj.tech}</p>` : ""}
                                        ${proj.description ? `<p style="font-size: 0.875rem; color: #cbd5e1; margin-top: 8px; white-space: pre-line;">${proj.description}</p>` : ""}
                                    </div>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${skills.length > 0 ? `
                        <section>
                            <h2 style="font-size: 0.75rem; font-weight: 700; color: #34d399; margin-bottom: 8px;"><span style="color: #64748b;">// </span>tech_stack</h2>
                            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                ${skills.map(skill => `
                                    <span style="background: #1e293b; color: #6ee7b7; padding: 2px 10px; border-radius: 4px; font-size: 0.75rem; border: 1px solid rgba(16, 185, 129, 0.2); font-family: monospace;">${skill.trim()}</span>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${achievements.length > 0 && achievements[0] ? `
                        <section>
                            <h2 style="font-size: 0.75rem; font-weight: 700; color: #34d399; margin-bottom: 8px;"><span style="color: #64748b;">// </span>achievements</h2>
                            <div style="display: flex; flex-direction: column; gap: 4px;">
                                ${achievements.map(item => `
                                    <p style="font-size: 0.875rem; color: #94a3b8; margin: 0;">• <span style="color: #cbd5e1;">${item}</span></p>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${certifications.length > 0 && certifications[0] ? `
                        <section>
                            <h2 style="font-size: 0.75rem; font-weight: 700; color: #34d399; margin-bottom: 8px;"><span style="color: #64748b;">// </span>certifications</h2>
                            <div style="display: flex; flex-direction: column; gap: 4px;">
                                ${certifications.map(item => `
                                    <p style="font-size: 0.875rem; color: #94a3b8; margin: 0;">• <span style="color: #cbd5e1;">${item}</span></p>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${extraCurricular.length > 0 && extraCurricular[0] ? `
                        <section>
                            <h2 style="font-size: 0.75rem; font-weight: 700; color: #34d399; margin-bottom: 8px;"><span style="color: #64748b;">// </span>extra_curricular</h2>
                            <div style="display: flex; flex-direction: column; gap: 4px;">
                                ${extraCurricular.map(item => `
                                    <p style="font-size: 0.875rem; color: #94a3b8; margin: 0;">• <span style="color: #cbd5e1;">${item}</span></p>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    ${coCurricular.length > 0 && coCurricular[0] ? `
                        <section>
                            <h2 style="font-size: 0.75rem; font-weight: 700; color: #34d399; margin-bottom: 8px;"><span style="color: #64748b;">// </span>co_curricular</h2>
                            <div style="display: flex; flex-direction: column; gap: 4px;">
                                ${coCurricular.map(item => `
                                    <p style="font-size: 0.875rem; color: #94a3b8; margin: 0;">• <span style="color: #cbd5e1;">${item}</span></p>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}
                </div>
            </div>
        `;
    }

    if (activeTemplate === 'Professional') {
        const { 
            basics: personal = {}, 
            summary = '', 
            objective = '', 
            work: experience = [], 
            education = [], 
            projects = [], 
            skills = [], 
            achievements = [], 
            certifications = [], 
            extraCurricular = [], 
            coCurricular = [] 
        } = resumeData;
        const summaryContent = summary || objective;
        const summaryHeader = summary ? "Professional Summary" : "Career Objective";

        return `
            <div id="resume-preview-root">
                <div class="resume-page" style="color: #111827; font-family: 'Georgia', serif; font-size: 11pt; line-height: 1.5;">
                    <div style="padding: 0 3px 12px 3px; border-bottom: 1.8px solid #111827;">
                        <h1 style="font-size: 2.25rem; font-weight: 700; color: #111827; text-transform: uppercase; letter-spacing: 0.05em; margin: 0; line-height: 1.0;">
                            ${personal.name || "Your Name"}
                        </h1>
                        <div style="margin-top: 6px; display: flex; flex-wrap: wrap; gap: 4px 10px; font-size: 0.7rem; color: #4b5563; align-items: center; letter-spacing: 0.01em;">
                            ${personal.email ? `<span>${personal.email}</span>` : ''}
                            ${personal.phone ? `<span>• ${personal.phone}</span>` : ''}
                            ${personal.location ? `<span>• ${personal.location}</span>` : ''}
                            ${personal.linkedin ? `<span>• ${personal.linkedin}</span>` : ''}
                            ${personal.website ? `<span>• ${personal.website}</span>` : ''}
                        </div>
                    </div>

                    <div style="padding: 8px 3px; display: flex; flex-direction: column; gap: 12px;">
                        ${summaryContent ? `
                            <section class="resume-section">
                                <h2 style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #111827; border-bottom: 0.8px solid #9ca3af; padding-bottom: 2px; margin-bottom: 6px;">${summaryHeader}</h2>
                                <p style="font-size: 0.825rem; color: #1f2937; line-height: 1.45; text-align: justify; margin: 0; hyphens: auto;">${summaryContent}</p>
                            </section>
                        ` : ''}

                        ${experience.length > 0 && experience[0].company ? `
                            <section class="resume-section">
                                <h2 style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #111827; border-bottom: 0.8px solid #9ca3af; padding-bottom: 2px; margin-bottom: 8px;">Experience</h2>
                                <div style="display: flex; flex-direction: column; gap: 12px;">
                                    ${experience.map(exp => `
                                        <div class="page-break-avoid">
                                            <div style="display: flex; justify-content: space-between; align-items: baseline;">
                                                <h3 style="font-size: 0.875rem; font-weight: 700; color: #111827; margin: 0;">${exp.position}</h3>
                                                <span style="font-size: 0.725rem; color: #4b5563; flex-shrink: 0; margin-left: 16px; font-family: 'Helvetica', sans-serif;">${exp.startDate}</span>
                                            </div>
                                            <p style="font-size: 0.775rem; color: #4b5563; font-weight: 600; font-style: italic; margin: 0;">${exp.company}${exp.location ? `, ${exp.location}` : ""}</p>
                                            ${exp.summary ? `<div style="font-size: 0.825rem; color: #1f2937; margin-top: 3px; line-height: 1.4; white-space: pre-line; text-align: justify; hyphens: auto;">${exp.summary}</div>` : ""}
                                        </div>
                                    `).join('')}
                                </div>
                            </section>
                        ` : ''}

                        ${education.length > 0 && education[0].institution ? `
                            <section class="resume-section">
                                <h2 style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #111827; border-bottom: 0.8px solid #9ca3af; padding-bottom: 2px; margin-bottom: 8px;">Education</h2>
                                <div style="display: flex; flex-direction: column; gap: 8px;">
                                    ${education.map(edu => `
                                        <div class="page-break-avoid">
                                            <div style="display: flex; justify-content: space-between; align-items: baseline;">
                                                <h3 style="font-size: 0.875rem; font-weight: 700; color: #111827; margin: 0;">${edu.degree}</h3>
                                                <span style="font-size: 0.725rem; color: #4b5563; flex-shrink: 0; margin-left: 16px; font-family: 'Helvetica', sans-serif;">${edu.year}</span>
                                            </div>
                                            <p style="font-size: 0.775rem; color: #4b5563; font-weight: 600; font-style: italic; margin: 0;">${edu.institution}</p>
                                            ${edu.gpa ? `<p style="font-size: 0.725rem; color: #4b5563; margin: 0;">GPA: ${edu.gpa}</p>` : ''}
                                        </div>
                                    `).join('')}
                                </div>
                            </section>
                        ` : ''}

                        ${projects.length > 0 && projects[0].name ? `
                            <section class="resume-section">
                                <h2 style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #111827; border-bottom: 0.8px solid #9ca3af; padding-bottom: 2px; margin-bottom: 8px;">Projects</h2>
                                <div style="display: flex; flex-direction: column; gap: 12px;">
                                    ${projects.map(proj => `
                                        <div class="page-break-avoid">
                                            <div style="display: flex; justify-content: space-between; align-items: baseline;">
                                                <h3 style="font-size: 0.875rem; font-weight: 700; color: #111827; margin: 0;">${proj.name}</h3>
                                                ${proj.link ? `<span style="font-size: 0.725rem; color: #2563eb; flex-shrink: 0; margin-left: 16px; font-family: 'Helvetica', sans-serif;">${proj.link}</span>` : ""}
                                            </div>
                                            ${proj.tech ? `<p style="font-size: 0.7rem; color: #4b5563; font-style: italic; margin: 0;">Tech: ${proj.tech}</p>` : ""}
                                            ${proj.description ? `<div style="font-size: 0.825rem; color: #1f2937; margin-top: 3px; line-height: 1.4; white-space: pre-line; text-align: justify; hyphens: auto;">${proj.description}</div>` : ""}
                                        </div>
                                    `).join('')}
                                </div>
                            </section>
                        ` : ''}

                        ${skills.length > 0 ? `
                            <section class="resume-section">
                                <h2 style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #111827; border-bottom: 0.8px solid #9ca3af; padding-bottom: 2px; margin-bottom: 4px;">Skills</h2>
                                <div style="display: flex; flex-wrap: wrap; gap: 4px 8px; margin-top: 2px;">
                                    ${skills.map(skill => `
                                        <span style="font-size: 0.825rem; color: #1f2937; font-family: 'Georgia', serif;">${skill.trim()}${skills.indexOf(skill) === skills.length - 1 ? '' : ','}</span>
                                    `).join('')}
                                </div>
                            </section>
                        ` : ''}

                        ${achievements.length > 0 && achievements[0] ? `
                            <section class="resume-section">
                                <h2 style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #111827; border-bottom: 0.8px solid #9ca3af; padding-bottom: 2px; margin-bottom: 4px;">Achievements</h2>
                                <div style="display: flex; flex-direction: column; gap: 3px;">
                                    ${achievements.map(item => `
                                        <p style="font-size: 0.825rem; color: #1f2937; margin: 0; line-height: 1.4; text-align: justify; hyphens: auto;">• ${item}</p>
                                    `).join('')}
                                </div>
                            </section>
                        ` : ''}

                        ${certifications.length > 0 && certifications[0] ? `
                            <section class="resume-section">
                                <h2 style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #111827; border-bottom: 0.8px solid #9ca3af; padding-bottom: 2px; margin-bottom: 4px;">Certifications</h2>
                                <div style="display: flex; flex-direction: column; gap: 3px;">
                                    ${certifications.map(item => `
                                        <p style="font-size: 0.825rem; color: #1f2937; margin: 0; line-height: 1.4; text-align: justify; hyphens: auto;">• ${item}</p>
                                    `).join('')}
                                </div>
                            </section>
                        ` : ''}

                        ${extraCurricular.length > 0 && extraCurricular[0] ? `
                            <section class="resume-section">
                                <h2 style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #111827; border-bottom: 0.8px solid #9ca3af; padding-bottom: 2px; margin-bottom: 4px;">Extra-curricular</h2>
                                <div style="display: flex; flex-direction: column; gap: 3px;">
                                    ${extraCurricular.map(item => `
                                        <p style="font-size: 0.825rem; color: #1f2937; margin: 0; line-height: 1.4; text-align: justify; hyphens: auto;">• ${item}</p>
                                    `).join('')}
                                </div>
                            </section>
                        ` : ''}

                        ${coCurricular.length > 0 && coCurricular[0] ? `
                            <section class="resume-section">
                                <h2 style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #111827; border-bottom: 0.8px solid #9ca3af; padding-bottom: 2px; margin-bottom: 4px;">Co-curricular</h2>
                                <div style="display: flex; flex-direction: column; gap: 3px;">
                                    ${coCurricular.map(item => `
                                        <p style="font-size: 0.825rem; color: #1f2937; margin: 0; line-height: 1.4; text-align: justify; hyphens: auto;">• ${item}</p>
                                    `).join('')}
                                </div>
                            </section>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }


    // Default Fallback
    return ``;
};

function refreshPreview() {
  const preview = document.getElementById('resumePreview');
  const header = document.querySelector('.live-preview-header');
  if (preview) {
    preview.innerHTML = renderResumeTemplate();
    if (header) header.innerText = `LIVE PREVIEW — ${activeTemplate.toUpperCase()}`;
  }
  
  // Persist data locally on every refresh
  localStorage.setItem('resumeBuilderData', JSON.stringify(resumeData));
}

// --- Main Render and Event Functions ---

export const renderBuilder = (container) => {
  container.innerHTML = `
    <div class="dash-layout">
      ${renderSidebar('builder')}
      
      <main class="dash-content">
        <header class="builder-controls animate-slide-in" style="position: relative; z-index: 10001; align-items: flex-end;">
          <div>
            <h1 class="text-gradient" style="font-size: 3.5rem; line-height: 1;">Resume Builder</h1>
            <p style="font-size: 1rem; margin-top: 0.5rem; color: var(--text-muted); font-weight: 500;">Build a professional resume in minutes</p>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: center;">
             <div class="template-dropdown" id="tplDropdown">
                <div class="dropdown-trigger" id="tplTrigger" style="padding: 0.6rem 1rem; border-radius: 12px; font-size: 0.9rem;">
                    <div class="item-circle" style="border-color: ${templates[activeTemplate].color}; background: ${templates[activeTemplate].color}; width: 10px; height: 10px;"></div>
                    <span style="font-weight: 600; color: #fff;">${activeTemplate}</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="opacity: 0.5; margin-left: 2px;"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
                <div class="dropdown-content" id="tplMenu">
                    ${renderDropdownItems()}
                </div>
             </div>

             <button class="preview-pill" id="previewToggle" style="padding: 0.6rem 1rem; gap: 0.6rem; border-radius: 12px; font-size: 0.9rem; font-weight: 600;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                <span>Preview</span>
             </button>

             <button class="cyan-btn" id="exportBtn" style="padding: 0.6rem 1.2rem; gap: 0.6rem; border-radius: 12px; font-size: 0.9rem; background: #00e5ff; color: #000; font-weight: 700;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                <span>Download PDF</span>
             </button>
          </div>
        </header>

        <div class="builder-layout" id="builderLayout" style="margin-top: 2.5rem; z-index: 1;">
          <!-- Editor Panel -->
          <div class="editor-panel">
            <div class="builder-tabs">
                <button class="tab-btn ${activeTab === 'personal' ? 'active' : ''}" data-tab="personal">Personal Info</button>
                <button class="tab-btn ${activeTab === 'summary' ? 'active' : ''}" data-tab="summary">Summary</button>
                <button class="tab-btn ${activeTab === 'experience' ? 'active' : ''}" data-tab="experience">Experience</button>
                <button class="tab-btn ${activeTab === 'education' ? 'active' : ''}" data-tab="education">Education</button>
                <button class="tab-btn ${activeTab === 'projects' ? 'active' : ''}" data-tab="projects">Projects</button>
                <button class="tab-btn ${activeTab === 'skills' ? 'active' : ''}" data-tab="skills">Skills</button>
                <button class="tab-btn ${activeTab === 'achievements' ? 'active' : ''}" data-tab="achievements">Achievements</button>
                <button class="tab-btn ${activeTab === 'certifications' ? 'active' : ''}" data-tab="certifications">Certifications</button>
                <button class="tab-btn ${activeTab === 'extraCurricular' ? 'active' : ''}" data-tab="extraCurricular">Extra-curricular</button>
                <button class="tab-btn ${activeTab === 'coCurricular' ? 'active' : ''}" data-tab="coCurricular">Co-curricular</button>
            </div>

            <div class="builder-content-area" id="tabContent">
                ${renderActiveTabContent()}
            </div>
          </div>

          <div class="preview-panel" style="z-index: 0;">
            <div style="width: 100%; position: sticky; top: 0; display: flex; flex-direction: column; align-items: center;">
                <div class="live-preview-header">LIVE PREVIEW — ${activeTemplate.toUpperCase()}</div>
                <div id="resumePreview" class="resume-preview">
                  ${renderResumeTemplate()}
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `;

  initSidebarEvents();
  initBuilderEvents();
};

function initBuilderEvents() {
  // Tab Switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
          activeTab = btn.dataset.tab;
          document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          document.getElementById('tabContent').innerHTML = renderActiveTabContent();
      });
  });
  
  // Preview Toggle
  const previewToggle = document.getElementById('previewToggle');
  const builderLayout = document.getElementById('builderLayout');
  if (previewToggle && builderLayout) {
      previewToggle.addEventListener('click', () => {
          builderLayout.classList.toggle('preview-hidden');
          const isHidden = builderLayout.classList.contains('preview-hidden');
          previewToggle.querySelector('span').innerText = isHidden ? 'Show Preview' : 'Preview';
      });
  }

  // Dropdown Toggling
  const trigger = document.getElementById('tplTrigger');
  const menu = document.getElementById('tplMenu');
  
  if (trigger) {
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('show');
    });
  }

  window.addEventListener('click', () => {
    if (menu) menu.classList.remove('show');
  });

  // Template Selection
  document.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
          activeTemplate = item.dataset.tpl;
          localStorage.setItem('resumeBuilderTemplate', activeTemplate);
          
          const tplData = templates[activeTemplate];
          const trigger = document.getElementById('tplTrigger');
          
          // Update Trigger text and indicator color
          trigger.querySelector('span').innerText = activeTemplate;
          const circle = trigger.querySelector('.item-circle');
          if (circle) {
              circle.style.borderColor = tplData.color;
              circle.style.backgroundColor = tplData.color;
          }

          document.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
          item.classList.add('active');
          refreshPreview();
      });
  });

  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
          const element = document.getElementById('resume-preview-root');
          
          if (!element) {
              console.error("Preview root not found");
              return;
          }

          const opt = {
            margin: 0,
            filename: `resume-${resumeData.basics.name.replace(/\s+/g, '-').toLowerCase() || 'download'}.pdf`,
            image: { type: 'jpeg', quality: 1.0 },
            html2canvas: { 
              scale: 3, 
              useCORS: true, 
              letterRendering: true,
              backgroundColor: '#ffffff',
              logging: false 
            },
            jsPDF: { 
              unit: 'mm', 
              format: 'a4', 
              orientation: 'portrait' 
            },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
          };

          // Use the professional html2pdf flow
          html2pdf().set(opt).from(element).save();
    });
  }

  // Global functions for dynamic items and inputs (Avoid double listeners)
  window.updateBasics = (key, val) => {
    resumeData.basics[key] = val;
    refreshPreview();
  };

  window.updateSummary = (val) => {
    resumeData.summary = val;
    refreshPreview();
  };

  window.updateObjective = (val) => {
    resumeData.objective = val;
    refreshPreview();
  };

  window.updateSkills = (val) => {
    resumeData.skills = val.split(',').map(s => s.trim()).filter(s => s !== '');
    refreshPreview();
  };

  window.updateWork = (index, key, val) => {
    resumeData.work[index][key] = val;
    refreshPreview();
  };

  window.removeWork = (index) => {
    resumeData.work.splice(index, 1);
    document.getElementById('tabContent').innerHTML = renderActiveTabContent();
    refreshPreview();
  };

  window.updateEdu = (index, key, val) => {
    resumeData.education[index][key] = val;
    refreshPreview();
  };

  window.removeEdu = (index) => {
    resumeData.education.splice(index, 1);
    document.getElementById('tabContent').innerHTML = renderActiveTabContent();
    refreshPreview();
  };

  window.updateProject = (index, key, val) => {
    resumeData.projects[index][key] = val;
    refreshPreview();
  };

  window.removeProject = (index) => {
    resumeData.projects.splice(index, 1);
    document.getElementById('tabContent').innerHTML = renderActiveTabContent();
    refreshPreview();
  };

  window.updateAchievement = (index, val) => {
    resumeData.achievements[index] = val;
    refreshPreview();
  };

  window.removeAchievement = (index) => {
    resumeData.achievements.splice(index, 1);
    document.getElementById('tabContent').innerHTML = renderActiveTabContent();
    refreshPreview();
  };

  window.updateCert = (index, val) => {
    resumeData.certifications[index] = val;
    refreshPreview();
  };

  window.removeCert = (index) => {
    resumeData.certifications.splice(index, 1);
    document.getElementById('tabContent').innerHTML = renderActiveTabContent();
    refreshPreview();
  };

  window.updateExtraCurricular = (index, val) => {
    resumeData.extraCurricular[index] = val;
    refreshPreview();
  };

  window.removeExtraCurricular = (index) => {
    resumeData.extraCurricular.splice(index, 1);
    document.getElementById('tabContent').innerHTML = renderActiveTabContent();
    refreshPreview();
  };

  window.updateCoCurricular = (index, val) => {
    resumeData.coCurricular[index] = val;
    refreshPreview();
  };

  window.removeCoCurricular = (index) => {
    resumeData.coCurricular.splice(index, 1);
    document.getElementById('tabContent').innerHTML = renderActiveTabContent();
    refreshPreview();
  };
  
  // Handlers for Add buttons - Use delegating listener or check for ID
  const contentArea = document.getElementById('tabContent');
  if (contentArea) {
      contentArea.addEventListener('click', (e) => {
        if (e.target.id === 'addWorkBtn') {
            resumeData.work.push({ company: '', position: '', startDate: '', endDate: '', summary: '' });
            document.getElementById('tabContent').innerHTML = renderActiveTabContent();
            refreshPreview();
        }
        if (e.target.id === 'addEduBtn') {
            resumeData.education.push({ institution: '', degree: '', year: '', gpa: '' });
            document.getElementById('tabContent').innerHTML = renderActiveTabContent();
            refreshPreview();
        }
        if (e.target.id === 'addProjectBtn') {
            resumeData.projects.push({ name: '', description: '', tech: '', link: '' });
            document.getElementById('tabContent').innerHTML = renderActiveTabContent();
            refreshPreview();
        }
        if (e.target.id === 'addAchievementBtn') {
            resumeData.achievements.push('');
            document.getElementById('tabContent').innerHTML = renderActiveTabContent();
            refreshPreview();
        }
        if (e.target.id === 'addCertBtn') {
            resumeData.certifications.push('');
            document.getElementById('tabContent').innerHTML = renderActiveTabContent();
            refreshPreview();
        }
        if (e.target.id === 'addExtraCurricularBtn') {
            resumeData.extraCurricular.push('');
            document.getElementById('tabContent').innerHTML = renderActiveTabContent();
            refreshPreview();
        }
        if (e.target.id === 'addCoCurricularBtn') {
            resumeData.coCurricular.push('');
            document.getElementById('tabContent').innerHTML = renderActiveTabContent();
            refreshPreview();
        }
      });
  }
}

