/**
 * EventSystem - Manages random and story events
 * 
 * Handles event triggering, effects, and choices.
 * Events are loaded from data/events/
 */

class EventSystem {
  constructor(scene) {
    this.scene = scene;
    this.randomEvents = [];
    this.seasonalEvents = [];
    this.storyEvents = [];
    this.eventHistory = [];
    this.eventFlags = new Set();
    this.config = null;
  }

  /**
   * Initialize event system with data
   */
  init(randomEventsData, seasonalEventsData, storyEventsData, config) {
    this.randomEvents = randomEventsData.events;
    this.seasonalEvents = seasonalEventsData.events;
    this.storyEvents = storyEventsData.events;
    this.config = config;
  }

  /**
   * Check for and trigger events
   */
  checkEvents(currentSeason, currentEra, resourceManager) {
    const events = [];
    
    // Check for story events
    const triggeredStory = this.checkStoryEvents(currentEra, resourceManager);
    if (triggeredStory) {
      events.push(triggeredStory);
    }
    
    // Check for random events
    if (Math.random() < this.config.event_check_chance) {
      const randomEvent = this.selectRandomEvent(currentSeason, currentEra);
      if (randomEvent) {
        events.push(randomEvent);
      }
    }
    
    return events;
  }

  /**
   * Check if any story events should trigger
   */
  checkStoryEvents(currentEra, resourceManager) {
    for (const event of this.storyEvents) {
      // Check if already triggered
      if (this.eventFlags.has(event.id)) {
        continue;
      }
      
      // Check trigger conditions
      if (this.checkTriggerConditions(event.trigger_conditions, currentEra, resourceManager)) {
        this.eventFlags.add(event.id);
        return event;
      }
    }
    return null;
  }

  /**
   * Check if trigger conditions are met
   */
  checkTriggerConditions(conditions, currentEra, resourceManager) {
    if (!conditions) return false;
    
    // Check population
    if (conditions.population && resourceManager.get('population') < conditions.population) {
      return false;
    }
    
    // Check building count
    if (conditions.buildings) {
      const buildingCount = this.scene.buildingSystem?.getBuildings().length || 0;
      if (buildingCount < conditions.buildings) {
        return false;
      }
    }
    
    // Check era
    if (conditions.era && conditions.era !== currentEra) {
      return false;
    }
    
    // Check flags
    if (conditions.flag) {
      const flagName = conditions.flag.startsWith('!') 
        ? conditions.flag.substring(1) 
        : conditions.flag;
      const shouldExist = !conditions.flag.startsWith('!');
      
      if (shouldExist && !this.eventFlags.has(flagName)) {
        return false;
      }
      if (!shouldExist && this.eventFlags.has(flagName)) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Select a random event based on current conditions
   */
  selectRandomEvent(currentSeason, currentEra) {
    // Filter events by season and era
    const eligibleEvents = this.randomEvents.filter(event => {
      // Check era
      if (event.era && !event.era.includes(currentEra)) {
        return false;
      }
      
      // Check season
      if (event.season && !event.season.includes(currentSeason)) {
        return false;
      }
      
      return true;
    });
    
    if (eligibleEvents.length === 0) return null;
    
    // Calculate total probability
    const totalProbability = eligibleEvents.reduce((sum, e) => sum + e.probability, 0);
    let random = Math.random() * totalProbability;
    
    // Select event
    for (const event of eligibleEvents) {
      random -= event.probability;
      if (random <= 0) {
        return event;
      }
    }
    
    return eligibleEvents[eligibleEvents.length - 1];
  }

  /**
   * Trigger seasonal event
   */
  triggerSeasonalEvent(season) {
    const event = this.seasonalEvents.find(e => e.season === season);
    if (event && event.automatic) {
      this.applyEventEffects(event.effects, null);
      eventBridge.emit('event:seasonal', { event });
    }
  }

  /**
   * Apply event effects
   */
  applyEventEffects(effects, resourceManager) {
    if (!effects || !resourceManager) return;
    
    for (const [resource, amount] of Object.entries(effects)) {
      if (resource === 'lore_unlocked' || resource === 'event_flag') {
        // Handle special effects
        if (resource === 'event_flag') {
          this.eventFlags.add(amount);
        }
        continue;
      }
      
      resourceManager.add(resource, amount);
    }
  }

  /**
   * Handle event choice selection
   */
  selectEventChoice(event, choiceIndex, resourceManager) {
    const choice = event.choices[choiceIndex];
    if (!choice) return { success: false, message: 'Invalid choice' };
    
    // Check requirements
    if (choice.requires && !resourceManager.hasEnough(choice.requires)) {
      return { 
        success: false, 
        message: 'Insufficient resources' 
      };
    }
    
    // Handle risk-based choices
    if (choice.risk !== undefined) {
      const success = Math.random() >= choice.risk;
      const effects = success ? choice.success_effects : choice.failure_effects;
      const message = success ? null : choice.failure_message;
      
      this.applyEventEffects(effects, resourceManager);
      
      return { 
        success, 
        message,
        effects
      };
    }
    
    // Apply standard effects
    this.applyEventEffects(choice.effects, resourceManager);
    
    return { 
      success: true, 
      effects: choice.effects 
    };
  }

  /**
   * Trigger an event
   */
  triggerEvent(event) {
    this.eventHistory.push({
      id: event.id,
      turn: this.scene.resourceManager?.get('turn') || 0,
      timestamp: Date.now()
    });
    
    eventBridge.emit('event:triggered', { event });
  }

  /**
   * Set an event flag
   */
  setFlag(flag) {
    this.eventFlags.add(flag);
  }

  /**
   * Check if flag exists
   */
  hasFlag(flag) {
    return this.eventFlags.has(flag);
  }

  /**
   * Load saved state
   */
  loadState(savedState) {
    this.eventHistory = savedState.eventHistory || [];
    this.eventFlags = new Set(savedState.eventFlags || []);
  }

  /**
   * Get state for saving
   */
  getSaveState() {
    return {
      eventHistory: [...this.eventHistory],
      eventFlags: Array.from(this.eventFlags)
    };
  }
}
