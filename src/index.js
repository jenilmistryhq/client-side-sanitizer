/**
 * Client-Side Sanitizer
 * A robust, real-time input sanitizer with configurable whitelist support.
 */

// 1. Define Base Presets (Regex Strings for reusability)
const PRESETS = {
    // TEXT: The default. It acts as a Blacklist, stripping common XSS chars.
    // We remove: ' " < > & /
    'text': /['"<>&/]/g, 

    // NUMBER: Allows only digits 0-9.
    'number': /[^0-9]/g, 
    
    // EMAIL (Basic): Allows letters, numbers, @, dot, dash, underscore.
    'email': /[^a-zA-Z0-9@._-]/g, 
    
    // URL-Friendly: Allows alphanumeric, dashes, dots, underscores, slashes, colons.
    'url': /[^a-zA-Z0-9._\-/:?=&%]/g,
};

// Default behavior if nothing is passed
const DEFAULT_TYPE = 'text';

/**
 * Sanitizes a string based on a configurable whitelist or preset.
 * * @param {string} input - The raw string input from the user.
 * @param {object|string} config - Configuration object OR a simple string type.
 * @param {string} [config.type] - Built-in preset ('text', 'number', 'email', 'url').
 * @param {string} [config.allow] - Custom string of allowed characters (regex style, e.g. "A-Z0-9").
 * @returns {{safeValue: string, removedCount: number}} 
 */
export const sanitizeInput = (input, config = DEFAULT_TYPE) => {
    // Safety check: ensure input is a string
    if (typeof input !== 'string') {
        return { safeValue: '', removedCount: 0 };
    }
    
    const originalLength = input.length;
    let finalRegex;

    // Normalize config: handle if user passed just "number" string instead of { type: "number" }
    let options = {};
    if (typeof config === 'string') {
        options.type = config;
    } else {
        options = config;
    }

    // --- LOGIC BRANCHING ---

    // Option A: User provided a Custom Whitelist (e.g., { allow: "A-Z" })
    if (options.allow) {
        try {
            // Build a regex that matches anything NOT in the allowed list.
            // Example: allow="A-Z" -> Regex becomes /[^A-Z]/g
            finalRegex = new RegExp(`[^${options.allow}]`, 'g');
        } catch (e) {
            console.error("Client-Side-Sanitizer: Invalid 'allow' regex provided. Falling back to default text safety.");
            finalRegex = PRESETS['text'];
        }
    } 
    // Option B: User requested a known Preset (e.g., { type: "number" })
    else if (options.type && PRESETS[options.type]) {
        finalRegex = PRESETS[options.type];
    } 
    // Option C: Default fallback (Basic XSS stripping)
    else {
        finalRegex = PRESETS['text'];
    }
    
    // --- EXECUTION ---
    
    // Replace invalid characters with empty string
    const safeValue = input.replace(finalRegex, '');
    
    const removedCount = originalLength - safeValue.length;

    return { 
        safeValue, 
        removedCount 
    };
};

export default sanitizeInput;