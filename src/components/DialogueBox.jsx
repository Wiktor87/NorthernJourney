/**
 * DialogueBox Component
 * 
 * Displays branching dialogue with character portraits and choices.
 * Used for NPC conversations and creature encounters.
 */

import React from 'react';
import './DialogueBox.css';

const DialogueBox = ({ dialogue, onChoice }) => {
  if (!dialogue || !dialogue.node) return null;

  const { node, availableChoices } = dialogue;

  return (
    <div className="modal-overlay">
      <div className="modal-content dialogue-box">
        {/* Speaker info */}
        {node.speaker && node.speaker !== 'narrator' && (
          <div className="dialogue-header">
            {node.portrait && (
              <div className="portrait-placeholder">
                {/* Placeholder for portrait */}
                <span className="portrait-text">{node.speaker}</span>
              </div>
            )}
            <h3 className="speaker-name">{node.speaker}</h3>
          </div>
        )}

        {/* Dialogue text */}
        <div className="dialogue-text">
          {node.text}
        </div>

        {/* Choices */}
        {availableChoices && availableChoices.length > 0 && (
          <div className="dialogue-choices">
            {availableChoices.map((choice) => (
              <button
                key={choice.index}
                className={`dialogue-choice ${!choice.available ? 'disabled' : ''}`}
                onClick={() => choice.available && onChoice(choice.index)}
                disabled={!choice.available}
              >
                <span className="choice-text">{choice.text}</span>
                {choice.requires && !choice.available && (
                  <span className="choice-requirement">
                    (Requires: {Object.entries(choice.requires).map(([r, a]) => `${r}: ${a}`).join(', ')})
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DialogueBox;
