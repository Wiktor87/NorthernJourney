/**
 * BuildingSystem - Manages building placement and upgrades
 * 
 * Handles building construction, placement validation, and production.
 * Buildings are loaded from data/buildings.json
 */

class BuildingSystem {
  constructor(scene) {
    this.scene = scene;
    this.buildings = [];
    this.buildingDefinitions = null;
    this.placementMode = false;
    this.selectedBuilding = null;
    this.ghostSprite = null;
  }

  /**
   * Initialize building system with data
   */
  init(buildingsData) {
    this.buildingDefinitions = buildingsData.buildings;
  }

  /**
   * Get buildings available for current era
   */
  getAvailableBuildings(era, unlockedFeatures = []) {
    return this.buildingDefinitions.filter(building => {
      // Check era requirement
      if (building.era !== era && !this.isEraUnlocked(building.era, era)) {
        return false;
      }
      
      // Check unlock requirements
      if (building.requires_unlock && !unlockedFeatures.includes(building.id)) {
        return false;
      }
      
      return true;
    });
  }

  /**
   * Check if an era is unlocked
   */
  isEraUnlocked(requiredEra, currentEra) {
    const eraOrder = ['village', 'settlement', 'town', 'kingdom'];
    const requiredIndex = eraOrder.indexOf(requiredEra);
    const currentIndex = eraOrder.indexOf(currentEra);
    return currentIndex >= requiredIndex;
  }

  /**
   * Enter building placement mode
   */
  enterPlacementMode(buildingId) {
    const definition = this.buildingDefinitions.find(b => b.id === buildingId);
    if (!definition) return;
    
    this.placementMode = true;
    this.selectedBuilding = definition;
    eventBridge.emit('building:placement_started', { building: definition });
  }

  /**
   * Exit building placement mode
   */
  exitPlacementMode() {
    this.placementMode = false;
    this.selectedBuilding = null;
    if (this.ghostSprite) {
      this.ghostSprite.destroy();
      this.ghostSprite = null;
    }
    eventBridge.emit('building:placement_cancelled');
  }

  /**
   * Check if a tile position is valid for building placement
   */
  isValidPlacement(x, y, building, mapData) {
    // Check if within map bounds
    if (x < 0 || y < 0 || x >= mapData[0].length || y >= mapData.length) {
      return false;
    }
    
    // Check if tile is grass (basic requirement)
    const tile = mapData[y][x];
    
    // Special case: can build on water
    if (building.placement_rules.includes('can_build_on_water')) {
      if (tile !== 'water') {
        return false;
      }
    } else if (tile !== 'grass' && tile !== 'path' && !building.placement_rules.includes('can_build_on_' + tile)) {
      return false;
    }
    
    // Check placement rules
    if (building.placement_rules.includes('adjacent_to_water')) {
      if (!this.isAdjacentToWater(x, y, mapData)) {
        return false;
      }
    }
    
    if (building.placement_rules.includes('not_adjacent_to_water')) {
      if (this.isAdjacentToWater(x, y, mapData)) {
        return false;
      }
    }
    
    // Check if tile is already occupied
    if (this.isTileOccupied(x, y)) {
      return false;
    }
    
    return true;
  }

  /**
   * Check if tile is adjacent to water
   */
  isAdjacentToWater(x, y, mapData) {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && ny >= 0 && ny < mapData.length && nx < mapData[0].length) {
        if (mapData[ny][nx] === 'water') {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Check if tile is occupied by a building
   */
  isTileOccupied(x, y) {
    return this.buildings.some(b => b.x === x && b.y === y);
  }

  /**
   * Place a building at the specified position
   */
  placeBuilding(x, y, buildingId, resourceManager) {
    const definition = this.buildingDefinitions.find(b => b.id === buildingId);
    if (!definition) return false;
    
    // Check resources
    if (!resourceManager.hasEnough(definition.cost)) {
      eventBridge.emit('building:insufficient_resources', { building: definition });
      return false;
    }
    
    // Spend resources
    resourceManager.spend(definition.cost);
    
    // Create building instance
    const building = {
      id: buildingId,
      definition: definition,
      x: x,
      y: y,
      level: 1,
      workers: 0,
      constructionTurnsLeft: definition.buildTime || 0
    };
    
    this.buildings.push(building);
    
    eventBridge.emit('building:placed', { building });
    
    return true;
  }

  /**
   * Place a starting building (free, instant construction)
   */
  placeStartingBuilding(x, y, buildingId) {
    const definition = this.buildingDefinitions.find(b => b.id === buildingId);
    if (!definition) return false;
    
    // Create building instance (no cost, instant construction)
    const building = {
      id: buildingId,
      definition: definition,
      x: x,
      y: y,
      level: 1,
      workers: 0,
      constructionTurnsLeft: 0
    };
    
    this.buildings.push(building);
    
    return true;
  }

  /**
   * Process turn for all buildings (production, maintenance, etc.)
   */
  processTurn(resourceManager, seasonModifiers = {}) {
    const production = {};
    
    for (const building of this.buildings) {
      // Skip buildings under construction
      if (building.constructionTurnsLeft > 0) {
        building.constructionTurnsLeft--;
        continue;
      }
      
      // Calculate production
      if (building.definition.production) {
        for (const [resource, amount] of Object.entries(building.definition.production)) {
          const modifier = seasonModifiers[resource + '_production_modifier'] || 1.0;
          const produced = amount * modifier * (building.workers || 1);
          production[resource] = (production[resource] || 0) + produced;
        }
      }
      
      // Apply effects (one-time or passive)
      if (building.definition.effects) {
        // Effects are applied passively through getTotalEffect()
        for (const [effect] of Object.entries(building.definition.effects)) {
          if (effect.includes('cap') || effect.includes('capacity')) {
            // These are passive effects, handled elsewhere
            continue;
          }
        }
      }
    }
    
    // Apply production to resources
    for (const [resource, amount] of Object.entries(production)) {
      resourceManager.add(resource, Math.floor(amount));
    }
    
    return production;
  }

  /**
   * Get total effect value from all buildings
   */
  getTotalEffect(effectName) {
    let total = 0;
    for (const building of this.buildings) {
      if (building.definition.effects && building.definition.effects[effectName]) {
        total += building.definition.effects[effectName];
      }
    }
    return total;
  }

  /**
   * Get all placed buildings
   */
  getBuildings() {
    return [...this.buildings];
  }

  /**
   * Load saved state
   */
  loadState(savedBuildings) {
    this.buildings = savedBuildings.map(saved => ({
      ...saved,
      definition: this.buildingDefinitions.find(b => b.id === saved.id)
    }));
  }

  /**
   * Get state for saving
   */
  getSaveState() {
    return this.buildings.map(b => ({
      id: b.id,
      x: b.x,
      y: b.y,
      level: b.level,
      workers: b.workers,
      constructionTurnsLeft: b.constructionTurnsLeft
    }));
  }
}
