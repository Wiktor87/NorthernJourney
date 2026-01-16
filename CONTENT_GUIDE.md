# Content Guide for Northern Journey

This guide explains how to add new content to Northern Journey without coding. The game is **data-driven**, meaning all game content (buildings, creatures, events, dialogues) is defined in JSON files that are automatically loaded by the game.

## Table of Contents

1. [Overview](#overview)
2. [Adding New Buildings](#adding-new-buildings)
3. [Adding New Creatures](#adding-new-creatures)
4. [Adding New Events](#adding-new-events)
5. [Creating Dialogue Trees](#creating-dialogue-trees)
6. [Modifying Game Balance](#modifying-game-balance)
7. [Adding New Tile Types](#adding-new-tile-types)
8. [Asset Specifications](#asset-specifications)

---

## Overview

All game content is stored in the `src/data/` directory:

```
src/data/
├── buildings.json          # All building definitions
├── resources.json          # Resource types
├── creatures.json          # Creature definitions
├── events/
│   ├── random-events.json  # Random events per season/era
│   ├── seasonal-events.json # Automatic seasonal events
│   └── story-events.json   # Story progression events
├── dialogues/
│   ├── creatures/          # Creature encounter dialogues
│   ├── events/             # Event-triggered dialogues
│   └── npcs/               # NPC conversations (future)
├── seasons.json            # Seasonal effects
├── progression.json        # Era requirements and unlocks
└── config.json             # Game balance constants
```

**Important**: After editing JSON files, refresh your browser to see changes!

---

## Adding New Buildings

Buildings are defined in `src/data/buildings.json`.

### Basic Building Structure

```json
{
  "id": "unique_building_id",
  "name": "Display Name",
  "description": "What this building does",
  "era": "village",
  "cost": {
    "wood": 10,
    "stone": 5
  },
  "production": {
    "food": 2
  },
  "consumption": {},
  "effects": {},
  "workers": {
    "min": 0,
    "max": 2
  },
  "size": {
    "width": 1,
    "height": 1
  },
  "sprite": "buildings/unique_building_id",
  "buildTime": 1,
  "unlocks": [],
  "upgrades_to": null,
  "placement_rules": []
}
```

### Field Explanations

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (no spaces) |
| `name` | string | Display name shown to player |
| `description` | string | Flavor text explaining the building |
| `era` | string | Required era: `village`, `settlement`, `town`, or `kingdom` |
| `cost` | object | Resources required to build |
| `production` | object | Resources produced per turn |
| `consumption` | object | Resources consumed per turn |
| `effects` | object | Special effects (e.g., `morale: 10`, `population_cap: 5`) |
| `workers` | object | Min/max workers that can be assigned |
| `size` | object | Grid size (width x height) |
| `sprite` | string | Path to sprite (without extension) |
| `buildTime` | number | Turns to construct |
| `unlocks` | array | Building IDs unlocked by this building |
| `upgrades_to` | string | Building ID this upgrades to (or `null`) |
| `placement_rules` | array | Special placement requirements |

### Placement Rules

Available placement rules:
- `"adjacent_to_water"` - Must be next to water tile
- `"not_adjacent_to_water"` - Cannot be next to water
- `"can_build_on_water"` - Can be placed on water tiles
- `"can_build_on_mountain"` - Can be placed on mountains

### Example: Adding a Mead Hall

```json
{
  "id": "mead_hall",
  "name": "Mead Hall",
  "description": "A place for warriors to drink and celebrate victories.",
  "era": "settlement",
  "cost": {
    "wood": 30,
    "stone": 15
  },
  "production": {},
  "consumption": {
    "food": 2
  },
  "effects": {
    "morale": 15
  },
  "workers": {
    "min": 0,
    "max": 1
  },
  "size": {
    "width": 2,
    "height": 1
  },
  "sprite": "buildings/mead_hall",
  "buildTime": 2,
  "unlocks": ["feast_hall"],
  "upgrades_to": null,
  "placement_rules": []
}
```

### Steps to Add a New Building

1. Open `src/data/buildings.json`
2. Add your building definition to the `buildings` array
3. Create a sprite file at `src/assets/sprites/buildings/{id}.png` (see [Asset Specifications](#asset-specifications))
4. Refresh the game
5. Your building will appear in the Build menu!

---

## Adding New Creatures

Creatures are defined in `src/data/creatures.json`.

### Basic Creature Structure

```json
{
  "id": "unique_creature_id",
  "name": "Display Name",
  "description": "Description of the creature",
  "hostility": "neutral",
  "sprite": "creatures/unique_creature_id",
  "portrait": "portraits/unique_creature_id",
  "spawn_conditions": {
    "terrain": ["grass", "forest"],
    "season": ["autumn", "winter"],
    "min_era": "village"
  },
  "interactions": ["dialogue", "combat", "tribute"],
  "dialogue_file": "creatures/creature_dialogue.json",
  "combat_stats": {
    "health": 100,
    "attack": 15,
    "defense": 10
  },
  "drops": {
    "gold": 10,
    "special_item": 0.3
  },
  "tribute_cost": {
    "gold": 5,
    "food": 10
  },
  "trade_offers": []
}
```

### Field Explanations

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier |
| `name` | string | Display name |
| `description` | string | Flavor text |
| `hostility` | string | `friendly`, `neutral`, or `hostile` |
| `sprite` | string | Path to sprite |
| `portrait` | string | Path to dialogue portrait |
| `spawn_conditions` | object | When/where creature can spawn |
| `interactions` | array | Available interactions: `dialogue`, `combat`, `tribute`, `trade` |
| `dialogue_file` | string | Path to dialogue JSON (if applicable) |
| `combat_stats` | object | Health, attack, defense values |
| `drops` | object | Items/resources dropped on defeat |
| `tribute_cost` | object | Cost to pay tribute |
| `trade_offers` | array | Trading options (if friendly) |

### Hostility Types

- **friendly**: Will trade or help
- **neutral**: Can be negotiated with or fought
- **hostile**: Attacks on sight

### Example: Adding a Forest Spirit

```json
{
  "id": "forest_spirit",
  "name": "Forest Spirit",
  "description": "An ancient guardian of the woods, wise and mysterious.",
  "hostility": "friendly",
  "sprite": "creatures/forest_spirit",
  "portrait": "portraits/forest_spirit",
  "spawn_conditions": {
    "terrain": ["forest"],
    "season": ["spring", "summer"],
    "min_era": "village"
  },
  "interactions": ["dialogue", "trade"],
  "dialogue_file": "creatures/forest_spirit_encounter.json",
  "trade_offers": [
    {
      "gives": {
        "rare_herbs": 1
      },
      "wants": {
        "gold": 15
      }
    }
  ]
}
```

### Steps to Add a New Creature

1. Open `src/data/creatures.json`
2. Add your creature definition to the `creatures` array
3. Create sprite and portrait files (see [Asset Specifications](#asset-specifications))
4. Create a dialogue file in `src/data/dialogues/creatures/` (see [Creating Dialogue Trees](#creating-dialogue-trees))
5. Refresh the game
6. Your creature will spawn based on its spawn conditions!

---

## Adding New Events

Events are defined in three categories:

### Random Events (`src/data/events/random-events.json`)

These events have a chance to occur each turn based on season and era.

```json
{
  "id": "unique_event_id",
  "title": "Event Title",
  "description": "What happens during this event",
  "era": ["village", "settlement"],
  "season": ["winter"],
  "probability": 0.15,
  "conditions": {},
  "effects": {
    "food": -5,
    "morale": -10
  },
  "choices": [
    {
      "text": "Choice 1 text",
      "effects": {
        "morale": 5
      }
    },
    {
      "text": "Choice 2 text",
      "requires": {
        "gold": 10
      },
      "risk": 0.5,
      "success_effects": {
        "food": 20
      },
      "failure_effects": {
        "gold": -10
      },
      "failure_message": "The plan failed..."
    }
  ],
  "triggers_dialogue": null
}
```

### Field Explanations

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier |
| `title` | string | Event title shown to player |
| `description` | string | Event description |
| `era` | array | Eras when event can occur |
| `season` | array | Seasons when event can occur |
| `probability` | number | Chance of occurring (0.0 to 1.0) |
| `effects` | object | Immediate resource changes |
| `choices` | array | Player choices (empty for automatic events) |

### Choice Options

- **Simple Choice**: Just `text` and `effects`
- **Resource Requirement**: Add `requires` object
- **Risk-Based**: Add `risk` (0-1), `success_effects`, `failure_effects`, and optional `failure_message`

### Example: Adding a Traveling Merchant Event

```json
{
  "id": "traveling_merchant",
  "title": "Merchant Caravan",
  "description": "A merchant caravan arrives, offering exotic goods.",
  "era": ["settlement", "town"],
  "season": ["spring", "summer", "autumn"],
  "probability": 0.12,
  "effects": {},
  "choices": [
    {
      "text": "Buy food supplies",
      "requires": {
        "gold": 5
      },
      "effects": {
        "gold": -5,
        "food": 15
      }
    },
    {
      "text": "Buy rare materials",
      "requires": {
        "gold": 10
      },
      "effects": {
        "gold": -10,
        "stone": 10
      }
    },
    {
      "text": "Send them away",
      "effects": {}
    }
  ]
}
```

### Seasonal Events (`src/data/events/seasonal-events.json`)

These trigger automatically when a season changes.

```json
{
  "id": "spring_thaw",
  "title": "Spring Thaw",
  "description": "The ice melts and life returns to the land.",
  "season": "spring",
  "effects": {
    "morale": 10
  },
  "automatic": true
}
```

### Story Events (`src/data/events/story-events.json`)

These trigger once when specific conditions are met.

```json
{
  "id": "first_visitor",
  "title": "First Visitor",
  "description": "A traveler brings news of other settlements.",
  "trigger_conditions": {
    "population": 10,
    "flag": "!first_visitor_met"
  },
  "effects": {
    "morale": 5
  },
  "sets_flag": "first_visitor_met",
  "unlocks": ["trade_routes"]
}
```

---

## Creating Dialogue Trees

Dialogues are JSON files in `src/data/dialogues/` that define branching conversations.

### Basic Dialogue Structure

```json
{
  "id": "dialogue_id",
  "start_node": "intro",
  "nodes": {
    "intro": {
      "speaker": "character_name",
      "portrait": "character_portrait",
      "text": "Dialogue text here...",
      "choices": [
        {
          "text": "Player response option 1",
          "next": "node_id_to_go_to"
        },
        {
          "text": "Player response option 2",
          "requires": {
            "gold": 10
          },
          "effects": {
            "gold": -10,
            "reputation": 5
          },
          "next": "another_node_id"
        }
      ]
    },
    "another_node": {
      "speaker": "character_name",
      "portrait": "character_happy",
      "text": "More dialogue...",
      "end": true
    }
  }
}
```

### Node Types

**Standard Node**:
```json
{
  "speaker": "troll",
  "portrait": "troll_angry",
  "text": "WHO DARES ENTER MY DOMAIN?",
  "choices": [...]
}
```

**Combat Node**:
```json
{
  "action": "start_combat",
  "enemy": "troll",
  "on_win": "victory_node",
  "on_lose": "defeat_node"
}
```

**Narrator Node**:
```json
{
  "speaker": "narrator",
  "portrait": null,
  "text": "You flee from the encounter...",
  "end": true
}
```

### Choice Options

**Simple Choice**:
```json
{
  "text": "Greet them warmly",
  "next": "greeting_node"
}
```

**Choice with Requirements**:
```json
{
  "text": "Offer a trade",
  "requires": {
    "food": 20,
    "gold": 5
  },
  "effects": {
    "food": -20,
    "gold": -5,
    "rare_item": 1
  },
  "next": "trade_complete"
}
```

**Skill Check Choice**:
```json
{
  "text": "Attempt to persuade them",
  "skill_check": {
    "diplomacy": 5
  },
  "success": "persuasion_success",
  "failure": "persuasion_fail"
}
```

### Example: Complete Dialogue Tree

```json
{
  "id": "hermit_encounter",
  "start_node": "greeting",
  "nodes": {
    "greeting": {
      "speaker": "hermit",
      "portrait": "hermit_neutral",
      "text": "Hmm? Visitors? I haven't seen outsiders in years. What brings you to my mountain?",
      "choices": [
        {
          "text": "We seek wisdom, elder.",
          "next": "wisdom_path"
        },
        {
          "text": "We need supplies. Can you help?",
          "next": "trade_path"
        },
        {
          "text": "We're just passing through.",
          "next": "farewell"
        }
      ]
    },
    "wisdom_path": {
      "speaker": "hermit",
      "portrait": "hermit_wise",
      "text": "Wisdom, eh? Very well. The mountain whispers secrets to those who listen. Winter approaches—prepare your stores, young one.",
      "effects": {
        "lore_unlocked": "hermit_wisdom",
        "morale": 5
      },
      "next": "offer_trade"
    },
    "trade_path": {
      "speaker": "hermit",
      "portrait": "hermit_merchant",
      "text": "I have little, but I can spare some dried meat for... let's say 10 gold?",
      "choices": [
        {
          "text": "Agreed. Here's the gold.",
          "requires": {
            "gold": 10
          },
          "effects": {
            "gold": -10,
            "food": 15
          },
          "next": "trade_complete"
        },
        {
          "text": "Too expensive. Farewell.",
          "next": "farewell"
        }
      ]
    },
    "trade_complete": {
      "speaker": "hermit",
      "portrait": "hermit_pleased",
      "text": "A fair trade. May it sustain you through the cold months.",
      "end": true
    },
    "farewell": {
      "speaker": "hermit",
      "portrait": "hermit_neutral",
      "text": "Safe travels, then. The mountain is unforgiving to the unprepared.",
      "end": true
    }
  }
}
```

### Steps to Add a New Dialogue

1. Create a new JSON file in `src/data/dialogues/creatures/` (or appropriate subfolder)
2. Define your dialogue tree with nodes and choices
3. Reference the dialogue file in a creature or event definition
4. Refresh the game
5. Trigger the dialogue through the game!

---

## Modifying Game Balance

Game balance constants are in `src/data/config.json`.

```json
{
  "starting_resources": {
    "food": 15,
    "wood": 10,
    "stone": 0,
    "gold": 0,
    "population": 5,
    "morale": 70
  },
  "consumption_rates": {
    "food_per_villager": 1,
    "wood_per_building_maintenance": 0.1
  },
  "production_multipliers": {
    "fishing": 2,
    "woodcutting": 2,
    "farming": 3,
    "mining": 1.5
  },
  "season_duration_turns": 8,
  "event_check_chance": 0.4,
  "creature_spawn_chance": 0.1
}
```

### Common Adjustments

**Make the game easier:**
- Increase `starting_resources`
- Decrease `food_per_villager`
- Increase `production_multipliers`
- Decrease `event_check_chance` (fewer random events)

**Make the game harder:**
- Decrease `starting_resources`
- Increase `food_per_villager`
- Decrease `production_multipliers`
- Increase `event_check_chance`

---

## Adding New Tile Types

To add new terrain types:

1. **Generate the placeholder** in `src/game/scenes/BootScene.js`:
```javascript
// Add to generatePlaceholders() method
const forestTexture = this.add.graphics();
forestTexture.fillStyle(0x2d5016, 1); // Dark green
forestTexture.fillRect(0, 0, 64, 32);
forestTexture.generateTexture('tile_forest', 64, 32);
forestTexture.destroy();
```

2. **Use in map generation** in `src/game/scenes/VillageScene.js`:
```javascript
// In generateMapData() method
if (/* your condition */) {
  row.push('forest');
}
```

3. **Create final art** (see [Asset Specifications](#asset-specifications))

---

## Asset Specifications

See `src/assets/README.md` for complete asset specifications including:

- Tile dimensions (64x32 isometric)
- Building sprite sizes
- Character and creature sprites
- Portrait specifications
- UI element guidelines
- Audio file formats

### Quick Reference

**Tiles**: 64x32 PNG, isometric diamond shape
**Buildings**: 64x48 base, multiples for larger buildings
**Creatures**: 32-64 pixels square
**Portraits**: 128x128 PNG

---

## Tips for Content Creators

### Testing Your Content

1. **Start small**: Add one building/creature/event at a time
2. **Test immediately**: Refresh after each change to verify it works
3. **Check console**: Open browser developer tools (F12) to see error messages
4. **Validate JSON**: Use a JSON validator to check for syntax errors

### Common Mistakes

❌ **Forgetting commas** between JSON objects
✅ Always add commas between array items and object properties

❌ **Typos in IDs** - `"fisher_hut"` vs `"fishing_hut"`
✅ Double-check ID references match exactly

❌ **Missing required fields**
✅ Include all required fields for each content type

❌ **Invalid JSON syntax**
✅ Use a JSON validator or editor with syntax checking

### Best Practices

1. **Use descriptive IDs**: `"longhouse"` not `"bldg1"`
2. **Write flavorful descriptions**: Immerse players in the Norse atmosphere
3. **Balance carefully**: Playtest after adding content
4. **Keep backups**: Save working versions before major changes
5. **Document your additions**: Add comments in a separate doc

---

## Advanced Topics

### Conditional Events

Use flags and conditions to create story progressions:

```json
{
  "trigger_conditions": {
    "population": 20,
    "flag": "first_raid_survived",
    "era": "settlement"
  }
}
```

### Chain Dialogues

Reference dialogue files from events:

```json
{
  "triggers_dialogue": "events/special_encounter.json"
}
```

### Custom Effects

While most effects are predefined, you can add custom effects that the game systems recognize:

- `population_cap` - Increases max population
- `storage_capacity` - Increases resource storage
- `defense` - Provides defensive bonus
- `morale` - Passive morale boost

---

## Getting Help

- **Check the examples**: Look at existing content in the JSON files
- **Read error messages**: Browser console (F12) shows helpful errors
- **Test incrementally**: Add content piece by piece
- **Ask for help**: Open an issue on GitHub with your question

---

**Happy content creating! May your additions bring glory to Fjordheim!** ⚔️
