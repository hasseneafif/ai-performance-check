
import React, { useEffect } from 'react';
import { initAIPerformanceCheck } from './vanilla';
import type { AIPerformanceCheckProps } from './types';

/**
 * A React component that renders a performance monitoring overlay.
 * The component itself renders null and injects the overlay into the DOM.
 * It is recommended to only use this component in development environments.
 */
export const AIPerformanceCheck: React.FC<AIPerformanceCheckProps> = ({ enabled = true }) => {
  useEffect(() => {
    // We only want to run this in the browser, not during SSR.
    if (enabled && typeof window !== 'undefined') {
      initAIPerformanceCheck();
    }
  }, [enabled]);

  return null; // This component does not render anything itself.
};
