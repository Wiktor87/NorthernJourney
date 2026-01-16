// Northern Journey - Main Game File
// All game logic in a single file for simplicity

// Game State
const gameState = {
    day: 1,
    season: 'Deep Winter',
    weather: 'Howling Gale',
    population: 16,
    sick: 4,
    warmth: 60,
    sustenance: 50,
    dread: 20,
    resources: {
        driftwood: 12,
        timber: 8,
        driedFish: 20,
        icicleFish: 5,
        porridge: 10,
        livestock: 3
    },
    selectedTile: null,
    tiles: []
};

// Phaser Configuration
const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 700,
    parent: 'game-canvas',
    backgroundColor: '#1a1a1e',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
};

// Initialize Phaser game
const phaserGame = new Phaser.Game(config);
let mainScene;
let groundLayer;
let objectsLayer;
let selectedTileGraphic;
let cameraControls = {
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    cameraStartX: 0,
    cameraStartY: 0
};

// Preload assets - Load from assets folder (Vite copies public/ to dist root)
function preload() {
    mainScene = this;
    
    // Load ground tiles
    this.load.image('ground_snow_1', 'assets/T_Ground_Snow_01.png');
    this.load.image('ground_snow_2', 'assets/T_Ground_Snow_02.png');
    
    // Load trees
    this.load.image('tree_1', 'assets/T_Tree_Pine_Snow_01.png');
    this.load.image('tree_2', 'assets/T_Tree_Pine_Snow_02.png');
    this.load.image('tree_3', 'assets/T_Tree_Pine_Snow_03.png');
    this.load.image('tree_4', 'assets/T_Tree_Pine_Snow_04.png');
    this.load.image('tree_5', 'assets/T_Tree_Pine_Snow_05.png');
    
    // Load buildings
    this.load.image('house_1', 'assets/T_ResidentialHouse_Snow_01.png');
    this.load.image('house_2', 'assets/T_ResidentialHouse_Snow_02.png');
    this.load.image('well', 'assets/T_Well_Snow_02.png');
}

// Create the game world
function create() {
    mainScene = this;
    
    // Create layers
    groundLayer = this.add.container(0, 0);
    objectsLayer = this.add.container(0, 0);
    
    // Create isometric map
    createIsometricMap();
    
    // Setup camera with increased zoom for better visibility
    this.cameras.main.setBounds(-500, -500, 2000, 2000);
    this.cameras.main.setZoom(1.5);
    this.cameras.main.centerOn(600, 350);
    
    // Setup input for tile selection
    this.input.on('pointerdown', onPointerDown);
    this.input.on('pointermove', onPointerMove);
    this.input.on('pointerup', onPointerUp);
    
    // Mouse wheel zoom (optional)
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
        const camera = this.cameras.main;
        const newZoom = Phaser.Math.Clamp(camera.zoom - deltaY * 0.001, 0.5, 2);
        camera.setZoom(newZoom);
    });
    
    // Create selection graphic
    selectedTileGraphic = this.add.graphics();
    selectedTileGraphic.lineStyle(3, 0xffff00, 1);
    
    console.log('Game created successfully!');
}

// Update loop
function update() {
    // Game loop updates can go here
}

// Create isometric map with all existing sprites
function createIsometricMap() {
    const tileWidth = 64;
    const tileHeight = 32;
    const mapWidth = 15;
    const mapHeight = 15;
    const startX = 600;
    const startY = 200;
    
    gameState.tiles = [];
    
    for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
            // Convert grid position to isometric screen position
            const isoX = startX + (x - y) * (tileWidth / 2);
            const isoY = startY + (x + y) * (tileHeight / 2);
            
            // Use both ground tile variations
            const tileKey = Math.random() > 0.5 ? 'ground_snow_1' : 'ground_snow_2';
            const tile = mainScene.add.image(isoX, isoY, tileKey);
            tile.setScale(0.35);
            tile.setInteractive();
            tile.setData('gridX', x);
            tile.setData('gridY', y);
            tile.setData('isoX', isoX);
            tile.setData('isoY', isoY);
            
            groundLayer.add(tile);
            gameState.tiles.push(tile);
            
            // Add trees using all 5 tree variations randomly
            if (Math.random() < 0.15) {
                const treeNum = Math.floor(Math.random() * 5) + 1;
                const tree = mainScene.add.image(isoX, isoY - 30, `tree_${treeNum}`);
                tree.setScale(0.45);
                tree.setDepth(isoY);
                objectsLayer.add(tree);
            }
            
            // Add houses using both house variations
            if (Math.random() < 0.05 && x > 3 && y > 3) {
                const houseNum = Math.random() > 0.5 ? 1 : 2;
                const house = mainScene.add.image(isoX, isoY - 40, `house_${houseNum}`);
                house.setScale(0.55);
                house.setDepth(isoY);
                objectsLayer.add(house);
            }
        }
    }
    
    // Add a well near center using the well sprite
    const centerX = Math.floor(mapWidth / 2);
    const centerY = Math.floor(mapHeight / 2);
    const wellIsoX = startX + (centerX - centerY) * (tileWidth / 2);
    const wellIsoY = startY + (centerX + centerY) * (tileHeight / 2);
    const well = mainScene.add.image(wellIsoX, wellIsoY - 35, 'well');
    well.setScale(0.5);
    well.setDepth(wellIsoY);
    objectsLayer.add(well);
}

