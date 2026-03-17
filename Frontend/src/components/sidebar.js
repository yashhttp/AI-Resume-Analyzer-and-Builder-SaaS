export const renderSidebar = (activeItem) => {
  const user = {
    name: localStorage.getItem('userName') || 'Demo User',
    email: localStorage.getItem('userEmail') || 'demo@example.com'
  };

  const userRole = localStorage.getItem('userRole') || 'user';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>' },
    ...(userRole === 'admin' ? [{ id: 'admin', label: 'Admin Panel', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>' }] : []),
    { id: 'builder', label: 'Resume Builder', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>' },
    { id: 'upload', label: 'Upload Resume', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>' },
    { id: 'resumes', label: 'My Resumes', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>' },
    { id: 'analysis', label: 'Analysis', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>' },
    { id: 'subscription', label: 'Pricing', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>' },
    { id: 'profile', label: 'Profile', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' }
  ];

  return `
    <aside class="sidebar">
      <div class="sidebar-logo" onclick="window.location.hash='#'" style="cursor: pointer;">
        <div class="sidebar-logo-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <span class="sidebar-logo-text">ResumeAI</span>
        <div class="sidebar-collapse-toggle" onclick="event.stopPropagation()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </div>
      </div>

      <nav class="sidebar-nav">
        ${navItems.map(item => `
          <div class="nav-item ${activeItem === item.id ? 'active' : ''}" onclick="window.location.hash='#${item.id}'">
            ${item.icon}
            ${item.label}
          </div>
        `).join('')}
      </nav>

      <div class="sidebar-user">
        <div class="user-card">
          <div class="user-avatar">${user.name.charAt(0)}</div>
          <div class="user-info">
            <span class="user-name">${user.name}</span>
            <span class="user-email">${user.email}</span>
          </div>
        </div>
        <div id="sidebar-logout" class="nav-item logout-link" style="color: #ef4444; margin-top: 1rem;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          Logout
        </div>
      </div>
    </aside>
  `;
};

export const initSidebarEvents = () => {
  const logoutBtn = document.getElementById('sidebar-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.hash = '#login';
    });
  }
};
