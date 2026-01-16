/**
 * DialogueSystem - Manages branching dialogue trees
 * 
 * Handles dialogue flow, choices, and effects.
 * Dialogues are loaded from data/dialogues/
 */

class DialogueSystem {
  constructor(scene) {
    this.scene = scene;
    this.dialogues = new Map();
    this.currentDialogue = null;
    this.currentNode = null;
  }

  /**
   * Load a dialogue file
   */
  loadDialogue(dialogueId, dialogueData) {
    this.dialogues.set(dialogueId, dialogueData);
  }

  /**
   * Start a dialogue
   */
  startDialogue(dialogueId, resourceManager = null) {
    const dialogue = this.dialogues.get(dialogueId);
    if (!dialogue) {
      console.error(`Dialogue ${dialogueId} not found`);
      return false;
    }
    
    this.currentDialogue = dialogue;
    this.currentNode = dialogue.nodes[dialogue.start_node];
    
    if (!this.currentNode) {
      console.error(`Start node ${dialogue.start_node} not found in dialogue ${dialogueId}`);
      return false;
    }
    
    // Apply immediate effects if any
    if (this.currentNode.effects) {
      this.applyEffects(this.currentNode.effects, resourceManager);
    }
    
    // Filter available choices based on requirements
    const availableChoices = this.getAvailableChoices(this.currentNode, resourceManager);
    
    eventBridge.emit('dialogue:start', {
      dialogue: this.currentDialogue,
      node: this.currentNode,
      availableChoices
    });
    
    return true;
  }

  /**
   * Get available choices for current node
   */
  getAvailableChoices(node, resourceManager) {
    if (!node.choices) return [];
    
    return node.choices.map((choice, index) => {
      const available = !choice.requires || 
        (resourceManager && resourceManager.hasEnough(choice.requires));
      
      return {
        ...choice,
        index,
        available
      };
    });
  }

  /**
   * Select a dialogue choice
   */
  selectChoice(choiceIndex, resourceManager = null) {
    if (!this.currentNode || !this.currentNode.choices) {
      return false;
    }
    
    const choice = this.currentNode.choices[choiceIndex];
    if (!choice) {
      return false;
    }
    
    // Check requirements
    if (choice.requires && resourceManager && !resourceManager.hasEnough(choice.requires)) {
      eventBridge.emit('dialogue:insufficient_resources', { choice });
      return false;
    }
    
    // Apply choice effects
    if (choice.effects) {
      this.applyEffects(choice.effects, resourceManager);
    }
    
    // Handle skill checks
    if (choice.skill_check) {
      const success = this.performSkillCheck(choice.skill_check, resourceManager);
      const nextNodeId = success ? choice.success : choice.failure;
      this.moveToNode(nextNodeId, resourceManager);
      return true;
    }
    
    // Handle risk-based choices
    if (choice.risk !== undefined) {
      const success = Math.random() >= choice.risk;
      const effects = success ? choice.success_effects : choice.failure_effects;
      
      if (effects) {
        this.applyEffects(effects, resourceManager);
      }
      
      if (!success && choice.failure_message) {
        eventBridge.emit('dialogue:risk_failed', { message: choice.failure_message });
      }
    }
    
    // Move to next node
    if (choice.next) {
      this.moveToNode(choice.next, resourceManager);
    } else {
      this.endDialogue();
    }
    
    return true;
  }

  /**
   * Move to a specific dialogue node
   */
  moveToNode(nodeId, resourceManager) {
    if (!this.currentDialogue) return false;
    
    const node = this.currentDialogue.nodes[nodeId];
    if (!node) {
      console.error(`Node ${nodeId} not found`);
      this.endDialogue();
      return false;
    }
    
    this.currentNode = node;
    
    // Handle special action nodes
    if (node.action === 'start_combat') {
      eventBridge.emit('dialogue:combat_start', {
        enemy: node.enemy,
        onWin: node.on_win,
        onLose: node.on_lose
      });
      return true;
    }
    
    // Apply node effects
    if (node.effects) {
      this.applyEffects(node.effects, resourceManager);
    }
    
    // Check if dialogue should end
    if (node.end) {
      this.endDialogue();
      return true;
    }
    
    // Continue dialogue
    const availableChoices = this.getAvailableChoices(node, resourceManager);
    
    eventBridge.emit('dialogue:continue', {
      node: this.currentNode,
      availableChoices
    });
    
    return true;
  }

  /**
   * Perform a skill check
   */
  performSkillCheck(skillCheck, resourceManager) {
    // Simple skill check - can be expanded with actual skill system
    const [, requiredLevel] = Object.entries(skillCheck)[0];
    
    // For now, use a random check with slight bias based on resource availability
    // In a full implementation, this would check actual character skills
    const playerLevel = resourceManager ? Math.floor(resourceManager.get('population') / 5) : 0;
    const roll = Math.random() * 10 + playerLevel;
    
    return roll >= requiredLevel;
  }

  /**
   * Apply dialogue effects
   */
  applyEffects(effects, resourceManager) {
    if (!effects) return;
    
    for (const [key, value] of Object.entries(effects)) {
      // Handle special effects
      if (key === 'event_flag') {
        if (this.scene.eventSystem) {
          this.scene.eventSystem.setFlag(value);
        }
        continue;
      }
      
      if (key === 'lore_unlocked') {
        eventBridge.emit('lore:unlocked', { loreId: value });
        continue;
      }
      
      if (key.includes('_reputation')) {
        // Handle reputation changes (stored in event system flags)
        continue;
      }
      
      // Apply resource changes
      if (resourceManager) {
        resourceManager.add(key, value);
      }
    }
  }

  /**
   * End the current dialogue
   */
  endDialogue() {
    this.currentDialogue = null;
    this.currentNode = null;
    
    eventBridge.emit('dialogue:end');
  }

  /**
   * Check if dialogue is currently active
   */
  isActive() {
    return this.currentDialogue !== null;
  }

  /**
   * Get current dialogue state
   */
  getCurrentState() {
    if (!this.currentDialogue || !this.currentNode) {
      return null;
    }
    
    return {
      dialogueId: this.currentDialogue.id,
      nodeId: this.currentNode.id || 'unknown',
      speaker: this.currentNode.speaker,
      portrait: this.currentNode.portrait,
      text: this.currentNode.text
    };
  }
}
