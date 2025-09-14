
# AI Performance Check Overlay

**`@hasseneafif/ai-performance-check`**

A simple, drop-in performance monitoring overlay for web applications, featuring AI-powered analysis. This tool provides key performance metrics at a glance and suggests improvements, helping you optimize your user experience.

![Performance Overlay Screenshot](https://picsum.photos/400/300)

## Features

- **Real-time Metrics:** Tracks Core Web Vitals and other key performance indicators like FCP, LCP, and Page Load time.
- **AI-Powered Analysis:** Uses a lightweight AI model to provide actionable insights and improvement suggestions based on your site's performance data.
- **Framework Agnostic:** Can be used as a React component or a simple function in any vanilla JavaScript project.
- **Responsive Design:** The overlay adapts to both desktop and mobile viewports.
- **Easy Setup:** No complex configuration needed. Just install and import.

## Installation

```bash
npm install @hasseneafif/ai-performance-check
```

## Usage

You can use this package in two ways: as a React component or as a vanilla JavaScript function.

### 1. React Component

The easiest way to use the overlay in a React application is by importing and rendering the `AIPerformanceCheck` component.

```jsx
// In your main App component or layout
import React from 'react';
import { AIPerformanceCheck } from '@hasseneafif/ai-performance-check';

function App() {
  return (
    <div>
      <h1>My Awesome Application</h1>
      {/* Your other components */}
      
      {/* Add the performance check overlay */}
      {/* It's recommended to only render this in development environments */}
      {process.env.NODE_ENV === 'development' && <AIPerformanceCheck />}
    </div>
  );
}

export default App;
```

The component renders `null` and injects the overlay into the DOM, so it won't interfere with your component tree.

### 2. Vanilla JavaScript

If you're not using React, you can import and call the `initAIPerformanceCheck` function. This is useful for static sites, or projects using other frameworks like Vue, Svelte, or Angular.

```javascript
// In your main entry point file (e.g., index.js or app.js)
import { initAIPerformanceCheck } from '@hasseneafif/ai-performance-check';

// Call the function to initialize the overlay
// It's recommended to only do this in development environments
if (process.env.NODE_ENV === 'development') {
    initAIPerformanceCheck();
}
```

The function will handle DOM readiness and inject the overlay when the page is ready.

## How it Works

The overlay uses the `PerformanceObserver` API to gather metrics. When the page loads, it sends this data to a free, lightweight AI API (`apifree.min.js`) to generate a brief analysis and improvement suggestions.

---

**Note:** This tool is intended for development and debugging purposes. While it's lightweight, you should avoid including it in your production bundle.
