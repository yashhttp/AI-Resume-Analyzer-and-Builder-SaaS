import { renderSidebar, initSidebarEvents } from '../components/sidebar.js';
import { api } from '../api.js';

export const renderProfile = (container) => {
  const user = {
    name: localStorage.getItem('userName') || 'Demo User',
    email: localStorage.getItem('userEmail') || 'demo@example.com'
  };

  container.innerHTML = `
    <div class="dash-layout">
      ${renderSidebar('profile')}
      
      <main class="dash-content">
        <header class="page-header animate-slide-in">
          <h1 class="text-gradient">My <span style="color: white;">Profile</span></h1>
        </header>

        <section class="profile-layout animate-slide-in" >
          <!-- Profile Header Card -->
          <div class="profile-header-card card">
             <div class="profile-avatar-large">
               ${user.name.split(' ').map(n => n[0]).join('')}
             </div>
             <h2 class="profile-name">${user.name}</h2>
             <p class="profile-email-text">${user.email}</p>
          </div>

          <!-- Account Details Card -->
          <div class="account-details-card card">
            <h3 class="section-title">Account Details</h3>
            
            <div class="details-form">
              <div class="form-group-mock">
                <label><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> Name</label>
                <div id="profile-name-val" class="input-mock">${user.name}</div>
              </div>

              <div class="form-group-mock">
                <label><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> Email</label>
                <div id="profile-email-val" class="input-mock">${user.email}</div>
              </div>

              <div class="form-group-mock">
                <label><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg> Plan</label>
                <div id="profile-plan-val" class="input-mock highlight-text">FREE</div>
              </div>

              <button class="btn-mockup-action">Save Changes</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  `;
  
  initSidebarEvents();

  // Fetch real profile data
  const fetchProfileData = async () => {
    try {
      const res = await api.get('/auth/profile');
      if (res.data) {
        const { name, email, plan, subscriptionStatus, role } = res.data;
        
        // Update name/email in localStorage
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userRole', role || 'user');

        // Update Header
        const headerName = document.querySelector('.profile-name');
        if (headerName) headerName.innerText = name;
        const headerEmail = document.querySelector('.profile-email-text');
        if (headerEmail) headerEmail.innerText = email;

        // Update Avatar
        const avatarEl = document.querySelector('.profile-avatar-large');
        if (avatarEl) avatarEl.innerText = name.split(' ').map(n => n[0]).join('');

        // Update Form Fields
        const nameVal = document.getElementById('profile-name-val');
        if (nameVal) nameVal.innerText = name;

        const emailVal = document.getElementById('profile-email-val');
        if (emailVal) emailVal.innerText = email;

        const planVal = document.getElementById('profile-plan-val');
        
        // Setup Plan & Status display
        if (planVal) {
          planVal.innerHTML = `${plan.toUpperCase()}`;
          // Show "Cancelled" indicator if active but pending cancellation
          if (subscriptionStatus === "CANCELLED" && plan !== "FREE") {
            planVal.innerHTML += ` <span style="color: #ff4d4f; font-size: 0.8rem; margin-left:8px;">(Cancels at end of cycle)</span>`;
          }
        }

        // Add Cancel Button if the user has a PRO plan and status is not already cancelled
        const formContainer = document.querySelector('.details-form');
        if (plan !== "FREE" && subscriptionStatus !== "CANCELLED") {
          const cancelBtn = document.createElement('button');
          cancelBtn.className = "btn-mockup-action";
          cancelBtn.style.background = "linear-gradient(45deg, #ff4d4f, #d9363e)";
          cancelBtn.style.marginTop = "1rem";
          cancelBtn.style.transition = "all 0.3s ease";
          cancelBtn.innerText = "Cancel Subscription";
          
          cancelBtn.onclick = async (e) => {
            e.preventDefault();
            if(!confirm("Are you sure you want to cancel your plan? You will still have access until the end of your billing cycle.")) {
              return;
            }

            try {
              cancelBtn.innerText = "Cancelling...";
              cancelBtn.disabled = true;
              
              const res = await api.post('/subscription/cancel');
              // Using ApiResponse structure where message is at top level
              alert(res.message || "Subscription cancelled successfully.");
              
              // Refresh to show updated status
              window.location.reload();
            } catch (err) {
              console.error("Cancel failed:", err);
              alert(err.message || "Failed to cancel subscription");
              cancelBtn.innerText = "Cancel Subscription";
              cancelBtn.disabled = false;
            }
          };

          formContainer.appendChild(cancelBtn);
        }

      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  fetchProfileData();
};
