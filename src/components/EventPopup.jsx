/**
 * EventPopup Component
 * 
 * Displays random events with choices and effects.
 * Events are loaded from data/events/
 */

import React from 'react';
import './EventPopup.css';

const EventPopup = ({ event, onChoice, onClose }) => {
  if (!event) return null;

  const hasChoices = event.choices && event.choices.length > 0;

  const handleChoice = (index) => {
    onChoice(index);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content event-popup">
        <h2 className="event-title">{event.title}</h2>
        
        <div className="event-description">
          {event.description}
        </div>

        {/* Show immediate effects if any */}
        {event.effects && Object.keys(event.effects).length > 0 && !hasChoices && (
          <div className="event-effects">
            <strong>Effects:</strong>
            <ul>
              {Object.entries(event.effects).map(([resource, amount]) => (
                <li key={resource} className={amount > 0 ? 'positive' : 'negative'}>
                  {resource}: {amount > 0 ? '+' : ''}{amount}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Show choices if available */}
        {hasChoices ? (
          <div className="event-choices">
            <p className="choices-label">How will you respond?</p>
            {event.choices.map((choice, index) => (
              <button
                key={index}
                className="event-choice"
                onClick={() => handleChoice(index)}
              >
                {choice.text}
                {choice.requires && (
                  <span className="choice-requires">
                    (Requires: {Object.entries(choice.requires).map(([r, a]) => `${r}: ${a}`).join(', ')})
                  </span>
                )}
              </button>
            ))}
          </div>
        ) : (
          <button className="event-close-btn" onClick={onClose}>
            Continue
          </button>
        )}
      </div>
    </div>
  );
};

export default EventPopup;
