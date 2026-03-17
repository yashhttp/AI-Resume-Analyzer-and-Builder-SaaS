(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function r(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerPolicy&&(n.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?n.credentials="include":t.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(t){if(t.ep)return;t.ep=!0;const n=r(t);fetch(t.href,n)}})();const c=i=>{i.innerHTML=`
    <div class="home-view">
      <div class="hero">
        <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.2); padding: 0.5rem 1rem; border-radius: 2rem; margin-bottom: 2rem; color: var(--accent-primary); font-size: 0.9rem; font-weight: 500;">
          <span style="display: inline-block; width: 8px; height: 8px; background: var(--accent-primary); border-radius: 50%; box-shadow: 0 0 8px var(--accent-primary);"></span>
          Vite + AI Powered
        </div>
        <h1>Elevate Your Resume with<br/>AI Precision</h1>
        <p class="subtitle" style="max-width: 600px; margin: 0 auto 2.5rem auto;">Get instant AI feedback, deep ATS scoring, and actionable improvement suggestions to land your dream job faster.</p>
        <div class="cta-group">
          <button id="btn-register" class="btn btn-primary" style="padding: 1rem 2rem; font-size: 1.1rem;">Start Analyzing Free</button>
          <button id="btn-login" class="btn btn-secondary" style="padding: 1rem 2rem; font-size: 1.1rem;">Sign In</button>
        </div>
      </div>
      
      <div class="features">
        <div class="feature-card" style="backdrop-filter: blur(10px);">
          <div style="width: 40px; height: 40px; background: rgba(99, 102, 241, 0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <h3>AI Analysis</h3>
          <p style="font-size: 0.95rem;">Our advanced AI models read your resume like a recruiter, highlighting real strengths and weaknesses.</p>
        </div>
        <div class="feature-card" style="backdrop-filter: blur(10px);">
          <div style="width: 40px; height: 40px; background: rgba(236, 72, 153, 0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-secondary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
          <h3>Instant Results</h3>
          <p style="font-size: 0.95rem;">No waiting for human review. Get your ATS compatibility score and targeted feedback in seconds.</p>
        </div>
        <div class="feature-card" style="backdrop-filter: blur(10px);">
          <div style="width: 40px; height: 40px; background: rgba(139, 92, 246, 0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-tertiary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          </div>
          <h3>Trend Tracking</h3>
          <p style="font-size: 0.95rem;">Watch your score improve over time on your dashboard as you implement our AI suggestions.</p>
        </div>
      </div>
    </div>
  `,document.getElementById("btn-login").addEventListener("click",()=>u("#login")),document.getElementById("btn-register").addEventListener("click",()=>u("#register"))},h="http://localhost:4000/api/v1",l={getHeaders(i=!1){const e=localStorage.getItem("token"),r={};return e&&(r.Authorization=`Bearer ${e}`),i||(r["Content-Type"]="application/json"),r},async request(i,e={}){const r=e.body instanceof FormData,s=`${h}${i}`;try{const t=await fetch(s,{...e,headers:{...this.getHeaders(r),...e.headers}}),n=await t.json();if(!t.ok)throw new Error(n.message||"API Error");return n}catch(t){throw console.error("API Request failed:",t),t}},async get(i){return this.request(i,{method:"GET"})},async post(i,e){return this.request(i,{method:"POST",body:e instanceof FormData?e:JSON.stringify(e)})},async put(i,e){return this.request(i,{method:"PUT",body:e instanceof FormData?e:JSON.stringify(e)})},async del(i){return this.request(i,{method:"DELETE"})}},p=i=>{const e=document.getElementById("app"),r=i==="login";e.innerHTML=`
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header" style="margin-bottom: 2rem;">
          <div style="width: 50px; height: 50px; background: var(--grad-primary); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1rem; box-shadow: var(--shadow-glow);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <h2 style="margin-bottom: 0.5rem;">${r?"Welcome Back":"Create an Account"}</h2>
          <p style="color: var(--text-muted); font-size: 0.95rem;">${r?"Enter your details to access your dashboard.":"Sign up to start analyzing your resumes with AI."}</p>
        </div>
        
        <form id="auth-form">
          ${r?"":`
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" id="name" required placeholder="John Doe">
            </div>
          `}
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" id="email" required placeholder="name@example.com">
          </div>
          <div class="form-group" style="margin-bottom: 2rem;">
            <label>Password</label>
            <input type="password" id="password" required placeholder="••••••••">
          </div>
          <button type="submit" class="btn btn-primary w-100" style="padding: 0.875rem; font-size: 1.05rem;">
            ${r?"Log In":"Sign Up"}
          </button>
        </form>
        
        <p class="auth-switch" style="margin-top: 2rem; color: var(--text-muted);">
          ${r?"Don't have an account?":"Already have an account?"} 
          <a href="#${r?"register":"login"}" style="font-weight: 500; margin-left: 0.5rem;">
            ${r?"Create one":"Log in here"}
          </a>
        </p>
      </div>
    </div>
  `,document.getElementById("auth-form").addEventListener("submit",async s=>{s.preventDefault();const t=document.getElementById("email").value,n=document.getElementById("password").value,a={email:t,password:n};r||(a.name=document.getElementById("name").value);try{const d=s.target.querySelector("button"),m=d.innerText;d.innerText="Loading...",d.disabled=!0;const o=await l.post(`/auth/${r?"login":"register"}`,a);o.data&&o.data.token?(localStorage.setItem("token",o.data.token),u("#dashboard")):alert(o.message||"Authentication successful, but no token received.")}catch(d){alert(d.message||"Authentication failed")}finally{const d=s.target.querySelector("button");d&&(d.innerText=r?"Login":"Register",d.disabled=!1)}})},y=async i=>{i.innerHTML=`
    <div class="dashboard">
      <header class="dash-header">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="width: 40px; height: 40px; background: var(--grad-primary); border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; box-shadow: var(--shadow-glow);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
          </div>
          <h2>Your Dashboard</h2>
        </div>
        <button id="btn-logout" class="btn btn-secondary">Logout</button>
      </header>
      
      <div class="dash-grid">
        <div class="upload-section card section">
          <h3 style="margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            Analyze New Resume
          </h3>
          <form id="upload-form">
            <div class="form-group">
              <label>Target Job Description</label>
              <textarea id="job-desc" rows="4" required placeholder="Paste the job requirements here to benchmark against..."></textarea>
            </div>
            <div class="form-group file-drop" id="file-drop">
              <input type="file" id="resume-file" accept=".pdf,.doc,.docx" required>
              <p>Drag & drop or click to upload resume (PDF, DOC)</p>
            </div>
            <button type="submit" class="btn btn-primary w-100" style="padding: 1rem; font-size: 1.05rem;">Start AI Analysis</button>
          </form>
          <div id="analysis-result" style="display:none; margin-top:20px;"></div>
        </div>
        
        <div class="history-section card section">
          <h3 style="margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-secondary)" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            Analysis History
          </h3>
          <div id="history-list">Loading history...</div>
        </div>
      </div>
    </div>
  `,document.getElementById("btn-logout").addEventListener("click",()=>{localStorage.removeItem("token"),window.location.hash="#login"});try{const e=await l.get("/analysis/my"),r=document.getElementById("history-list");e.data&&e.data.length>0?r.innerHTML=e.data.map(s=>`
        <div class="history-item">
          <strong>Score: <span class="score">${s.score}%</span></strong>
          <p class="role">Role: ${s.jobTitle||"Unknown"}</p>
        </div>
      `).join(""):r.innerHTML='<p class="text-muted">No past analysis found.</p>'}catch{document.getElementById("history-list").innerHTML='<p class="text-error">Failed to load history.</p>'}document.getElementById("upload-form").addEventListener("submit",async e=>{e.preventDefault();const r=document.getElementById("job-desc").value,t=document.getElementById("resume-file").files[0];if(!t)return alert("Please select a resume file.");const n=e.target.querySelector("button");n.innerText="Uploading...",n.disabled=!0;try{const a=new FormData;a.append("resume",t);const m=(await l.post("/resume/upload",a)).data._id;n.innerText="Analyzing (may take a moment)...";const o=await l.post("/analysis/analyze",{resumeId:m,jobDescription:r}),g=document.getElementById("analysis-result");g.style.display="block",g.innerHTML=`
        <div class="result-card">
          <h4>Match Score: <span class="score-highlight">${o.data.score}%</span> (ATS: ${o.data.atsScore}%)</h4>
          <p><strong>Strengths:</strong> ${o.data.strengths?o.data.strengths.join(", "):"N/A"}</p>
          <p><strong>Suggestions:</strong> ${o.data.suggestions?o.data.suggestions.join(", "):"N/A"}</p>
        </div>
      `}catch(a){alert("Analysis failed: "+a.message)}finally{n.innerText="Analyze",n.disabled=!1}})},v={"":c,"#":c,"#login":()=>p("login"),"#register":()=>p("register"),"#dashboard":y},f=()=>{const i=()=>{let e=window.location.hash;const r=v[e]||c,s=document.getElementById("app");s.innerHTML="",r(s)};window.addEventListener("hashchange",i),window.addEventListener("load",i),i()},u=i=>{window.location.hash=i};f();
