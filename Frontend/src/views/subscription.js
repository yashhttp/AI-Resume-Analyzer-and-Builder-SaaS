import { navigate } from '../router.js';
import { api } from '../api.js';

// Global handler for upgrades
window.handlePlanUpgrade = async (planType) => {
  const isLoggedIn = !!localStorage.getItem('token');
  if (!isLoggedIn) {
    navigate('#login');
    return;
  }

  try {
    const { initiateSubscription } = await import('../utils/payments.js');
    await initiateSubscription(planType);
  } catch (err) {
    alert('Upgrade failed: ' + err.message);
  }
};

/**
 * Renders ONLY the pricing header and cards (no nav/footer)
 */
export const renderPricingCards = (container) => {
  container.innerHTML = `
    <div class="pricing-view">
      <header class="pricing-header">
        <h1 class="tools-title">Simple <span class="text-gradient">Pricing</span></h1>
        <p class="tools-subtitle">Start free. Upgrade when you need more power.</p>
      </header>
      
      <div class="pricing-grid-premium">
        <!-- Free Plan -->
        <div class="pricing-card-refined">
          <div class="card-p-content">
            <h3 class="plan-name">Free</h3>
            <div class="plan-price">
              <span class="currency">₹</span>0<span class="period">forever</span>
            </div>
            <ul class="plan-features">
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> 3 Resume Uploads</li>
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> AI Analysis</li>
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Basic Score</li>
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> ATS Check</li>
            </ul>
            <button class="btn btn-card-outline w-100" onclick="window.location.hash='#register'">Start Free</button>
          </div>
        </div>

        <!-- Weekly Plan -->
        <div class="pricing-card-refined">
          <div class="card-p-content">
            <h3 class="plan-name">Weekly</h3>
            <div class="plan-price">
              <span class="currency">₹</span>49<span class="period">/week</span>
            </div>
            <ul class="plan-features">
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Unlimited Uploads</li>
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Advanced AI</li>
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Score Trends</li>
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Priority Support</li>
            </ul>
            <button class="btn btn-card-outline w-100" onclick="handlePlanUpgrade('Weekly')">Subscribe</button>
          </div>
        </div>

        <!-- Monthly Plan (Popular) -->
        <div class="pricing-card-refined active-plan">
          <div class="popular-badge-alt">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            POPULAR
          </div>
          <div class="card-p-content">
            <h3 class="plan-name">Monthly</h3>
            <div class="plan-price">
              <span class="currency">₹</span>149<span class="period">/month</span>
            </div>
            <ul class="plan-features">
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Unlimited Uploads</li>
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Advanced AI</li>
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Score Trends</li>
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Priority Support</li>
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Email Reports</li>
            </ul>
            <button class="btn btn-card-solid w-100" onclick="handlePlanUpgrade('Monthly')">Subscribe</button>
          </div>
        </div>

        <!-- Yearly Plan -->
        <div class="pricing-card-refined">
          <div class="card-p-content">
            <h3 class="plan-name">Yearly</h3>
            <div class="plan-price">
              <span class="currency">₹</span>999<span class="period">/year</span>
            </div>
            <ul class="plan-features">
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Everything in Monthly</li>
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Best Value</li>
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Early Features Access</li>
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> 1-on-1 Support</li>
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Custom Analysis</li>
            </ul>
            <button class="btn btn-card-outline w-100" onclick="handlePlanUpgrade('Yearly')">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  `;
};

/**
 * Renders the FULL pricing page with navigation and footer
 */
export const renderSubscription = (container) => {
  const isLoggedIn = !!localStorage.getItem('token');

  container.innerHTML = `
    <div class="landing-page pricing-page">
      <!-- Background Elements -->
      <div class="floating-blob blob-1"></div>
      <div class="floating-blob blob-2"></div>

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
          <a href="#pricing" class="nav-link active">Pricing</a>
          ${isLoggedIn ? `
            <a href="#dashboard" class="nav-link">Dashboard</a>
            <button id="btn-cta-nav" class="btn btn-primary btn-sm">Get Started</button>
          ` : `
            <a href="#login" class="nav-link">Login</a>
            <button id="btn-cta-nav" class="btn btn-primary btn-sm">Get Started</button>
          `}
        </div>
      </nav>

      <div id="pricing-page-content" class="section-padding">
        <!-- Pricing cards will be mounted here -->
      </div>

      <!-- Professional Footer -->
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

  // Render cards into the specific container
  const contentContainer = document.getElementById('pricing-page-content');
  if (contentContainer) {
    renderPricingCards(contentContainer);
  }

  document.getElementById('btn-cta-nav')?.addEventListener('click', () => navigate(isLoggedIn ? '#dashboard' : '#register'));
};
