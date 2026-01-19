class Greeting extends Component {
  clickCount = 0;
  clickTimer = null;
  hasSeenHint = false;

  constructor() {
    super();
    const userSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    this.userName = userSettings.userName || CONFIG.config.userName || 'User';
    this.hasSeenHint = localStorage.getItem('onboardingHintSeen') === 'true';
  }

  imports() {
    return [
      this.resources.fonts.roboto,
    ];
  }

  getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }

  style() {
    return `
      :host {
        position: fixed;
        top: 20px;
        right: 30px;
        z-index: 1000;
        max-width: 300px;
      }

      .greeting {
        font: 300 13px 'Roboto', sans-serif;
        color: rgba(237, 242, 244, 0.5);
        letter-spacing: 0.5px;
        cursor: default;
        user-select: none;
        transition: color 0.2s ease;
        
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: right;
      }

      .greeting:hover {
        color: rgba(237, 242, 244, 0.7);
      }

      .greeting .name {
        color: #f4a261;
        font-weight: 400;
      }

      .onboarding-hint {
        margin-top: 12px;
        padding: 10px 14px;
        background: rgba(42, 43, 38, 0.85);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(169, 182, 101, 0.2);
        border-radius: 8px;
        font: 300 11px 'Roboto', sans-serif;
        color: rgba(232, 224, 213, 0.6);
        text-align: right;
        opacity: 0;
        transform: translateY(-5px);
        animation: hintFadeIn 0.6s ease 1s forwards;
        cursor: pointer;
        transition: opacity 0.3s ease, transform 0.3s ease;
      }

      .onboarding-hint:hover {
        background: rgba(42, 43, 38, 0.95);
        border-color: rgba(169, 182, 101, 0.4);
      }

      .onboarding-hint .hint-icon {
        display: inline-block;
        margin-right: 6px;
        opacity: 0.5;
      }

      .onboarding-hint .hint-action {
        color: #a9b665;
        font-weight: 400;
      }

      .onboarding-hint.fade-out {
        opacity: 0;
        transform: translateY(-10px);
        pointer-events: none;
      }

      @keyframes hintFadeIn {
        from {
          opacity: 0;
          transform: translateY(-5px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
  }

  template() {
    const greeting = this.getGreeting();
    const hintHtml = !this.hasSeenHint ? `
      <div class="onboarding-hint" id="onboarding-hint">
        <span class="hint-icon">✨</span>
        <span class="hint-action">triple tap here</span> to customize
      </div>
    ` : '';

    return `
      <span class="greeting" id="greeting-text" title="good ${greeting}, ${this.userName}">good ${greeting}, <span class="name">${this.userName}</span></span>
      ${hintHtml}
    `;
  }

  handleClick() {
    this.clickCount++;

    if (this.clickTimer) clearTimeout(this.clickTimer);

    this.clickTimer = setTimeout(() => {
      this.clickCount = 0;
    }, 500);

    if (this.clickCount >= 3) {
      this.clickCount = 0;
      this.dismissHint();
      document.dispatchEvent(new CustomEvent('openSettings'));
    }
  }

  dismissHint() {
    const hint = this.shadow.getElementById('onboarding-hint');
    if (hint) {
      hint.classList.add('fade-out');
      setTimeout(() => hint.remove(), 300);
    }
    localStorage.setItem('onboardingHintSeen', 'true');
    this.hasSeenHint = true;
  }

  setEvents() {
    const greeting = this.shadow.getElementById('greeting-text');
    greeting?.addEventListener('click', () => this.handleClick());

    const hint = this.shadow.getElementById('onboarding-hint');
    if (hint) {
      hint.addEventListener('click', () => {
        this.dismissHint();
        document.dispatchEvent(new CustomEvent('openSettings'));
      });

      setTimeout(() => {
        if (!this.hasSeenHint) {
          this.dismissHint();
        }
      }, 8000);
    }
  }

  connectedCallback() {
    this.render().then(() => {
      this.setEvents();
    });
  }
}

customElements.define('greeting-display', Greeting);
