/**
 * Sanitizes a string by stripping XSS-related characters and returns the cleaned string 
 * and the count of removed characters, allowing for caret position correction.
 * * @param {string} input - The raw string input from the user.
 * @returns {{safeValue: string, removedCount: number}} Object containing the safe string and the number of characters removed.
 */
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') {
        return { safeValue: '', removedCount: 0 };
    }
    
    const originalLength = input.length;
    
    // Regex for XSS characters: quotes, tags, ampersand, and slash
    const xssRegex = /['"<>&/]/g;
    
    const safeValue = input.replace(xssRegex, '');
    
    const removedCount = originalLength - safeValue.length;

    return { 
        safeValue, 
        removedCount 
    };
};

// We also export the primary function directly for simplicity
export default sanitizeInput;