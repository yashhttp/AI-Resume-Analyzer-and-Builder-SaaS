import { renderSidebar, initSidebarEvents } from '../components/sidebar.js';
import { api } from '../api.js';
import { showModal } from '../utils/modals.js';

export const renderResumes = async (container) => {
  container.innerHTML = `
    <div class="dash-layout">
      ${renderSidebar('resumes')}
      
      <main class="dash-content">
        <header class="page-header animate-slide-in">
          <h1 class="text-gradient">My <span style="color: white;">Resumes</span></h1>
          <p class="subtitle">Manage your uploaded resumes</p>
        </header>

        <section id="resumes-list-container" class="animate-slide-in" >
          <div class="loading-state" style="padding: 3rem; text-align: center; color: var(--text-muted);">
            Loading your resumes...
          </div>
        </section>
      </main>
    </div>
  `;
  
  initSidebarEvents();

  // Fetch real data
  try {
    const res = await api.get('/resume/my');
    const listContainer = document.getElementById('resumes-list-container');
    
    if (res.data && res.data.length > 0) {
      listContainer.innerHTML = `
        <div class="resumes-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 1rem;">
          ${res.data.map((item, idx) => `
            <div class="card animate-slide-in" style="position: relative; overflow: hidden;">
              <div style="width: 45px; height: 45px; background: rgba(0, 217, 255, 0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--accent-primary); margin-bottom: 1.25rem;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
              </div>
              <h4 style="margin: 0 0 0.5rem 0; font-size: 1.05rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${item.originalName || 'Resume'}">${item.originalName || 'Resume'}</h4>
              <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1.5rem;">Uploaded ${new Date(item.createdAt).toLocaleDateString()}</p>
              
              <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-outline btn-sm btn-view-pdf" data-path="${item.filePath}" style="flex: 1; font-size: 0.75rem; padding: 0.5rem;">View PDF</button>
                <button class="btn btn-outline btn-sm btn-delete-resume" data-id="${item._id}" style="flex: 1; font-size: 0.75rem; padding: 0.5rem; border-color: rgba(239, 68, 68, 0.3); color: #ef4444;">Delete</button>
              </div>
            </div>
          `).join('')}
        </div>
      `;

      const BACKEND_URL = 'http://localhost:4000';

      // Attach view pdf events
      document.querySelectorAll('.btn-view-pdf').forEach(btn => {
        btn.addEventListener('click', () => {
          const filePath = btn.getAttribute('data-path');
          const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
          const fullUrl = `${BACKEND_URL}/${cleanPath}`;
          window.open(fullUrl, '_blank');
        });
      });

      // Attach delete events
      document.querySelectorAll('.btn-delete-resume').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          
          showModal({
            title: 'Delete Resume',
            message: 'Are you sure you want to permanently delete this resume?',
            type: 'confirm',
            confirmText: 'Delete',
            onConfirm: async () => {
              try {
                await api.del(`/resume/${id}`);
                showModal({
                  title: 'Success',
                  message: 'Resume deleted successfully.',
                  type: 'success'
                });
                renderResumes(container); // Refresh
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
        <div class="mockup-empty-container">
          <div class="empty-state-content">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--text-muted); opacity: 0.8; margin-bottom: 1rem;">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <line x1="10" y1="9" x2="8" y2="9"></line>
            </svg>
            <p class="text-muted" style="font-size: 0.95rem;">No resumes uploaded yet</p>
          </div>
        </div>
      `;
    }
  } catch (err) {
    console.error('Failed to fetch resumes:', err);
    document.getElementById('resumes-list-container').innerHTML = `
      <div class="error-state" style="padding: 3rem; text-align: center; color: #ef4444;">
        Failed to load resumes. Please try again.
      </div>
    `;
  }
};
