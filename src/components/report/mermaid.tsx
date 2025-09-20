'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { useTheme } from 'next-themes';

type MermaidProps = {
  chart: string;
};

// Generate a random ID for the mermaid diagram
const randomId = () => `mermaid-diagram-${Math.random().toString(36).substring(2, 9)}`;

const Mermaid = ({ chart }: MermaidProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [diagramId] = useState(randomId());
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    const currentTheme = resolvedTheme === 'dark' ? 'dark' : 'neutral';
    
    mermaid.initialize({ 
      startOnLoad: false, 
      theme: currentTheme,
      flowchart: {
        useMaxWidth: true,
      }
    });

    const renderMermaid = async () => {
      if (containerRef.current && chart) {
        try {
          const { svg } = await mermaid.render(diagramId, chart);
          if (containerRef.current) {
             containerRef.current.innerHTML = svg;
          }
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          if (containerRef.current) {
            containerRef.current.innerHTML = `<p class="text-destructive">Error rendering diagram. Please check syntax.</p><pre class="text-sm bg-muted p-2 rounded">${chart}</pre>`;
          }
        }
      }
    };
    
    renderMermaid();

  }, [chart, diagramId, resolvedTheme]);

  return <div ref={containerRef} className="w-full flex justify-center" />;
};

export default Mermaid;
