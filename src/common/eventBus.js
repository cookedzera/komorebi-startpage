/**
 * EventBus - Simple pub/sub pattern for component communication
 */
class EventBus {
    constructor() {
        this.listeners = new Map();
    }

    /**
     * Subscribe to an event
     * @param {string} event - Event name
     * @param {Function} callback - Handler function
     * @returns {Function} Unsubscribe function
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);

        // Return unsubscribe function
        return () => this.off(event, callback);
    }

    /**
     * Unsubscribe from an event
     */
    off(event, callback) {
        const callbacks = this.listeners.get(event);
        if (!callbacks) return;

        const index = callbacks.indexOf(callback);
        if (index > -1) {
            callbacks.splice(index, 1);
        }
    }

    /**
     * Emit an event
     * @param {string} event - Event name
     * @param {*} data - Event payload
     */
    emit(event, data) {
        const callbacks = this.listeners.get(event);
        if (!callbacks) return;

        callbacks.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error in event listener for "${event}":`, error);
            }
        });
    }

    /**
     * Clear all listeners for an event
     */
    clear(event) {
        this.listeners.delete(event);
    }

    /**
     * Remove all listeners
     */
    clearAll() {
        this.listeners.clear();
    }
}

// Global singleton instance
const eventBus = new EventBus();
