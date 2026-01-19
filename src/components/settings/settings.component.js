class SettingsPanel extends Component {
    isOpen = false;
    userSettings = null;
    activeSection = 'general';
    activeLinkTab = 0;

    defaultAccents = ['#a9b665', '#d4be98', '#e78a4e', '#7daea3'];
    defaultContainers = ['#2a2b26', '#2a2b26', '#2a2b26', '#2a2b26'];

    constructor() {
        super();
        this.backgrounds = [
            'bg-1.gif', 'bg-2.gif', 'bg-3.gif',
            'cbg-1.gif', 'cbg-2.gif', 'cbg-3.gif', 'cbg-4.gif', 'cbg-5.gif',
            'cbg-6.gif', 'cbg-7.gif', 'cbg-8.gif', 'cbg-9.gif', 'cbg-10.gif',
            'cbg-11.gif', 'cbg-12.gif', 'cbg-13.gif'
        ];
        this.loadSettings();
    }

    loadSettings() {
        const saved = localStorage.getItem('userSettings');
        const defaults = {
            widgets: {
                quote: true,
                crypto: true,
                weather: true,
                ambient: true,
                search: true,
            },

            userName: CONFIG.userName || 'User',
            weatherCity: CONFIG.temperature?.location || 'India',
        };

        if (saved) {
            const parsed = JSON.parse(saved);
            this.userSettings = {
                ...defaults,
                ...parsed,
                widgets: { ...defaults.widgets, ...(parsed.widgets || {}) }
            };
        } else {
            this.userSettings = defaults;
        }

        if (!this.userSettings.weatherCity) {
            this.userSettings.weatherCity = CONFIG.temperature?.location || 'India';
        }
    }

    saveSettings() {
        localStorage.setItem('userSettings', JSON.stringify(this.userSettings));
    }

    imports() {
        return [
            this.resources.fonts.roboto,
            this.resources.icons.material,
            this.resources.icons.tabler
        ];
    }

    style() {
        // Get active tab's colors (defaults to olive)
        const activeTabIndex = parseInt(localStorage.lastVisitedTab || '0');
        const activeTab = CONFIG.tabs[activeTabIndex] || {};
        const accent = activeTab.accent || '#a9b665';
        const container = activeTab.containerColor || '#2a2b26';

        return `
            :host {
                position: fixed;
                top: 0; left: 0; width: 100vw; height: 100vh;
                z-index: 9999;
                pointer-events: none;
                --theme-accent: ${accent};
                --theme-container: ${container};
            }

            .overlay {
                position: absolute;
                top: 0; left: 0; width: 100%; height: 100%;
                background: var(--color-bg-primary, rgba(15, 12, 10, 0.85));
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s ease, visibility 0.3s ease;
                pointer-events: none;
                will-change: opacity;
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(8px);
            }

            .overlay.open {
                opacity: 1;
                visibility: visible;
                pointer-events: auto;
            }

            .panel {
                width: 800px;
                max-width: 90%;
                height: 600px;
                max-height: 90vh;
                background: var(--color-bg-secondary, #2a2b26);
                border: 1px solid var(--glass-border, rgba(169, 182, 101, 0.15));
                border-radius: 12px;
                box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                transform: scale(0.95);
                transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            }

            .overlay.open .panel {
                transform: scale(1);
            }

            /* Header */
            .panel-header {
                padding: 15px 20px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(255, 255, 255, 0.02);
            }

            .panel-title {
                font: 500 16px 'Roboto', sans-serif;
                color: #e8e0d5;
                letter-spacing: 0.5px;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .panel-logo {
                width: 24px;
                height: 24px;
                border-radius: 6px;
            }

            .close-btn {
                background: none;
                border: none;
                color: rgba(232, 224, 213, 0.5);
                cursor: pointer;
                padding: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: all 0.2s;
            }

            .close-btn:hover {
                background: rgba(255, 255, 255, 0.1);
                color: #e8e0d5;
            }

            /* Main Layout */
            .panel-body {
                display: flex;
                flex: 1;
                overflow: hidden;
            }

            /* Sidebar */
            .sidebar {
                width: 160px;
                background: rgba(0, 0, 0, 0.2);
                border-right: 1px solid rgba(255, 255, 255, 0.05);
                padding: 20px 0;
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .sidebar-btn {
                background: transparent;
                border: none;
                color: rgba(232, 224, 213, 0.6);
                padding: 12px 20px;
                text-align: left;
                font: 500 13px 'Roboto', sans-serif;
                cursor: pointer;
                transition: all 0.2s;
                position: relative;
            }

            .sidebar-btn:hover {
                color: #e8e0d5;
                background: rgba(255, 255, 255, 0.03);
            }

            .sidebar-btn.active {
                color: var(--theme-accent, #a9b665);
                background: rgba(169, 182, 101, 0.1);
            }

            .sidebar-btn.active::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 3px;
                background: var(--theme-accent, #a9b665);
            }

            /* Content Area */
            .content-area {
                flex: 1;
                padding: 0;
                overflow-y: auto;
                position: relative;
            }

            .view-section {
                padding: 30px;
                display: none;
                animation: fadeIn 0.3s ease;
            }

            .view-section.active {
                display: block;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(5px); }
                to { opacity: 1; transform: translateY(0); }
            }

            /* Widget & Generic Styles */
            .section-title {
                font: 500 11px 'Roboto', sans-serif;
                color: rgba(232, 224, 213, 0.4);
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 12px;
            }

            .input-group {
                margin-bottom: 24px;
            }

            input[type="text"] {
                width: 100%;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 8px;
                padding: 10px 14px;
                font: 400 13px 'Roboto', sans-serif;
                color: #e8e0d5;
                outline: none;
                transition: all 0.2s ease;
            }

            input[type="text"]:focus {
                background: rgba(255, 255, 255, 0.06);
                border-color: rgba(169, 182, 101, 0.5);
            }

            .toggle-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px;
                background: rgba(255, 255, 255, 0.02);
                border-radius: 8px;
                margin-bottom: 8px;
            }

            .toggle-label {
                font: 500 13px 'Roboto', sans-serif;
                color: rgba(232, 224, 213, 0.9);
            }

            .toggle {
                position: relative;
                width: 40px;
                height: 22px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .toggle.on {
                background: var(--theme-accent, #a9b665);
                box-shadow: 0 0 10px rgba(169, 182, 101, 0.4);
            }

            .toggle::after {
                content: '';
                position: absolute;
                width: 16px;
                height: 16px;
                background: #fff;
                border-radius: 50%;
                top: 3px;
                left: 3px;
                transition: transform 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
            }

            .toggle.on::after {
                transform: translateX(18px);
            }

            /* Color Palette Swatches */
            .palette-swatch {
                width: 32px;
                height: 32px;
                border-radius: 8px;
                cursor: pointer;
                border: 2px solid transparent;
                transition: all 0.2s ease;
            }
            .palette-swatch:hover {
                transform: scale(1.15);
                border-color: rgba(255, 255, 255, 0.3);
            }
            .palette-swatch.selected {
                border-color: #fff;
                box-shadow: 0 0 12px rgba(255, 255, 255, 0.3);
            }
            
            .accent-circle:hover {
                transform: scale(1.1);
            }

            /* Appearance / Tab Settings Styles */
            .tab-edit-row {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 10px;
                background: rgba(255, 255, 255, 0.02);
                padding: 10px;
                border-radius: 8px;
            }

            .tab-color-input {
                width: 36px;
                height: 36px;
                padding: 0;
                border: 2px solid rgba(255,255,255,0.1);
                border-radius: 6px;
                cursor: pointer;
                background: transparent;
            }
            .tab-color-input::-webkit-color-swatch-wrapper { padding: 3px; }
            .tab-color-input::-webkit-color-swatch { border-radius: 4px; border: none; }

            /* Links Manager Styles */
            .tab-selector {
                display: flex;
                gap: 6px;
                margin-bottom: 20px;
                overflow-x: auto;
                padding-bottom: 5px;
            }

            .tab-btn {
                background: rgba(255, 255, 255, 0.05);
                border: none;
                border-radius: 6px;
                color: rgba(232, 224, 213, 0.5);
                padding: 8px 16px;
                cursor: pointer;
                font: 500 11px 'Roboto', sans-serif;
                text-transform: uppercase;
                transition: all 0.15s ease;
                white-space: nowrap;
            }

            .tab-btn.active {
                background: rgba(244, 162, 97, 0.15);
                color: #f4a261;
            }

            .links-list {
                display: flex;
                flex-direction: column;
                gap: 6px;
                margin-bottom: 24px;
            }

            .link-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 10px 14px;
                background: rgba(255, 255, 255, 0.03);
                border-radius: 8px;
                transition: background 0.2s;
            }
            .link-item:hover { background: rgba(255, 255, 255, 0.05); }

            .link-name {
                flex: 1;
                font: 400 13px 'Roboto', sans-serif;
                color: #e8e0d5;
            }

            .link-actions {
                display: flex;
                gap: 8px;
                align-items: center;
            }

            .icon-btn {
                background: none;
                border: none;
                color: rgba(232, 224, 213, 0.6); /* Increased visibility */
                cursor: pointer;
                padding: 6px;
                border-radius: 4px;
                transition: all 0.2s;
            }
            .icon-btn:hover { 
                color: #f4a261; 
                background: rgba(255, 255, 255, 0.05);
            }
            .icon-btn.delete:hover { 
                color: #e76f51; 
                background: rgba(231, 111, 81, 0.1);
            }

            .add-link-form {
                background: rgba(255, 255, 255, 0.03);
                padding: 20px;
                border-radius: 12px;
                border: 1px dashed rgba(255, 255, 255, 0.1);
            }
            
            .add-link-row {
                display: flex;
                gap: 10px;
                margin-bottom: 12px;
            }

            .add-link-btn {
                width: 100%;
                padding: 10px;
                background: #2a9d8f;
                border: none;
                border-radius: 6px;
                color: #fff;
                font: 500 13px 'Roboto';
                cursor: pointer;
                transition: background 0.2s;
            }
            .add-link-btn:hover { background: #248a7d; }

            /* Themed Dropdown */
            select {
                appearance: none;
                -webkit-appearance: none;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23a9b665' d='M6 8L2 4h8z'/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 10px center;
                padding-right: 30px !important;
            }
            select option {
                background: #2a2b26;
                color: #e8e0d5;
                padding: 8px;
            }
            select:focus {
                outline: none;
                border-color: rgba(169,182,101,0.4);
            }

            /* Premium Scrollbar Global */
            ::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }
            ::-webkit-scrollbar-track { 
                background: transparent; 
                margin: 4px 0;
            }
            ::-webkit-scrollbar-thumb { 
                background: rgba(255, 255, 255, 0.1); 
                border-radius: 4px; 
                border: 2px solid transparent;
                background-clip: content-box;
                transition: background 0.2s ease;
            }
            ::-webkit-scrollbar-thumb:hover { 
                background: var(--theme-accent, #a9b665); 
                border: 0;
                border-radius: 4px;
            }
            ::-webkit-scrollbar-corner { background: transparent; }

            .content-area::-webkit-scrollbar { width: 8px; }
            .content-area::-webkit-scrollbar-thumb { 
                border: 2px solid rgba(0,0,0,0);
                background-clip: padding-box;
                background-color: rgba(255,255,255,0.15);
            }
            .content-area::-webkit-scrollbar-thumb:hover {
                background-color: var(--theme-accent, #a9b665);
            }
        `;
    }

    template() {
        const tabs = CONFIG.tabs || [];

        return `
            <div class="overlay" id="settings-overlay">
                <div class="panel">
                    <div class="panel-header">
                        <span class="panel-title">
                            <img src="src/img/logo48.png" class="panel-logo" alt="K">
                            Komorebi
                        </span>
                        <button class="close-btn" id="close-btn">
                            <i class="material-icons">close</i>
                        </button>
                    </div>
                    <div class="panel-body">
                        <div class="sidebar">
                            <button class="sidebar-btn active" data-section="general">General</button>
                            <button class="sidebar-btn" data-section="appearance">Appearance</button>
                            <button class="sidebar-btn" data-section="links">Links</button>
                            <button class="sidebar-btn" data-section="search">Search</button>
                        </div>

                        <div class="content-area">
                            
                            <div class="view-section active" id="view-general">
                                <div class="section-title">User Profile</div>
                                <div class="input-group">
                                    <input type="text" id="user-name" name="user-name" value="${this.userSettings.userName}" placeholder="Greeting Name">
                                </div>

                                <div class="section-title">Weather</div>
                                <div class="input-group">
                                    <input type="text" id="weather-city" name="weather-city" value="${this.userSettings.weatherCity}" placeholder="City Location">
                                </div>

                                <div class="section-title">Widgets & Features</div>
                                <div class="toggle-row">
                                    <span class="toggle-label">Daily Quote</span>
                                    <div class="toggle ${this.userSettings.widgets.quote ? 'on' : ''}" data-widget="quote"></div>
                                </div>
                                <div class="toggle-row">
                                    <span class="toggle-label">Weather Widget</span>
                                    <div class="toggle ${this.userSettings.widgets.weather ? 'on' : ''}" data-widget="weather"></div>
                                </div>
                                <div class="toggle-row">
                                    <span class="toggle-label">Crypto Prices</span>
                                    <div class="toggle ${this.userSettings.widgets.crypto ? 'on' : ''}" data-widget="crypto"></div>
                                </div>
                                <div class="toggle-row">
                                    <span class="toggle-label">Ambient Player</span>
                                    <div class="toggle ${this.userSettings.widgets.ambient ? 'on' : ''}" data-widget="ambient"></div>
                                </div>
                            </div>

                            <div class="view-section" id="view-appearance">


                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px">
                                    <div class="section-title" style="margin:0">Tab Customization</div>
                                    <button id="reset-theme-btn" style="background:none; border:1px solid rgba(169, 182, 101, 0.3); color:#a9b665; border-radius:4px; padding:4px 8px; font-size:10px; cursor:pointer;">
                                        RESET DEFAULT COLORS
                                    </button>
                                </div>
                                
                                <div class="section-title" style="margin-top:20px">Color Palette</div>
                                <div style="color:rgba(255,255,255,0.4); font-size:11px; margin-bottom:10px; font-family:'Roboto'">
                                    Click a color to copy it, then use below to set tab accents.
                                </div>
                                <div class="color-palette" style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:24px;">
                                    <div class="palette-swatch" data-color="#a9b665" style="background:#a9b665" title="Olive Green"></div>
                                    <div class="palette-swatch" data-color="#7daea3" style="background:#7daea3" title="Sage Teal"></div>
                                    <div class="palette-swatch" data-color="#d4be98" style="background:#d4be98" title="Warm Beige"></div>
                                    <div class="palette-swatch" data-color="#d8a657" style="background:#d8a657" title="Warm Gold"></div>
                                    <div class="palette-swatch" data-color="#e78a4e" style="background:#e78a4e" title="Soft Terracotta"></div>
                                    <div class="palette-swatch" data-color="#ea6962" style="background:#ea6962" title="Muted Coral"></div>
                                    <div class="palette-swatch" data-color="#d3869b" style="background:#d3869b" title="Dusty Rose"></div>
                                    <div class="palette-swatch" data-color="#b4a4c9" style="background:#b4a4c9" title="Soft Lavender"></div>
                                    <div class="palette-swatch" data-color="#c5b4a1" style="background:#c5b4a1" title="Warm Taupe"></div>
                                </div>
                                
                                <div class="section-title">Tab Accents</div>
                                <div style="color:rgba(255,255,255,0.4); font-size:11px; margin-bottom:10px; font-family:'Roboto'">
                                    Click a palette color above, then click a tab's accent circle to apply.
                                </div>
                                <div class="tab-edit-list" id="tab-edit-list">
                                    ${tabs.map((tab, i) => `
                                        <div class="tab-edit-row" style="display:flex; align-items:center; gap:10px; padding:10px 12px; background:rgba(255,255,255,0.02); border-radius:8px; margin-bottom:6px;">
                                            <div class="accent-circle" data-tab="${i}" style="width:28px; height:28px; min-width:28px; border-radius:50%; background:${tab.accent || this.defaultAccents[i]}; cursor:pointer; border:2px solid rgba(255,255,255,0.1); transition:transform 0.2s;" title="Click to apply selected color"></div>
                                            <input type="text" class="tab-name-input" name="tab-name-${i}" data-tab="${i}" value="${tab.name}" placeholder="Tab Name" style="flex:1; min-width:0">
                                            <div class="gif-preview-btn" data-tab="${i}" style="width:48px; height:28px; border-radius:4px; background-image:url('${tab.background_url || 'src/img/banners/bg-1.gif'}'); background-size:cover; background-position:center; cursor:pointer; border:2px solid rgba(255,255,255,0.1); transition:all 0.2s; position:relative; overflow:hidden;" title="Change background">
                                                <div style="position:absolute; inset:0; background:rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity 0.2s;" class="gif-hover-overlay">
                                                    <i class="material-icons" style="font-size:14px; color:#fff">edit</i>
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                                
                                <div id="gif-modal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:9999; backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px);">
                                    <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); background:linear-gradient(145deg, rgba(42,43,38,0.98), rgba(35,36,32,0.98)); border-radius:12px; padding:20px; width:90%; max-width:480px; border:1px solid rgba(169,182,101,0.2); box-shadow:0 25px 50px rgba(0,0,0,0.5);">
                                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                                            <div style="font-size:13px; color:#a9b665; text-transform:uppercase; letter-spacing:2px; font-weight:600;">Select Background</div>
                                            <button id="gif-modal-close" style="background:none; border:none; color:rgba(255,255,255,0.5); cursor:pointer; font-size:20px; line-height:1;">&times;</button>
                                        </div>
                                        <div id="gif-grid" style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px; max-height:280px; overflow-y:auto; padding-right:4px;">
                                        </div>
                                    </div>
                                </div>
                                
                                <div id="selected-color-display" style="margin-top:16px; padding:10px; background:rgba(255,255,255,0.03); border-radius:6px; display:none;">
                                    <span style="font-size:11px; color:rgba(255,255,255,0.5)">Selected: </span>
                                    <span id="selected-color-value" style="font-size:12px; color:#a9b665; font-weight:500"></span>
                                </div>
                                
                                <div class="section-title" style="margin-top:24px">Taskbar</div>
                                <div style="color:rgba(255,255,255,0.4); font-size:11px; margin-bottom:10px; font-family:'Roboto'">
                                    Click a palette color above, then click the circle to change taskbar color.
                                </div>
                                <div class="tab-edit-row" style="display:flex; align-items:center; gap:12px; padding:12px; background:rgba(255,255,255,0.02); border-radius:8px;">
                                    <div id="taskbar-color-circle" style="width:32px; height:32px; border-radius:50%; background:${this.userSettings.taskbarColor || '#2a2b26'}; cursor:pointer; border:2px solid rgba(255,255,255,0.1); transition:transform 0.2s;" title="Click to apply selected color"></div>
                                    <div style="flex:1">
                                        <span style="font-size:13px; color:rgba(255,255,255,0.8)">Status Bar Background</span>
                                    </div>
                                </div>
                            </div>

                            <div class="view-section" id="view-links">
                                <div class="section-title">Manage Links</div>
                                
                                <div class="tab-selector" id="tab-selector">
                                    ${tabs.map((tab, i) => `
                                        <button class="tab-btn ${i === this.activeLinkTab ? 'active' : ''}" data-tab="${i}">${tab.name}</button>
                                    `).join('')}
                                </div>

                                <div id="links-container">
                                </div>

                                <div class="add-link-form">
                                    <div class="section-title" style="margin-bottom:10px">Add New Link</div>
                                    <div class="add-link-row">
                                        <input type="text" id="new-link-name" name="new-link-name" placeholder="Name">
                                        <input type="text" id="new-link-url" name="new-link-url" placeholder="URL">
                                    </div>
                                    <div class="add-link-row" style="margin-top:0">
                                        <div style="flex:1; display:flex; align-items:center; gap:10px;">
                                            <input type="text" id="new-link-icon" name="new-link-icon" placeholder="Icon (e.g. brand-github)" style="flex:1">
                                            <div id="icon-preview" style="width:32px; height:32px; min-width:32px; border-radius:8px; background:rgba(255,255,255,0.05); display:flex; align-items:center; justify-content:center; border:1px solid rgba(255,255,255,0.1); transition:all 0.2s;">
                                                <i class="ti ti-star" id="icon-preview-i" style="font-size:16px; color:rgba(232,224,213,0.5); transition:color 0.2s;"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="margin-top:6px; margin-bottom:12px;">
                                        <a href="https://tabler.io/icons" target="_blank" style="font-size:10px; color:rgba(169,182,101,0.7); text-decoration:none; display:inline-flex; align-items:center; gap:4px; transition:color 0.2s;" onmouseover="this.style.color='#a9b665'" onmouseout="this.style.color='rgba(169,182,101,0.7)'">↳ Browse 5000+ icons at tabler.io/icons <i class="material-icons" style="font-size:12px">open_in_new</i></a>
                                    </div>
                                    <div class="add-link-row" style="margin-top:0">
                                        <select id="new-link-category" name="new-link-category" style="flex:1; padding:8px 10px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:6px; color:#e8e0d5; font-size:12px; cursor:pointer;">
                                        </select>
                                    </div>
                                    <button class="add-link-btn" id="add-link-btn">+ Add Link</button>
                                </div>
                            </div>

                            <div class="view-section" id="view-search">
                                <div class="section-title">Search Shortcuts</div>
                                <div style="color:rgba(255,255,255,0.4); font-size:11px; margin-bottom:15px; font-family:'Roboto'">
                                    Use shortcuts like <span style="color:#a9b665">!g query</span> in the search bar to search specific sites.
                                </div>
                                
                                <div id="search-engines-list" style="margin-bottom:20px;">
                                </div>

                                <div class="add-link-form">
                                    <div class="section-title" style="margin-bottom:10px">Add New Shortcut</div>
                                    <div class="add-link-row">
                                        <input type="text" id="new-shortcut-key" name="new-shortcut-key" placeholder="Shortcut (e.g. i)" style="flex:0.3; min-width:80px;" maxlength="5">
                                        <input type="text" id="new-shortcut-name" name="new-shortcut-name" placeholder="Name (e.g. Instagram)" style="flex:0.7">
                                    </div>
                                    <div class="add-link-row" style="margin-top:0">
                                        <input type="text" id="new-shortcut-url" name="new-shortcut-url" placeholder="Search URL (use {query} for search term)">
                                    </div>
                                    <div style="margin-top:4px; margin-bottom:12px;">
                                        <div style="font-size:10px; color:rgba(169,182,101,0.7);">
                                            💡 Examples:
                                        </div>
                                        <div style="font-size:10px; color:rgba(255,255,255,0.35); margin-top:4px; line-height:1.6;">
                                            • Direct link: <span style="color:rgba(169,182,101,0.6)">!i → instagram.com</span><br>
                                            • Search: <span style="color:rgba(169,182,101,0.6)">!gh → github.com/search?q={query}</span><br>
                                            • Quick nav: <span style="color:rgba(169,182,101,0.6)">!mail → gmail.com</span>
                                        </div>
                                    </div>
                                    <button class="add-link-btn" id="add-shortcut-btn">+ Add Shortcut</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    connectedCallback() {
        this.render().then(() => {
            this.setEvents();
            this.renderLinks(this.activeLinkTab);
            this.renderSearchShortcuts();
        });

        // Listen for open event
        document.addEventListener('openSettings', () => this.open());
    }

    setEvents() {
        const shadow = this.shadow;

        shadow.getElementById('close-btn').addEventListener('click', () => this.close());
        shadow.getElementById('settings-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'settings-overlay') this.close();
        });

        const sidebarBtns = shadow.querySelectorAll('.sidebar-btn');
        sidebarBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                sidebarBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const section = btn.dataset.section;
                const views = shadow.querySelectorAll('.view-section');
                views.forEach(v => v.classList.remove('active'));
                shadow.getElementById(`view-${section}`).classList.add('active');
            });
        });

        shadow.querySelectorAll('.toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
                if (toggle.dataset.widget) {
                    const widget = toggle.dataset.widget;
                    this.userSettings.widgets[widget] = !this.userSettings.widgets[widget];
                } else if (toggle.dataset.setting) {
                    const setting = toggle.dataset.setting;
                    this.userSettings[setting] = !this.userSettings[setting];
                }
                toggle.classList.toggle('on');
                this.saveSettings();
            });
        });

        shadow.getElementById('user-name').addEventListener('input', (e) => {
            this.userSettings.userName = e.target.value;
            this.saveSettings();
        });

        const githubInput = shadow.getElementById('github-user');
        if (githubInput) {
            githubInput.addEventListener('change', (e) => {
                this.userSettings.githubUsername = e.target.value;
                this.saveSettings();
            });
        }

        shadow.getElementById('weather-city').addEventListener('change', (e) => {
            this.userSettings.weatherCity = e.target.value;
            this.saveSettings();
        });

        shadow.querySelectorAll('.tab-name-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const index = parseInt(e.target.dataset.tab);
                CONFIG.tabs[index].name = e.target.value;
                localStorage.setItem('savedTabs', JSON.stringify(CONFIG.tabs));
            });
        });

        this.selectedColor = null;
        shadow.querySelectorAll('.palette-swatch').forEach(swatch => {
            swatch.addEventListener('click', () => {
                shadow.querySelectorAll('.palette-swatch').forEach(s => s.classList.remove('selected'));
                swatch.classList.add('selected');

                this.selectedColor = swatch.dataset.color;

                const display = shadow.getElementById('selected-color-display');
                const value = shadow.getElementById('selected-color-value');
                if (display && value) {
                    display.style.display = 'block';
                    value.textContent = this.selectedColor;
                    value.style.color = this.selectedColor;
                }
            });
        });

        shadow.querySelectorAll('.accent-circle').forEach(circle => {
            circle.addEventListener('click', () => {
                if (!this.selectedColor) {
                    alert('First select a color from the palette above!');
                    return;
                }

                const index = parseInt(circle.dataset.tab);

                // Set accent
                CONFIG.tabs[index].accent = this.selectedColor;
                circle.style.background = this.selectedColor;

                // Also set matching container color (derived darker version)
                const containerColor = this.getContainerForAccent(this.selectedColor);
                CONFIG.tabs[index].containerColor = containerColor;

                localStorage.setItem('savedTabs', JSON.stringify(CONFIG.tabs));
            });
        });

        shadow.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                shadow.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.activeLinkTab = parseInt(btn.dataset.tab);
                this.renderLinks(this.activeLinkTab);
            });
        });

        shadow.getElementById('add-link-btn').addEventListener('click', () => this.addLink());

        // Live icon preview
        const iconInput = shadow.getElementById('new-link-icon');
        const iconPreview = shadow.getElementById('icon-preview-i');
        if (iconInput && iconPreview) {
            iconInput.addEventListener('input', (e) => {
                const iconName = e.target.value.trim();
                if (iconName) {
                    iconPreview.className = `ti ti-${iconName}`;
                    iconPreview.style.color = '#a9b665';
                } else {
                    iconPreview.className = 'ti ti-star';
                    iconPreview.style.color = 'rgba(232,224,213,0.5)';
                }
            });
        }

        shadow.getElementById('reset-theme-btn')?.addEventListener('click', () => this.resetTheme());

        const taskbarCircle = shadow.getElementById('taskbar-color-circle');
        if (taskbarCircle) {
            taskbarCircle.addEventListener('click', () => {
                if (!this.selectedColor) {
                    alert('First select a color from the palette above!');
                    return;
                }

                const taskbarBg = this.getContainerForAccent(this.selectedColor);

                this.userSettings.taskbarColor = taskbarBg;
                this.userSettings.taskbarAccent = this.selectedColor;
                this.saveSettings();

                taskbarCircle.style.background = taskbarBg;

                localStorage.setItem('taskbarColor', taskbarBg);
            });
        }

        shadow.addEventListener('click', (e) => {
            const deleteBtn = e.target.closest('.delete-link-btn');
            if (deleteBtn) {
                e.stopPropagation();
                const tabIdx = parseInt(deleteBtn.dataset.tab);
                const catIdx = parseInt(deleteBtn.dataset.category);
                const linkIdx = parseInt(deleteBtn.dataset.link);
                this.deleteLink(tabIdx, catIdx, linkIdx);
                return;
            }
        });

        shadow.addEventListener('change', (e) => {
            if (e.target.classList.contains('category-name-input')) {
                const tabIdx = parseInt(e.target.dataset.tab);
                const catIdx = parseInt(e.target.dataset.category);
                CONFIG.tabs[tabIdx].categories[catIdx].name = e.target.value;
                localStorage.setItem('savedTabs', JSON.stringify(CONFIG.tabs));
                this.populateCategoryDropdown();
            }
        });

        const addShortcutBtn = shadow.getElementById('add-shortcut-btn');
        if (addShortcutBtn) {
            addShortcutBtn.addEventListener('click', () => this.addSearchShortcut());
        }

        shadow.addEventListener('click', (e) => {
            const deleteShortcutBtn = e.target.closest('.delete-shortcut-btn');
            if (deleteShortcutBtn) {
                const key = deleteShortcutBtn.dataset.key;
                this.deleteSearchShortcut(key);
            }
        });

        // GIF Selector Logic - Modal Based
        const gifModal = shadow.getElementById('gif-modal');
        const gifGrid = shadow.getElementById('gif-grid');

        // Hover effects for preview buttons
        shadow.querySelectorAll('.gif-preview-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.querySelector('.gif-hover-overlay').style.opacity = '1';
            });
            btn.addEventListener('mouseleave', () => {
                btn.querySelector('.gif-hover-overlay').style.opacity = '0';
            });
            btn.addEventListener('click', () => {
                const tabIdx = parseInt(btn.dataset.tab);
                gifModal.dataset.activeTab = tabIdx;

                // Lazy-load GIF grid only when modal opens
                if (gifGrid.children.length === 0) {
                    const getUrl = (path) => {
                        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
                            return chrome.runtime.getURL(path);
                        }
                        return path;
                    };

                    gifGrid.innerHTML = this.backgrounds.map(bg => {
                        const bgPath = `src/img/banners/${bg}`;
                        const bgUrl = getUrl(bgPath);
                        return `<div class="gif-option" data-bg="${bgPath}" style="aspect-ratio:16/9; background-image:url('${bgUrl}'); background-size:cover; background-position:center; border-radius:6px; cursor:pointer; border:2px solid transparent; opacity:0.7; transition:all 0.2s ease;" title="${bg}"></div>`;
                    }).join('');
                    this.attachGifOptionEvents(shadow, gifGrid, gifModal);
                }

                gifModal.style.display = 'block';

                // Highlight current selection
                const currentBg = CONFIG.tabs[tabIdx].background_url || '';
                gifGrid.querySelectorAll('.gif-option').forEach(opt => {
                    if (currentBg.includes(opt.dataset.bg.split('/').pop())) {
                        opt.style.borderColor = '#a9b665';
                        opt.style.opacity = '1';
                    } else {
                        opt.style.borderColor = 'transparent';
                        opt.style.opacity = '0.7';
                    }
                });
            });
        });

        // Close modal
        shadow.getElementById('gif-modal-close')?.addEventListener('click', () => {
            gifModal.style.display = 'none';
        });
        gifModal?.addEventListener('click', (e) => {
            if (e.target === gifModal) gifModal.style.display = 'none';
        });

    }

    attachGifOptionEvents(shadow, gifGrid, gifModal) {
        gifGrid.querySelectorAll('.gif-option').forEach(opt => {
            opt.addEventListener('mouseenter', () => {
                opt.style.opacity = '1';
                opt.style.transform = 'scale(1.05)';
            });
            opt.addEventListener('mouseleave', () => {
                const activeTab = parseInt(gifModal.dataset.activeTab || '0');
                const currentBg = CONFIG.tabs[activeTab]?.background_url || '';
                if (!currentBg.includes(opt.dataset.bg.split('/').pop())) {
                    opt.style.opacity = '0.7';
                }
                opt.style.transform = 'scale(1)';
            });
            opt.addEventListener('click', () => {
                const bgUrl = opt.dataset.bg;
                const activeTab = parseInt(gifModal.dataset.activeTab || '0');

                // Update config
                CONFIG.tabs[activeTab].background_url = bgUrl;
                localStorage.setItem('savedTabs', JSON.stringify(CONFIG.tabs));

                // Update preview button
                const previewBtn = shadow.querySelector(`.gif-preview-btn[data-tab="${activeTab}"]`);
                if (previewBtn) previewBtn.style.backgroundImage = `url('${bgUrl}')`;

                // Visual feedback in grid
                gifGrid.querySelectorAll('.gif-option').forEach(o => {
                    o.style.borderColor = 'transparent';
                    o.style.opacity = '0.7';
                });
                opt.style.borderColor = '#a9b665';
                opt.style.opacity = '1';

                // Close modal after short delay
                setTimeout(() => {
                    gifModal.style.display = 'none';
                }, 200);
            });
        });
    }

    getContainerForAccent(accent) {
        const colorMap = {
            '#a9b665': '#2a2b26',
            '#7daea3': '#252a2a',
            '#d4be98': '#2a2826',
            '#d8a657': '#2a2720',
            '#e78a4e': '#2a2420',
            '#ea6962': '#2a2324',
            '#d3869b': '#2a2428',
            '#b4a4c9': '#26242a',
            '#c5b4a1': '#282724',
        };
        return colorMap[accent] || '#2a2b26';
    }

    resetTheme() {
        if (!confirm('Reset all tab colors to the new Lofi Premium defaults?')) return;

        const tabs = CONFIG.tabs;
        tabs.forEach((tab, i) => {
            tab.accent = this.defaultAccents[i] || '#a9b665';
            tab.containerColor = this.defaultContainers[i] || '#2a2b26';
        });

        localStorage.setItem('savedTabs', JSON.stringify(tabs));
        location.reload();
    }

    renderLinks(tabIndex) {
        const container = this.shadow.getElementById('links-container');
        if (!container) return;

        const tabs = CONFIG.tabs || [];
        const tab = tabs[tabIndex];

        let html = '';
        tab.categories.forEach((cat, catIdx) => {
            html += `<div style="margin-bottom:15px">`;
            html += `
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                    <input 
                        type="text" 
                        class="category-name-input" 
                        name="category-name-${tabIndex}-${catIdx}"
                        data-tab="${tabIndex}" 
                        data-category="${catIdx}" 
                        value="${cat.name}" 
                        placeholder="Category Name"
                        style="flex:1; font-size:11px; text-transform:uppercase; letter-spacing:1px; font-weight:500; color:rgba(232,224,213,0.6); padding:6px 10px;"
                    >
                </div>
            `;
            html += `<div class="links-list">`;
            cat.links.forEach((link, linkIdx) => {
                const iconName = link.icon || 'star';
                const iconColor = link.icon_color || 'rgba(232,224,213,0.5)';
                html += `
                    <div class="link-item">
                        <div style="width:24px; height:24px; min-width:24px; border-radius:6px; background:rgba(255,255,255,0.05); display:flex; align-items:center; justify-content:center;">
                            <i class="ti ti-${iconName}" style="font-size:14px; color:${iconColor};"></i>
                        </div>
                        <span class="link-name">${link.name}</span>
                        <div class="link-actions">
                            <button class="icon-btn delete delete-link-btn" data-tab="${tabIndex}" data-category="${catIdx}" data-link="${linkIdx}">
                                <i class="ti ti-trash" style="font-size:16px"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
            html += `</div></div>`;
        });

        container.innerHTML = html;
        this.populateCategoryDropdown();
    }

    populateCategoryDropdown() {
        const dropdown = this.shadow.getElementById('new-link-category');
        if (!dropdown) return;

        const tab = CONFIG.tabs[this.activeLinkTab];
        if (!tab) return;

        dropdown.innerHTML = tab.categories.map((cat, idx) =>
            `<option value="${idx}">${cat.name}</option>`
        ).join('');
    }

    deleteLink(tabIdx, catIdx, linkIdx) {
        CONFIG.tabs[tabIdx].categories[catIdx].links.splice(linkIdx, 1);
        localStorage.setItem('savedTabs', JSON.stringify(CONFIG.tabs));
        this.renderLinks(tabIdx);
    }

    addLink() {
        const nameInput = this.shadow.getElementById('new-link-name');
        const urlInput = this.shadow.getElementById('new-link-url');
        const iconInput = this.shadow.getElementById('new-link-icon');
        const iconPreview = this.shadow.getElementById('icon-preview-i');
        const categoryDropdown = this.shadow.getElementById('new-link-category');

        const name = nameInput.value.trim();
        let url = urlInput.value.trim();
        const icon = iconInput?.value.trim() || 'star';
        const categoryIdx = parseInt(categoryDropdown?.value || '0');

        if (!name || !url) return alert('Please enter both name and URL');

        if (!url.startsWith('http')) url = 'https://' + url;

        CONFIG.tabs[this.activeLinkTab].categories[categoryIdx].links.push({
            name: name,
            url: url,
            icon: icon,
            icon_color: '#a9b665'
        });

        localStorage.setItem('savedTabs', JSON.stringify(CONFIG.tabs));

        nameInput.value = '';
        urlInput.value = '';
        if (iconInput) iconInput.value = '';
        if (iconPreview) {
            iconPreview.className = 'ti ti-star';
            iconPreview.style.color = 'rgba(232,224,213,0.5)';
        }

        this.renderLinks(this.activeLinkTab);
    }

    renderSearchShortcuts() {
        const container = this.shadow.getElementById('search-engines-list');
        if (!container) return;

        const engines = CONFIG.search?.engines || {};

        container.innerHTML = Object.entries(engines).map(([key, value]) => {
            const [url, name] = value;
            const isDirectLink = !url.includes('=');
            return `
                <div class="link-row" style="display:flex; align-items:center; gap:12px; padding:10px 12px; background:rgba(255,255,255,0.02); border-radius:6px; margin-bottom:6px;">
                    <div style="width:40px; height:28px; display:flex; align-items:center; justify-content:center; background:rgba(169,182,101,0.15); border-radius:4px;">
                        <span style="font-size:11px; font-weight:600; color:#a9b665;">!${key}</span>
                    </div>
                    <div style="flex:1; overflow:hidden;">
                        <div style="font-size:12px; color:#e8e0d5; font-weight:500;">${name}</div>
                        <div style="font-size:10px; color:rgba(255,255,255,0.3); text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${isDirectLink ? '→ ' + url : url.split('?')[0] + '...'}</div>
                    </div>
                    <button class="delete-shortcut-btn" data-key="${key}" style="background:none; border:none; color:rgba(231,111,81,0.6); cursor:pointer; padding:4px; display:flex; align-items:center; transition:color 0.2s;" title="Delete shortcut">
                        <i class="material-icons" style="font-size:16px;">delete</i>
                    </button>
                </div>
            `;
        }).join('');

        if (Object.keys(engines).length === 0) {
            container.innerHTML = `<div style="padding:20px; text-align:center; color:rgba(255,255,255,0.3); font-size:12px;">No shortcuts yet. Add one below!</div>`;
        }
    }

    addSearchShortcut() {
        const keyInput = this.shadow.getElementById('new-shortcut-key');
        const nameInput = this.shadow.getElementById('new-shortcut-name');
        const urlInput = this.shadow.getElementById('new-shortcut-url');

        const key = keyInput.value.trim().toLowerCase().replace(/^!/, '');
        const name = nameInput.value.trim();
        let url = urlInput.value.trim();

        if (!key || !name || !url) {
            Actions.showToast('Please fill all fields');
            return;
        }

        if (!url.startsWith('http')) {
            url = 'https://' + url;
        }

        if (!url.includes('{query}') && url.includes('?')) {
            url = url + '{query}';
        } else if (!url.includes('{query}')) {
            url = url + (url.endsWith('/') ? '' : '/');
        }

        const searchUrl = url.replace('{query}', '');

        if (!CONFIG.search) CONFIG.search = { engines: {} };
        if (!CONFIG.search.engines) CONFIG.search.engines = {};

        CONFIG.search.engines[key] = [searchUrl, name];

        localStorage.setItem('savedSearchEngines', JSON.stringify(CONFIG.search.engines));

        const deleted = JSON.parse(localStorage.getItem('deletedSearchEngines') || '[]');
        const idx = deleted.indexOf(key);
        if (idx > -1) {
            deleted.splice(idx, 1);
            localStorage.setItem('deletedSearchEngines', JSON.stringify(deleted));
        }

        keyInput.value = '';
        nameInput.value = '';
        urlInput.value = '';

        this.renderSearchShortcuts();
        this.refreshSearchComponent();
        Actions.showToast(`Shortcut !${key} added`);
    }

    deleteSearchShortcut(key) {
        if (!CONFIG.search?.engines?.[key]) return;

        delete CONFIG.search.engines[key];
        localStorage.setItem('savedSearchEngines', JSON.stringify(CONFIG.search.engines));

        const deleted = JSON.parse(localStorage.getItem('deletedSearchEngines') || '[]');
        if (!deleted.includes(key)) {
            deleted.push(key);
            localStorage.setItem('deletedSearchEngines', JSON.stringify(deleted));
        }

        this.renderSearchShortcuts();
        this.refreshSearchComponent();
        Actions.showToast(`Shortcut !${key} removed`);
    }

    refreshSearchComponent() {
        const tabsList = document.querySelector('tabs-list');
        if (!tabsList || !tabsList.shadowRoot) return;

        const searchBar = tabsList.shadowRoot.querySelector('search-bar');
        if (searchBar && searchBar.shadowRoot) {
            const enginesDiv = searchBar.shadowRoot.querySelector('.engines');
            if (enginesDiv) {
                const engines = CONFIG.search?.engines || {};
                enginesDiv.innerHTML = Object.keys(engines).map(key =>
                    `<span class="engine-tag">!${key} ${engines[key][1]}</span>`
                ).join('');
            }
        }
    }

    open() {
        this.isOpen = true;
        this.shadow.getElementById('settings-overlay').classList.add('open');
        document.body.style.overflow = 'hidden';
        document.dispatchEvent(new CustomEvent('settingsOpened'));
    }

    close() {
        this.isOpen = false;
        this.shadow.getElementById('settings-overlay').classList.remove('open');
        document.body.style.overflow = '';
        document.dispatchEvent(new CustomEvent('settingsClosed'));
    }
}

customElements.define('settings-panel', SettingsPanel);
