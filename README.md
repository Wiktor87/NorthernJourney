# Northern Journey

**A Data-Driven Norse Fishing Village Management Game**

![Northern Journey](https://img.shields.io/badge/Status-Alpha-blue) ![React](https://img.shields.io/badge/React-19.2-61dafb) ![Phaser](https://img.shields.io/badge/Phaser-3-ff6600) ![Vite](https://img.shields.io/badge/Vite-7.2-646cff)

## 📖 About

Northern Journey is an isometric resource management and survival game set in a harsh Norse fishing village. Guide your people through bitter winters, mythical encounters, and the path from struggling village to Viking kingdom.

**Key Features:**
- **Isometric Phaser 3 Game Canvas** - Beautiful isometric rendering with building placement
- **React UI Overlays** - Clean, responsive UI for resource management and dialogues
- **Data-Driven Content System** - Add buildings, creatures, events, and dialogues via JSON files—no coding required!
- **Branching Dialogues** - Encounter trolls, gnomes, and other mythical beings with meaningful choices
- **Seasonal Cycles** - Each season affects resource production and spawns unique events
- **Story Progression** - Evolve from village → settlement → town → kingdom
- **Save/Load System** - Your progress is automatically saved to local storage

## 🎮 Play Now

[**Play Northern Journey on GitHub Pages**](https://wiktor87.github.io/NorthernJourney/)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm (comes with Node.js)

### Installation & Running

```bash
# Clone the repository
git clone https://github.com/Wiktor87/NorthernJourney.git
cd NorthernJourney

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The game will open at `http://localhost:5173/`

## 🎯 How to Play

### Basic Controls
- **WASD / Arrow Keys**: Pan camera around the village
- **Mouse**: Click to interact with tiles and buildings
- **End Turn Button**: Process the turn and advance time
- **Build Button**: Open building menu

### Gameplay Loop

1. **Manage Resources**: Keep track of food, wood, morale, and population
2. **Build Structures**: Place buildings to increase production and capacity
3. **Survive Events**: Make choices during random events that affect your village
4. **Encounter Creatures**: Meet trolls, gnomes, and draugr with branching dialogues
5. **Progress Through Eras**: Grow from village to settlement to town to kingdom

### Victory & Defeat

- **Game Over**: Occurs when all villagers die (starvation) or morale reaches 0
- **Goal**: Survive as many turns as possible and advance through eras

## 🛠️ For Content Creators

**No coding required!** Northern Journey is designed for easy content modification.

### 📝 For Writers: Adding Content

All game content is in JSON files in `src/data/`:

- **Events** (`src/data/events/`) - Add random events, seasonal events, and story beats
- **Dialogues** (`src/data/dialogues/`) - Create branching conversation trees
- **Lore** - Integrated into events and dialogues

See [CONTENT_GUIDE.md](./CONTENT_GUIDE.md) for complete instructions.

**Example**: Adding a new random event:
```json
{
  "id": "mysterious_fog",
  "title": "Strange Fog",
  "description": "An eerie fog rolls in from the sea...",
  "probability": 0.1,
  "season": ["autumn", "winter"],
  "effects": {
    "morale": -5
  }
}
```

### 🎨 For Artists: Replacing Artwork

Currently using placeholder colored rectangles. Replace with your art:

1. Create PNG files following specifications in `src/assets/README.md`
2. Place in appropriate directory (e.g., `src/assets/sprites/buildings/`)
3. Match the naming convention (e.g., `fishing_hut.png`)
4. Refresh the game - your art appears automatically!

**Tile Specs**: 64x32 pixels (isometric diamond)  
**Building Specs**: 64x48 base size (varies by building)  
**Creature Specs**: 32-64 pixels square  

See [src/assets/README.md](./src/assets/README.md) for complete specifications.

### 🏗️ For Game Designers: Adding Buildings

Edit `src/data/buildings.json`:

```json
{
  "id": "mead_hall",
  "name": "Mead Hall",
  "description": "A place for warriors to feast and sing.",
  "era": "settlement",
  "cost": {
    "wood": 40,
    "stone": 20
  },
  "effects": {
    "morale": 15
  },
  "sprite": "buildings/mead_hall"
}
```

Buildings automatically appear in the build menu when requirements are met!

### 🐉 For Creature Designers: Adding Encounters

Edit `src/data/creatures.json`:

```json
{
  "id": "ice_giant",
  "name": "Ice Giant",
  "hostility": "hostile",
  "spawn_conditions": {
    "season": ["winter"],
    "min_era": "settlement"
  },
  "combat_stats": {
    "health": 150,
    "attack": 20
  }
}
```

See [CONTENT_GUIDE.md](./CONTENT_GUIDE.md) for complete guide.

## 🔧 For Developers

### Architecture Overview

```
src/
├── game/                    # Phaser 3 game code
│   ├── config.js           # Phaser configuration
│   ├── EventBridge.js      # React ↔ Phaser communication
│   ├── PhaserGame.jsx      # React wrapper for Phaser
│   ├── scenes/             # Phaser scenes
│   │   ├── BootScene.js    # Asset loading
│   │   ├── MainMenuScene.js
│   │   └── VillageScene.js # Main gameplay
│   └── systems/            # Game logic systems
│       ├── ResourceManager.js
│       ├── BuildingSystem.js
│       ├── EventSystem.js
│       ├── DialogueSystem.js
│       ├── SeasonSystem.js
│       └── CreatureSystem.js
│
├── components/              # React UI components
│   ├── GameContainer.jsx   # Main container
│   ├── ResourcePanel.jsx   # Resource display
│   ├── BuildMenu.jsx       # Building selection
│   ├── DialogueBox.jsx     # Branching dialogues
│   └── EventPopup.jsx      # Event notifications
│
├── data/                    # Content files (JSON)
│   ├── buildings.json
│   ├── creatures.json
│   ├── events/
│   │   ├── random-events.json
│   │   ├── seasonal-events.json
│   │   └── story-events.json
│   ├── dialogues/
│   ├── seasons.json
│   ├── progression.json
│   └── config.json
│
└── assets/                  # Art and audio
    └── README.md           # Asset specifications
```

### Key Technologies

- **Phaser 3** - Game engine for isometric rendering
- **React 19** - UI framework
- **Vite 7** - Build tool & dev server
- **LocalStorage** - Save/load functionality

### Communication Layer

The `EventBridge` enables bidirectional communication between Phaser and React:

```javascript
// Phaser emits to React
eventBridge.emit('resources:updated', { food: 10, wood: 5 });

// React listens
eventBridge.on('resources:updated', (data) => {
  updateUI(data);
});

// React emits to Phaser
eventBridge.emit('building:select', { buildingId: 'fishing_hut' });
```

### Game Systems

Each system is modular and loads data from JSON:

- **ResourceManager**: Tracks and manages all resources
- **BuildingSystem**: Handles building placement, validation, and production
- **EventSystem**: Triggers random and story events
- **DialogueSystem**: Manages branching conversation trees
- **SeasonSystem**: Handles seasonal cycles and effects
- **CreatureSystem**: Spawns and manages creature encounters

### Extending the Game

1. **Adding New Resource Types**: Edit `src/data/resources.json`
2. **Adding New Seasons**: Edit `src/data/seasons.json`
3. **Modifying Game Balance**: Edit `src/data/config.json`
4. **Custom Game Systems**: Extend existing systems or create new ones

See the codebase—all files are heavily commented!

## 📦 Deployment

### GitHub Pages (Automatic)

Pushes to `main` automatically deploy via GitHub Actions:

1. Go to Settings → Pages
2. Set Source to `gh-pages` branch
3. Push to `main` branch
4. Game deploys automatically!

### Manual Deployment

```bash
npm run deploy
```

## 🗺️ Roadmap

- [x] Isometric tilemap with Phaser 3
- [x] Building placement system
- [x] Resource management
- [x] Random events
- [x] Seasonal cycles
- [x] Creature encounters
- [x] Branching dialogues
- [x] Save/load system
- [x] Data-driven content system
- [ ] Combat system
- [ ] Trading system
- [ ] Multiple maps/expeditions
- [ ] More buildings and creatures
- [ ] Achievement system
- [ ] Sound effects and music
- [ ] Multiplayer (future)

## 📝 Documentation

- **[CONTENT_GUIDE.md](./CONTENT_GUIDE.md)** - Complete guide for adding content without coding
- **[src/assets/README.md](./src/assets/README.md)** - Asset specifications for artists
- **Code Comments** - All code is heavily documented

## 🤝 Contributing

Contributions are welcome! Whether you're a:

- **Writer**: Add events, dialogues, and lore
- **Artist**: Replace placeholder art with custom sprites
- **Designer**: Balance buildings and create new content
- **Developer**: Improve systems and add features

See [CONTENT_GUIDE.md](./CONTENT_GUIDE.md) for non-coding contributions.

## 📄 License

This project is open source and available for modification and expansion.

## 🙏 Acknowledgments

- Phaser 3 framework
- React team
- Norse mythology and history

---

**May the gods watch over Fjordheim!** ⚔️ ❄️ 🏔️
