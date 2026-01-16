/**
 * BuildMenu Component
 * 
 * Shows available buildings that can be constructed.
 * Buildings are loaded from data/buildings.json
 */

import React from 'react';
import buildingsData from '../data/buildings.json';
import './BuildMenu.css';

const BuildMenu = ({ onClose, onSelect, resources }) => {
  // Compute buildings directly from resources.era - no need for state
  const currentEra = resources.era || 'village';
  const buildings = buildingsData.buildings.filter(
    b => b.era === currentEra
  );

  const canAfford = (building) => {
    for (const [resource, cost] of Object.entries(building.cost)) {
      if ((resources[resource] || 0) < cost) {
        return false;
      }
    }
    return true;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content build-menu" onClick={(e) => e.stopPropagation()}>
        <h2>Construct Building</h2>
        <button className="close-btn" onClick={onClose}>✕</button>
        
        <div className="building-list">
          {buildings.map(building => {
            const affordable = canAfford(building);
            
            return (
              <div 
                key={building.id}
                className={`building-item ${!affordable ? 'unaffordable' : ''}`}
                onClick={() => affordable && onSelect(building.id)}
              >
                <h3>{building.name}</h3>
                <p className="building-description">{building.description}</p>
                
                <div className="building-stats">
                  <div className="building-cost">
                    <strong>Cost:</strong>{' '}
                    {Object.entries(building.cost).map(([resource, amount]) => (
                      <span key={resource} className="cost-item">
                        {resource}: {amount}
                      </span>
                    ))}
                  </div>
                  
                  {building.production && Object.keys(building.production).length > 0 && (
                    <div className="building-production">
                      <strong>Produces:</strong>{' '}
                      {Object.entries(building.production).map(([resource, amount]) => (
                        <span key={resource} className="production-item">
                          {resource}: +{amount}/turn
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {building.effects && Object.keys(building.effects).length > 0 && (
                    <div className="building-effects">
                      <strong>Effects:</strong>{' '}
                      {Object.entries(building.effects).map(([effect, value]) => (
                        <span key={effect} className="effect-item">
                          {effect}: +{value}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                {!affordable && (
                  <div className="insufficient-resources">
                    Insufficient resources
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BuildMenu;
