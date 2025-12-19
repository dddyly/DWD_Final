const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
const dbPath = path.join(__dirname, '../database/responses.db');
const db = new sqlite3.Database(dbPath);

// Initialize database table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      position_x INTEGER NOT NULL,
      position_y INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`CREATE INDEX IF NOT EXISTS idx_created_at ON responses(created_at)`);
});

// Generate random position with collision detection
function generatePosition(existingPositions) {
  const MIN_DISTANCE = 150; // minimum distance between responses in pixels
  const MAX_ATTEMPTS = 20;
  const CANVAS_WIDTH = 1200;
  const CANVAS_HEIGHT = 800;
  const MARGIN = 100; // margin from edges

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const x = Math.floor(Math.random() * (CANVAS_WIDTH - 2 * MARGIN) + MARGIN);
    const y = Math.floor(Math.random() * (CANVAS_HEIGHT - 2 * MARGIN) + MARGIN);

    // Check if position collides with existing responses
    const hasCollision = existingPositions.some(pos => {
      const distance = Math.sqrt(
        Math.pow(pos.position_x - x, 2) + Math.pow(pos.position_y - y, 2)
      );
      return distance < MIN_DISTANCE;
    });

    if (!hasCollision) {
      return { x, y };
    }
  }

  // Fallback: return random position even if collision exists
  return {
    x: Math.floor(Math.random() * (CANVAS_WIDTH - 2 * MARGIN) + MARGIN),
    y: Math.floor(Math.random() * (CANVAS_HEIGHT - 2 * MARGIN) + MARGIN)
  };
}

// Get all responses
function getAllResponses() {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT id, text, position_x, position_y, created_at FROM responses ORDER BY created_at DESC',
      [],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
}

// Create new response with random position
async function createResponse(text) {
  try {
    // Get existing positions for collision detection
    const existingResponses = await getAllResponses();
    const position = generatePosition(existingResponses);

    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO responses (text, position_x, position_y) VALUES (?, ?, ?)',
        [text, position.x, position.y],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              id: this.lastID,
              text,
              position_x: position.x,
              position_y: position.y
            });
          }
        }
      );
    });
  } catch (error) {
    throw error;
  }
}

// Update response position
function updatePosition(id, posX, posY) {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE responses SET position_x = ?, position_y = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [posX, posY, id],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      }
    );
  });
}

module.exports = {
  getAllResponses,
  createResponse,
  updatePosition
};
