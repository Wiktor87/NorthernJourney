/**
 * GameContainer Component
 * 
 * Main container that combines Phaser game with React UI overlays.
 * Manages the communication between game and UI through EventBridge.
 */

import { useState, useEffect } from 'react';
import PhaserGame from '../game/PhaserGame.jsx';
import ResourcePanel from './ResourcePanel.jsx';
import BuildMenu from './BuildMenu.jsx';
import DialogueBox from './DialogueBox.jsx';
import EventPopup from './EventPopup.jsx';
import { eventBridge } from '../game/EventBridge.js';
import './GameContainer.css';

function GameContainer() {
  const [resources, setResources] = useState({});
  const [currentEvent, setCurrentEvent] = useState(null);
  const [currentDialogue, setCurrentDialogue] = useState(null);
  const [buildMenuOpen, setBuildMenuOpen] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState('');

  useEffect(() => {
    // Subscribe to events from Phaser
    const unsubscribers = [];

    // Resources updated
    unsubscribers.push(
      eventBridge.on('resources:updated', (data) => {
        setResources(data);
      })
    );

    // Event triggered
    unsubscribers.push(
      eventBridge.on('event:triggered', (data) => {
        setCurrentEvent(data.event);
      })
    );

    // Dialogue started
    unsubscribers.push(
      eventBridge.on('dialogue:start', (data) => {
        setCurrentDialogue(data);
      })
    );

    // Dialogue continued
    unsubscribers.push(
      eventBridge.on('dialogue:continue', (data) => {
        setCurrentDialogue(data);
      })
    );

    // Dialogue ended
    unsubscribers.push(
      eventBridge.on('dialogue:end', () => {
        setCurrentDialogue(null);
      })
    );

    // Game over
    unsubscribers.push(
      eventBridge.on('game:over', (data) => {
        setGameOver(true);
        setGameOverReason(data.reason);
      })
    );

    // Cleanup
    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, []);

  const handleEndTurn = () => {
    eventBridge.emit('game:endTurn');
  };

  const handleBuildMenuToggle = () => {
    setBuildMenuOpen(!buildMenuOpen);
  };

  const handleBuildingSelect = (buildingId) => {
    eventBridge.emit('building:select', { buildingId });
    setBuildMenuOpen(false);
  };

  const handleEventChoice = (choiceIndex) => {
    if (currentEvent) {
      eventBridge.emit('event:choice', { 
        event: currentEvent, 
        choiceIndex 
      });
      setCurrentEvent(null);
    }
  };

  const handleDialogueChoice = (choiceIndex) => {
    eventBridge.emit('dialogue:choice', { choiceIndex });
  };

  const handleNewGame = () => {
    window.location.reload();
  };

  return (
    <div className="game-container">
      {/* Header */}
      <header className="game-header">
        <h1>⚔️ Northern Journey ⚔️</h1>
        <p>A Norse Fishing Village Saga</p>
      </header>

      {/* Main game area */}
      <div className="game-main">
        {/* Left side - Phaser game */}
        <div className="game-canvas-area">
          <PhaserGame />
          
          {/* Overlay controls */}
          <div className="game-controls">
            {!gameOver && (
              <>
                <button 
                  className="btn-primary" 
                  onClick={handleEndTurn}
                >
                  End Turn
                </button>
                <button 
                  className="btn-secondary" 
                  onClick={handleBuildMenuToggle}
                >
                  Build
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right side - UI panels */}
        <div className="game-ui-area">
          <ResourcePanel resources={resources} />
          
          {gameOver && (
            <div className="game-over-panel">
              <h2>The Saga Has Ended</h2>
              <p>{gameOverReason}</p>
              <div className="final-stats">
                <p><strong>Turns Survived:</strong> {resources.turn || 0}</p>
                <p><strong>Final Population:</strong> {resources.population || 0}</p>
                <p><strong>Food:</strong> {resources.food || 0}</p>
                <p><strong>Wood:</strong> {resources.wood || 0}</p>
              </div>
              <button 
                className="btn-primary" 
                onClick={handleNewGame}
              >
                Begin a New Saga
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overlays */}
      {buildMenuOpen && (
        <BuildMenu 
          onClose={() => setBuildMenuOpen(false)}
          onSelect={handleBuildingSelect}
          resources={resources}
        />
      )}

      {currentEvent && (
        <EventPopup
          event={currentEvent}
          onChoice={handleEventChoice}
          onClose={() => setCurrentEvent(null)}
        />
      )}

      {currentDialogue && (
        <DialogueBox
          dialogue={currentDialogue}
          onChoice={handleDialogueChoice}
        />
      )}

      {/* Footer */}
      <footer className="game-footer">
        <p>
          Use WASD or Arrow Keys to pan camera • Click tiles to place buildings • 
          Survive the harsh northern winters
        </p>
      </footer>
    </div>
  );
}

export default GameContainer;
