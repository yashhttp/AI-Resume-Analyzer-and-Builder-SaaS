import { navigate } from '../router.js';

export const renderHome = (container) => {
  const isLoggedIn = !!localStorage.getItem('token');
  
  container.innerHTML = `
    <div class="landing-page">
      <!-- Background Elements -->
      <div class="floating-blob blob-1"></div>
      <div class="floating-blob blob-2"></div>
      <div class="floating-blob blob-3"></div>

      <!-- Navigation -->
      <nav class="top-nav animate-in">
        <div class="logo" onclick="window.location.hash='#'">
          <div class="logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <span class="logo-text">ResumeAI</span>
        </div>
        <div class="nav-links">
          <a href="#features" class="nav-link">Features</a>
          <a href="#pricing" class="nav-link">Pricing</a>
          ${isLoggedIn ? `
            <a href="#dashboard" class="nav-link">Dashboard</a>
            <button id="btn-cta-nav" class="btn btn-primary btn-sm">Get Started</button>
          ` : `
            <a href="#login" class="nav-link">Login</a>
            <button id="btn-cta-nav" class="btn btn-primary btn-sm">Get Started</button>
          `}
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="hero-section section-padding">
        <div class="badge-gpt-container animate-fade-up" >
          <div class="badge-gpt">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            AI Analyzer + Resume Builder — All in One
          </div>
        </div>
        
        <h1 class="hero-title animate-fade-up" >
          <span class="text-gradient">Build & Analyze</span><br/>
          Your Resume
        </h1>
        
        <p class="hero-subtitle animate-fade-up" >
          Build professional resumes from scratch with our powerful builder, or upload your existing resume for AI-powered analysis with ATS scoring, strengths, weaknesses, and actionable suggestions — all in one platform.
        </p>
        
        <div class="cta-group animate-fade-up" >
          <button id="btn-cta-main" class="btn btn-primary btn-glow">Get Started Free <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
          ${!isLoggedIn ? '<button id="btn-login-main" class="btn btn-secondary">Login</button>' : ''}
        </div>

        <div class="stats-grid animate-fade-up" >
          <div class="stat-card">
            <strong>10K+</strong>
            <p>Resumes Analyzed</p>
          </div>
          <div class="stat-card">
            <strong>5K+</strong>
            <p>Resumes Built</p>
          </div>
          <div class="stat-card">
            <strong>95%</strong>
            <p>Accuracy Rate</p>
          </div>
          <div class="stat-card">
            <strong>4.9★</strong>
            <p>User Rating</p>
          </div>
        </div>
      </section>

      <!-- Two Powerful Tools Section -->
      <section class="tools-overview section-padding">
        <div class="tools-header animate-on-scroll">
          <h2 class="tools-title">
            Two Powerful Tools, <span class="text-gradient">One Platform</span>
          </h2>
          <p class="tools-subtitle">
            Whether you want to build a new resume or improve your existing one — we've got you covered.
          </p>
        </div>

        <div class="tools-grid">
          <!-- Resume Analyzer Card -->
          <div class="tool-card animate-on-scroll">
            <div class="tool-card-header">
              <div class="tool-icon analyzer"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg></div>
              <div class="tool-title-box">
                <h3>Resume Analyzer</h3>
                <span>AI-Powered Resume Analysis</span>
              </div>
            </div>
            <p class="tool-description">Upload your existing resume and get instant AI-powered feedback — ATS score, strengths, weaknesses, and actionable improvement suggestions.</p>
            <ul class="tool-feature-list">
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> <span><strong>AI-Powered Analysis</strong> — GPT-4o deep analysis</span></li>
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> <span><strong>ATS Score</strong> — Get your score instantly</span></li>
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> <span><strong>Score Trends</strong> — Track improvement over time</span></li>
            </ul>
            <button class="btn btn-primary btn-tool-action w-100" onclick="window.location.hash='#upload'">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              Analyze My Resume
            </button>
          </div>

          <!-- Resume Builder Card -->
          <div class="tool-card animate-on-scroll">
            <div class="tool-card-header">
              <div class="tool-icon builder"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></div>
              <div class="tool-title-box">
                <h3>Resume Builder</h3>
                <span>Build From Scratch</span>
              </div>
            </div>
            <p class="tool-description">Create a top-grade professional resume from scratch — add experience, education, projects, skills and download a polished PDF ready to send.</p>
            <ul class="tool-feature-list">
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> <span><strong>Section-wise Editor</strong> — Add details intuitively</span></li>
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> <span><strong>Professional Templates</strong> — Clean, ATS-friendly</span></li>
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> <span><strong>PDF Export</strong> — Download your resume instantly</span></li>
            </ul>
            <button class="btn btn-outline btn-tool-action w-100" onclick="window.location.hash='#builder'">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              Build My Resume
            </button>
          </div>
        </div>
      </section>

      <!-- All Features Section -->
      <section id="features" class="features-section section-padding">
        <div class="tools-header animate-on-scroll">
          <h2 class="tools-title">
            <span class="text-gradient">All Features</span>
          </h2>
          <p class="tools-subtitle">Everything you need to build and perfect your resume</p>
        </div>
        
        <div class="features-grid-premium">
          <!-- Feature 1 -->
          <div class="feature-tile animate-on-scroll">
            <div class="feature-tile-icon analyzer"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg></div>
            <div class="feature-tile-content">
              <h3>AI-Powered Analysis</h3>
              <p>GPT-4o powered deep resume analysis with scoring and suggestions.</p>
            </div>
          </div>
          
          <!-- Feature 2 -->
          <div class="feature-tile animate-on-scroll">
            <div class="feature-tile-icon builder"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></div>
            <div class="feature-tile-content">
              <h3>Resume Builder</h3>
              <p>Build professional resumes from scratch with section-wise editor.</p>
            </div>
          </div>
          
          <!-- Feature 3 -->
          <div class="feature-tile animate-on-scroll">
            <div class="feature-tile-icon green"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg></div>
            <div class="feature-tile-content">
              <h3>ATS Score</h3>
              <p>Get your Applicant Tracking System compatibility score instantly.</p>
            </div>
          </div>
          
          <!-- Feature 4 -->
          <div class="feature-tile animate-on-scroll">
            <div class="feature-tile-icon pink"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12c0 1.66-2 3-4.5 3s-4.5-1.34-4.5-3 2-3 4.5-3 4.5 1.34 4.5 3z"></path><path d="M5 15l-2 2 2 2"></path><path d="M2 12h5"></path><path d="M9 18v3"></path></svg></div>
            <div class="feature-tile-content">
              <h3>Real-time Preview</h3>
              <p>See your resume update live as you type in the builder.</p>
            </div>
          </div>
          
          <!-- Feature 5 -->
          <div class="feature-tile animate-on-scroll">
            <div class="feature-tile-icon cyan"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div>
            <div class="feature-tile-content">
              <h3>Secure & Private</h3>
              <p>Enterprise-grade security with encrypted file handling.</p>
            </div>
          </div>
          
          <!-- Feature 6 -->
          <div class="feature-tile animate-on-scroll">
            <div class="feature-tile-icon indigo"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></div>
            <div class="feature-tile-content">
              <h3>PDF Export</h3>
              <p>Download analyzed reports or built resumes as high-quality PDFs.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works Section OVERHAUL -->
      <section id="how-it-works" class="how-it-works-overhaul section-padding">
        <div class="tools-header animate-on-scroll">
          <h2 class="tools-title">
            How It <span class="text-gradient">Works</span>
          </h2>
        </div>

        <div class="workflow-container">
          <!-- Resume Analyzer Workflow -->
          <div class="workflow-group animate-on-scroll">
            <div class="workflow-group-header">
              <div class="tool-icon-mini analyzer"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg></div>
              <span>Resume Analyzer</span>
            </div>
            <div class="workflow-steps-grid">
              <div class="workflow-step">
                <div class="workflow-icon-box cyan-glow"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg></div>
                <div class="workflow-step-num">STEP 01</div>
                <h3>Upload Resume</h3>
                <p>Upload your PDF resume with a simple drag & drop</p>
              </div>
              <div class="workflow-step">
                <div class="workflow-icon-box cyan-glow"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg></div>
                <div class="workflow-step-num">STEP 02</div>
                <h3>AI Analyzes</h3>
                <p>GPT-4o scans every detail of your resume</p>
              </div>
              <div class="workflow-step">
                <div class="workflow-icon-box cyan-glow"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg></div>
                <div class="workflow-step-num">STEP 03</div>
                <h3>Get Results</h3>
                <p>Receive scores, strengths, and suggestions instantly</p>
              </div>
            </div>
          </div>

          <!-- Resume Builder Workflow -->
          <div class="workflow-group animate-on-scroll">
            <div class="workflow-group-header">
              <div class="tool-icon-mini builder"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></div>
              <span>Resume Builder</span>
            </div>
            <div class="workflow-steps-grid">
              <div class="workflow-step">
                <div class="workflow-icon-box indigo-glow"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg></div>
                <div class="workflow-step-num">STEP 01</div>
                <h3>Fill Details</h3>
                <p>Add your experience, education, projects & skills</p>
              </div>
              <div class="workflow-step">
                <div class="workflow-icon-box indigo-glow"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></div>
                <div class="workflow-step-num">STEP 02</div>
                <h3>Live Preview</h3>
                <p>See your resume update in real-time as you type</p>
              </div>
              <div class="workflow-step">
                <div class="workflow-step-num">STEP 03</div>
                <div class="workflow-icon-box indigo-glow"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg></div>
                <h3>Download PDF</h3>
                <p>Export your polished resume as a professional PDF</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Pricing Section Integrated -->
      <section id="pricing" class="pricing-landing section-padding">
        <!-- Pricing cards will be mounted here -->
        <div id="pricing-mount"></div>
      </section>

      <!-- Footer -->
      <footer class="main-footer">
        <div class="footer-container">
          <div class="footer-grid">
            <div class="footer-brand">
              <div class="footer-logo">
                <div class="logo-icon-gradient">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <span class="logo-text">ResumeAI</span>
              </div>
              <p class="footer-description">
                Elevate your career with our AI-powered Resume Analyzer and Resume Builder. Get ATS-optimized feedback and build professional resumes in minutes.
              </p>
              <div class="footer-social">
                <a href="#" class="social-icon-box"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1 2-2z"/></svg></a>
                <a href="#" class="social-icon-box"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg></a>
                <a href="#" class="social-icon-box"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01"></path></svg></a>
              </div>
            </div>
            
            <div class="footer-links">
              <h3>Product</h3>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#">ATS Score</a></li>
                <li><a href="#">AI Methodology</a></li>
              </ul>
            </div>
            
            <div class="footer-links">
              <h3>Resources</h3>
              <ul>
                <li><a href="#">Resume Guides</a></li>
                <li><a href="#">Career Blog</a></li>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">FAQ</a></li>
              </ul>
            </div>
            
            <div class="footer-links">
              <h3>Company</h3>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div class="footer-bottom">
            <p>&copy; 2026 ResumeAI. All rights reserved.</p>
            <div class="footer-legal">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `;

  // Event Listeners
  document.getElementById('btn-cta-nav').addEventListener('click', () => navigate(isLoggedIn ? '#dashboard' : '#register'));
  document.getElementById('btn-cta-main').addEventListener('click', () => navigate(isLoggedIn ? '#dashboard' : '#register'));
  
  if (!isLoggedIn) {
     document.getElementById('btn-login-main').addEventListener('click', () => navigate('#login'));
  }

  // Handle Scroll Animations
  const observerOptions = {
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

  // Mount Pricing Component (Modular version)
  import('./subscription.js').then(module => {
    const pricingContainer = document.getElementById('pricing-mount');
    if (pricingContainer) {
      module.renderPricingCards(pricingContainer);
    }
  });
};
