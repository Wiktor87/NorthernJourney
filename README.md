# Northern Journey

**A Norse Fishing Village Survival Game**

![Northern Journey](https://img.shields.io/badge/Status-Alpha-blue) ![Phaser](https://img.shields.io/badge/Phaser-3.90-ff6600) ![Vanilla JS](https://img.shields.io/badge/Vanilla-JavaScript-f7df1e)

## 📖 About

Northern Journey is a simple, browser-based isometric survival game set in a harsh Norse fishing village. Guide your people through bitter winters, manage resources, and make crucial decisions to survive.

**Key Features:**
- **Pure Phaser 3** - Simple, working game with no build tools required
- **Isometric Village Map** - Beautiful snow-covered village with trees and buildings
- **Norse UI** - Dark wood aesthetic with resource panels and action buttons
- **Turn-Based Gameplay** - Click "End Day" to advance time and trigger events
- **Interactive Events** - Make choices that affect your village
- **Works on GitHub Pages** - No npm, no React, no Vite - just open index.html!

## 🎮 Play Now

[**Play Northern Journey on GitHub Pages**](https://wiktor87.github.io/NorthernJourney/)

## 🚀 Quick Start

### Option 1: Open Directly (No Setup!)
```bash
# Clone the repository
git clone https://github.com/Wiktor87/NorthernJourney.git
cd NorthernJourney

# Open in browser
open index.html
# or double-click index.html in your file explorer
```

### Option 2: Local Server
```bash
# Python 3
python3 -m http.server 8080

# Node.js (if you have it)
npx http-server

# Then open http://localhost:8080
```

## 🎯 How to Play

### Basic Controls
- **Click tiles**: Select tiles on the map (yellow diamond indicator appears)
- **Drag to pan**: Hold and drag the mouse to move the camera
- **Mouse wheel**: Zoom in and out (optional)
- **END DAY button**: Advance to the next day
- **Action buttons**: Click Build, Manage, or Rituals buttons in the right panel

### Gameplay
1. **Monitor Resources**: Keep track of Fuel (Driftwood, Timber) and Food in the left panel
2. **Watch Status Meters**: WARMTH, SUSTENANCE, and DREAD at the top
3. **Advance Days**: Click "END DAY" to progress - resources change, events trigger
4. **Make Choices**: When events appear, choose your response carefully
5. **Survive**: Keep your village alive through the harsh northern winters!

## 🛠️ Project Structure

```
NorthernJourney/
├── index.html          # Single HTML file - loads everything
├── css/
│   └── style.css       # Norse UI styling (dark wood theme)
├── js/
│   └── game.js         # All game logic in one file (376 lines)
├── assets/
│   ├── tiles/          # T_Ground_Snow_01.png, T_Ground_Snow_02.png
│   ├── trees/          # T_Tree_Pine_Snow_01-05.png (5 variations)
│   └── buildings/      # T_ResidentialHouse_01-02.png, T_Well_02.png
└── lib/
    └── phaser.min.js   # Phaser 3.90.0 (local copy, 1.2MB)
```

**Total Code:** 869 lines (141 HTML + 352 CSS + 376 JS)

## 🎨 Features Implemented

### ✅ Game World
- 15x15 isometric tile grid with snow ground textures
- Random placement of trees (5 sprite variations)
- Random placement of houses (2 sprite variations)
- Central well structure
- Proper isometric depth sorting

### ✅ Camera Controls
- Drag to pan the map
- Mouse wheel to zoom (0.5x to 2x)
- Camera bounds to prevent going off-map

### ✅ Tile Interaction
- Click detection on isometric tiles
- Yellow diamond selection indicator
- Grid coordinate display in event log

### ✅ UI Panels
**Top Bar:**
- Date display (Deep Winter, Day X)
- Weather indicator
- Population count
- Three status meters with icons and progress bars

**Left Panel - Resources:**
- FUEL: Driftwood, Timber
- FOOD: Dried Fish, Icicle Fish, Porridge, Livestock

**Right Panel - Actions:**
- BUILD: Smokehouse, Palisade, Pyre buttons
- MANAGE: Jobs, Rationing buttons
- RITUALS: Tell Saga, Sacrifice, Feast buttons

**Bottom Bar:**
- Scrolling event log
- Large END DAY button

### ✅ Game Systems
- Turn-based day/night cycle
- Resource management (increase/decrease over time)
- Status meters that change (warmth, sustenance, dread)
- Random event system with 3 events
- Multiple choice decisions
- Event logging

## 🎯 All Sprites Utilized

Every sprite uploaded to the repo is used in the game:
- ✅ **T_Ground_Snow_01.png** - Ground tile variation 1
- ✅ **T_Ground_Snow_02.png** - Ground tile variation 2
- ✅ **T_Tree_Pine_Snow_01.png** - Tree variation 1
- ✅ **T_Tree_Pine_Snow_02.png** - Tree variation 2
- ✅ **T_Tree_Pine_Snow_03.png** - Tree variation 3
- ✅ **T_Tree_Pine_Snow_04.png** - Tree variation 4
- ✅ **T_Tree_Pine_Snow_05.png** - Tree variation 5
- ✅ **T_ResidentialHouse_Snow_01.png** - House variation 1
- ✅ **T_ResidentialHouse_Snow_02.png** - House variation 2
- ✅ **T_Well_Snow_02.png** - Village well

## 📦 Deployment

### GitHub Pages (Automatic)

The game automatically deploys to GitHub Pages when you push to `main`:

1. Workflow: `.github/workflows/deploy.yml`
2. No build step required - deploys static files directly
3. URL: `https://wiktor87.github.io/NorthernJourney`

### Manual Deployment

Just upload these files to any web server:
- `index.html`
- `css/style.css`
- `js/game.js`
- `assets/` folder (with all sprites)
- `lib/phaser.min.js`

No compilation, no npm install, no build process!
