// utils/validation.js

/**
 * Checks if a given userId is valid.
 * For demo purposes, let's say a valid ID is only digits and length 3–10.
 */
function isValidUserId(userId) {
  if (!userId) return false;

  // Allow only numbers, between 3 and 10 characters
  const regex = /^[0-9]{3,10}$/;
  return regex.test(userId);
}

module.exports = { isValidUserId };
