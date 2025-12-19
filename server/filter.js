const Filter = require('bad-words');
const filter = new Filter();

// Validate text length
function isValidLength(text) {
  return text.length >= 1 && text.length <= 500;
}

// Check for URLs
function containsURL(text) {
  const urlPattern = /(https?:\/\/|www\.)/i;
  return urlPattern.test(text);
}

// Check for email addresses
function containsEmail(text) {
  const emailPattern = /\S+@\S+\.\S+/;
  return emailPattern.test(text);
}

// Check for phone numbers
function containsPhone(text) {
  const phonePattern = /(\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|\(\d{3}\)\s*\d{3}[-.\s]?\d{4})/;
  return phonePattern.test(text);
}

// Check for excessive caps (more than 50% uppercase)
function hasExcessiveCaps(text) {
  const letters = text.replace(/[^a-zA-Z]/g, '');
  if (letters.length === 0) return false;

  const uppercaseCount = (text.match(/[A-Z]/g) || []).length;
  return uppercaseCount / letters.length > 0.5;
}

// Check for excessive repeated characters
function hasExcessiveRepetition(text) {
  // Check for 5 or more of the same character in a row
  const repetitionPattern = /(.)\1{4,}/;
  return repetitionPattern.test(text);
}

// Main filter function
function filterContent(text) {
  // Trim whitespace
  text = text.trim();

  // Length validation
  if (!isValidLength(text)) {
    return {
      valid: false,
      reason: 'response must be between 1 and 500 characters'
    };
  }

  // Profanity check
  if (filter.isProfane(text)) {
    return {
      valid: false,
      reason: 'inappropriate content detected'
    };
  }

  // URL check
  if (containsURL(text)) {
    return {
      valid: false,
      reason: 'urls are not allowed'
    };
  }

  // Email check
  if (containsEmail(text)) {
    return {
      valid: false,
      reason: 'email addresses are not allowed'
    };
  }

  // Phone check
  if (containsPhone(text)) {
    return {
      valid: false,
      reason: 'phone numbers are not allowed'
    };
  }

  // Excessive caps check
  if (hasExcessiveCaps(text)) {
    return {
      valid: false,
      reason: 'please avoid excessive capitalization'
    };
  }

  // Repetition check
  if (hasExcessiveRepetition(text)) {
    return {
      valid: false,
      reason: 'excessive character repetition detected'
    };
  }

  // All checks passed
  return {
    valid: true,
    filtered: text
  };
}

module.exports = {
  filterContent
};
