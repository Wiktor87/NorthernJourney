/**
 * CreatureSystem - Manages creature spawning and interactions
 * 
 * Handles creature appearance, movement, and interactions.
 * Creatures are loaded from data/creatures.json
 */

class CreatureSystem {
  constructor(scene) {
    this.scene = scene;
    this.creatureDefinitions = [];
    this.activeCreatures = [];
    this.config = null;
  }

  /**
   * Initialize creature system
   */
  init(creaturesData, config) {
    this.creatureDefinitions = creaturesData.creatures;
    this.config = config;
  }

  /**
   * Check for creature spawns
   */
  checkSpawns(currentSeason, currentEra) {
    if (Math.random() > this.config.creature_spawn_chance) {
      return;
    }
    
    // Get eligible creatures for current conditions
    const eligibleCreatures = this.getEligibleCreatures(currentSeason, currentEra);
    
    if (eligibleCreatures.length === 0) return;
    
    // Select random creature
    const creature = eligibleCreatures[Math.floor(Math.random() * eligibleCreatures.length)];
    
    // Spawn creature
    this.spawnCreature(creature);
  }

  /**
   * Get creatures eligible to spawn
   */
  getEligibleCreatures(currentSeason, currentEra) {
    return this.creatureDefinitions.filter(creature => {
      const conditions = creature.spawn_conditions;
      
      // Check era
      if (conditions.min_era) {
        const eraOrder = ['village', 'settlement', 'town', 'kingdom'];
        const minIndex = eraOrder.indexOf(conditions.min_era);
        const currentIndex = eraOrder.indexOf(currentEra);
        
        if (currentIndex < minIndex) {
          return false;
        }
      }
      
      // Check season
      if (conditions.season && !conditions.season.includes(currentSeason)) {
        return false;
      }
      
      return true;
    });
  }

  /**
   * Spawn a creature
   */
  spawnCreature(creatureDefinition) {
    // Find spawn position (edge of map or designated spawn point)
    const spawnPos = this.findSpawnPosition();
    
    const creature = {
      id: Date.now() + '_' + creatureDefinition.id,
      definition: creatureDefinition,
      x: spawnPos.x,
      y: spawnPos.y,
      health: creatureDefinition.combat_stats?.health || 100
    };
    
    this.activeCreatures.push(creature);
    
    eventBridge.emit('creature:spawned', { creature });
    
    return creature;
  }

  /**
   * Find a valid spawn position
   */
  findSpawnPosition() {
    // For now, spawn at edges
    // In full implementation, would check terrain requirements
    const edge = Math.floor(Math.random() * 4); // 0=top, 1=right, 2=bottom, 3=left
    const mapSize = 8; // Should come from scene
    
    switch (edge) {
      case 0: // top
        return { x: Math.floor(Math.random() * mapSize), y: 0 };
      case 1: // right
        return { x: mapSize - 1, y: Math.floor(Math.random() * mapSize) };
      case 2: // bottom
        return { x: Math.floor(Math.random() * mapSize), y: mapSize - 1 };
      case 3: // left
        return { x: 0, y: Math.floor(Math.random() * mapSize) };
      default:
        return { x: 0, y: 0 };
    }
  }

  /**
   * Handle creature interaction
   */
  interactWithCreature(creatureId) {
    const creature = this.activeCreatures.find(c => c.id === creatureId);
    if (!creature) return false;
    
    const definition = creature.definition;
    
    // Start dialogue if available
    if (definition.dialogue_file && this.scene.dialogueSystem) {
      // In full implementation, would load and start dialogue
      eventBridge.emit('creature:interaction', { 
        creature,
        interactionType: 'dialogue'
      });
      return true;
    }
    
    // Handle hostile creatures (combat)
    if (definition.hostility === 'hostile') {
      eventBridge.emit('creature:interaction', {
        creature,
        interactionType: 'combat'
      });
      return true;
    }
    
    // Handle friendly creatures (trade)
    if (definition.trade_offers) {
      eventBridge.emit('creature:interaction', {
        creature,
        interactionType: 'trade',
        offers: definition.trade_offers
      });
      return true;
    }
    
    return false;
  }

  /**
   * Remove creature (defeated, fled, etc.)
   */
  removeCreature(creatureId) {
    const index = this.activeCreatures.findIndex(c => c.id === creatureId);
    if (index >= 0) {
      const creature = this.activeCreatures[index];
      this.activeCreatures.splice(index, 1);
      
      eventBridge.emit('creature:removed', { creature });
      
      return true;
    }
    return false;
  }

  /**
   * Get all active creatures
   */
  getActiveCreatures() {
    return [...this.activeCreatures];
  }

  /**
   * Load saved state
   */
  loadState(savedState) {
    this.activeCreatures = savedState.map(saved => ({
      ...saved,
      definition: this.creatureDefinitions.find(c => c.id === saved.definitionId)
    }));
  }

  /**
   * Get state for saving
   */
  getSaveState() {
    return this.activeCreatures.map(c => ({
      id: c.id,
      definitionId: c.definition.id,
      x: c.x,
      y: c.y,
      health: c.health
    }));
  }
}
