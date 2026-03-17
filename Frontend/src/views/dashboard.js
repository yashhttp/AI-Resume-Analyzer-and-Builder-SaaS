import { renderSidebar, initSidebarEvents } from '../components/sidebar.js';
import { api } from '../api.js';

export const renderDashboard = async (container) => {
  const user = {
    name: localStorage.getItem('userName') || 'Demo User',
    email: localStorage.getItem('userEmail') || 'demo@example.com'
  };

  container.innerHTML = `
    <div class="dash-layout">
      ${renderSidebar('dashboard')}

      <!-- Main Content -->
      <main class="dash-content">
        <header class="dash-content-header animate-slide-in">
          <h1>Welcome, <span class="text-gradient">${user.name}</span></h1>
          <p>Here's your resume analysis overview</p>
        </header>

        <section class="stats-row">
          <div class="stat-premium-card animate-slide-in" >
            <div class="stat-info">
              <span class="label">Total Resumes</span>
              <span class="value" id="stat-resumes">0</span>
            </div>
            <div class="stat-icon-box" style="background: rgba(0, 217, 255, 0.1); color: #00d9ff;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            </div>
          </div>
          <div class="stat-premium-card animate-slide-in" >
            <div class="stat-info">
              <span class="label">Total Analysis</span>
              <span class="value" id="stat-analysis">0</span>
            </div>
            <div class="stat-icon-box" style="background: rgba(139, 92, 246, 0.1); color: #8b5cf6;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            </div>
          </div>
          <div class="stat-premium-card animate-slide-in" >
            <div class="stat-info">
              <span class="label">Plan</span>
              <span class="value">FREE</span>
            </div>
            <div class="stat-icon-box" style="background: rgba(236, 72, 153, 0.1); color: #ec4899;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.05 6.18L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
            </div>
          </div>
          <div class="stat-premium-card animate-slide-in" >
            <div class="stat-info">
              <span class="label">Remaining Uploads</span>
              <span class="value">3</span>
            </div>
            <div class="stat-icon-box" style="background: rgba(16, 185, 129, 0.1); color: #10b981;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            </div>
          </div>
        </section>

        <div class="dash-grid-mockup">
          <div class="trend-section card animate-slide-in" padding-bottom: 1.5rem;">
            <div class="card-header" style="border-bottom: 1px solid rgba(255,255,255,0.05); padding: 1.25rem 1.5rem; margin-bottom: 1rem;">
              <h3 style="display: flex; align-items: center; gap: 0.75rem; font-size: 1.1rem; margin: 0;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00d9ff" stroke-width="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                Score Trend
              </h3>
            </div>
            <div class="trend-content" id="score-trend-container" style="height: 300px; padding: 0 1rem; position: relative;">
               <canvas id="scoreChart"></canvas>
               <div id="chart-loading" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: rgba(22, 25, 33, 0.4); border-radius: 12px; color: var(--text-muted);">
                 Loading trend data...
               </div>
            </div>
          </div>

          <div class="card animate-slide-in" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1)); border: 1px solid rgba(99, 102, 241, 0.2); display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 2rem;">
            <div class="stat-icon-box" style="background: var(--grad-primary); color: white; width: 60px; height: 60px; border-radius: 16px; margin-bottom: 1.5rem;">
               <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </div>
            <h3 style="margin-bottom: 0.5rem;">Create New Resume</h3>
            <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.5rem;">Use our AI-powered builder to create a professional resume from scratch.</p>
            <button class="btn btn-primary w-100" onclick="window.location.hash='#builder'">Start Building</button>
          </div>
        </div>
      </main>
    </div>
  `;

  initSidebarEvents();

  const initScoreChart = async () => {
    try {
      const res = await api.get('/analysis/trend?type=raw');
      const container = document.getElementById('score-trend-container');
      const loader = document.getElementById('chart-loading');
      
      if (res.data && res.data.length > 0) {
        if (loader) loader.remove();
        
        const ctx = document.getElementById('scoreChart').getContext('2d');
        const themeColor = '#6366f1'; // Indigo color for chart
        
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

        new Chart(ctx, {
          type: 'line',
          data: {
            labels: res.data.map(i => new Date(i.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })),
            datasets: [{
              label: 'Match Score',
              data: res.data.map(i => i.score),
              borderColor: themeColor,
              borderWidth: 3,
              backgroundColor: gradient,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: themeColor,
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: 'rgba(22, 25, 33, 0.9)',
                titleColor: '#fff',
                bodyColor: '#a5b4fc',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                callbacks: {
                  label: (context) => `Score: ${context.parsed.y}%`
                }
              }
            },
            scales: {
              y: {
                min: 0,
                max: 100,
                grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
                ticks: { color: 'rgba(255, 255, 255, 0.4)', font: { size: 10 } }
              },
              x: {
                grid: { display: false },
                ticks: { color: 'rgba(255, 255, 255, 0.4)', font: { size: 10 } }
              }
            }
          }
        });
      } else {
        container.innerHTML = `
          <div class="empty-state" style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0.6;">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 1rem;"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            <p style="font-size: 0.9rem;">No analysis data yet. Upload and analyze a resume to see trends.</p>
          </div>
        `;
      }
    } catch (err) {
      console.error('Chart failed to load:', err);
      document.getElementById('score-trend-container').innerHTML = `
        <div class="error-state" style="padding: 2rem; color: #ef4444; font-size: 0.85rem; text-align: center;">
          Could not load trend data.
        </div>
      `;
    }
  };

  const initImprovementStat = async () => {
    try {
      const res = await api.get('/analysis/improvement');
      if (res.data) {
        const { improvementPercentage, firstScore, latestScore } = res.data;
        const trendTitle = document.querySelector('.card-header h3');
        
        if (trendTitle && (firstScore > 0 || latestScore > 0)) {
           const color = improvementPercentage > 0 ? '#10b981' : (improvementPercentage < 0 ? '#ff4d4f' : '#8b5cf6');
           const arrow = improvementPercentage > 0 ? '↗' : (improvementPercentage < 0 ? '↘' : '→');
           const prefix = improvementPercentage > 0 ? '+' : '';
           
           trendTitle.innerHTML += `
             <span style="margin-left:auto; font-size:0.9rem; background: ${color}22; color:${color}; padding:4px 12px; border-radius:20px; font-weight:600;">
               ${arrow} ${prefix}${improvementPercentage}% Improvement
             </span>
           `;
        }
      }
    } catch(err) {
      console.error("Failed to load improvement stats:", err);
    }
  };

  initScoreChart();
  initImprovementStat();

  // Load history & update stats
  try {
    // Parallel fetch for history and profile
    const [historyRes, profileRes] = await Promise.all([
      api.get('/analysis/my'),
      api.get('/auth/profile')
    ]);

    const statResumes = document.getElementById('stat-resumes');
    const statAnalysis = document.getElementById('stat-analysis');
    
    // Update Stats from Profile
    if (profileRes.data) {
      const { plan, remainingUploads, totalResumes, totalAnalysis, role } = profileRes.data;
      
      // Update role in localStorage
      localStorage.setItem('userRole', role || 'user');
      
      // Update Total Resumes count
      if (statResumes) statResumes.innerText = totalResumes || 0;
      
      // Update Total Analysis count
      if (statAnalysis) statAnalysis.innerText = totalAnalysis || 0;
      
      // Update Plan
      const planValue = document.querySelectorAll('.stat-info .value')[2];
      if (planValue) planValue.innerText = plan.toUpperCase();
      
      // Update Remaining
      const remainingValue = document.querySelectorAll('.stat-info .value')[3];
      if (remainingValue) {
        remainingValue.innerText = remainingUploads === "Unlimited" ? "Unlimited" : remainingUploads;
      }
    }
  } catch (e) {
    console.error('Failed to load dashboard data:', e);
  }
};
