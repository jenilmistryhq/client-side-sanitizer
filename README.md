## **🛡️Client Side Sanitizer**

A lightweight, high-performance utility for real-time input sanitization, primarily
designed for controlled React components.
This package instantly sanitizes user input using regular expressions, preventing XSS
injection and ensuring a clean UI state. Its key strength is providing the data necessary to fix
the common cursor jump problem in React forms after state updates.

---
## **✨ Features**

● **Real-time XSS Prevention:** Instantly removes blacklisted characters (`<`, `>`, `"`, `'`,
`&`, `/`) or strictly whitelists characters based on the configuration.

● **Configurable Presets:** Default rules for `text`, `number`, `email`, and `url` can be
globally overridden or extended by the user using `setPresets()`.

● **Caret Position Fix:** Returns metadata required for precise cursor position
management in controlled inputs, preventing the cursor from jumping to the end.

● **Zero Dependencies:** Extremely lightweight and fast.

---
## **💾 Installation**

Install the package using npm:
```
npm install client-side-sanitizer
```

## **🛠 Usage & Integration**

The package exports two functions: sanitizeInput (the core logic) and setPresets (for global
configuration).

## 1. Global Configuration (setPresets)

Before using the sanitizer, you can globally override the default rules for presets like number
or text. This should be done once in your application's entry file (e.g., src/main.jsx or
src/App.jsx).

**File: src/main.jsx (or src/App.jsx)**
```
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// 1. Import the configuration tool
import { setPresets } from 'client-side-sanitizer'; 

// === GLOBAL SANITIZER CONFIGURATION ===
// Call setPresets ONCE to globally override or extend the default rules.
setPresets({
    // Override the default 'number' rule to allow decimals (period) and commas.
    'number': /[^0-9.,]/g, 
    
    // Override the default 'text' rule to be very strict: only allow letters and spaces.
    'text': /[^a-zA-Z\s]/g,
    
    // Add a brand new, custom preset for zip codes.
    'zipcode': /[^0-9-]/g 
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
```
## 2. Using the Sanitizer in a React Component

Use sanitizeInput within your component's change handler to get the clean value and the
removedCount needed for cursor fixation.

**File: SafeInputComponent.jsx**
```
import React, { useState, useCallback, useRef, useEffect } from 'react';
// Import 'sanitizeInput' from the package 'client-side-sanitizer'
// import { sanitizeInput } from 'client-side-sanitizer';

const SafeInputComponent = () => {
    const [formState, setFormState] = useState({
        username: '',
        age: '',
        productCode: '',
        testText: '',
        testNumber: '',
        testEmail: '',
        testUrl: ''
    });

    const [cursorState, setCursorState] = useState({ name: null, position: 0 });
    const inputRefs = useRef({}); 
    
    const setInputRef = useCallback((el) => {
        if (el && el.name) inputRefs.current[el.name] = el;
    }, []);

    const handleInputChange = useCallback((e, config) => {
        const inputElement = e.target;
        const rawValue = inputElement.value;
        const fieldName = inputElement.name;

        const currentCaret = inputElement.selectionStart;
        const { safeValue, removedCount } = sanitizeInput(rawValue, config);

        setFormState(prev => ({ ...prev, [fieldName]: safeValue }));
        setCursorState({ name: fieldName, position: currentCaret - removedCount });
    }, []);

    useEffect(() => {
        if (cursorState.name) {
            const input = inputRefs.current[cursorState.name];
            if (input) {
                input.focus(); 
                input.selectionStart = cursorState.position;
                input.selectionEnd = cursorState.position;
            }
        }
    }, [cursorState]); 

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <form>
                {/* --- Testing Global Presets --- */}
                <h2>A. Global Preset Behavior</h2>

                {/* 1. Username (Preset: 'text') */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold' }}>1. Username (Preset: 'text'):</label>
                    <input ref={setInputRef} name="username" type="text" value={formState.username}
                        onChange={(e) => handleInputChange(e, 'text')}
                        placeholder="Type: <script>Test 123 !@#"
                        style={{ padding: '8px', width: '300px' }}
                    />
                </div>

                {/* 2. Age (Preset: 'number') */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold' }}>2. Age (Preset: 'number'):</label>
                    <input ref={setInputRef} name="age" type="text" value={formState.age}
                        onChange={(e) => handleInputChange(e, 'number')}
                        placeholder="Try: 12,345.67abc"
                        style={{ padding: '8px', width: '300px' }}
                    />
                </div>
                
                {/* 3. Product Code (Preset: 'productCode') */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold' }}>3. Product Code (Preset: 'productCode'):</label>
                    <input ref={setInputRef} name="productCode" type="text" value={formState.productCode}
                        onChange={(e) => handleInputChange(e, 'productCode')}
                        placeholder="Try: ab-123 (Uses new rule from App.jsx)"
                        style={{ padding: '8px', width: '300px' }}
                    />
                </div>
                
                <hr style={{margin: '30px 0'}}/>

                {/* --- Testing Custom Allow Prop --- */}
                <h2>B. Custom Whitelisting (Overrides Presets)</h2>

                {/* 4. Custom Allow Field */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold' }}>4. Custom (Config: allow: '0-9./'):</label>
                    <input ref={setInputRef} name="testNumber" type="text" value={formState.testNumber}
                        onChange={(e) => handleInputChange(e, { allow: '0-9./' })}
                        placeholder="Only allows digits, period, and slash."
                        style={{ padding: '8px', width: '300px' }}
                    />
                </div>
                
            </form>
        </div>
    );
};

export default SafeInputComponent;
```