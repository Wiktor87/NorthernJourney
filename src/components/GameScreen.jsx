import React from 'react';
import IsometricMap from './IsometricMap';
import ResourcePanel from './ResourcePanel';
import VillagerPanel from './VillagerPanel';
import EventLog from './EventLog';
import './GameScreen.css';

/**
 * GameScreen Component
 * 
 * Main game container that displays all game components in a cohesive layout.
 * 
 * Props:
 * - gameState: Object containing all game state information
 *   - resources: Resource counts (food, wood, morale, turn, population)
 *   - mapData: 2D array for isometric map
 *   - events: Array of game events for the log
 * - onEndTurn: Callback for ending the turn with villager assignments
 * - onNewGame: Callback for starting a new game
 * - gameOver: Boolean indicating if game is over
 * - gameOverReason: String explaining why the game ended
 * 
 * The layout is designed to be clear and functional, with the map
 * prominently displayed and all controls easily accessible.
 */
const GameScreen = ({ 
  gameState, 
  onEndTurn, 
  onNewGame, 
  gameOver, 
  gameOverReason 
}) => {
  return (
    <div className="game-screen">
      {/* Header */}
      <header className="game-header">
        <h1 className="game-title">⚔️ Northern Journey ⚔️</h1>
        <p className="game-subtitle">A Norse Fishing Village Saga</p>
      </header>

      {/* Main Game Area */}
      <div className="game-content">
        {/* Left Column - Map and Resources */}
        <div className="left-column">
          <IsometricMap mapData={gameState.mapData} />
          <ResourcePanel resources={gameState.resources} />
        </div>

        {/* Right Column - Villager Assignment and Event Log */}
        <div className="right-column">
          {!gameOver ? (
            <VillagerPanel 
              population={gameState.resources.population}
              onEndTurn={onEndTurn}
            />
          ) : (
            <div className="game-over-panel">
              <h2 className="game-over-title">The Saga Has Ended</h2>
              <p className="game-over-reason">{gameOverReason}</p>
              <div className="final-stats">
                <h3>Final Statistics:</h3>
                <p>Survived: {gameState.resources.turn} turns</p>
                <p>Final Population: {gameState.resources.population}</p>
                <p>Food Remaining: {gameState.resources.food}</p>
                <p>Wood Remaining: {gameState.resources.wood}</p>
              </div>
              <button className="btn-new-game" onClick={onNewGame}>
                Begin a New Saga
              </button>
            </div>
          )}
          <EventLog events={gameState.events} />
        </div>
      </div>

      {/* Footer */}
      <footer className="game-footer">
        <p>
          Tips: Villagers need food each turn. Balance fishing and woodcutting to survive!
          {!gameOver && (
            <button className="btn-restart" onClick={onNewGame}>
              Restart
            </button>
          )}
        </p>
      </footer>
    </div>
  );
};

export default GameScreen;
