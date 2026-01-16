/**
 * VillagerSystem - Manages visible villager sprites
 * 
 * Spawns and manages villager sprites that represent the population.
 * Villagers appear near buildings and can be clicked for interaction.
 */

import { eventBridge } from '../EventBridge.js';

export class VillagerSystem {
  constructor(scene) {
    this.scene = scene;
    this.villagers = [];
    this.villagerSprites = [];
  }

  /**
   * Initialize villager system
   */
  init() {
    // Initialize empty
  }

  /**
   * Update villager count based on population
   */
  updateVillagers(population, buildings) {
    // Remove excess villagers
    while (this.villagerSprites.length > population) {
      const sprite = this.villagerSprites.pop();
      sprite.destroy();
    }

    // Add new villagers
    while (this.villagerSprites.length < population) {
      this.spawnVillager(buildings);
    }
  }

  /**
   * Spawn a new villager sprite
   */
  spawnVillager(buildings) {
    // Find a random building or village center to spawn near
    let spawnX, spawnY;
    
    if (buildings && buildings.length > 0) {
      // Spawn near a random building
      const building = buildings[Math.floor(Math.random() * buildings.length)];
      const buildingPos = this.scene.getIsoPosition(building.x, building.y);
      spawnX = buildingPos.x + (Math.random() - 0.5) * 100;
      spawnY = buildingPos.y + (Math.random() - 0.5) * 100;
    } else {
      // Spawn in village center
      spawnX = (Math.random() - 0.5) * 200;
      spawnY = (Math.random() - 0.5) * 200;
    }

    const sprite = this.scene.add.sprite(spawnX, spawnY, 'villager');
    sprite.setOrigin(0.5, 1);
    sprite.setInteractive();
    sprite.setData('isVillager', true);
    
    // Add click handler
    sprite.on('pointerdown', () => {
      this.handleVillagerClick(sprite);
    });

    // Add to entity container if it exists
    if (this.scene.entityContainer) {
      this.scene.entityContainer.add(sprite);
    }

    this.villagerSprites.push(sprite);

    // Simple wandering behavior
    this.addWanderingBehavior(sprite, spawnX, spawnY);
  }

  /**
   * Add simple wandering behavior to villager
   */
  addWanderingBehavior(sprite, homeX, homeY) {
    const wander = () => {
      if (!sprite.active) return;

      const targetX = homeX + (Math.random() - 0.5) * 150;
      const targetY = homeY + (Math.random() - 0.5) * 150;
      const duration = 3000 + Math.random() * 2000;

      this.scene.tweens.add({
        targets: sprite,
        x: targetX,
        y: targetY,
        duration: duration,
        ease: 'Sine.inOut',
        onComplete: () => {
          setTimeout(wander, 1000 + Math.random() * 2000);
        }
      });
    };

    // Start wandering after a random delay
    setTimeout(wander, Math.random() * 2000);
  }

  /**
   * Handle villager click
   */
  handleVillagerClick(sprite) {
    eventBridge.emit('villager:clicked', {
      message: 'A villager of Fjordheim. They work hard to survive the harsh winter.'
    });
  }

  /**
   * Process turn for villagers
   */
  processTurn() {
    // Villagers don't need turn processing currently
  }

  /**
   * Get state for saving
   */
  getSaveState() {
    return {
      villagerCount: this.villagerSprites.length
    };
  }

  /**
   * Load saved state
   */
  loadState(savedState, buildings) {
    // Clear existing villagers
    this.villagerSprites.forEach(sprite => sprite.destroy());
    this.villagerSprites = [];

    // Respawn villagers
    const count = savedState.villagerCount || 0;
    for (let i = 0; i < count; i++) {
      this.spawnVillager(buildings);
    }
  }

  /**
   * Clean up
   */
  destroy() {
    this.villagerSprites.forEach(sprite => sprite.destroy());
    this.villagerSprites = [];
  }
}
