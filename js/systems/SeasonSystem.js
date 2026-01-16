/**
 * SeasonSystem - Manages seasonal cycles and effects
 * 
 * Handles season transitions and seasonal modifiers.
 * Seasons are loaded from data/seasons.json
 */

class SeasonSystem {
  constructor(scene) {
    this.scene = scene;
    this.seasons = [];
    this.currentSeasonIndex = 0;
    this.turnsInCurrentSeason = 0;
    this.config = null;
  }

  /**
   * Initialize season system
   */
  init(seasonsData, config) {
    this.seasons = seasonsData.seasons;
    this.config = config;
    this.currentSeasonIndex = 0; // Start with spring
    this.turnsInCurrentSeason = 0;
    
    eventBridge.emit('season:changed', { 
      season: this.getCurrentSeason() 
    });
  }

  /**
   * Get current season
   */
  getCurrentSeason() {
    return this.seasons[this.currentSeasonIndex];
  }

  /**
   * Get current season ID
   */
  getCurrentSeasonId() {
    return this.getCurrentSeason().id;
  }

  /**
   * Process turn and check for season change
   */
  processTurn() {
    this.turnsInCurrentSeason++;
    
    const currentSeason = this.getCurrentSeason();
    const seasonDuration = currentSeason.duration_turns || this.config.season_duration_turns;
    
    // Check if season should change
    if (this.turnsInCurrentSeason >= seasonDuration) {
      this.advanceSeason();
    }
  }

  /**
   * Advance to next season
   */
  advanceSeason() {
    this.currentSeasonIndex = (this.currentSeasonIndex + 1) % this.seasons.length;
    this.turnsInCurrentSeason = 0;
    
    const newSeason = this.getCurrentSeason();
    
    // Trigger seasonal event
    if (this.scene.eventSystem) {
      this.scene.eventSystem.triggerSeasonalEvent(newSeason.id);
    }
    
    eventBridge.emit('season:changed', { 
      season: newSeason 
    });
  }

  /**
   * Get current season modifiers
   */
  getSeasonModifiers() {
    const season = this.getCurrentSeason();
    return season.effects || {};
  }

  /**
   * Get season progress (0-1)
   */
  getSeasonProgress() {
    const currentSeason = this.getCurrentSeason();
    const seasonDuration = currentSeason.duration_turns || this.config.season_duration_turns;
    return this.turnsInCurrentSeason / seasonDuration;
  }

  /**
   * Load saved state
   */
  loadState(savedState) {
    this.currentSeasonIndex = savedState.currentSeasonIndex || 0;
    this.turnsInCurrentSeason = savedState.turnsInCurrentSeason || 0;
  }

  /**
   * Get state for saving
   */
  getSaveState() {
    return {
      currentSeasonIndex: this.currentSeasonIndex,
      turnsInCurrentSeason: this.turnsInCurrentSeason
    };
  }
}
