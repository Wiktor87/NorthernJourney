import React from 'react';
import './IsometricMap.css';

/**
 * IsometricMap Component
 * 
 * Renders an 8x6 grid of isometric tiles representing the Norse village.
 * 
 * Props:
 * - mapData: 2D array (8 columns x 6 rows) containing tile types
 * 
 * Tile types:
 * - 'water': Water tiles (fishing spots)
 * - 'grass': Grass/land tiles
 * - 'hut': Village huts
 * - 'villager': Villager icon
 * - 'draugr': Draugr (undead) icon
 * 
 * The isometric view is created by rendering tiles in a diamond pattern.
 * All tile images are loaded from /public/isometric/tiles/ and can be
 * easily replaced by artists without changing code.
 */
const IsometricMap = ({ mapData }) => {
  // Tile dimensions for isometric rendering
  const TILE_WIDTH = 64;
  const TILE_HEIGHT = 32;

  /**
   * Calculate the screen position for an isometric tile
   * based on its grid coordinates.
   */
  const getIsoPosition = (x, y) => {
    return {
      left: (x - y) * (TILE_WIDTH / 2),
      top: (x + y) * (TILE_HEIGHT / 2)
    };
  };

  return (
    <div className="isometric-map-container">
      <div className="isometric-map">
        {mapData.map((row, y) =>
          row.map((tile, x) => {
            const pos = getIsoPosition(x, y);
            return (
              <div
                key={`${x}-${y}`}
                className="iso-tile"
                style={{
                  left: `${pos.left}px`,
                  top: `${pos.top}px`,
                  width: `${TILE_WIDTH}px`,
                  height: `${TILE_HEIGHT}px`
                }}
              >
                <img
                  src={`/isometric/tiles/${tile}.png`}
                  alt={tile}
                  className="tile-image"
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default IsometricMap;
