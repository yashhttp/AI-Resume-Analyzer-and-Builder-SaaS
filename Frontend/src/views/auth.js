import { api } from '../api.js';
import { navigate } from '../router.js';

export const renderAuth = (type) => {
  const container = document.getElementById('app');
  const isLogin = type === 'login';
  
  container.innerHTML = `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header" style="margin-bottom: 2rem;">
          <div style="width: 50px; height: 50px; background: var(--grad-primary); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1rem; box-shadow: var(--shadow-glow);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <h2 style="margin-bottom: 0.5rem;">${isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
          <p style="color: var(--text-muted); font-size: 0.95rem;">${isLogin ? 'Enter your details to access your dashboard.' : 'Sign up to start analyzing your resumes with AI.'}</p>
        </div>
        
        <form id="auth-form">
          ${!isLogin ? `
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" id="name" required placeholder="John Doe">
            </div>
          ` : ''}
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" id="email" required placeholder="name@example.com">
          </div>
          <div class="form-group" style="margin-bottom: 2rem;">
            <label>Password</label>
            <input type="password" id="password" required placeholder="••••••••">
          </div>
          <button type="submit" class="btn btn-primary w-100" style="padding: 0.875rem; font-size: 1.05rem;">
            ${isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>
        
        <p class="auth-switch" style="margin-top: 2rem; color: var(--text-muted);">
          ${isLogin ? "Don't have an account?" : 'Already have an account?'} 
          <a href="#${isLogin ? 'register' : 'login'}" style="font-weight: 500; margin-left: 0.5rem;">
            ${isLogin ? 'Create one' : 'Log in here'}
          </a>
        </p>
      </div>
    </div>
  `;

  document.getElementById('auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const payload = { email, password };
    
    if (!isLogin) {
      payload.name = document.getElementById('name').value;
    }

    try {
      const btn = e.target.querySelector('button');
      const originalText = btn.innerText;
      btn.innerText = 'Loading...';
      btn.disabled = true;

      const res = await api.post(`/auth/${isLogin ? 'login' : 'register'}`, payload);
      
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userName', res.data.name || '');
        localStorage.setItem('userEmail', res.data.email || '');
        localStorage.setItem('userRole', res.data.role || 'user');
        navigate('#dashboard');
      } else {
        alert(res.message || 'Authentication successful, but no token received.');
      }
    } catch (err) {
      alert(err.message || 'Authentication failed');
    } finally {
      const btn = e.target.querySelector('button');
      if (btn) {
        btn.innerText = isLogin ? 'Login' : 'Register';
        btn.disabled = false;
      }
    }
  });
};
