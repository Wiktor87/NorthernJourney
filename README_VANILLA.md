# Northern Journey - Vanilla JavaScript Version

A Norse fishing village survival game built with Phaser 3. This version runs entirely in the browser with no build tools required!

## How to Play

### Option 1: Direct File Open (Simple)
1. Download or clone this repository
2. Open `index.html` directly in your web browser (double-click the file)
3. Start playing!

### Option 2: Local Web Server (Recommended)
For better compatibility, serve the files using a local web server:

```bash
# Using Python 3
python3 -m http.server 8080

# Using Python 2
python -m SimpleHTTPServer 8080

# Using Node.js http-server (install globally first: npm install -g http-server)
http-server -p 8080

# Using PHP
php -S localhost:8080
```

Then open http://localhost:8080 in your browser.

## Project Structure

```
NorthernJourney/
├── index.html          ← Open this file to play!
├── assets/             ← Game sprites (snow tiles, trees, buildings)
├── js/                 ← Game code (vanilla JavaScript)
│   ├── scenes/         ← Phaser game scenes
│   ├── systems/        ← Game systems (resources, buildings, etc.)
│   └── ...
├── css/                ← Styling
├── lib/                ← Phaser 3.90.0 library
└── src/data/           ← JSON configuration files
```

## Features

- ✅ **No build tools required** - Just open index.html!
- ✅ **Custom snow-themed sprites** - All sprites properly loaded and scaled
- ✅ **Resource management** - Food, wood, population, morale
- ✅ **Building system** - Place and upgrade buildings
- ✅ **Seasonal cycles** - Survive harsh winters
- ✅ **Random events** - Dynamic storytelling
- ✅ **Save/Load system** - Uses localStorage

## Controls

- **WASD or Arrow Keys** - Pan camera
- **Mouse Click** - Interact with buildings and UI
- **End Turn button** - Advance to next turn
- **Build button** - Open building menu

## Technical Details

- **Game Engine**: Phaser 3.90.0
- **No frameworks**: Pure vanilla JavaScript (no React, no Vite)
- **No bundlers**: All scripts loaded via standard `<script>` tags
- **Audio disabled**: `audio: { noAudio: true }` to prevent console spam

## Sprite Scaling

Custom sprites are scaled appropriately:
- **Ground tiles**: 0.25x scale
- **Trees**: 0.3x scale  
- **Buildings**: 0.35x scale

## Browser Compatibility

Works in all modern browsers that support:
- ES6 JavaScript
- Canvas/WebGL
- LocalStorage

Tested on: Chrome, Firefox, Edge, Safari

## Credits

Game developed as a Norse-themed village survival simulation with isometric graphics.
