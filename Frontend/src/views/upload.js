import { renderSidebar, initSidebarEvents } from '../components/sidebar.js';
import { api } from '../api.js';

export const renderUpload = (container) => {
  container.innerHTML = `
    <div class="dash-layout">
      ${renderSidebar('upload')}
      
      <main class="dash-content">
        <header class="page-header animate-slide-in">
          <h1 class="text-gradient">Upload <span style="color: white;">Resume</span></h1>
          <p class="subtitle">Upload your PDF resume for AI-powered analysis</p>
        </header>

        <section class="upload-workflow-container animate-slide-in" >
          <!-- Stepper -->
          <div class="stepper-horizontal">
            <div class="step active">
              <div class="step-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              </div>
              <span class="step-label">Upload</span>
            </div>
            <div class="step-line"></div>
            <div class="step">
              <div class="step-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
              </div>
            </div>
            <div class="step-line"></div>
            <div class="step">
              <div class="step-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></svg>
              </div>
            </div>
            <div class="step-line"></div>
            <div class="step">
              <div class="step-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
            </div>
          </div>

          <!-- Upload Box -->
          <div class="mega-upload-box" id="drop-zone">
            <input type="file" id="file-input" accept=".pdf" style="display: none;">
            <div class="upload-content">
              <div class="big-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              </div>
              <h3>Drag & drop your PDF resume here</h3>
              <p>or click to browse (max 2MB)</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  `;

  initSidebarEvents();

  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');

  dropZone.addEventListener('click', () => fileInput.click());

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragging');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragging');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragging');
    const files = e.dataTransfer.files;
    if (files.length > 0) showSelectedFile(files[0]);
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) showSelectedFile(e.target.files[0]);
  });

  const updateStepper = (stepIndex) => {
    const steps = document.querySelectorAll('.stepper-horizontal .step');
    steps.forEach((step, idx) => {
      if (idx <= stepIndex) step.classList.add('active');
      else step.classList.remove('active');
    });
  };

  const showSelectedFile = (file) => {
    if (file.type !== 'application/pdf') {
       return alert('Please upload a PDF file.');
    }
    if (file.size > 2 * 1024 * 1024) {
      return alert('File size exceeds 2MB limit.');
    }

    const uploadBox = document.getElementById('drop-zone');
    uploadBox.innerHTML = `
      <div class="upload-content animate-fade-in">
        <div class="big-icon" style="color: #8b5cf6;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
        </div>
        <h3 style="margin-bottom: 0.5rem;">${file.name}</h3>
        <p style="margin-bottom: 1.5rem;">Ready for AI analysis</p>
        <div style="display: flex; gap: 1rem; justify-content: center;">
          <button class="btn btn-primary btn-glow" id="btn-start-analysis">Upload & Analyze</button>
          <button class="btn btn-outline" onclick="window.location.reload()">Cancel</button>
        </div>
      </div>
    `;

    document.getElementById('btn-start-analysis').onclick = (e) => {
      e.stopPropagation();
      handleUpload(file);
    };
  };

  const handleUpload = async (file) => {
    const uploadBox = document.querySelector('.mega-upload-box');
    const originalContent = uploadBox.innerHTML;
    
    try {
      // Step 2: Selected & Uploading
      updateStepper(1);
      uploadBox.innerHTML = `
        <div class="upload-content animate-fade-in">
          <div class="loading-spinner" style="width: 40px; height: 40px; border: 3px solid rgba(0, 217, 255, 0.1); border-top-color: #00d9ff; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1.5rem;"></div>
          <h3>Uploading PDF...</h3>
          <p>Processing multipart data chunks</p>
        </div>
      `;

      const formData = new FormData();
      formData.append('resume', file);
      
      const uploadRes = await api.post('/resume/upload', formData);
      const resumeId = uploadRes.data._id;

      // Step 3: Analyzing
      updateStepper(2);
      uploadBox.innerHTML = `
        <div class="upload-content animate-fade-in">
          <div class="loading-spinner" style="width: 40px; height: 40px; border: 3px solid rgba(139, 92, 246, 0.1); border-top-color: #8b5cf6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1.5rem;"></div>
          <h3>AI Analysis in Progress...</h3>
          <p>Generating matching scores and suggestions</p>
        </div>
      `;

      // Slight artificial delay to make it feel "real" as requested
      await new Promise(r => setTimeout(r, 800));

      const analyzeRes = await api.post('/analysis/analyze', { resumeId });
      const result = analyzeRes.data;

      // Step 4: Done
      updateStepper(3);
      
      // Show results
      uploadBox.innerHTML = `
        <div class="result-display animate-slide-in" style="width: 100%; text-align: left; padding: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 1.5rem;">
            <div>
              <h2 style="margin: 0; font-size: 1.5rem;">Analysis Complete!</h2>
              <p style="margin: 0.5rem 0 0; color: var(--text-muted);">Results for ${file.name}</p>
            </div>
            <div class="match-score-big" style="text-align: center;">
              <div style="font-size: 2.5rem; font-weight: 800; color: var(--accent-primary); line-height: 1;">${result.score}%</div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem; letter-spacing: 1px;">MATCH SCORE</div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
            <div>
              <h4 style="color: #10b981; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Strengths
              </h4>
              <ul style="list-style: none; padding: 0;">
                ${result.strengths.map(s => `<li style="margin-bottom: 0.5rem; color: #e2e8f0; font-size: 0.95rem; display: flex; gap: 0.5rem;"><span style="color: #10b981;">•</span> ${s}</li>`).join('')}
              </ul>
            </div>
            <div>
              <h4 style="color: #f59e0b; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                Suggestions
              </h4>
              <ul style="list-style: none; padding: 0;">
                ${result.suggestions.map(s => `<li style="margin-bottom: 0.5rem; color: #e2e8f0; font-size: 0.95rem; display: flex; gap: 0.5rem;"><span style="color: #f59e0b;">•</span> ${s}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div style="margin-top: 2.5rem; display: flex; gap: 1rem;">
             <button class="btn btn-primary" onclick="window.location.hash='#analysis'">View History</button>
             <button class="btn btn-outline" id="btn-reset-upload">Analyze Another</button>
          </div>
        </div>
      `;
      
      document.getElementById('btn-reset-upload').onclick = () => renderUpload(container);

    } catch (err) {
      console.error('Flow failed:', err);
      
      // Check for limit reached error
      if (err.message && (err.message.toLowerCase().includes('limit reached') || err.message.toLowerCase().includes('upgrade to pro'))) {
        showLimitModal(container);
      } else {
        alert(err.message || 'Something went wrong during the analysis flow.');
      }
      
      uploadBox.innerHTML = originalContent;
      updateStepper(0);
      renderUpload(container);
    }
  };

  const showLimitModal = (container) => {
    // Remove existing modal if any
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) existingModal.remove();

    const modalHtml = `
      <div class="modal-overlay active">
        <div class="limit-modal animate-modal-in" style="max-width: 650px; background: rgba(22, 25, 33, 0.98); border: 1px solid rgba(255,255,255,0.1); border-radius: 28px;">
          <div class="limit-icon-container" style="background: rgba(99, 102, 241, 0.1); color: var(--accent-primary);">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          </div>
          <h2 style="font-weight: 800; background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Unlock Full Potential</h2>
          <p style="color: var(--text-muted); font-size: 1rem; margin-bottom: 2.5rem;">Choose a plan to continue with unlimited uploads and premium AI insights.</p>
          
          <div class="modal-pricing-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; margin-bottom: 2.5rem;">
            <div class="plan-card-mini" data-plan="WEEKLY" style="border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 2rem 1rem; cursor: pointer; transition: all 0.3s; background: rgba(255,255,255,0.02);">
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.75rem; letter-spacing: 1.5px; font-weight: 700;">WEEKLY</div>
              <div style="font-size: 1.75rem; font-weight: 800; color: white;">₹49</div>
              <button class="btn btn-outline btn-sm" style="margin-top: 1.5rem; width: 100%; border-radius: 10px;">Select</button>
            </div>
            
            <div class="plan-card-mini active" data-plan="MONTHLY" style="border: 2px solid var(--accent-primary); border-radius: 20px; padding: 2rem 1rem; cursor: pointer; transition: all 0.3s; background: rgba(99, 102, 241, 0.05); position: relative; box-shadow: 0 0 20px rgba(99, 102, 241, 0.15);">
               <div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: var(--accent-primary); color: white; font-size: 0.65rem; font-weight: 900; padding: 4px 12px; border-radius: 20px; letter-spacing: 0.5px;">POPULAR</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.75rem; letter-spacing: 1.5px; font-weight: 700;">MONTHLY</div>
              <div style="font-size: 1.75rem; font-weight: 800; color: white;">₹149</div>
              <button class="btn btn-primary btn-sm" style="margin-top: 1.5rem; width: 100%; border-radius: 10px;">Select</button>
            </div>

            <div class="plan-card-mini" data-plan="YEARLY" style="border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 2rem 1rem; cursor: pointer; transition: all 0.3s; background: rgba(255,255,255,0.02);">
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.75rem; letter-spacing: 1.5px; font-weight: 700;">YEARLY</div>
              <div style="font-size: 1.75rem; font-weight: 800; color: white;">₹999</div>
              <button class="btn btn-outline btn-sm" style="margin-top: 1.5rem; width: 100%; border-radius: 10px;">Select</button>
            </div>
          </div>

          <div class="modal-actions">
            <button class="btn-limit-close" id="btn-modal-close" style="width: 100%; border-radius: 14px; padding: 1rem; font-weight: 600;">Maybe Later</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const overlay = document.querySelector('.modal-overlay');
    const planCards = document.querySelectorAll('.plan-card-mini');
    const closeBtn = document.getElementById('btn-modal-close');

    const closeModal = () => {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 300);
    };

    planCards.forEach(card => {
      card.onclick = async () => {
        const plan = card.getAttribute('data-plan');
        closeModal();
        const { initiateSubscription } = await import('../utils/payments.js');
        initiateSubscription(plan);
      };
    });

    closeBtn.onclick = closeModal;
    overlay.onclick = (e) => {
      if (e.target === overlay) closeModal();
    };
  };
};
