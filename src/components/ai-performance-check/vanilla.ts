
// Add declarations for third-party scripts to satisfy TypeScript
declare global {
  interface Window {
    apifree?: {
      chat: (prompt: string) => Promise<string>;
    };
    __perfLCP?: string;
  }
}

/**
 * Initializes the AI Performance Check overlay.
 * This function is idempotent and will only create the overlay once.
 */
export function initAIPerformanceCheck() {
  // Prevent multiple initializations
  if (document.getElementById("perf-overlay-ui")) {
    return;
  }

  // Load the AI API script if it doesn't exist
  if (!document.querySelector('script[src="https://apifreellm.com/apifree.min.js"]')) {
    const script = document.createElement('script');
    script.src = 'https://apifreellm.com/apifree.min.js';
    script.async = true;
    document.head.appendChild(script);
  }
  
  function initPerfOverlay() {
    console.log("✅ AI Performance Check loading...");

    const overlay = document.createElement("div");
    overlay.id = "perf-overlay-ui";
    
    function getOverlayPosition() {
      const vw = window.innerWidth;
      if (vw < 768) {
        return {
          position: "fixed",
          bottom: "12px",
          left: "12px",
          right: "12px",
          width: "auto",
          maxWidth: "none"
        };
      } else {
        return {
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "320px",
          maxWidth: "calc(100vw - 48px)"
        };
      }
    }

    function applyOverlayStyles() {
      const position = getOverlayPosition();
      Object.assign(overlay.style, {
        ...position,
        background: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        borderRadius: "20px",
        padding: "0",
        zIndex: "999999",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontSize: "14px",
        color: "#ffffff",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "default",
        userSelect: "none",
        overflow: "hidden",
        maxHeight: "calc(100vh - 48px)"
      });
    }

    applyOverlayStyles();

    const header = document.createElement("div");
    Object.assign(header.style, {
      padding: "20px 24px 16px",
      background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    });

    const title = document.createElement("div");
    title.innerHTML = "⚡ Performance";
    Object.assign(title.style, {
      fontSize: "16px",
      fontWeight: "600",
      color: "#ffffff",
      display: "flex",
      alignItems: "center",
      gap: "8px"
    });

    const status = document.createElement("div");
    status.innerHTML = "🔄";
    Object.assign(status.style, { fontSize: "14px", opacity: "0.7" });

    header.appendChild(title);
    header.appendChild(status);
    overlay.appendChild(header);

    const content = document.createElement("div");
    Object.assign(content.style, { padding: "20px 24px" });
    const metricsContainer = document.createElement("div");
    content.appendChild(metricsContainer);
    overlay.appendChild(content);

    const aiSection = document.createElement("div");
    Object.assign(aiSection.style, {
      background: "linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)",
      border: "1px solid rgba(147, 51, 234, 0.3)",
      borderRadius: "16px",
      margin: "0 24px 16px",
      padding: "16px",
      transition: "all 0.3s ease"
    });

    const aiHeader = document.createElement("div");
    aiHeader.innerHTML = "🤖 AI Analysis";
    Object.assign(aiHeader.style, {
      fontSize: "14px",
      fontWeight: "600",
      color: "#c084fc",
      marginBottom: "12px",
      display: "flex",
      alignItems: "center",
      gap: "8px"
    });

    const aiContent = document.createElement("div");
    aiContent.innerHTML = "Waiting for page load...";
    Object.assign(aiContent.style, {
      fontSize: "12px",
      lineHeight: "1.5",
      color: "#e0e7ff",
      opacity: "0.9",
      maxHeight: "120px",
      overflowY: "auto",
      paddingRight: "5px"
    });

    aiContent.style.scrollbarWidth = "thin";
    aiContent.style.scrollbarColor = "#c084fc rgba(147, 51, 234, 0.2)";
    aiContent.classList.add('ai-content');

    const style = document.createElement('style');
    style.textContent = `
      #perf-overlay-ui .ai-content::-webkit-scrollbar { width: 6px; }
      #perf-overlay-ui .ai-content::-webkit-scrollbar-track { background: rgba(147, 51, 234, 0.2); border-radius: 3px; }
      #perf-overlay-ui .ai-content::-webkit-scrollbar-thumb { background: #c084fc; border-radius: 3px; }
    `;
    document.head.appendChild(style);

    aiSection.appendChild(aiHeader);
    aiSection.appendChild(aiContent);
    overlay.appendChild(aiSection);

    const expandButton = document.createElement("button");
    expandButton.innerHTML = "View Details";
    Object.assign(expandButton.style, {
      width: "100%", padding: "12px 24px", background: "rgba(255, 255, 255, 0.08)",
      border: "1px solid rgba(255, 255, 255, 0.15)", borderRadius: "0 0 20px 20px",
      color: "#ffffff", fontSize: "13px", fontWeight: "500", cursor: "pointer",
      transition: "all 0.2s ease", outline: "none"
    });

    expandButton.onmouseenter = () => {
      expandButton.style.background = "rgba(255, 255, 255, 0.12)";
      expandButton.style.borderColor = "rgba(255, 255, 255, 0.25)";
    };
    expandButton.onmouseleave = () => {
      expandButton.style.background = "rgba(255, 255, 255, 0.08)";
      expandButton.style.borderColor = "rgba(255, 255, 255, 0.15)";
    };

    const detailsContainer = document.createElement("div");
    Object.assign(detailsContainer.style, {
      maxHeight: "0", overflow: "auto", transition: "max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      background: "rgba(0, 0, 0, 0.4)", borderTop: "1px solid rgba(255, 255, 255, 0.08)"
    });
    const detailsContent = document.createElement("div");
    Object.assign(detailsContent.style, { padding: "20px 24px", fontSize: "12px", lineHeight: "1.6", color: "#e0e0e0" });
    detailsContainer.appendChild(detailsContent);
    overlay.appendChild(detailsContainer);
    overlay.appendChild(expandButton);

    let expanded = false;
    expandButton.addEventListener("click", () => {
      expanded = !expanded;
      const vw = window.innerWidth;
      if (expanded) {
        detailsContainer.style.maxHeight = `${Math.min(300, window.innerHeight * 0.4)}px`;
        expandButton.innerHTML = "Hide Details";
        if (vw >= 768) overlay.style.width = "380px";
      } else {
        detailsContainer.style.maxHeight = "0";
        expandButton.innerHTML = "View Details";
        if (vw >= 768) overlay.style.width = "320px";
      }
    });

    document.body.appendChild(overlay);
    window.addEventListener("resize", () => {
      applyOverlayStyles();
      if (expanded && window.innerWidth >= 768) {
        overlay.style.width = "380px";
      } else if (window.innerWidth >= 768) {
        overlay.style.width = "320px";
      }
    });

    function createMetric(label: string, value: string, unit = "", color = "#4ade80") {
      const metric = document.createElement("div");
      Object.assign(metric.style, {
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "8px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.08)"
      });
      const labelEl = document.createElement("span");
      labelEl.textContent = label;
      Object.assign(labelEl.style, { color: "#e0e0e0", fontSize: "13px" });
      const valueEl = document.createElement("span");
      valueEl.innerHTML = `<strong>${value}</strong>${unit}`;
      Object.assign(valueEl.style, { color: color, fontSize: "14px", fontWeight: "600" });
      metric.appendChild(labelEl);
      metric.appendChild(valueEl);
      return metric;
    }

    function getPerformanceGrade(timing: number) {
      if (timing < 1) return { color: "#4ade80" };
      if (timing < 2.5) return { color: "#fbbf24" };
      return { color: "#f87171" };
    }

    let aiApiCalled = false;
    async function analyzePerformance() {
      if (aiApiCalled) return;
      try {
        aiApiCalled = true;
        aiContent.innerHTML = "🔄 AI analyzing page...";
        let attempts = 0;
        while (typeof window.apifree === 'undefined' && attempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
        if (typeof window.apifree === 'undefined') throw new Error('AI API not available');

        const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
        const paints = performance.getEntriesByType("paint") || [];
        
        let performanceData = "Website performance metrics:\n";
        if (nav) {
          performanceData += `- DOM Interactive: ${(nav.domInteractive / 1000).toFixed(2)}s\n`;
          performanceData += `- Page Load: ${(nav.loadEventEnd / 1000).toFixed(2)}s\n`;
        }
        paints.forEach(paint => {
          performanceData += `- ${paint.name}: ${(paint.startTime / 1000).toFixed(2)}s\n`;
        });
        if (window.__perfLCP) {
          performanceData += `- Largest Contentful Paint: ${window.__perfLCP}s\n`;
        }

        performanceData += "\nProvide a brief, actionable analysis (max 3 sentences) of this website's performance. Focus on potential improvements.";
        
        const response = await window.apifree.chat(performanceData);
        aiContent.innerHTML = response.replace(/```[\s\S]*?```/g, '').trim() || "Performance analysis completed.";
        
      } catch (error) {
        console.warn("AI Analysis error:", error);
        aiContent.innerHTML = "AI currently unavailable.";
      }
    }

    function renderMetrics() {
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      const paints = performance.getEntriesByType("paint") || [];
      
      metricsContainer.innerHTML = "";
      status.innerHTML = "✅";

      if (nav) {
        const interactive = nav.domInteractive / 1000;
        const load = nav.loadEventEnd / 1000;
        metricsContainer.appendChild(createMetric("DOM Interactive", interactive.toFixed(2), "s", getPerformanceGrade(interactive).color));
        metricsContainer.appendChild(createMetric("Page Load", load.toFixed(2), "s", getPerformanceGrade(load).color));
      }

      paints.forEach(paint => {
        const timing = paint.startTime / 1000;
        const name = paint.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        metricsContainer.appendChild(createMetric(name, timing.toFixed(2), "s", getPerformanceGrade(timing).color));
      });

      if (window.__perfLCP) {
        const lcpGrade = getPerformanceGrade(parseFloat(window.__perfLCP));
        metricsContainer.appendChild(createMetric("Largest Contentful Paint", window.__perfLCP, "s", lcpGrade.color));
      }
    }

    function renderDetails() {
      const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
      const totalSize = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
      
      let html = `<div style="margin-bottom: 16px;">
          <div style="color: #ffffff; font-weight: 600; margin-bottom: 8px;">📊 Resource Summary</div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span>Total Resources:</span><span style="color: #80d4ff;">${resources.length}</span></div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;"><span>Total Transfer Size:</span><span style="color: #4ade80;">${(totalSize / 1024).toFixed(1)} KB</span></div>
        </div><div><div style="color: #ffffff; font-weight: 600; margin-bottom: 8px;">🐌 Slowest Resources</div>`;

      [...resources].sort((a, b) => b.duration - a.duration).slice(0, 5).forEach(res => {
        const name = res.name.split('/').pop()?.split('?')[0] || '...';
        html += `<div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 11px;"><span style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${res.name}">${res.initiatorType}: ${name}</span><span style="color: #ffb347; margin-left: 8px;">${(res.duration).toFixed(0)}ms</span></div>`;
      });
      html += "</div>";
      detailsContent.innerHTML = html;
    }

    if (typeof window.PerformanceObserver !== 'undefined') {
      new PerformanceObserver(list => {
        const entries = list.getEntries();
        if (entries.length > 0) {
            const lcpEntry = entries[entries.length-1];
            window.__perfLCP = (lcpEntry.startTime / 1000).toFixed(2);
            renderMetrics();
        }
      }).observe({ type: "largest-contentful-paint", buffered: true });
    }

    let initialLoadCompleted = false;
    const onPageLoad = () => {
        if (initialLoadCompleted) return;
        setTimeout(() => {
            renderMetrics();
            renderDetails();
            analyzePerformance();
            initialLoadCompleted = true;
        }, 100);
    };

    if (document.readyState === "complete") {
      onPageLoad();
    } else {
      window.addEventListener("load", onPageLoad);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPerfOverlay);
  } else {
    initPerfOverlay();
  }
}
