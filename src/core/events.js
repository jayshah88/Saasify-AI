/**
 * Saasify-AI Event Bus
 * 
 * A simple wrapper around standard CustomEvents for decoupled component communication.
 */

export const EventBus = {
    /**
     * Dispatch a global event.
     * @param {string} eventName - Name of the event (prefixed with saasify:)
     * @param {object} detail - Data payload
     */
    emit(eventName, detail = {}) {
        const event = new CustomEvent(eventName, { 
            detail,
            bubbles: true,
            composed: true
        });
        window.dispatchEvent(event);
        
        // Log only in dev mode (resilient to non-Vite environments)
        const isDev = typeof import.meta.env !== 'undefined' ? import.meta.env.DEV : true;
        if (isDev) {
            console.debug(`[EventBus] Emitted: ${eventName}`, detail);
        }
    },

    /**
     * Subscribe to a global event.
     * @param {string} eventName - Name of the event
     * @param {function} callback - Function to execute
     */
    on(eventName, callback) {
        window.addEventListener(eventName, callback);
    },

    /**
     * Unsubscribe from a global event.
     * @param {string} eventName 
     * @param {function} callback 
     */
    off(eventName, callback) {
        window.removeEventListener(eventName, callback);
    }
};
