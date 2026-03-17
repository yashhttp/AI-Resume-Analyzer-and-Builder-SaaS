/**
 * Custom Premium Modal Utility
 * Replaces native alert() and confirm() with themed glassmorphism dialogs.
 */

export const showModal = ({ 
  title, 
  message, 
  type = 'info', // 'info', 'success', 'error', 'confirm'
  confirmText = 'OK', 
  cancelText = 'Cancel',
  onConfirm = () => {},
  onCancel = () => {}
}) => {
  // Remove existing modals
  const existingModal = document.querySelector('.custom-modal-overlay');
  if (existingModal) existingModal.remove();

  const isConfirm = type === 'confirm';
  
  // Icon and color based on type
  let icon = '🔔';
  let accentColor = 'var(--accent-primary)';
  
  if (type === 'success') {
    icon = '✅';
    accentColor = '#10b981';
  } else if (type === 'error') {
    icon = '❌';
    accentColor = '#ef4444';
  } else if (type === 'confirm') {
    icon = '❓';
    accentColor = '#f59e0b';
  }

  const modalHtml = `
    <div class="custom-modal-overlay active">
      <div class="custom-modal-card animate-modal-in">
        <div class="modal-icon-header" style="background: ${accentColor}15; color: ${accentColor};">
          ${icon}
        </div>
        <h2 class="modal-title">${title}</h2>
        <p class="modal-message">${message}</p>
        
        <div class="modal-footer">
          ${isConfirm ? `<button class="btn-modal-secondary" id="modal-cancel-btn">${cancelText}</button>` : ''}
          <button class="btn-modal-primary" id="modal-confirm-btn" style="background: ${accentColor}; box-shadow: 0 4px 15px ${accentColor}33;">${confirmText}</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // Styles injected if not present
  if (!document.getElementById('custom-modal-styles')) {
    const styleSheet = document.createElement("style");
    styleSheet.id = 'custom-modal-styles';
    styleSheet.innerText = `
      .custom-modal-overlay {
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(10px);
        z-index: 10000;
        display: flex; align-items: center; justify-content: center;
        opacity: 0; pointer-events: none; transition: all 0.3s ease;
      }
      .custom-modal-overlay.active { opacity: 1; pointer-events: auto; }
      
      .custom-modal-card {
        background: rgba(22, 25, 33, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 24px;
        width: 100%; max-width: 440px;
        padding: 2.5rem 2rem;
        text-align: center;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        transform: translateY(20px);
        transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
      }
      .custom-modal-overlay.active .custom-modal-card { transform: translateY(0); }
      
      .modal-icon-header {
        width: 60px; height: 60px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto 1.5rem; font-size: 1.5rem;
      }
      .modal-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.75rem; color: white; }
      .modal-message { color: rgba(255,255,255,0.6); line-height: 1.6; margin-bottom: 2rem; font-size: 1rem; }
      
      .modal-footer { display: flex; gap: 1rem; justify-content: center; }
      .btn-modal-primary, .btn-modal-secondary {
        padding: 0.75rem 1.5rem; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; border: none; font-family: inherit;
      }
      .btn-modal-primary { color: white; min-width: 120px; }
      .btn-modal-primary:hover { transform: translateY(-2px); opacity: 0.9; }
      
      .btn-modal-secondary {
        background: rgba(255, 255, 255, 0.05); color: #94a3b8; border: 1px solid rgba(255, 255, 255, 0.1);
      }
      .btn-modal-secondary:hover { background: rgba(255, 255, 255, 0.1); color: white; }
      
      @keyframes animate-modal-in {
        from { opacity: 0; transform: scale(0.95) translateY(10px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
      }
      .animate-modal-in { animation: animate-modal-in 0.3s ease-out forwards; }
    `;
    document.head.appendChild(styleSheet);
  }

  const overlay = document.querySelector('.custom-modal-overlay');
  const confirmBtn = document.getElementById('modal-confirm-btn');
  const cancelBtn = document.getElementById('modal-cancel-btn');

  const closeModal = () => {
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 300);
  };

  confirmBtn.onclick = () => {
    closeModal();
    onConfirm();
  };

  if (cancelBtn) {
    cancelBtn.onclick = () => {
      closeModal();
      onCancel();
    };
  }

  overlay.onclick = (e) => {
    if (e.target === overlay) closeModal();
  };
};
