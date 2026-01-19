class CommandPalette extends Component {
    isOpen = false;
    selectedIndex = 0;
    filteredCommands = [];

    constructor() {
        super();
    }

    getAllCommands() {
        const commands = [];

        // Tab commands
        if (typeof CONFIG !== 'undefined' && CONFIG.tabs) {
            CONFIG.tabs.forEach((tab, i) => {
                commands.push({
                    type: 'tab',
                    name: `Go to ${tab.name}`,
                    icon: '📁',
                    action: () => KeyboardShortcuts.switchTab(i)
                });
            });
        }

        // Quick actions
        commands.push(
            { type: 'action', name: 'Focus Search', icon: '🔍', action: () => KeyboardShortcuts.focusSearch() },
            { type: 'action', name: 'Open Settings', icon: '⚙️', action: () => this.openSettings() },
            { type: 'action', name: 'Toggle Rain', icon: '🌧️', action: () => this.toggleAmbient('rain') },
            { type: 'action', name: 'Toggle Sakura', icon: '🌸', action: () => this.toggleAmbient('sparkle') },
        );

        // Link commands
        if (typeof CONFIG !== 'undefined' && CONFIG.tabs) {
            CONFIG.tabs.forEach(tab => {
                tab.categories?.forEach(cat => {
                    cat.links?.forEach(link => {
                        commands.push({
                            type: 'link',
                            name: link.name,
                            icon: '🔗',
                            url: link.url,
                            action: () => window.open(link.url, '_blank')
                        });
                    });
                });
            });
        }

        return commands;
    }

    style() {
        const activeTabIndex = parseInt(localStorage.lastVisitedTab || '0');
        const activeTab = (typeof CONFIG !== 'undefined' && CONFIG.tabs && CONFIG.tabs[activeTabIndex])
            ? CONFIG.tabs[activeTabIndex] : {};
        const accent = activeTab.accent || '#a9b665';
        const container = activeTab.containerColor || '#2a2b26';

        return `
            :host {
                --theme-accent: ${accent};
                --theme-container: ${container};
            }

            .overlay {
                position: fixed;
                top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(15, 12, 10, 0.7);
                backdrop-filter: blur(5px);
                z-index: 10000;
                display: none;
                align-items: flex-start;
                justify-content: center;
                padding-top: 15vh;
            }

            .overlay.open { display: flex; }

            .palette {
                width: 500px;
                max-width: 90%;
                background: var(--theme-container);
                border: 1px solid rgba(169, 182, 101, 0.15);
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                overflow: hidden;
            }

            .search-input {
                width: 100%;
                padding: 16px 20px;
                background: transparent;
                border: none;
                border-bottom: 1px solid rgba(255,255,255,0.05);
                color: #e8e0d5;
                font: 400 16px 'Roboto', sans-serif;
                outline: none;
            }

            .search-input::placeholder {
                color: rgba(232, 224, 213, 0.4);
            }

            .results {
                max-height: 300px;
                overflow-y: auto;
            }

            .result-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 20px;
                cursor: pointer;
                transition: background 0.15s ease;
                color: rgba(232, 224, 213, 0.8);
                font: 400 14px 'Roboto', sans-serif;
            }

            .result-item:hover,
            .result-item.selected {
                background: rgba(169, 182, 101, 0.1);
                color: var(--theme-accent);
            }

            .result-icon {
                font-size: 16px;
            }

            .result-type {
                margin-left: auto;
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: rgba(232, 224, 213, 0.3);
            }

            .no-results {
                padding: 20px;
                text-align: center;
                color: rgba(232, 224, 213, 0.4);
                font-size: 13px;
            }

            .hint {
                padding: 10px 20px;
                border-top: 1px solid rgba(255,255,255,0.05);
                font-size: 11px;
                color: rgba(232, 224, 213, 0.3);
                display: flex;
                gap: 15px;
            }

            .hint kbd {
                background: rgba(255,255,255,0.05);
                padding: 2px 6px;
                border-radius: 3px;
            }
        `;
    }

    template() {
        return `
            <div class="overlay">
                <div class="palette">
                    <input type="text" class="search-input" id="palette-search" name="palette-search" placeholder="Type a command or search..." autofocus>
                    <div class="results"></div>
                    <div class="hint">
                        <span><kbd>↑↓</kbd> Navigate</span>
                        <span><kbd>Enter</kbd> Select</span>
                        <span><kbd>Esc</kbd> Close</span>
                    </div>
                </div>
            </div>
        `;
    }

    open() {
        this.isOpen = true;
        this.selectedIndex = 0;
        const overlay = this.shadow.querySelector('.overlay');
        overlay.classList.add('open');

        const input = this.shadow.querySelector('.search-input');
        input.value = '';
        input.focus();

        this.filterCommands('');
    }

    close() {
        this.isOpen = false;
        this.shadow.querySelector('.overlay').classList.remove('open');
    }

    filterCommands(query) {
        const commands = this.getAllCommands();
        const q = query.toLowerCase().trim();

        this.filteredCommands = q
            ? commands.filter(c => c.name.toLowerCase().includes(q))
            : commands.slice(0, 10); // Show first 10 by default

        this.renderResults();
    }

    renderResults() {
        const resultsEl = this.shadow.querySelector('.results');

        if (this.filteredCommands.length === 0) {
            resultsEl.innerHTML = '<div class="no-results">No results found</div>';
            return;
        }

        resultsEl.innerHTML = this.filteredCommands.map((cmd, i) => `
            <div class="result-item ${i === this.selectedIndex ? 'selected' : ''}" data-index="${i}">
                <span class="result-icon">${cmd.icon}</span>
                <span class="result-name">${cmd.name}</span>
                <span class="result-type">${cmd.type}</span>
            </div>
        `).join('');
    }

    executeSelected() {
        const cmd = this.filteredCommands[this.selectedIndex];
        if (cmd) {
            this.close();
            cmd.action();
        }
    }

    openSettings() {
        const tabsList = document.querySelector('tabs-list');
        if (tabsList && tabsList.shadowRoot) {
            const settings = tabsList.shadowRoot.querySelector('settings-panel');
            if (settings) settings.open?.();
        }
    }

    toggleAmbient(type) {
        const tabsList = document.querySelector('tabs-list');
        if (tabsList && tabsList.shadowRoot) {
            const ambient = tabsList.shadowRoot.querySelector('ambient-player');
            if (ambient) ambient.playSound?.(type);
        }
    }

    setEvents() {
        const overlay = this.shadow.querySelector('.overlay');
        const input = this.shadow.querySelector('.search-input');
        const results = this.shadow.querySelector('.results');

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.close();
        });

        // Search input
        input.addEventListener('input', (e) => {
            this.selectedIndex = 0;
            this.filterCommands(e.target.value);
        });

        // Keyboard navigation
        input.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, this.filteredCommands.length - 1);
                this.renderResults();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
                this.renderResults();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                this.executeSelected();
            } else if (e.key === 'Escape') {
                this.close();
            }
        });

        // Click on result
        results.addEventListener('click', (e) => {
            const item = e.target.closest('.result-item');
            if (item) {
                this.selectedIndex = parseInt(item.dataset.index);
                this.executeSelected();
            }
        });

        // Listen for open event from keyboard shortcuts
        document.addEventListener('openCommandPalette', () => this.open());
    }

    connectedCallback() {
        this.render().then(() => this.setEvents());
    }
}

customElements.define('command-palette', CommandPalette);
