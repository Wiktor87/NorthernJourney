# Asset Specifications

This directory contains all game artwork, tilemaps, and audio files for Northern Journey.

## Directory Structure

```
assets/
├── tilemaps/        # Tiled map editor JSON exports
├── tilesets/        # Tileset sprite sheets
├── sprites/
│   ├── buildings/   # Building sprites
│   ├── characters/  # Character/villager sprites
│   ├── creatures/   # Creature sprites (trolls, gnomes, draugr)
│   └── effects/     # Visual effects (particles, animations)
├── portraits/       # Character portraits for dialogue
├── ui/              # UI elements and buttons
└── audio/           # Sound effects and music
```

## Tile Specifications

### Isometric Tiles
- **Format**: PNG with transparency (RGBA)
- **Dimensions**: 64x32 pixels (isometric diamond shape)
- **Naming**: `tile_{type}.png` (e.g., `tile_grass.png`, `tile_water.png`)

### Required Tile Types
- `grass` - Green grass/land tiles
- `water` - Blue water tiles
- `mountain` - Gray/brown mountain tiles
- `forest` - Green tiles with trees (future)
- `snow` - White/light blue for winter (future)

## Building Sprites

### Specifications
- **Format**: PNG with transparency
- **Base Dimensions**: 64x48 pixels (for 1x1 buildings)
- **Larger Buildings**: Multiple of base (e.g., 2x1 = 128x48, 3x2 = 192x96)
- **Anchor Point**: Bottom center (building sits on tile)
- **Naming**: `buildings/{building_id}.png` (e.g., `buildings/fishing_hut.png`)

### Required Buildings
1. **fishing_hut** (64x48) - Simple hut by water
2. **lumber_camp** (64x48) - Woodcutting area
3. **farm** (128x48) - Farm fields (2x1)
4. **storage** (64x48) - Storage building
5. **villager_hut** (64x48) - Dwelling
6. **longhouse** (192x96) - Large hall (3x2)
7. **palisade_wall** (64x48) - Wooden wall section

### Style Guidelines
- Norse/Viking aesthetic
- Weathered wood and stone textures
- Dark, earthy color palette
- Visible in isometric view from above

## Character Sprites

### Villagers
- **Dimensions**: 32x32 pixels
- **Format**: PNG with transparency
- **Naming**: `villager.png`, `villager_fisher.png`, etc.
- **Style**: Simple, recognizable silhouettes

### Animation Frames (Optional)
- Idle: 1-4 frames
- Walk: 4-8 frames
- Work: 2-4 frames

## Creature Sprites

### Specifications
- **Format**: PNG with transparency
- **Dimensions**: 
  - Small creatures (gnome): 32x32
  - Medium creatures: 48x48
  - Large creatures (troll): 64x64
- **Naming**: `creatures/{creature_id}.png`

### Required Creatures
1. **troll** (64x64) - Large, imposing figure
2. **gnome** (32x32) - Small, friendly character
3. **draugr** (48x48) - Undead warrior

### Portrait Specifications
- **Dimensions**: 128x128 pixels
- **Format**: PNG
- **Naming**: `portraits/{creature_id}_{expression}.png`
- **Example**: `portraits/troll_angry.png`, `portraits/gnome_friendly.png`

## UI Elements

### Specifications
- **Format**: PNG with transparency
- **Style**: Norse-themed borders and buttons
- **Color Scheme**: 
  - Primary: #4a7c3b (green)
  - Secondary: #3b5c7c (blue)
  - Accent: #8b4513 (brown)
  - Danger: #8b0000 (dark red)

### Required UI Elements
- Button backgrounds (normal, hover, pressed states)
- Panel borders and backgrounds
- Icons for resources (food, wood, stone, gold)
- Cursor variations (normal, build mode, invalid)

## Audio

### Sound Effects
- **Format**: MP3 or OGG
- **Sample Rate**: 44.1kHz
- **Bit Rate**: 128kbps minimum

### Required Sounds
- Button click
- Building placement
- Resource collection
- Turn end chime
- Event notification
- Dialogue advance
- Creature encounter
- Warning/alert

### Music
- **Format**: MP3 or OGG (looping)
- **Length**: 2-4 minutes per track
- **Mood**: Atmospheric, Norse-themed

### Required Tracks
1. Main menu theme
2. Village ambient (day)
3. Village ambient (night/winter)
4. Event music (tension)
5. Victory/achievement fanfare
6. Defeat music

## Tiled Map Editor

### Map Specifications
- **Tile Size**: 64x32 (isometric)
- **Map Size**: 12x10 tiles (or larger)
- **Format**: Export as JSON
- **Layers**:
  1. Ground (terrain)
  2. Buildings
  3. Decorations
  4. Collision/placement rules

### Exporting from Tiled
1. Create your map in Tiled Map Editor
2. Use isometric orientation
3. Set tile size to 64x32
4. Export as JSON (File → Export As → JSON)
5. Place in `assets/tilemaps/`

## Placeholder Art

Currently, the game uses colored rectangles as placeholders:
- **Grass**: Green (#4a7c3b)
- **Water**: Blue (#3b5c7c)
- **Mountain**: Gray (#6c6c6c)
- **Buildings**: Brown shades (#8b4513, #654321, etc.)
- **Creatures**: Red (hostile), Yellow (friendly)
- **Villagers**: White

Replace these by creating files with the same names as defined in the game code.

## Adding New Art

### To Replace Placeholder Art:
1. Create your PNG file following the specifications above
2. Name it according to the naming convention
3. Place it in the appropriate directory
4. The game will automatically load your custom art!

### To Add New Buildings/Creatures:
1. Add the definition to the appropriate JSON file:
   - `src/data/buildings.json` for buildings
   - `src/data/creatures.json` for creatures
2. Create the sprite following specifications
3. Place in `assets/sprites/buildings/` or `assets/sprites/creatures/`
4. The sprite path in JSON should match the file location

## Testing Your Art

After adding new artwork:
1. Refresh the game (`npm run dev`)
2. Check that sprites load correctly
3. Verify they're positioned properly on tiles
4. Test at different zoom levels (if implemented)

## Tools and Resources

### Recommended Tools
- **Pixel Art**: Aseprite, GIMP, Photoshop
- **Tiled Maps**: Tiled Map Editor (https://www.mapeditor.org/)
- **Audio**: Audacity, LMMS

### Useful Resources
- OpenGameArt.org - Free game assets
- itch.io - Game asset bundles
- Kenney.nl - Free game assets

## Questions?

If you need clarification on asset specifications or have suggestions for improvements, check the main `CONTENT_GUIDE.md` or open an issue in the repository.

---

**May your art bring Fjordheim to life!** 🎨
