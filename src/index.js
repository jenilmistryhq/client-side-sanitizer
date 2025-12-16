/**
 * client-side-sanitizer V1.2.0
 * Features:
 * 1. Global Regex Presets (Text, Number, Email, URL, etc.) - Configurable via setPresets
 * 2. Robust Regex Stripping/Whitelisting - Handles preset type or custom 'allow' config
 */

// --- DEFAULT REGEX PRESETS (Mutable defaults) ---
let PRESETS = {
    // BLACKLIST: Removes common XSS characters (quotes, angle brackets, ampersand, slash)
    'text': /['"<>&/]/g, 

    // WHITELIST: Digits only
    'number': /[^0-9]/g, 
    
    // WHITELIST: Basic Email characters
    'email': /[^a-zA-Z0-9@._-]/g, 
    
    // WHITELIST: Basic URL characters
    'url': /[^a-zA-Z0-9._\-/:?=&%]/g,
    
};

const DEFAULT_TYPE = 'text';

// --- CONFIGURATION FUNCTION ---
/**
 * Allows the user to override or extend the default regex presets globally.
 * This makes all predefined types (text, number, email, url) fully configurable.
 * * @param {object} newPresets
 */
export const setPresets = (newPresets) => {
    if (typeof newPresets === 'object' && newPresets !== null) {
        // Merge new presets with existing ones (new ones override old ones)
        PRESETS = { ...PRESETS, ...newPresets };
        console.log("Sanitizer presets updated. Current keys:", Object.keys(PRESETS));
    } else {
        console.error("setPresets must be called with a valid object of { name: RegExp } pairs.");
    }
};

// --- MAIN EXPORT ---
/**
 * Sanitizes a string based on a configurable rule (preset or custom whitelist).
 * @param {string} input - The raw string input from the user.
 * @param {object|string} config - Configuration object OR a simple string type.
 * @returns {{safeValue: string, removedCount: number}} 
 */
export const sanitizeInput = (input, config = DEFAULT_TYPE) => {
    if (typeof input !== 'string') {
        return { safeValue: '', removedCount: 0 };
    }
    
    const originalLength = input.length;
    let options = typeof config === 'string' ? { type: config } : config;
    let finalRegex;

    // Custom Whitelist 
    if (options.allow) {
        try {
            // Build a Whitelist Regex: Match anything NOT in the allowed set.
            finalRegex = new RegExp(`[^${options.allow}]`, 'g');
        } catch (e) {
            console.error("Client-Side-Sanitizer: Invalid 'allow' regex. Falling back to default 'text'.");
            finalRegex = PRESETS[DEFAULT_TYPE];
        }
    } 
    // B. Preset Regex
    else {
        const type = options.type || DEFAULT_TYPE;
        // Use the requested type, or fall back to the default 'text' preset
        finalRegex = PRESETS[type] || PRESETS[DEFAULT_TYPE];
    }
    
    // Perform the replacement
    const safeValue = input.replace(finalRegex, '');
    
    const removedCount = originalLength - safeValue.length;

    return { 
        safeValue, 
        removedCount 
    };
};

export default sanitizeInput;