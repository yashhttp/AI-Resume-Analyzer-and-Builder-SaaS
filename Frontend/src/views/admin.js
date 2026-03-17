import { renderSidebar, initSidebarEvents } from '../components/sidebar.js';
import { api } from '../api.js';

export const renderAdmin = (container) => {
  container.innerHTML = `
    <div class="dash-layout">
      ${renderSidebar('admin')}
      
      <main class="dash-content">
        <header class="dash-content-header animate-slide-in">
          <h1 class="text-gradient">Admin <span style="color: white;">Control Panel</span></h1>
          <p>System-wide analytics and user management</p>
        </header>

        <!-- Stats Grid -->
        <section class="admin-stats-grid">
          <div class="stat-premium-card animate-slide-in" style="animation-delay: 0.1s">
            <div class="stat-info">
              <span class="label">Total Users</span>
              <span class="value" id="admin-total-users">0</span>
            </div>
            <div class="stat-icon-box" style="background: rgba(99, 102, 241, 0.1); color: #6366f1;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
          </div>

          <div class="stat-premium-card animate-slide-in" style="animation-delay: 0.2s">
            <div class="stat-info">
              <span class="label">Pro Members</span>
              <span class="value" id="admin-premium-users">0</span>
            </div>
            <div class="stat-icon-box" style="background: rgba(16, 185, 129, 0.1); color: #10b981;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.05 6.18L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
            </div>
          </div>

          <div class="stat-premium-card animate-slide-in" style="animation-delay: 0.3s">
            <div class="stat-info">
              <span class="label">Total Revenue</span>
              <span class="value" id="admin-revenue">₹0</span>
            </div>
            <div class="stat-icon-box" style="background: rgba(245, 158, 11, 0.1); color: #f59e0b;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
          </div>

          <div class="stat-premium-card animate-slide-in" style="animation-delay: 0.4s">
            <div class="stat-info">
              <span class="label">Resumes Handled</span>
              <span class="value" id="admin-resumes">0</span>
            </div>
            <div class="stat-icon-box" style="background: rgba(0, 217, 255, 0.1); color: #00d9ff;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            </div>
          </div>
        </section>

        <div class="admin-grid-layout">
          <!-- Main Area: Recent Activity -->
          <div class="card recent-users-card animate-slide-in" style="animation-delay: 0.5s">
            <div class="card-header" style="justify-content: space-between; display: flex; align-items: center; margin-bottom: 1.5rem;">
               <h3 style="margin:0;">Recent User Registrations</h3>
               <button class="btn btn-secondary btn-sm" onclick="window.location.reload()">Refresh Data</button>
            </div>
            <div class="admin-table-container">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Plan</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody id="admin-recent-users-list">
                  <!-- JS Populated -->
                </tbody>
              </table>
            </div>
          </div>

          <!-- Sidebar Area: Breakdown & Health -->
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div class="card health-card animate-slide-in" style="animation-delay: 0.6s">
              <h3>Platform Health</h3>
              <div class="health-content">
                <div class="health-item">
                  <span class="health-label">Active Subscriptions</span>
                  <div class="health-bar-bg"><div class="health-bar-fill active" id="active-sub-bar" style="width: 0%"></div></div>
                  <span class="health-value" id="active-sub-val">0</span>
                </div>
                <div class="health-item">
                  <span class="health-label">Churn / Expired</span>
                  <div class="health-bar-bg"><div class="health-bar-fill cancelled" id="expired-sub-bar" style="width: 0%"></div></div>
                  <span class="health-value" id="expired-sub-val">0</span>
                </div>
              </div>
            </div>

            <div class="card revenue-card animate-slide-in" style="animation-delay: 0.7s">
              <h3>Revenue Streams</h3>
              <div class="revenue-breakdown">
                <div class="rev-item">
                  <div class="rev-type">Subscribed (Recurring)</div>
                  <div class="rev-val" id="rev-recurring">₹0</div>
                </div>
                <div class="rev-item">
                  <div class="rev-type">Direct Orders (One-time)</div>
                  <div class="rev-val" id="rev-onetime">₹0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `;

  initSidebarEvents();

  const fetchAdminData = async () => {
    try {
      const res = await api.get('/admin/analytics');
      if (res.data) {
        const { totalUsers, premiumUsers, totalResumes, totalRevenue, activeSubscriptions, expiredSubscriptions, breakdown, recentUsers } = res.data;

        // Core Numbers
        document.getElementById('admin-total-users').innerText = totalUsers.toLocaleString();
        document.getElementById('admin-premium-users').innerText = premiumUsers.toLocaleString();
        document.getElementById('admin-revenue').innerText = '₹' + totalRevenue.toLocaleString();
        document.getElementById('admin-resumes').innerText = totalResumes.toLocaleString();

        // Platform Health
        const activeSubEl = document.getElementById('active-sub-val');
        const expiredSubEl = document.getElementById('expired-sub-val');
        if (activeSubEl) activeSubEl.innerText = activeSubscriptions;
        if (expiredSubEl) expiredSubEl.innerText = expiredSubscriptions;

        const totalSubs = activeSubscriptions + expiredSubscriptions;
        if (totalSubs > 0) {
          const activePercent = (activeSubscriptions / totalSubs) * 100;
          const expiredPercent = (expiredSubscriptions / totalSubs) * 100;
          document.getElementById('active-sub-bar').style.width = activePercent + '%';
          document.getElementById('expired-sub-bar').style.width = expiredPercent + '%';
        }

        // Revenue Detail
        if (breakdown) {
          document.getElementById('rev-recurring').innerText = '₹' + breakdown.recurring.toLocaleString();
          document.getElementById('rev-onetime').innerText = '₹' + breakdown.oneTime.toLocaleString();
        }

        // Recent Users Table
        const userList = document.getElementById('admin-recent-users-list');
        if (userList && recentUsers) {
          userList.innerHTML = recentUsers.map(user => `
            <tr>
              <td>
                <div style="display: flex; flex-direction: column;">
                  <span style="font-weight: 500;">${user.name}</span>
                  <span style="font-size: 0.75rem; color: var(--text-muted);">${user.email}</span>
                </div>
              </td>
              <td>
                <span class="user-tag ${user.plan.toLowerCase()}">${user.plan}</span>
              </td>
              <td>
                <span style="font-size: 0.8rem; color: var(--text-muted);">${new Date(user.createdAt).toLocaleDateString()}</span>
              </td>
            </tr>
          `).join('');
        }
      }
    } catch (err) {
      console.error('Admin Fetch Failed:', err);
      if (err.status === 403) {
        container.innerHTML = `
          <div style="height: 100vh; display: flex; align-items: center; justify-content: center; background: #0f172a; color: white; text-align: center; flex-direction: column; padding: 2rem;">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" style="margin-bottom: 2rem;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <h1 style="color: #ef4444; margin-bottom: 1rem;">Access Denied</h1>
            <p style="color: #94a3b8; font-size: 1.1rem; max-width: 400px; line-height: 1.6; margin-bottom: 2rem;">It seems you have strayed into the command center. Only authorized AI administrators can access these systems.</p>
            <button class="btn btn-primary" onclick="window.location.hash='#dashboard'">Return to Safety</button>
          </div>
        `;
      }
    }
  };

  fetchAdminData();
};
