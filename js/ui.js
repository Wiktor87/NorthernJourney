/**
 * UI Manager - Handles all UI updates and interactions
 * 
 * Manages the communication between Phaser game and DOM UI elements
 */

class UIManager {
  constructor() {
    this.resources = {};
    this.gameOver = false;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Listen for resource updates from Phaser
    eventBridge.on('resources:updated', (data) => {
      this.resources = data;
      this.updateResourcePanel();
    });

    // Listen for game over
    eventBridge.on('game:over', (data) => {
      this.gameOver = true;
      this.showGameOver(data.reason);
    });

    // Listen for game started
    eventBridge.on('game:started', () => {
      this.gameOver = false;
      this.hideGameOver();
    });

    // Setup button click handlers
    const endTurnBtn = document.getElementById('btn-end-turn');
    if (endTurnBtn) {
      endTurnBtn.addEventListener('click', () => {
        if (!this.gameOver) {
          eventBridge.emit('game:endTurn');
        }
      });
    }

    const buildBtn = document.getElementById('btn-build');
    if (buildBtn) {
      buildBtn.addEventListener('click', () => {
        if (!this.gameOver) {
          this.toggleBuildMenu();
        }
      });
    }
  }

  updateResourcePanel() {
    const panel = document.getElementById('resource-panel');
    if (!panel) return;

    let html = '<h3 style="color: var(--text-bone); margin-bottom: 10px;">Resources</h3>';
    html += '<div style="font-size: 14px; line-height: 1.8;">';
    
    // Format resources
    if (this.resources.turn !== undefined) {
      html += `<p><strong>Turn:</strong> ${this.resources.turn}</p>`;
    }
    if (this.resources.population !== undefined) {
      html += `<p><strong>Population:</strong> ${this.resources.population}</p>`;
    }
    if (this.resources.food !== undefined) {
      html += `<p><strong>Food:</strong> ${Math.floor(this.resources.food)}</p>`;
    }
    if (this.resources.wood !== undefined) {
      html += `<p><strong>Wood:</strong> ${Math.floor(this.resources.wood)}</p>`;
    }
    if (this.resources.stone !== undefined) {
      html += `<p><strong>Stone:</strong> ${Math.floor(this.resources.stone)}</p>`;
    }
    if (this.resources.iron !== undefined) {
      html += `<p><strong>Iron:</strong> ${Math.floor(this.resources.iron)}</p>`;
    }
    if (this.resources.morale !== undefined) {
      html += `<p><strong>Morale:</strong> ${Math.floor(this.resources.morale)}</p>`;
    }
    
    html += '</div>';
    panel.innerHTML = html;
  }

  showGameOver(reason) {
    const panel = document.getElementById('game-over-panel');
    const controls = document.getElementById('game-controls');
    
    if (controls) {
      controls.style.display = 'none';
    }
    
    if (panel) {
      panel.style.display = 'block';
      
      let html = '<h2>The Saga Has Ended</h2>';
      html += `<p>${reason}</p>`;
      html += '<div class="final-stats">';
      html += `<p><strong>Turns Survived:</strong> ${this.resources.turn || 0}</p>`;
      html += `<p><strong>Final Population:</strong> ${this.resources.population || 0}</p>`;
      html += `<p><strong>Food:</strong> ${Math.floor(this.resources.food || 0)}</p>`;
      html += `<p><strong>Wood:</strong> ${Math.floor(this.resources.wood || 0)}</p>`;
      html += '</div>';
      html += '<button class="btn-primary" onclick="window.location.reload()">Begin a New Saga</button>';
      
      panel.innerHTML = html;
    }
  }

  hideGameOver() {
    const panel = document.getElementById('game-over-panel');
    const controls = document.getElementById('game-controls');
    
    if (panel) {
      panel.style.display = 'none';
    }
    
    if (controls) {
      controls.style.display = 'flex';
    }
  }

  toggleBuildMenu() {
    const menu = document.getElementById('build-menu');
    if (menu) {
      if (menu.style.display === 'none' || menu.style.display === '') {
        this.showBuildMenu();
      } else {
        this.hideBuildMenu();
      }
    }
  }

  showBuildMenu() {
    const menu = document.getElementById('build-menu');
    if (menu) {
      menu.style.display = 'block';
      
      // Simple build menu (basic version)
      let html = '<h3>Build Menu</h3>';
      html += '<p>Click on the map to place buildings</p>';
      html += '<button class="btn-secondary" onclick="uiManager.hideBuildMenu()">Close</button>';
      
      menu.innerHTML = html;
    }
  }

  hideBuildMenu() {
    const menu = document.getElementById('build-menu');
    if (menu) {
      menu.style.display = 'none';
    }
  }
}

// Create global UI manager instance
const uiManager = new UIManager();
