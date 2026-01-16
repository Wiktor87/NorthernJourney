import React, { useEffect, useRef } from 'react';
import './EventLog.css';

/**
 * EventLog Component - "The Saga" Chronicle
 * 
 * Displays a scrollable log of game events, including random events,
 * turn results, and important game messages in a Norse saga style.
 * 
 * Props:
 * - events: Array of event objects, each containing:
 *   - id: Unique identifier
 *   - turn: Turn number when event occurred
 *   - type: Event type ('info', 'warning', 'danger', 'success')
 *   - message: Event message text
 * 
 * The log automatically scrolls to show the latest events.
 */
const EventLog = ({ events }) => {
  const logEndRef = useRef(null);

  /**
   * Auto-scroll to bottom when new events are added
   */
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  /**
   * Get CSS class based on event type
   */
  const getEventClass = (type) => {
    switch (type) {
      case 'success':
        return 'event-success';
      case 'warning':
        return 'event-warning';
      case 'danger':
        return 'event-danger';
      default:
        return 'event-info';
    }
  };

  /**
   * Get icon based on event type - Norse themed
   */
  const getEventIcon = (type) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'danger':
        return '⚔';
      default:
        return '📜';
    }
  };

  return (
    <div className="event-log">
      <h2 className="log-title">⚔ The Saga ⚔</h2>
      <div className="log-content">
        {events.length === 0 ? (
          <div className="no-events">
            <p>The saga begins... Your deeds will be chronicled here for all time.</p>
          </div>
        ) : (
          events.map((event, index) => (
            <div key={`${event.id}-${index}`} className={`log-entry ${getEventClass(event.type)}`}>
              <div className="event-header">
                <span className="event-icon">{getEventIcon(event.type)}</span>
                <span className="event-turn">Day {event.turn}</span>
              </div>
              <div className="event-message">{event.message}</div>
            </div>
          ))
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
};

export default EventLog;