// Input handlers
function onPointerDown(pointer) {
    if (pointer.button === 0) { // Left click
        cameraControls.isDragging = true;
        cameraControls.dragStartX = pointer.x;
        cameraControls.dragStartY = pointer.y;
        cameraControls.cameraStartX = mainScene.cameras.main.scrollX;
        cameraControls.cameraStartY = mainScene.cameras.main.scrollY;
        
        // Check if clicked on a tile
        const worldPoint = mainScene.cameras.main.getWorldPoint(pointer.x, pointer.y);
        let closestTile = null;
        let closestDist = Infinity;
        
        gameState.tiles.forEach(tile => {
            const dx = worldPoint.x - tile.getData('isoX');
            const dy = worldPoint.y - tile.getData('isoY');
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < closestDist && dist < 40) {
                closestDist = dist;
                closestTile = tile;
            }
        });
        
        if (closestTile && closestDist < 5) {
            selectTile(closestTile);
            cameraControls.isDragging = false; // Don't drag if clicking tile
        }
    }
}

function onPointerMove(pointer) {
    if (cameraControls.isDragging && pointer.isDown) {
        const deltaX = pointer.x - cameraControls.dragStartX;
        const deltaY = pointer.y - cameraControls.dragStartY;
        
        mainScene.cameras.main.scrollX = cameraControls.cameraStartX - deltaX;
        mainScene.cameras.main.scrollY = cameraControls.cameraStartY - deltaY;
    }
}

function onPointerUp(pointer) {
    cameraControls.isDragging = false;
}

function selectTile(tile) {
    gameState.selectedTile = tile;
    
    // Draw selection indicator
    selectedTileGraphic.clear();
    selectedTileGraphic.lineStyle(3, 0xffff00, 1);
    
    const x = tile.getData('isoX');
    const y = tile.getData('isoY');
    
    // Draw diamond shape around tile
    selectedTileGraphic.beginPath();
    selectedTileGraphic.moveTo(x, y - 16);
    selectedTileGraphic.lineTo(x + 32, y);
    selectedTileGraphic.lineTo(x, y + 16);
    selectedTileGraphic.lineTo(x - 32, y);
    selectedTileGraphic.closePath();
    selectedTileGraphic.strokePath();
    
    const gridX = tile.getData('gridX');
    const gridY = tile.getData('gridY');
    addLogEntry(`Selected tile at (${gridX}, ${gridY})`);
    
    console.log(`Tile selected at grid (${gridX}, ${gridY})`);
}

// Game API - exposed to HTML buttons
window.game = {
    endDay: function() {
        gameState.day++;
        
        // Update resources
        gameState.resources.driftwood += Math.floor(Math.random() * 3);
        gameState.resources.driedFish -= Math.floor(Math.random() * 5);
        
        // Update stats
        gameState.warmth = Math.max(0, Math.min(100, gameState.warmth - 5 + Math.random() * 3));
        gameState.sustenance = Math.max(0, Math.min(100, gameState.sustenance - 3 + Math.random() * 2));
        gameState.dread = Math.max(0, Math.min(100, gameState.dread + Math.random() * 2));
        
        updateUI();
        addLogEntry(`> Day ${gameState.day}: The cold wind howls...`);
        
        // Random event chance
        if (Math.random() < 0.3) {
            showEvent();
        }
        
        console.log(`Day ${gameState.day} ended`);
    },
    
    build: function(type) {
        addLogEntry(`> Building ${type}...`);
        console.log(`Building: ${type}`);
    },
    
    manage: function(type) {
        addLogEntry(`> Managing ${type}...`);
        console.log(`Managing: ${type}`);
    },
    
    ritual: function(type) {
        addLogEntry(`> Performing ritual: ${type}...`);
        console.log(`Ritual: ${type}`);
    },
    
    chooseEvent: function(choice) {
        document.getElementById('event-popup').style.display = 'none';
        addLogEntry(`> Choice made: Option ${choice + 1}`);
        console.log(`Event choice: ${choice}`);
    },
    
    selectEventOption: function(option) {
        document.getElementById('event-panel').style.display = 'none';
        addLogEntry(`> Event decision made: Option ${String.fromCharCode(65 + option)}`);
        console.log(`Event panel option: ${option}`);
    },
    
    showEventPanel: function() {
        document.getElementById('event-panel').style.display = 'block';
    },
    
    hideEventPanel: function() {
        document.getElementById('event-panel').style.display = 'none';
    }
};

