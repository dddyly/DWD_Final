/**
 * Main application controller
 * Handles view switching, API calls, and response rendering
 */

// API base URL
const API_URL = '/api';

// DOM elements
const inputContainer = document.getElementById('input-container');
const canvasContainer = document.getElementById('canvas-container');
const responseInput = document.getElementById('response-input');
const submitBtn = document.getElementById('submit-btn');
const charCount = document.getElementById('char-count');
const errorMessage = document.getElementById('error-message');
const canvas = document.getElementById('canvas');
const refreshBtn = document.getElementById('refresh-btn');
const backBtn = document.getElementById('back-btn');
const loadingMessage = document.getElementById('loading-message');

// Store drag handlers for cleanup
let dragHandlers = [];

// Initialize app on page load
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
});

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Character counter
  responseInput.addEventListener('input', () => {
    const count = responseInput.value.length;
    charCount.textContent = `${count} / 500`;
  });

  // Submit button
  submitBtn.addEventListener('click', handleSubmit);

  // Allow Enter key to submit (with Shift+Enter for new line)
  responseInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  });

  // Refresh button
  refreshBtn.addEventListener('click', fetchResponses);

  // Back button
  backBtn.addEventListener('click', showInputView);
}

/**
 * Handle form submission
 */
async function handleSubmit() {
  const text = responseInput.value.trim();

  // Clear previous error
  errorMessage.textContent = '';

  if (!text) {
    showError('please enter a response');
    return;
  }

  // Disable button during submission
  submitBtn.disabled = true;
  submitBtn.textContent = 'submitting...';

  try {
    const response = await fetch(`${API_URL}/responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });

    const data = await response.json();

    if (data.success) {
      // Clear input
      responseInput.value = '';
      charCount.textContent = '0 / 500';

      // Switch to canvas view and fetch all responses
      showCanvasView();
      await fetchResponses();
    } else {
      showError(data.message || 'submission failed');
    }
  } catch (error) {
    console.error('Error submitting response:', error);
    showError('submission failed. please try again.');
  } finally {
    // Re-enable button
    submitBtn.disabled = false;
    submitBtn.textContent = 'submit';
  }
}

/**
 * Fetch all responses from API
 */
async function fetchResponses() {
  showLoading(true);

  try {
    const response = await fetch(`${API_URL}/responses`);
    const data = await response.json();

    if (data.success) {
      renderResponses(data.data);
    } else {
      console.error('Failed to fetch responses:', data.message);
    }
  } catch (error) {
    console.error('Error fetching responses:', error);
  } finally {
    showLoading(false);
  }
}

/**
 * Render responses on canvas
 */
function renderResponses(responses) {
  // Clear existing responses
  canvas.innerHTML = '';

  // Destroy old drag handlers
  dragHandlers.forEach(handler => handler.destroy());
  dragHandlers = [];

  // Create and position each response element
  responses.forEach(response => {
    const responseEl = document.createElement('div');
    responseEl.className = 'response';
    responseEl.textContent = response.text;
    responseEl.style.left = `${response.position_x}px`;
    responseEl.style.top = `${response.position_y}px`;
    responseEl.dataset.id = response.id;

    // Add to canvas
    canvas.appendChild(responseEl);

    // Attach drag handler
    const dragHandler = new DragHandler(
      responseEl,
      response.id,
      savePosition
    );
    dragHandlers.push(dragHandler);
  });
}

/**
 * Save response position to server
 */
async function savePosition(responseId, x, y) {
  try {
    const response = await fetch(`${API_URL}/responses/${responseId}/position`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        position_x: x,
        position_y: y
      })
    });

    const data = await response.json();

    if (!data.success) {
      console.error('Failed to save position:', data.message);
    }
  } catch (error) {
    console.error('Error saving position:', error);
  }
}

/**
 * Show input view
 */
function showInputView() {
  inputContainer.classList.remove('hidden');
  canvasContainer.classList.add('hidden');
  errorMessage.textContent = '';
}

/**
 * Show canvas view
 */
function showCanvasView() {
  inputContainer.classList.add('hidden');
  canvasContainer.classList.remove('hidden');
}

/**
 * Show/hide loading message
 */
function showLoading(show) {
  if (show) {
    loadingMessage.classList.remove('hidden');
  } else {
    loadingMessage.classList.add('hidden');
  }
}

/**
 * Show error message
 */
function showError(message) {
  errorMessage.textContent = message;
}
