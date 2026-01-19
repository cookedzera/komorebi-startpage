class Statusbar extends Component {
    externalRefs = {};

    refs = {
        categories: ".categories ul",
        tabs: "#tabs ul li",
        indicator: ".indicator",
    };

    currentTabIndex = 0;

    // Tab color themes - Anime Sepia/Olive Lofi
    tabColors = {
        0: { bg: 'rgba(42, 43, 38, 0.94)', accent: '#a9b665' }, // Dark Olive + Olive Green
        1: { bg: 'rgba(50, 48, 47, 0.94)', accent: '#d4be98' }, // Warm Grey + Beige
        2: { bg: 'rgba(45, 36, 32, 0.94)', accent: '#e78a4e' }, // Dark Sepia + Soft Orange
        3: { bg: 'rgba(37, 38, 42, 0.94)', accent: '#7daea3' }, // Muted Blue-Black + Sage
    };

    constructor() {
        super();
        this.setDependencies();
    }

    setDependencies() {
        this.externalRefs = {
            categories: this.parentNode.querySelectorAll(this.refs.categories),
        };
    }

    imports() {
        return [
            this.resources.fonts.roboto,
            this.resources.icons.material,
            this.resources.libs.awoo,
        ];
    }

    style() {
        return `
      *:not(:defined) { display: none; }

      #tabs, #tabs .widgets, #tabs ul li:last-child { position: absolute; }
      #tabs { width: 100%; height: 100%; }

      #tabs ul {
          counter-reset: tabs;
          height: 100%;
          position: relative;
          list-style: none;
          margin-left: 1em;
      }

      #tabs ul li:not(:last-child)::after {
          content: counter(tabs, cjk-ideographic);
          counter-increment: tabs;
          display: flex;
          width: 100%; height: 100%;
          position: relative;
          align-items: center;
          text-align: center;
          justify-content: center;
      }

      #tabs ul li:not(:last-child) {
          width: 35px;
          text-align: center;
          font: 700 13px 'Yu Gothic', serif;
          color: var(--color-text-muted, rgba(232, 224, 213, 0.4));
          padding: 6px 0;
          transition: all .2s ease;
          cursor: pointer;
          line-height: 0;
          height: 100%;
          border-radius: 4px;
      }

      #tabs ul li:not(:last-child):hover {
          background: var(--glass-bg, rgba(169, 182, 101, 0.1));
          color: var(--color-text-primary, rgba(232, 224, 213, 0.8));
      }

      #tabs ul li:last-child {
          --flavour: #a9b665;
          width: 35px; height: 3px;
          background: var(--flavour);
          bottom: 0;
          transition: all .3s ease;
          border-radius: 2px;
      }

      #tabs ul li[active]:not(:last-child) { color: #e8e0d5; font-size: 13px; padding: 6px 0; }
      #tabs ul li[active]:nth-child(2) ~ li:last-child { margin: 0 0 0 35px; }
      #tabs ul li[active]:nth-child(3) ~ li:last-child { margin: 0 0 0 70px; }
      #tabs ul li[active]:nth-child(4) ~ li:last-child { margin: 0 0 0 105px; }
      #tabs ul li[active]:nth-child(5) ~ li:last-child { margin: 0 0 0 140px; }
      ${CONFIG.tabs.map((tab, i) => `#tabs ul li[active]:nth-child(${i + 1}) ~ li:last-child { --flavour: ${tab.accent || '#f4a261'}; }`).join('\n      ')}

      .widgets {
          right: 0;
          margin: auto;
          height: 32px;
          color: #e8e0d5;
          font-size: 12px;
          display: flex;
          align-items: center;
      }

      .widget {
          position: relative;
          height: 100%;
          padding: 0 1em;
          display: flex;
          align-items: center;
      }

      .widget:first-child { padding-left: 2em; }
      .widget:last-child { padding-right: 2em; }
      .widget:not(:first-child)::before {
          content: '';
          position: absolute;
          left: 0;
          height: calc(100% - 15px);
          width: 1px;
          background: rgba(255, 255, 255, 0.1);
      }
    `;
    }

    template() {
        const userSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
        const widgets = userSettings.widgets || { crypto: true, weather: true, ambient: true, search: true };
        return `
        <div id="tabs">
            <cols>
                <ul class="- indicator"></ul>
                <div class="+ widgets col-end">
                    ${widgets.crypto ? '<crypto-widget class="+ widget"></crypto-widget>' : ''}
                    <current-time class="+ widget"></current-time>
                    ${widgets.weather ? '<weather-forecast class="+ widget weather"></weather-forecast>' : ''}
                </div>
            </cols>
        </div>`;
    }

    updateLinksBackground(tabIndex) {
    }

    setEvents() {
        this.refs.tabs.forEach(tab => tab.onclick = ({ target }) => this.handleTabChange(target));

        let scrollTimeout = null;
        let lastScrollTime = 0;
        const SCROLL_COOLDOWN = 700;

        document.addEventListener('wheel', (e) => {
            const now = Date.now();
            if (now - lastScrollTime < SCROLL_COOLDOWN) return;
            if (e.target.closest('.content-area, .overlay, input, textarea')) return;

            lastScrollTime = now;
            this.handleWheelScroll(e);
        }, { passive: true });

        document.onkeydown = (e) => this.handleKeyPress(e);
        if (CONFIG.openLastVisitedTab) window.onbeforeunload = () => this.saveCurrentTab();
    }

    saveCurrentTab() { localStorage.lastVisitedTab = this.currentTabIndex; }
    openLastVisitedTab() { if (CONFIG.openLastVisitedTab) this.activateByKey(localStorage.lastVisitedTab); }
    handleTabChange(tab) { this.activateByKey(Number(tab.getAttribute("tab-index"))); }

    handleWheelScroll(event) {
        if (!event) return;
        const delta = event.deltaY || -event.wheelDelta;

        // Small threshold to filter noise but not block normal scrolls
        if (Math.abs(delta) < 5) return;

        // Find current active tab
        let activeTab = this.currentTabIndex;
        const tabCount = this.refs.tabs.length - 1;

        // Scroll down = next tab, scroll up = previous tab
        if (delta > 0) {
            activeTab = (activeTab + 1) % tabCount;
        } else {
            activeTab = activeTab - 1 < 0 ? tabCount - 1 : activeTab - 1;
        }

        this.activateByKey(activeTab);
    }

    handleKeyPress(event) {
        if (!event) return;
        let { target, key } = event;
        if (target.shadow && target.shadow.activeElement) return;
        if (Number.isInteger(parseInt(key)) && key <= this.externalRefs.categories.length) this.activateByKey(key - 1);
    }

    activateByKey(key) {
        if (key < 0) return;
        this.currentTabIndex = key;
        this.activate(this.refs.tabs, this.refs.tabs[key]);
        this.activate(this.externalRefs.categories, this.externalRefs.categories[key]);
        this.updateLinksBackground(key);
    }

    createTabs() {
        const count = this.externalRefs.categories.length;
        for (let i = 0; i < count; i++) this.refs.indicator.innerHTML += `<li tab-index=${i} ${i == 0 ? "active" : ""}></li>`;
        // Add the indicator element at the end (for the underline)
        this.refs.indicator.innerHTML += `<li></li>`;
    }

    activate(target, item) {
        if (!target || !item) return;
        target.forEach(i => i.removeAttribute("active"));
        item.setAttribute("active", "");
    }

    connectedCallback() {
        this.render().then(() => {
            this.createTabs();
            this.setEvents();
            this.openLastVisitedTab();
        });
    }
}
