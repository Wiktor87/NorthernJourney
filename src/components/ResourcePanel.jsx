import React from 'react';
import './ResourcePanel.css';

// Default resource values
const DEFAULT_MORALE = 50;

/**
 * ResourcePanel Component
 * 
 * Displays the current game resources and statistics in a horizontal top bar.
 * 
 * Props:
 * - resources: Object containing:
 *   - food: Current food supply (mapped to Sustenance)
 *   - wood: Current wood supply (mapped to Warmth/Fuel)
 *   - morale: Current morale level (mapped to Dread - inverted)
 *   - turn: Current turn number
 *   - population: Current number of living villagers
 * 
 * Three Core Resources:
 * - Warmth (Fuel) 🔥 - For the central fire and homes
 * - Sustenance (Food) 🐟 - From fishing
 * - Dread (Sanity) 👁 - Rises with danger, lowered by morale
 */
const ResourcePanel = ({ resources }) => {
  const { food = 0, wood = 0, morale = DEFAULT_MORALE, turn = 0, population = 0 } = resources;

  // Map existing resources to new themed names
  const warmth = wood; // Wood represents fuel for warmth
  const sustenance = food; // Food represents sustenance
  const dread = Math.max(0, 100 - (morale || DEFAULT_MORALE)); // Dread is inverse of morale

  /**
   * Get color class based on resource amount
   */
  const getResourceColor = (value, threshold = 5) => {
    if (value <= 0) return 'critical';
    if (value <= threshold) return 'low';
    return 'good';
  };

  /**
   * Get dread color based on level (higher is worse)
   */
  const getDreadColor = (value) => {
    if (value >= 80) return 'critical';
    if (value >= 60) return 'high';
    if (value >= 40) return 'medium';
    return 'good';
  };

  return (
    <div className="resource-panel">
      <div className="resource-bar">
        {/* Turn Counter */}
        <div className="resource-item info">
          <span className="resource-icon">📜</span>
          <div className="resource-details">
            <span className="resource-label">Day</span>
            <span className="resource-value">{turn}</span>
          </div>
        </div>

        {/* Population */}
        <div className="resource-item info">
          <span className="resource-icon">⚔️</span>
          <div className="resource-details">
            <span className="resource-label">Souls</span>
            <span className="resource-value">{population}</span>
          </div>
        </div>

        {/* Warmth (Fuel) */}
        <div className={`resource-item ${getResourceColor(warmth)}`}>
          <span className="resource-icon">🔥</span>
          <div className="resource-details">
            <span className="resource-label">Warmth</span>
            <span className="resource-value">{warmth}</span>
          </div>
        </div>

        {/* Sustenance (Food) */}
        <div className={`resource-item ${getResourceColor(sustenance)}`}>
          <span className="resource-icon">🐟</span>
          <div className="resource-details">
            <span className="resource-label">Sustenance</span>
            <span className="resource-value">{sustenance}</span>
          </div>
        </div>

        {/* Dread (Sanity) */}
        <div className={`resource-item dread ${getDreadColor(dread)}`}>
          <span className="resource-icon">👁</span>
          <div className="resource-details">
            <span className="resource-label">Dread</span>
            <span className="resource-value">{dread}</span>
          </div>
        </div>
      </div>

      {/* Critical warnings - only show when severe */}
      {(warmth <= 3 || sustenance <= 3 || dread >= 70) && (
        <div className="warning-banner">
          {warmth <= 3 && (
            <span className="warning-text">⚠️ The fires grow cold...</span>
          )}
          {sustenance <= 3 && (
            <span className="warning-text">⚠️ Starvation looms...</span>
          )}
          {dread >= 70 && (
            <span className="warning-text">⚠️ Madness spreads through the village...</span>
          )}
        </div>
      )}
    </div>
  );
};

export default ResourcePanel;
