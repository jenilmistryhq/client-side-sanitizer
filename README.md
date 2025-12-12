# 🛡️ client-side-sanitizer 

A lightweight, high-performance utility for real-time input sanitization, primarily designed for controlled React components, including logic for precise cursor position management.

It immediately strips XSS-related characters to ensure the UI state remains clean and safe as the user types.

## ✨ Features

* **Real-time XSS Prevention:** Instantly removes characters like `< > " ' & /`.
* **Caret Position Fix:** Returns metadata needed to prevent the cursor from jumping to the end of the input field after sanitization.
* **Isomorphic:** Works in both Node.js (Express) and Browser (React, Vue, etc.) environments.
* **Zero Dependencies:** Extremely lightweight and fast.

## 💾 Installation

```bash
npm install client-side-sanitizer