// UI Update Functions
function updateUI() {
    // Update date and stats
    document.getElementById('date-display').textContent = `${gameState.season}, Day ${gameState.day}`;
    document.getElementById('weather-display').textContent = gameState.weather;
    document.getElementById('population-display').textContent = `👥 ${gameState.population}${gameState.sick > 0 ? ` (${gameState.sick} Sick)` : ''}`;
    
    // Update status bars with level indicators
    const warmthBar = document.getElementById('warmth-bar');
    warmthBar.style.width = `${gameState.warmth}%`;
    document.getElementById('warmth-level').textContent = getStatusLevel(gameState.warmth);
    
    const sustenanceBar = document.getElementById('sustenance-bar');
    sustenanceBar.style.width = `${gameState.sustenance}%`;
    document.getElementById('sustenance-level').textContent = getStatusLevel(gameState.sustenance);
    
    const dreadBar = document.getElementById('dread-bar');
    dreadBar.style.width = `${gameState.dread}%`;
    document.getElementById('dread-level').textContent = getDreadLevel(gameState.dread);
    
    // Update resources
    document.getElementById('driftwood').textContent = gameState.resources.driftwood;
    document.getElementById('timber').textContent = gameState.resources.timber;
    document.getElementById('dried-fish').textContent = gameState.resources.driedFish;
    document.getElementById('icicle-fish').textContent = gameState.resources.icicleFish;
    document.getElementById('porridge').textContent = gameState.resources.porridge;
    document.getElementById('livestock').textContent = gameState.resources.livestock;
}

function getStatusLevel(value) {
    if (value >= 80) return 'EXCELLENT';
    if (value >= 60) return 'GOOD';
    if (value >= 40) return 'MODERATE';
    if (value >= 20) return 'LOW!';
    if (value >= 10) return 'VERY LOW!';
    return 'CRITICAL!';
}

function getDreadLevel(value) {
    if (value >= 80) return 'OVERWHELMING!';
    if (value >= 60) return 'VERY HIGH!';
    if (value >= 40) return 'HIGH';
    if (value >= 20) return 'MODERATE';
    return 'LOW';
}

function addLogEntry(text) {
    const logDiv = document.getElementById('event-log');
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = text;
    logDiv.insertBefore(entry, logDiv.firstChild);
    
    // Keep only last 10 entries
    while (logDiv.children.length > 10) {
        logDiv.removeChild(logDiv.lastChild);
    }
}

function showEvent() {
    const events = [
        {
            title: "THE JARL'S COUNCIL",
            text: "A dispute of blood and oats has arisen. The Jarl demands a decision.",
            choices: ["Side with the farmer", "Side with the hunter", "Remain neutral"]
        },
        {
            title: "WINTER STORM",
            text: "Dark clouds gather on the horizon. A fierce storm approaches.",
            choices: ["Secure the buildings", "Gather more wood", "Pray to the gods"]
        },
        {
            title: "MYSTERIOUS STRANGER",
            text: "A hooded figure approaches the village gates at dusk.",
            choices: ["Welcome them warmly", "Question their intentions", "Turn them away"]
        }
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    
    document.getElementById('event-title').textContent = event.title;
    document.getElementById('event-text').textContent = event.text;
    
    const choicesDiv = document.querySelector('.event-choices');
    choicesDiv.innerHTML = '';
    event.choices.forEach((choice, index) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = choice;
        btn.onclick = () => window.game.chooseEvent(index);
        choicesDiv.appendChild(btn);
    });
    
    document.getElementById('event-popup').style.display = 'flex';
}

// Initialize UI on page load
window.addEventListener('load', () => {
    updateUI();
    addLogEntry('> Day 1: The village awakens to a cold dawn...');
    console.log('Northern Journey loaded!');
});
