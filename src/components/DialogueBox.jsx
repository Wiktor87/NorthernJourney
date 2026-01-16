/**
 * DialogueBox Component
 * 
 * Displays branching dialogue with character portraits and choices.
 * Used for NPC conversations and creature encounters.
 * Positioned at bottom of screen with Norse ornate frame styling.
 */

import React from 'react';
import './DialogueBox.css';

const DialogueBox = ({ dialogue, onChoice }) => {
  if (!dialogue || !dialogue.node) return null;

  const { node, availableChoices } = dialogue;

  return (
    <div className="dialogue-overlay">
      <div className="dialogue-box">
        {/* Ornate frame container */}
        <div className="dialogue-frame">
          {/* Portrait section - left side */}
          {node.speaker && node.speaker !== 'narrator' && (
            <div className="dialogue-portrait-section">
              <div className="portrait-frame">
                <div className="portrait-placeholder">
                  {/* Placeholder for actual portrait art */}
                  <span className="portrait-initial">{node.speaker.charAt(0).toUpperCase()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Content section - right side */}
          <div className="dialogue-content-section">
            {/* Speaker name */}
            {node.speaker && node.speaker !== 'narrator' && (
              <h3 className="speaker-name">{node.speaker}</h3>
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
      </div>
    </div>
  );
};

export default DialogueBox;
