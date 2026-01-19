class Actions {
  static activate(componentName) {
    if (!RenderedComponents[componentName]) {
      console.error(`Component ${componentName} not found in RenderedComponents`, RenderedComponents);
      return;
    }
    return RenderedComponents[componentName].activate();
  }
}

// Keyboard Shortcuts Handler
class KeyboardShortcuts {
  static shortcuts = {
    '1': () => KeyboardShortcuts.switchTab(0),
    '2': () => KeyboardShortcuts.switchTab(1),
    '3': () => KeyboardShortcuts.switchTab(2),
    '4': () => KeyboardShortcuts.switchTab(3),
    'Escape': () => KeyboardShortcuts.closeModals(),
  };

  static init() {
    document.addEventListener('keydown', (e) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target.matches('input, textarea, [contenteditable]')) {
        if (e.key === 'Escape') {
          e.target.blur();
        }
        return;
      }

      // Command Palette: Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        KeyboardShortcuts.openCommandPalette();
        return;
      }

      // Check for registered shortcuts
      const handler = this.shortcuts[e.key];
      if (handler) {
        e.preventDefault();
        handler();
      }
    });
  }

  static switchTab(index) {
    const tabsList = document.querySelector('tabs-list');
    if (!tabsList || !tabsList.shadowRoot) return;

    const tabs = tabsList.shadowRoot.querySelectorAll('#panels .categories ul');
    if (index >= tabs.length) return;

    // Deactivate all, activate target
    tabs.forEach((tab, i) => {
      tab.removeAttribute('active');
      if (i === index) {
        tab.setAttribute('active', '');
      }
    });

    // Save to localStorage
    localStorage.setItem('lastVisitedTab', index.toString());
  }

  static focusSearch() {
    const tabsList = document.querySelector('tabs-list');
    if (!tabsList || !tabsList.shadowRoot) return;

    const searchBar = tabsList.shadowRoot.querySelector('search-bar');
    if (searchBar && searchBar.shadowRoot) {
      const input = searchBar.shadowRoot.querySelector('input');
      if (input) {
        input.focus();
        this.showToast('Search');
      }
    }
  }

  static closeModals() {
    // Close settings panel
    const tabsList = document.querySelector('tabs-list');
    if (tabsList && tabsList.shadowRoot) {
      const settings = tabsList.shadowRoot.querySelector('settings-panel');
      if (settings && settings.shadowRoot) {
        const overlay = settings.shadowRoot.querySelector('.overlay');
        if (overlay && overlay.classList.contains('open')) {
          overlay.click();
          return;
        }
      }
    }

    // Close ambient menu
    document.dispatchEvent(new Event('click'));
  }

  static openCommandPalette() {
    // Dispatch event for command palette component to handle
    document.dispatchEvent(new CustomEvent('openCommandPalette'));
    this.showToast('Command Palette');
  }

  static showToast(message) {
    // Remove existing toast
    const existing = document.querySelector('.shortcut-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'shortcut-toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 60px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(42, 43, 38, 0.95);
      color: #a9b665;
      padding: 8px 16px;
      border-radius: 6px;
      font: 500 12px 'Roboto', sans-serif;
      letter-spacing: 1px;
      text-transform: uppercase;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.2s ease;
      border: 1px solid rgba(169, 182, 101, 0.2);
    `;
    document.body.appendChild(toast);

    // Fade in
    requestAnimationFrame(() => toast.style.opacity = '1');

    // Fade out and remove
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 200);
    }, 800);
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => KeyboardShortcuts.init());
