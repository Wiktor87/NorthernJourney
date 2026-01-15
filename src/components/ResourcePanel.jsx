import React from 'react';
import './ResourcePanel.css';

/**
 * ResourcePanel Component
 * 
 * Displays the current game resources and statistics.
 * 
 * Props:
 * - resources: Object containing:
 *   - food: Current food supply
 *   - wood: Current wood supply
 *   - morale: Current morale level (0-100)
 *   - turn: Current turn number
 *   - population: Current number of living villagers
 * 
 * Resources are displayed with icons and colored bars for easy visualization.
 * Writers can easily modify the labels and descriptions in this component.
 */
const ResourcePanel = ({ resources }) => {
  const { food, wood, morale, turn, population } = resources;

  /**
   * Get color class based on resource amount
   * Used for visual feedback on resource levels
   */
  const getResourceColor = (value, threshold = 5) => {
    if (value <= 0) return 'critical';
    if (value <= threshold) return 'low';
    return 'good';
  };

  /**
   * Get morale color based on level
   */
  const getMoraleColor = (value) => {
    if (value <= 20) return 'critical';
    if (value <= 40) return 'low';
    if (value <= 60) return 'medium';
    return 'good';
  };

  return (
    <div className="resource-panel">
      <h2 className="panel-title">Fjordheim Status</h2>
      
      <div className="resource-grid">
        {/* Turn Counter */}
        <div className="resource-item highlight">
          <span className="resource-label">Turn:</span>
          <span className="resource-value">{turn}</span>
        </div>

        {/* Population */}
        <div className="resource-item highlight">
          <span className="resource-label">⚔️ Villagers:</span>
          <span className="resource-value">{population}</span>
        </div>

        {/* Food */}
        <div className={`resource-item ${getResourceColor(food)}`}>
          <span className="resource-label">🐟 Food:</span>
          <span className="resource-value">{food}</span>
        </div>

        {/* Wood */}
        <div className={`resource-item ${getResourceColor(wood)}`}>
          <span className="resource-label">🪵 Wood:</span>
          <span className="resource-value">{wood}</span>
        </div>

        {/* Morale */}
        <div className={`resource-item ${getMoraleColor(morale)}`}>
          <span className="resource-label">❤️ Morale:</span>
          <span className="resource-value">{morale}%</span>
        </div>
      </div>

      {/* Warning Messages */}
      <div className="warnings">
        {food <= 3 && (
          <div className="warning-message critical">
            ⚠️ Food supplies are dangerously low!
          </div>
        )}
        {morale <= 30 && (
          <div className="warning-message critical">
            ⚠️ Morale is critically low! The village may fall into despair!
          </div>
        )}
        {wood <= 3 && (
          <div className="warning-message low">
            ⚠️ Wood supplies are running low!
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcePanel;
