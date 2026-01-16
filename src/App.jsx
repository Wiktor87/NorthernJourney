import GameContainer from './components/GameContainer';
import './App.css';

/**
 * Northern Journey - Main Game Application
 * 
 * Rebuilt with Phaser 3 for isometric rendering and React for UI overlays.
 * This is a data-driven architecture where content is loaded from JSON files.
 * 
 * The game features:
 * - Isometric village with building placement
 * - Resource management system
 * - Seasonal cycles
 * - Random events and story progression
 * - Creature encounters with branching dialogues
 * - Save/load functionality
 */

function App() {
  return (
    <div className="app">
      <GameContainer />
    </div>
  );
}

export default App;
