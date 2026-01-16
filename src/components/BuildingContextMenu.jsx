/**
 * BuildingContextMenu Component
 * 
 * Shows a contextual menu when a building is clicked.
 * Displays building info, workers, production, and upgrade options.
 */

import { useEffect } from 'react';
import { eventBridge } from '../game/EventBridge.js';
import './BuildingContextMenu.css';

function BuildingContextMenu({ building, onClose, resources }) {
  useEffect(() => {
    // Close on escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!building) return null;

  const handleAssignWorker = () => {
    // Use coordinate-based ID as fallback
    const buildingId = building.id || `${building.x},${building.y}`;
    eventBridge.emit('building:assign_worker', { buildingId });
  };

  const handleRemoveWorker = () => {
    const buildingId = building.id || `${building.x},${building.y}`;
    eventBridge.emit('building:remove_worker', { buildingId });
  };

  const handleUpgrade = () => {
    const buildingId = building.id || `${building.x},${building.y}`;
    eventBridge.emit('building:upgrade', { buildingId });
  };

  const maxWorkers = building.definition.workers?.max || 0;
  const currentWorkers = building.workers || 0;
  const canAssignWorker = currentWorkers < maxWorkers;
  const canRemoveWorker = currentWorkers > 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="building-context-menu" onClick={(e) => e.stopPropagation()}>
        <div className="menu-header">
          <h3>{building.definition.name}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="menu-content">
          <p className="building-description">{building.definition.description}</p>

          {/* Construction status */}
          {building.constructionTurnsLeft > 0 && (
            <div className="construction-status">
              <p>🔨 Under Construction</p>
              <p>Turns remaining: {building.constructionTurnsLeft}</p>
            </div>
          )}

          {/* Workers */}
          {maxWorkers > 0 && building.constructionTurnsLeft === 0 && (
            <div className="workers-section">
              <h4>Workers</h4>
              <p>Assigned: {currentWorkers} / {maxWorkers}</p>
              <div className="worker-buttons">
                <button
                  className="btn-secondary"
                  onClick={handleAssignWorker}
                  disabled={!canAssignWorker}
                >
                  Assign Worker
                </button>
                <button
                  className="btn-secondary"
                  onClick={handleRemoveWorker}
                  disabled={!canRemoveWorker}
                >
                  Remove Worker
                </button>
              </div>
            </div>
          )}

          {/* Production */}
          {building.definition.production && Object.keys(building.definition.production).length > 0 && building.constructionTurnsLeft === 0 && (
            <div className="production-section">
              <h4>Production per Turn</h4>
              {Object.entries(building.definition.production).map(([resource, amount]) => {
                const workers = maxWorkers > 0 ? currentWorkers : 1;
                return (
                  <p key={resource}>
                    {resource}: +{amount * workers}
                  </p>
                );
              })}
            </div>
          )}

          {/* Effects */}
          {building.definition.effects && Object.keys(building.definition.effects).length > 0 && (
            <div className="effects-section">
              <h4>Effects</h4>
              {Object.entries(building.definition.effects).map(([effect, value]) => (
                <p key={effect}>
                  {effect.replace(/_/g, ' ')}: +{value}
                </p>
              ))}
            </div>
          )}

          {/* Upgrade */}
          {building.definition.upgrades_to && (
            <div className="upgrade-section">
              <h4>Upgrade Available</h4>
              <button
                className="btn-primary"
                onClick={handleUpgrade}
              >
                Upgrade to {building.definition.upgrades_to}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BuildingContextMenu;
