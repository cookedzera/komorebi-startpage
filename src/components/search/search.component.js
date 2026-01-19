class Search extends Component {
  constructor() {
    super();
    this.isOpen = false;
  }

  get engines() {
    return CONFIG.search?.engines || {};
  }

  style() {
    return `
            :host {
                position: fixed;
                inset: 0;
                z-index: 9999;
                pointer-events: none;
                display: block;
            }

            .overlay {
                position: absolute;
                inset: 0;
                background: rgba(18, 18, 18, 0.6);
                backdrop-filter: blur(24px) saturate(120%);
                -webkit-backdrop-filter: blur(24px) saturate(120%);
                opacity: 0;
                transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .overlay.open {
                opacity: 1;
                pointer-events: auto;
            }

            .search-container {
                width: 600px;
                max-width: 90%;
                display: flex;
                flex-direction: column;
                align-items: center;
                transform: scale(0.95);
                transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            }

            .overlay.open .search-container {
                transform: scale(1);
            }

            input {
                width: 100%;
                background: transparent;
                border: none;
                border-bottom: 2px solid rgba(255, 255, 255, 0.15);
                color: #e8e0d5;
                font-family: 'Roboto', sans-serif;
                font-size: 32px;
                font-weight: 300;
                text-align: center;
                padding: 20px 24px;
                outline: none;
                transition: all 0.3s ease;
            }

            input:focus {
                border-color: rgba(244, 162, 97, 0.6);
                transform: translateY(-2px);
            }

            input::placeholder {
                color: rgba(255, 255, 255, 0.2);
                font-weight: 200;
            }

            .engines {
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                gap: 12px;
                margin-top: 24px;
                opacity: 0.6;
                transition: opacity 0.3s;
            }

            .engines:hover {
                opacity: 1;
            }

            .engine-tag {
                font-family: 'Roboto', sans-serif;
                font-size: 11px;
                color: rgba(232, 224, 213, 0.7);
                padding: 6px 10px;
                border-radius: 6px;
                background: rgba(255, 255, 255, 0.05);
                letter-spacing: 0.5px;
            }
        `;
  }

  template() {
    return `
            <div class="overlay" id="overlay">
                <div class="search-container">
                    <input type="text" id="input" name="search-input" placeholder="Search..." spellcheck="false" autocomplete="off">
                    <div class="engines">
                        ${Object.keys(this.engines).map(key =>
      `<span class="engine-tag">!${key} ${this.engines[key][1]}</span>`
    ).join('')}
                    </div>
                </div>
            </div>
        `;
  }

  connectedCallback() {
    this.render().then(() => {
      this.overlay = this.shadow.getElementById('overlay');
      this.input = this.shadow.getElementById('input');

      window.addEventListener('keydown', (e) => this.handleKeydown(e));

      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) this.close();
      });

      this.input.addEventListener('keydown', (e) => this.handleInputKey(e));
    });
  }

  handleKeydown(e) {
    const isInputActive = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
    if (isInputActive && !this.isOpen) return;

    if (e.key === 's' && !this.isOpen) {
      e.preventDefault();
      this.open();
    }

    if (e.key === 'Escape' && this.isOpen) {
      e.preventDefault();
      this.close();
    }
  }

  handleInputKey(e) {
    if (e.key === 'Enter') {
      this.performSearch(this.input.value);
    }
  }

  open() {
    this.isOpen = true;
    this.overlay.classList.add('open');
    this.input.value = '';
    setTimeout(() => this.input.focus(), 50);
  }

  close() {
    this.isOpen = false;
    this.overlay.classList.remove('open');
    this.input.blur();
  }

  performSearch(query) {
    if (!query.trim()) return;

    let url = this.engines['g'][0];
    let q = query;

    const parts = query.trim().split(' ');
    const prefix = parts[0];

    if (prefix.startsWith('!')) {
      const key = prefix.substring(1);
      if (this.engines[key]) {
        url = this.engines[key][0];
        q = parts.slice(1).join(' ');

        const isSearchUrl = url.includes('=') || url.includes('?');

        if (!q && !isSearchUrl) {
          window.location.href = url;
          this.close();
          return;
        }
      }
    }

    window.location.href = url + encodeURIComponent(q);
    this.close();
  }
}
