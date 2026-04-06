export const useCustomToast = () => {
  const showToast = (
    title: string, 
    description: string, 
    type: 'success' | 'warning' | 'error' = 'success'
  ) => {
    // 1. Style Mapping
    const config = {
      success: {
        icon: '✅',
        bg: '#74EBBD', // Emerald Green
      },
      warning: {
        icon: '⚠️',
        bg: '#D5A24A', // Your Gold color
      },
      error: {
        icon: '❌',
        bg: '#EF4444', // Red
      }
    };

    const current = config[type];

    // 2. Find or create the container
    let container = document.getElementById('custom-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'custom-toast-container';
      document.body.appendChild(container);
    }

    // 3. Create the toast element
    const toast = document.createElement('div');
    toast.className = 'my-custom-toast';
    
    // Apply dynamic background color directly
    toast.style.backgroundColor = current.bg;
    
    toast.innerHTML = `
      <div class="toast-content">
        <div class="toast-icon">${current.icon}</div>
        <div class="toast-text">
          <div class="toast-title">${title}</div>
          <div class="toast-description">${description}</div>
        </div>
        <button class="toast-close">&times;</button>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => toast.classList.add('is-visible'), 10);

    const remove = () => {
      toast.classList.remove('is-visible');
      toast.addEventListener('transitionend', () => toast.remove());
    };

    setTimeout(remove, 5000);
    toast.querySelector('.toast-close')?.addEventListener('click', remove);
  };

  return { showToast };
};