import { renderSidebar, initSidebarEvents } from '../components/sidebar.js';
import { api } from '../api.js';
import { showModal } from '../utils/modals.js';

export const renderAnalysis = async (container) => {
  container.innerHTML = `
    <div class="dash-layout">
      ${renderSidebar('analysis')}
      
      <main class="dash-content">
        <header class="page-header animate-slide-in">
          <h1 class="text-gradient">Analysis <span style="color: white;">Results</span></h1>
          <p class="subtitle">View your AI-powered resume analysis reports</p>
        </header>

        <section id="analysis-list-container" class="animate-slide-in" >
          <div class="loading-state" style="padding: 3rem; text-align: center; color: var(--text-muted);">
            Loading analysis reports...
          </div>
        </section>
      </main>
    </div>
  `;
  
  initSidebarEvents();

  // Fetch real data
  try {
    const res = await api.get('/analysis/my');
    const listContainer = document.getElementById('analysis-list-container');
    
    if (res.data && res.data.length > 0) {
      listContainer.innerHTML = `
        <div class="analysis-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; margin-top: 1rem;">
          ${res.data.map((item, idx) => `
            <div class="card animate-slide-in" style="border-left: 4px solid var(--accent-primary);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                <h4 style="margin: 0; font-size: 1.1rem;">${item.jobTitle || 'Analysis Report'}</h4>
                <div class="score-badge" style="background: rgba(0, 217, 255, 0.1); color: var(--accent-primary); padding: 0.25rem 0.6rem; border-radius: 20px; font-weight: 600; font-size: 0.85rem;">
                  ${item.score}% Match
                </div>
              </div>
              <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">Analyzed on ${new Date(item.createdAt).toLocaleDateString()}</p>
              <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-outline btn-sm btn-view-report" data-index="${idx}" style="flex: 2; font-size: 0.8rem;">View Report</button>
                <button class="btn btn-outline btn-sm btn-delete-analysis" data-id="${item._id}" style="flex: 1; font-size: 0.8rem; border-color: rgba(239, 68, 68, 0.3); color: #ef4444;">Delete</button>
              </div>
            </div>
          `).join('')}
        </div>
      `;

      // Attach view events
      document.querySelectorAll('.btn-view-report').forEach(btn => {
        btn.addEventListener('click', () => {
          const index = btn.getAttribute('data-index');
          showReportModal(res.data[index]);
        });
      });

      // Attach delete events
      document.querySelectorAll('.btn-delete-analysis').forEach(btn => {
         btn.addEventListener('click', () => {
           const id = btn.getAttribute('data-id');
           
           showModal({
             title: 'Delete Analysis',
             message: 'Are you sure you want to permanently delete this analysis record?',
             type: 'confirm',
             confirmText: 'Delete',
             onConfirm: async () => {
               try {
                 await api.del(`/analysis/delete/${id}`);
                 showModal({
                   title: 'Success',
                   message: 'Analysis deleted successfully.',
                   type: 'success'
                 });
                 renderAnalysis(container); // Refresh view
               } catch (err) {
                 showModal({
                   title: 'Delete Failed',
                   message: err.message,
                   type: 'error'
                 });
               }
             }
           });
         });
      });

    } else {
      listContainer.innerHTML = `
        <div class="mockup-empty-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 6rem 2rem; border: 1px dashed var(--border-subtle); border-radius: var(--radius-lg); background: rgba(255,255,255,0.01);">
          <div class="empty-state-content" style="text-align: center;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--text-muted); opacity: 0.6; margin-bottom: 1.5rem;">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
            <p style="font-size: 1.1rem; color: var(--text-muted);">No analysis results yet</p>
            <p style="font-size: 0.9rem; color: #475569; margin-top: 0.5rem;">Upload a resume to see AI analysis reports here.</p>
          </div>
        </div>
      `;
    }
  } catch (err) {
    console.error('Failed to fetch analysis:', err);
    const listContainer = document.getElementById('analysis-list-container');
    if (listContainer) {
      listContainer.innerHTML = `
        <div class="error-state" style="padding: 3rem; text-align: center; color: #ef4444;">
          Failed to load analysis results. Please try again later.
        </div>
      `;
    }
  }
};

const showReportModal = (report) => {
  const existingModal = document.querySelector('.modal-overlay');
  if (existingModal) existingModal.remove();

  const modalHtml = `
    <div class="modal-overlay active">
      <div class="limit-modal animate-modal-in" style="max-width: 800px; text-align: left; padding: 2.5rem; background: rgba(22, 25, 33, 0.98); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 1.5rem;">
          <div>
            <h2 style="margin: 0; font-size: 1.8rem; font-weight: 800; background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Analysis Report</h2>
            <p style="margin: 0.5rem 0 0; color: var(--text-muted); font-size: 1rem;">Full AI insights and recommendations</p>
          </div>
          <div class="match-score-big" style="text-align: center; background: rgba(0, 217, 255, 0.05); padding: 1rem; border-radius: 20px; border: 1px solid rgba(0, 217, 255, 0.1);">
            <div style="font-size: 2.5rem; font-weight: 800; color: var(--accent-primary); line-height: 1;">${report.score}%</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem; letter-spacing: 1.5px; font-weight: 700;">MATCH SCORE</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2.5rem;">
          <div>
            <h4 style="color: #10b981; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.75rem; font-size: 1.15rem; font-weight: 700;">
              <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(16, 185, 129, 0.1); display: flex; align-items: center; justify-content: center;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              Key Strengths
            </h4>
            <ul style="list-style: none; padding: 0;">
              ${report.strengths && report.strengths.length > 0 ? report.strengths.map(s => `<li style="margin-bottom: 1rem; color: #e2e8f0; font-size: 0.95rem; display: flex; gap: 1rem; line-height: 1.6;"><span style="color: #10b981; font-weight: 900;">•</span> ${s}</li>`).join('') : '<li style="color: var(--text-muted);">No specific strengths identified.</li>'}
            </ul>
          </div>
          <div>
            <h4 style="color: #f59e0b; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.75rem; font-size: 1.15rem; font-weight: 700;">
              <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(245, 158, 11, 0.1); display: flex; align-items: center; justify-content: center;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              </div>
              Smart Suggestions
            </h4>
            <ul style="list-style: none; padding: 0;">
              ${report.suggestions && report.suggestions.length > 0 ? report.suggestions.map(s => `<li style="margin-bottom: 1rem; color: #e2e8f0; font-size: 0.95rem; display: flex; gap: 1rem; line-height: 1.6;"><span style="color: #f59e0b; font-weight: 900;">•</span> ${s}</li>`).join('') : '<li style="color: var(--text-muted);">No suggestions available.</li>'}
            </ul>
          </div>
        </div>

        <div class="modal-actions" style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 2rem;">
          <button class="btn btn-primary" id="btn-modal-close" style="width: 100%; border-radius: 14px; padding: 1rem; font-weight: 700; font-size: 1.1rem; box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);">Close Report</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const overlay = document.querySelector('.modal-overlay');
  const closeBtn = document.getElementById('btn-modal-close');

  const closeModal = () => {
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 300);
  };

  closeBtn.onclick = closeModal;
  overlay.onclick = (e) => {
    if (e.target === overlay) closeModal();
  };
};
