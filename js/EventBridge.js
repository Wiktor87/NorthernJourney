/**
 * EventBridge - Communication layer between Phaser and UI
 * 
 * This singleton manages bidirectional event passing between the Phaser
 * game engine and UI components. It allows:
 * - Phaser to emit events that UI listens to
 * - UI to emit events that Phaser scenes listen to
 * 
 * Usage:
 * In Phaser: eventBridge.emit('resources:updated', { food: 10, wood: 5 })
 * In UI: eventBridge.on('resources:updated', (data) => updateUI(data))
 */

class EventBridge {
  constructor() {
    this.listeners = {};
  }
  
  /**
   * Emit an event with optional data
   * @param {string} event - Event name
   * @param {*} data - Data to pass to listeners
   */
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
  
  /**
   * Subscribe to an event
   * @param {string} event - Event name to listen for
   * @param {Function} callback - Function to call when event is emitted
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    
    // Return unsubscribe function
    return () => this.off(event, callback);
  }
  
  /**
   * Unsubscribe from an event
   * @param {string} event - Event name
   * @param {Function} callback - Callback to remove
   */
  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }
  
  /**
   * Remove all listeners for an event
   * @param {string} event - Event name
   */
  removeAllListeners(event) {
    if (event) {
      delete this.listeners[event];
    } else {
      this.listeners = {};
    }
  }
}

// Create singleton instance
const eventBridge = new EventBridge();
