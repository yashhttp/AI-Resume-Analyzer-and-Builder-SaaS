import { renderHome } from './views/home.js';
import { renderAuth } from './views/auth.js';
import { renderDashboard } from './views/dashboard.js';
import { renderProfile } from './views/profile.js';
import { renderResumes } from './views/resumes.js';
import { renderAnalysis } from './views/analysis.js';
import { renderSubscription } from './views/subscription.js';
import { renderAdmin } from './views/admin.js';
import { renderUpload } from './views/upload.js';
import { renderBuilder } from './views/builder.js';

const routes = {
  '': renderHome,
  '#': renderHome,
  '#features': renderHome,
  '#pricing': renderSubscription,
  '#login': () => renderAuth('login'),
  '#register': () => renderAuth('register'),
  '#profile': renderProfile,
  '#dashboard': renderDashboard,
  '#resumes': renderResumes,
  '#analysis': renderAnalysis,
  '#upload': renderUpload,
  '#subscription': renderSubscription,
  '#admin': renderAdmin,
  '#builder': renderBuilder,
};

export const initRouter = () => {
  const router = () => {
    let hash = window.location.hash;
    const baseHash = hash.split('/')[0] || '';
    const renderFunc = routes[baseHash] || renderHome;
    const appEl = document.getElementById('app');
    
    // Clear and execute render
    appEl.innerHTML = '';
    renderFunc(appEl);

    // Smooth scroll for landing sections
    if (baseHash === '#features') {
       setTimeout(() => {
          const target = document.querySelector(baseHash);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
       }, 100);
    } else {
       // Reset scroll position for independent pages
       window.scrollTo(0, 0);
    }
  };

  window.addEventListener('hashchange', router);
  window.addEventListener('load', router);
  
  // Initial call
  router();
};

export const navigate = (hash) => {
  window.location.hash = hash;
};
