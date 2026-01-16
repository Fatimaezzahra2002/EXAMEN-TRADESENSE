import React, { useEffect, useRef } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
  interval?: string;
  containerId: string;
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({ 
  symbol = 'AAPL', 
  interval = '1', 
  containerId 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Remove any existing widget containers
    const existingContainer = document.getElementById(`${containerId}-tv`);
    if (existingContainer) {
      existingContainer.remove();
    }

    // Create new container
    const tvContainer = document.createElement('div');
    tvContainer.id = `${containerId}-tv`;
    tvContainer.style.height = '100%';
    tvContainer.style.width = '100%';
    containerRef.current.appendChild(tvContainer);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.type = 'text/javascript';
    
    script.onload = () => {
      // Wait a bit for the TradingView object to be available
      setTimeout(() => {
        const w = window as any;
        if (w.TradingView) {
          new w.TradingView.widget({
            autosize: true,
            symbol: symbol,
            interval: interval,
            timezone: 'Etc/UTC',
            theme: 'dark',
            style: '1',
            locale: 'en',
            toolbar_bg: '#f1f3f6',
            enable_publishing: false,
            hide_top_toolbar: false,
            hide_legend: false,
            save_image: false,
            container_id: `${containerId}-tv`,
          });
        } else {
          console.error('TradingView object not available after script load');
          // Fallback to show error message
          const errorDiv = document.createElement('div');
          errorDiv.textContent = 'Failed to load TradingView widget';
          errorDiv.style.color = 'red';
          errorDiv.style.textAlign = 'center';
          errorDiv.style.padding = '20px';
          tvContainer.appendChild(errorDiv);
        }
      }, 500);
    };

    script.onerror = () => {
      console.error('Failed to load TradingView script');
      // Fallback to show error message
      const errorDiv = document.createElement('div');
      errorDiv.textContent = 'Failed to load TradingView widget';
      errorDiv.style.color = 'red';
      errorDiv.style.textAlign = 'center';
      errorDiv.style.padding = '20px';
      tvContainer.appendChild(errorDiv);
    };

    document.head.appendChild(script);

    return () => {
      // Clean up script and container
      document.head.removeChild(script);
      if (tvContainer.parentNode) {
        tvContainer.parentNode.removeChild(tvContainer);
      }
    };
  }, [symbol, interval, containerId]);

  return <div ref={containerRef} id={containerId} style={{ height: '400px', width: '100%' }} />;
};

export default TradingViewWidget;