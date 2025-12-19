/**
 * DragHandler class
 * Handles drag-and-drop functionality for response elements
 * Supports both mouse (desktop) and touch (mobile) events
 */
class DragHandler {
  constructor(element, responseId, onDragEnd) {
    this.element = element;
    this.responseId = responseId;
    this.onDragEnd = onDragEnd; // Callback function to save position
    this.isDragging = false;
    this.offset = { x: 0, y: 0 };

    // Bind methods to maintain context
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);

    this.attachListeners();
  }

  attachListeners() {
    // Mouse events (desktop)
    this.element.addEventListener('mousedown', this.handleMouseDown);

    // Touch events (mobile)
    this.element.addEventListener('touchstart', this.handleTouchStart, { passive: false });
  }

  handleMouseDown(e) {
    this.startDrag(e.clientX, e.clientY);

    // Add document-level listeners for move and up
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);

    e.preventDefault();
  }

  handleMouseMove(e) {
    if (!this.isDragging) return;
    this.drag(e.clientX, e.clientY);
    e.preventDefault();
  }

  handleMouseUp(e) {
    if (!this.isDragging) return;
    this.endDrag();

    // Remove document-level listeners
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);

    e.preventDefault();
  }

  handleTouchStart(e) {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    this.startDrag(touch.clientX, touch.clientY);

    // Add document-level listeners for move and end
    document.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    document.addEventListener('touchend', this.handleTouchEnd, { passive: false });

    e.preventDefault();
  }

  handleTouchMove(e) {
    if (!this.isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    this.drag(touch.clientX, touch.clientY);
    e.preventDefault();
  }

  handleTouchEnd(e) {
    if (!this.isDragging) return;
    this.endDrag();

    // Remove document-level listeners
    document.removeEventListener('touchmove', this.handleTouchMove);
    document.removeEventListener('touchend', this.handleTouchEnd);

    e.preventDefault();
  }

  startDrag(clientX, clientY) {
    this.isDragging = true;

    // Calculate offset from cursor to element's top-left corner
    const rect = this.element.getBoundingClientRect();
    this.offset.x = clientX - rect.left;
    this.offset.y = clientY - rect.top;

    // Add dragging class for visual feedback
    this.element.classList.add('dragging');
  }

  drag(clientX, clientY) {
    // Calculate new position
    const newX = clientX - this.offset.x;
    const newY = clientY - this.offset.y;

    // Update element position
    this.element.style.left = `${newX}px`;
    this.element.style.top = `${newY}px`;
  }

  endDrag() {
    this.isDragging = false;

    // Remove dragging class
    this.element.classList.remove('dragging');

    // Get final position
    const finalX = parseInt(this.element.style.left) || 0;
    const finalY = parseInt(this.element.style.top) || 0;

    // Call the callback to save position to server
    if (this.onDragEnd) {
      this.onDragEnd(this.responseId, finalX, finalY);
    }
  }

  destroy() {
    // Clean up event listeners
    this.element.removeEventListener('mousedown', this.handleMouseDown);
    this.element.removeEventListener('touchstart', this.handleTouchStart);
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
    document.removeEventListener('touchmove', this.handleTouchMove);
    document.removeEventListener('touchend', this.handleTouchEnd);
  }
}
