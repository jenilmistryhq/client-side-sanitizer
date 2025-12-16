# 🛡️ client-side-sanitizer

A lightweight, high-performance utility for real-time input sanitization, primarily designed for controlled React components. It provides a robust solution to immediately strip unwanted or malicious characters while ensuring the user's input cursor remains precisely in place.

---

## ✨ Key Features

* **Configurable Presets:** All built-in rules (`text`, `number`, `url`, etc.) can be globally overridden by the user using `setPresets()`.
* **Real-time XSS Prevention:** Instantly removes characters like `< > ' " & /` for safety.
* **Precise Caret Position Fix:** Returns metadata (`removedCount`) required for controlled components to prevent the cursor from jumping to the end of the input field after sanitization.
* **Zero Dependencies:** Extremely lightweight and fast.
* **Isomorphic (Core Logic):** Works reliably in both Node.js (for server-side validation) and Browser environments.

---

## 💾 Installation

```bash
npm install client-side-sanitizer