/**
 * ResourceManager - Manages game resources
 * 
 * Handles all resource tracking, production, and consumption.
 * Resources are loaded from data/resources.json
 */

import { eventBridge } from '../EventBridge.js';

export class ResourceManager {
  constructor(scene) {
    this.scene = scene;
    this.resources = {};
    this.resourceDefinitions = null;
  }

  /**
   * Initialize resources from data file
   */
  async init(resourcesData, configData) {
    this.resourceDefinitions = resourcesData.resources;
    this.config = configData;
    
    // Initialize starting resources
    this.resources = {};
    this.resourceDefinitions.forEach(resource => {
      this.resources[resource.id] = configData.starting_resources[resource.id] || 0;
    });
    
    // Add turn and era tracking
    this.resources.turn = 1;
    this.resources.era = 'village';
    
    this.emitUpdate();
  }

  /**
   * Get current resource amount
   */
  get(resourceId) {
    return this.resources[resourceId] || 0;
  }

  /**
   * Set resource amount
   */
  set(resourceId, amount) {
    const resource = this.resourceDefinitions.find(r => r.id === resourceId);
    
    if (resource && resource.min !== undefined) {
      amount = Math.max(resource.min, amount);
    }
    if (resource && resource.max !== undefined) {
      amount = Math.min(resource.max, amount);
    }
    
    this.resources[resourceId] = amount;
    this.emitUpdate();
  }

  /**
   * Add to resource amount
   */
  add(resourceId, amount) {
    const current = this.get(resourceId);
    this.set(resourceId, current + amount);
  }

  /**
   * Remove from resource amount
   */
  remove(resourceId, amount) {
    this.add(resourceId, -amount);
  }

  /**
   * Check if player has enough resources
   */
  hasEnough(requirements) {
    for (const [resourceId, amount] of Object.entries(requirements)) {
      if (this.get(resourceId) < amount) {
        return false;
      }
    }
    return true;
  }

  /**
   * Spend resources (returns true if successful)
   */
  spend(costs) {
    if (!this.hasEnough(costs)) {
      return false;
    }
    
    for (const [resourceId, amount] of Object.entries(costs)) {
      this.remove(resourceId, amount);
    }
    
    return true;
  }

  /**
   * Get all resources
   */
  getAll() {
    return { ...this.resources };
  }

  /**
   * Advance turn
   */
  nextTurn() {
    this.resources.turn += 1;
    this.emitUpdate();
  }

  /**
   * Emit resources update event to React
   */
  emitUpdate() {
    eventBridge.emit('resources:updated', this.getAll());
  }

  /**
   * Load saved state
   */
  loadState(savedResources) {
    this.resources = { ...savedResources };
    this.emitUpdate();
  }

  /**
   * Get state for saving
   */
  getSaveState() {
    return { ...this.resources };
  }
}
