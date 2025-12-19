const express = require('express');
const router = express.Router();
const { getAllResponses, createResponse, updatePosition } = require('../database');
const { filterContent } = require('../filter');

// GET /api/responses - Fetch all responses
router.get('/responses', async (req, res) => {
  try {
    const responses = await getAllResponses();
    res.json({
      success: true,
      data: responses
    });
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({
      success: false,
      message: 'failed to fetch responses'
    });
  }
});

// POST /api/responses - Submit new response
router.post('/responses', async (req, res) => {
  const { text } = req.body;

  // Validate input exists
  if (!text) {
    return res.status(400).json({
      success: false,
      message: 'response text is required'
    });
  }

  // Filter content
  const filterResult = filterContent(text);

  if (!filterResult.valid) {
    return res.status(400).json({
      success: false,
      message: filterResult.reason
    });
  }

  // Create response in database
  try {
    const newResponse = await createResponse(filterResult.filtered);
    res.status(201).json({
      success: true,
      data: newResponse
    });
  } catch (error) {
    console.error('Error creating response:', error);
    res.status(500).json({
      success: false,
      message: 'failed to save response'
    });
  }
});

// PUT /api/responses/:id/position - Update response position
router.put('/responses/:id/position', async (req, res) => {
  const { id } = req.params;
  const { position_x, position_y } = req.body;

  // Validate input
  if (position_x === undefined || position_y === undefined) {
    return res.status(400).json({
      success: false,
      message: 'position_x and position_y are required'
    });
  }

  // Validate position values are numbers
  if (isNaN(position_x) || isNaN(position_y)) {
    return res.status(400).json({
      success: false,
      message: 'position values must be numbers'
    });
  }

  // Update position in database
  try {
    const result = await updatePosition(id, position_x, position_y);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'response not found'
      });
    }

    res.json({
      success: true,
      message: 'position updated'
    });
  } catch (error) {
    console.error('Error updating position:', error);
    res.status(500).json({
      success: false,
      message: 'failed to update position'
    });
  }
});

module.exports = router;
