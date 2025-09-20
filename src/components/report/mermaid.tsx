'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

type MermaidProps = {
  chart: string;
};

// Generate a random ID for the mermaid diagram
const randomId = () => `mermaid-diagram-${Math.random().toString(36).substring(2, 9)}`;

const Mermaid = ({ chart }: MermaidProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const diagramId = randomId();

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, theme: 'neutral' });

    const renderMermaid = async () => {
      if (containerRef.current && chart) {
        try {
          const { svg } = await mermaid.render(diagramId, chart);
          containerRef.current.innerHTML = svg;
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          if (containerRef.current) {
            containerRef.current.innerHTML = `<p class="text-destructive">Error rendering diagram. Please check syntax.</p><pre class="text-sm bg-muted p-2 rounded">${chart}</pre>`;
          }
        }
      }
    };
    
    renderMermaid();

  }, [chart, diagramId]);

  return <div ref={containerRef} className="w-full flex justify-center" />;
};

export default Mermaid;
