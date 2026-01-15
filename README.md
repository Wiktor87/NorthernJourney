# Northern Journey

**A Norse fishing village resource management game**

![Northern Journey](https://img.shields.io/badge/Status-MVP-blue) ![React](https://img.shields.io/badge/React-18.3-61dafb) ![Vite](https://img.shields.io/badge/Vite-6.0-646cff)

## 📖 Game Summary

Northern Journey is an isometric browser-based resource management and strategy game set in a Norse fishing village called Fjordheim. Guide your villagers through the harsh northern winters, managing resources, making strategic decisions, and surviving random events.

### Core Features
- **Isometric Map Rendering**: 8x6 grid with water, grass, huts, villagers, and draugr
- **Resource Management**: Balance food, wood, and morale to survive
- **Turn-Based Gameplay**: Assign 5 villagers to fishing or woodcutting each turn
- **Random Events**: Dynamic events that affect resources and morale
- **Survival Mechanics**: Villagers die from starvation; game over if all die or morale reaches zero
- **Event Log**: Track your decisions and their consequences

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation & Running

```bash
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

### Deployment to GitHub Pages

This project is configured for easy deployment to GitHub Pages.

#### Manual Deployment

To manually deploy to GitHub Pages:

```bash
npm run deploy
```

This will build the project and push it to the `gh-pages` branch.

#### Automatic Deployment

The project includes a GitHub Actions workflow that automatically builds and deploys to GitHub Pages on every push to the `main` branch.

**To enable automatic deployment:**

1. Go to your repository's Settings → Pages
2. Under "Build and deployment", set:
   - **Source**: Deploy from a branch
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
3. Click Save

After the first push to `main`, your game will be available at:
`https://<username>.github.io/NorthernJourney/`

**Note**: The first deployment may take a few minutes. Check the "Actions" tab to monitor the deployment progress.

## 🎮 How to Play

1. **Start the Game**: The game begins with 5 villagers, 10 food, 5 wood, and 70 morale
2. **Assign Villagers**: Each turn, assign villagers to:
   - **Fishing**: Produces 2 food per villager
   - **Woodcutting**: Produces 2 wood per villager
3. **End Turn**: Click "End Turn" to process the turn
4. **Survive**: Each villager consumes 1 food per turn. Keep resources positive!
5. **Watch for Events**: Random events can help or hinder your progress

### Victory & Defeat
- **Game Over**: Occurs when all villagers die or morale reaches 0
- **Goal**: Survive as many turns as possible

## 🎨 For Artists: Replacing Artwork

All game artwork is stored in `/public/isometric/tiles/` as PNG files. Simply replace these files with your own artwork (keeping the same filenames):

### Tile Files
- `water.png` - Water tiles (fishing areas)
- `grass.png` - Grass/land tiles
- `hut.png` - Village huts
- `villager.png` - Villager icon
- `draugr.png` - Draugr (undead) icon

### Recommended Specifications
- **Format**: PNG with transparency (RGBA)
- **Dimensions**: 64x32 pixels (isometric diamond shape)
- **Style**: Keep tiles recognizable and distinct

### Testing Your Art
1. Replace the PNG files in `/public/isometric/tiles/`
2. Refresh your browser (Ctrl+R or Cmd+R)
3. Your new artwork will appear immediately!

No code changes needed - just replace the image files!

## ✍️ For Writers: Editing Lore & Events

All game text, lore, and events are stored in easy-to-edit files:

### Lore File
**Location**: `/src/lore/intro.md`

This Markdown file contains the game's introduction text. Edit it to change:
- Village name and backstory
- Game instructions
- Thematic flavor text

### Events File
**Location**: `/src/lore/events.json`

This JSON file defines all random events. Each event has:

```json
{
  "id": "unique_event_id",
  "title": "Event Title",
  "description": "What happens during this event",
  "probability": 0.15,
  "effects": {
    "food": 3,
    "wood": 0,
    "morale": 1
  }
}
```

**Fields:**
- `id`: Unique identifier (no spaces)
- `title`: Event name shown to player
- `description`: Event description shown to player
- `probability`: Chance of occurring (0.0 to 1.0, where 0.15 = 15% chance)
- `effects`: Resource changes (can be negative)
  - `food`: Change to food supply
  - `wood`: Change to wood supply
  - `morale`: Change to morale

### Adding New Events
1. Open `/src/lore/events.json`
2. Add a new event object to the `events` array
3. Save the file - changes appear immediately in development mode!

### Testing Your Changes
- Lore changes appear on game start
- Event changes take effect immediately
- Adjust `probability` values to make events more/less common

## 🛠️ For Developers: Code Structure

### Project Structure
```
/public/isometric/tiles/  # Artwork (PNG files)
/src/
  /components/           # React components
    GameScreen.jsx       # Main game container
    IsometricMap.jsx     # Map rendering
    ResourcePanel.jsx    # Resource display
    VillagerPanel.jsx    # Villager assignment
    EventLog.jsx         # Event history
  /lore/                 # Game content
    intro.md            # Introduction text
    events.json         # Random events
  App.jsx               # Main game logic & state
  App.css               # App styling
  index.css             # Global styles
  main.jsx              # Entry point
```

### Key Files to Modify

**Game Balance** (`/src/App.jsx`):
- `INITIAL_FOOD`, `INITIAL_WOOD`, `INITIAL_MORALE`, `INITIAL_POPULATION`
- `FOOD_PER_FISHER`, `WOOD_PER_CUTTER`
- `FOOD_CONSUMPTION_PER_VILLAGER`
- `MORALE_PENALTY_STARVATION`
- `RANDOM_EVENT_CHANCE`

**Map Layout** (`/src/App.jsx` - `generateMap()` function):
- Change map dimensions
- Modify tile placement

**Component Styling**:
- Each component has its own `.css` file
- Modify colors, layouts, and animations

### Code Comments
All code is heavily commented to explain:
- What each function does
- How game mechanics work
- Where to make common modifications

## 📦 Technologies Used

- **React 18.3** - UI framework
- **Vite 6.0** - Build tool & dev server
- **CSS3** - Styling & animations
- **JavaScript ES6+** - Game logic

## 🎯 Roadmap Ideas

Want to expand the game? Here are some ideas:

- [ ] Add more resource types (metal, stone, etc.)
- [ ] Implement building construction
- [ ] Add combat with draugr
- [ ] Create character progression/skills
- [ ] Implement seasons/weather systems
- [ ] Add trading mechanics
- [ ] Multiplayer support
- [ ] Save/load game functionality
- [ ] Achievement system
- [ ] Multiple villages

## 📝 License

This project is open source and available for modification and expansion.

## 🤝 Contributing

This MVP is designed to be easily modified. Feel free to:
- Replace artwork with your own
- Write new events and lore
- Adjust game balance
- Add new features

---

**May the gods watch over Fjordheim!** ⚔️
