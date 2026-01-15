import { useState, useEffect } from 'react';
import GameScreen from './components/GameScreen';
import eventsData from './lore/events.json';
import './App.css';

/**
 * Northern Journey - Main Game Application
 * 
 * A turn-based resource management game set in a Norse fishing village.
 * 
 * Core Game Loop:
 * 1. Player assigns villagers to fishing or woodcutting
 * 2. Turn is processed:
 *    - Resources are generated based on assignments
 *    - Food is consumed by villagers
 *    - Random events may occur
 *    - Death checks are performed
 * 3. Game over conditions are checked
 * 
 * Game Over Conditions:
 * - All villagers are dead (starvation)
 * - Morale reaches 0
 * 
 * All game constants and formulas can be easily modified by
 * developers/designers in this file.
 */

// Game Constants - Easy to modify for game balance
const INITIAL_FOOD = 10;
const INITIAL_WOOD = 5;
const INITIAL_MORALE = 70;
const INITIAL_POPULATION = 5;
const FOOD_PER_FISHER = 2;        // Food gained per villager fishing
const WOOD_PER_CUTTER = 2;        // Wood gained per villager woodcutting
const FOOD_CONSUMPTION_PER_VILLAGER = 1;  // Food consumed per villager per turn
const MORALE_PENALTY_STARVATION = 15;     // Morale lost when villagers starve
const RANDOM_EVENT_CHANCE = 0.4;  // 40% chance of random event per turn

function App() {
  // Initialize game state
  const [gameState, setGameState] = useState(() => initializeGame());
  const [gameOver, setGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState('');

  /**
   * Initialize a new game with starting values
   */
  function initializeGame() {
    return {
      resources: {
        food: INITIAL_FOOD,
        wood: INITIAL_WOOD,
        morale: INITIAL_MORALE,
        turn: 1,
        population: INITIAL_POPULATION
      },
      mapData: generateMap(),
      events: [
        {
          id: 'game-start',
          turn: 1,
          type: 'info',
          message: 'Welcome to Fjordheim! Your journey begins. Assign your villagers wisely.'
        }
      ]
    };
  }

  /**
   * Generate the isometric map (8x6 grid)
   * Creates a simple layout with water, grass, and huts
   */
  function generateMap() {
    const map = [];
    for (let y = 0; y < 6; y++) {
      const row = [];
      for (let x = 0; x < 8; x++) {
        // Water in the bottom rows
        if (y >= 4) {
          row.push('water');
        }
        // Huts in specific locations
        else if ((x === 2 && y === 1) || (x === 5 && y === 1) || (x === 3 && y === 2)) {
          row.push('hut');
        }
        // Grass everywhere else
        else {
          row.push('grass');
        }
      }
      map.push(row);
    }
    return map;
  }

  /**
   * Process the end of turn with villager assignments
   */
  function handleEndTurn(assignments) {
    const { fishing, woodcutting } = assignments;
    const newEvents = [];
    let newResources = { ...gameState.resources };

    // Generate resources from assignments
    const foodGained = fishing * FOOD_PER_FISHER;
    const woodGained = woodcutting * WOOD_PER_CUTTER;

    newResources.food += foodGained;
    newResources.wood += woodGained;

    // Log production
    if (foodGained > 0 || woodGained > 0) {
      newEvents.push({
        id: `production-${newResources.turn}`,
        turn: newResources.turn,
        type: 'info',
        message: `Your villagers gathered ${foodGained} food and ${woodGained} wood.`
      });
    }

    // Random event check
    if (Math.random() < RANDOM_EVENT_CHANCE) {
      const randomEvent = selectRandomEvent();
      if (randomEvent) {
        applyEvent(randomEvent, newResources, newEvents);
      }
    }

    // Food consumption
    const foodNeeded = newResources.population * FOOD_CONSUMPTION_PER_VILLAGER;
    newResources.food -= foodNeeded;

    // Check for starvation
    if (newResources.food < 0) {
      const villagersLost = Math.ceil(Math.abs(newResources.food) / FOOD_CONSUMPTION_PER_VILLAGER);
      const actualLost = Math.min(villagersLost, newResources.population);
      
      newResources.population -= actualLost;
      newResources.morale -= MORALE_PENALTY_STARVATION;
      newResources.food = 0;

      newEvents.push({
        id: `starvation-${newResources.turn}`,
        turn: newResources.turn,
        type: 'danger',
        message: `⚔️ ${actualLost} villager${actualLost > 1 ? 's' : ''} died from starvation! The village mourns.`
      });
    } else {
      newEvents.push({
        id: `consumption-${newResources.turn}`,
        turn: newResources.turn,
        type: 'info',
        message: `The village consumed ${foodNeeded} food.`
      });
    }

    // Ensure morale stays in valid range
    newResources.morale = Math.max(0, Math.min(100, newResources.morale));

    // Increment turn
    newResources.turn += 1;

    // Update game state
    setGameState({
      ...gameState,
      resources: newResources,
      events: [...gameState.events, ...newEvents]
    });

    // Check for game over conditions
    checkGameOver(newResources);
  }

  /**
   * Select a random event based on probabilities
   */
  function selectRandomEvent() {
    const totalProbability = eventsData.events.reduce((sum, event) => sum + event.probability, 0);
    let random = Math.random() * totalProbability;

    for (const event of eventsData.events) {
      random -= event.probability;
      if (random <= 0) {
        return event;
      }
    }

    return null;
  }

  /**
   * Apply event effects to resources and log the event
   */
  function applyEvent(event, resources, eventsLog) {
    const effects = event.effects;

    // Apply resource changes
    if (effects.food) resources.food += effects.food;
    if (effects.wood) resources.wood += effects.wood;
    if (effects.morale) resources.morale += effects.morale;

    // Determine event type based on effects
    let eventType = 'info';
    const totalEffect = (effects.food || 0) + (effects.wood || 0) + (effects.morale || 0);
    if (totalEffect > 0) eventType = 'success';
    else if (totalEffect < 0) eventType = 'warning';

    // Log the event
    eventsLog.push({
      id: `random-${event.id}-${resources.turn}`,
      turn: resources.turn,
      type: eventType,
      message: `⚡ ${event.title}: ${event.description}`
    });
  }

  /**
   * Check if game over conditions are met
   */
  function checkGameOver(resources) {
    if (resources.population <= 0) {
      setGameOver(true);
      setGameOverReason('All villagers have perished. The village of Fjordheim is no more.');
    } else if (resources.morale <= 0) {
      setGameOver(true);
      setGameOverReason('The villagers have lost all hope. They abandon Fjordheim in despair.');
    }
  }

  /**
   * Start a new game
   */
  function handleNewGame() {
    setGameState(initializeGame());
    setGameOver(false);
    setGameOverReason('');
  }

  return (
    <div className="app">
      <GameScreen
        gameState={gameState}
        onEndTurn={handleEndTurn}
        onNewGame={handleNewGame}
        gameOver={gameOver}
        gameOverReason={gameOverReason}
      />
    </div>
  );
}

export default App;
