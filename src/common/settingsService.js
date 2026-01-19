/**
 * SettingsService - Centralized settings management with localStorage persistence
 */
class SettingsService {
    static VERSION = '1.0.0';
    static STORAGE_KEY = 'userSettings';
    static VERSION_KEY = 'settingsVersion';

    constructor() {
        this.settings = this.load();
        this.checkVersion();
    }

    /**
     * Get default settings structure
     */
    getDefaults() {
        return {
            userName: 'User',
            weatherCity: 'Tokyo,JP',
            widgets: {
                quote: true,
                weather: true,
                crypto: true,
                ambient: true
            }
        };
    }

    /**
     * Load settings from localStorage
     */
    load() {
        try {
            const stored = localStorage.getItem(SettingsService.STORAGE_KEY);
            if (!stored) return this.getDefaults();

            const parsed = JSON.parse(stored);
            // Merge with defaults to ensure new settings exist
            return { ...this.getDefaults(), ...parsed };
        } catch (error) {
            console.warn('Failed to load settings, using defaults:', error);
            return this.getDefaults();
        }
    }

    /**
     * Save settings to localStorage
     */
    save() {
        try {
            localStorage.setItem(SettingsService.STORAGE_KEY, JSON.stringify(this.settings));
            localStorage.setItem(SettingsService.VERSION_KEY, SettingsService.VERSION);
            eventBus.emit('settingsChanged', this.settings);
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    }

    /**
     * Check version and migrate if needed
     */
    checkVersion() {
        const storedVersion = localStorage.getItem(SettingsService.VERSION_KEY);
        if (storedVersion !== SettingsService.VERSION) {
            // Migrate settings silently
            // Clear old dashboard/rss/github settings if they exist
            if (this.settings.widgets?.dashboard !== undefined) {
                delete this.settings.widgets.dashboard;
            }
            if (this.settings.rssEnabled !== undefined) {
                delete this.settings.rssEnabled;
            }
            if (this.settings.githubUsername !== undefined) {
                delete this.settings.githubUsername;
            }
            this.save();
        }
    }

    /**
     * Get a setting value
     */
    get(path) {
        const keys = path.split('.');
        let value = this.settings;
        for (const key of keys) {
            value = value?.[key];
            if (value === undefined) return undefined;
        }
        return value;
    }

    /**
     * Set a setting value
     */
    set(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        let target = this.settings;

        for (const key of keys) {
            if (!target[key]) target[key] = {};
            target = target[key];
        }

        target[lastKey] = value;
        this.save();
    }

    /**
     * Reset to defaults
     */
    reset() {
        this.settings = this.getDefaults();
        this.save();
    }
}

// Global singleton instance
const settingsService = new SettingsService();
