
import React from 'react';
import { AIPerformanceCheck } from './components/ai-performance-check';

function App() {
  return (
    <div className="text-white min-h-screen flex flex-col items-center justify-center text-center p-4">
      <div className="max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600">
          AI Performance Check Demo
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          The AI-powered performance monitoring overlay should be visible in the bottom-right corner of your screen.
          It provides real-time metrics and analysis of this page's performance.
        </p>
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-3">How to use it</h2>
          <p className="text-gray-300">
            This entire overlay is rendered by a single React component: <code className="bg-gray-700 text-purple-300 px-2 py-1 rounded">&lt;AIPerformanceCheck /&gt;</code>.
            Just drop it into your app's main layout during development to get instant feedback.
          </p>
        </div>
      </div>
      
      {/* 
        This is the component from the package. 
        It renders null and injects the overlay into the DOM.
        In a real app, you would likely only render this in development mode, e.g.:
        {process.env.NODE_ENV === 'development' && <AIPerformanceCheck />}
      */}
      <AIPerformanceCheck />
    </div>
  );
}

export default App;
