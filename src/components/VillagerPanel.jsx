import React, { useState } from 'react';
import './VillagerPanel.css';

/**
 * VillagerPanel Component
 * 
 * Allows the player to assign villagers to different tasks each turn.
 * 
 * Props:
 * - population: Total number of living villagers
 * - onEndTurn: Callback function called when turn is ended with assignments
 * 
 * Tasks:
 * - fishing: Villagers assigned to fish will produce food
 * - woodcutting: Villagers assigned to cut wood will produce wood
 * - idle: Villagers not assigned to any task
 * 
 * The component ensures all villagers are accounted for and provides
 * clear feedback on current assignments.
 */
const VillagerPanel = ({ population, onEndTurn }) => {
  // State for tracking villager assignments
  const [fishing, setFishing] = useState(0);
  const [woodcutting, setWoodcutting] = useState(0);

  // Calculate idle villagers
  const idle = population - fishing - woodcutting;

  /**
   * Handle ending the turn with current assignments
   */
  const handleEndTurn = () => {
    if (idle < 0) {
      alert('You cannot assign more villagers than you have!');
      return;
    }
    onEndTurn({ fishing, woodcutting, idle });
  };

  /**
   * Increment assignment for a task
   */
  const incrementTask = (task) => {
    if (idle <= 0) return;
    
    if (task === 'fishing') {
      setFishing(fishing + 1);
    } else if (task === 'woodcutting') {
      setWoodcutting(woodcutting + 1);
    }
  };

  /**
   * Decrement assignment for a task
   */
  const decrementTask = (task) => {
    if (task === 'fishing' && fishing > 0) {
      setFishing(fishing - 1);
    } else if (task === 'woodcutting' && woodcutting > 0) {
      setWoodcutting(woodcutting - 1);
    }
  };

  /**
   * Reset all assignments
   */
  const resetAssignments = () => {
    setFishing(0);
    setWoodcutting(0);
  };

  return (
    <div className="villager-panel">
      <h2 className="panel-title">Assign Villagers</h2>
      
      <div className="assignment-info">
        <p className="info-text">
          You have <strong>{population}</strong> villagers. Assign them wisely!
        </p>
        <p className="idle-count">
          Idle: <strong className={idle < 0 ? 'negative' : ''}>{idle}</strong>
        </p>
      </div>

      {/* Assignment Controls */}
      <div className="assignments">
        {/* Fishing Assignment */}
        <div className="assignment-row">
          <div className="task-info">
            <span className="task-icon">🐟</span>
            <div className="task-details">
              <span className="task-name">Fishing</span>
              <span className="task-description">Gather food from the sea</span>
            </div>
          </div>
          <div className="task-controls">
            <button 
              className="control-btn decrease"
              onClick={() => decrementTask('fishing')}
              disabled={fishing === 0}
            >
              -
            </button>
            <span className="task-count">{fishing}</span>
            <button 
              className="control-btn increase"
              onClick={() => incrementTask('fishing')}
              disabled={idle <= 0}
            >
              +
            </button>
          </div>
        </div>

        {/* Woodcutting Assignment */}
        <div className="assignment-row">
          <div className="task-info">
            <span className="task-icon">🪵</span>
            <div className="task-details">
              <span className="task-name">Woodcutting</span>
              <span className="task-description">Gather wood from the forest</span>
            </div>
          </div>
          <div className="task-controls">
            <button 
              className="control-btn decrease"
              onClick={() => decrementTask('woodcutting')}
              disabled={woodcutting === 0}
            >
              -
            </button>
            <span className="task-count">{woodcutting}</span>
            <button 
              className="control-btn increase"
              onClick={() => incrementTask('woodcutting')}
              disabled={idle <= 0}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button 
          className="btn-reset"
          onClick={resetAssignments}
        >
          Reset
        </button>
        <button 
          className="btn-end-turn"
          onClick={handleEndTurn}
          disabled={idle < 0}
        >
          End Turn
        </button>
      </div>

      {/* Production Preview */}
      <div className="production-preview">
        <h3>Expected Production:</h3>
        <div className="preview-items">
          <div className="preview-item">
            🐟 Food: +{fishing * 2}
          </div>
          <div className="preview-item">
            🪵 Wood: +{woodcutting * 2}
          </div>
          <div className="preview-item">
            🍞 Consumption: -{population}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VillagerPanel;
