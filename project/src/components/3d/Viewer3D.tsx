import React, { useRef, useEffect } from 'react';
import { RotateCcw, ZoomIn, ZoomOut, Move3D, Eye } from 'lucide-react';

interface Viewer3DProps {
  data?: any;
  viewMode?: 'rgb' | 'intensity' | 'height';
  showWireframe?: boolean;
  overlayData?: any;
  onViewModeChange?: (mode: string) => void;
  className?: string;
  stats?: {
    pointCount: number;
    density: number;
    bounds: string;
  };
}

export const Viewer3D: React.FC<Viewer3DProps> = ({
  data,
  viewMode = 'rgb',
  showWireframe = false,
  overlayData,
  onViewModeChange,
  className = '',
  stats
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to fit container
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mock 3D point cloud visualization
    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw mock point cloud
      const centerX = canvas.width / (2 * window.devicePixelRatio);
      const centerY = canvas.height / (2 * window.devicePixelRatio);
      
      // Generate mock points
      for (let i = 0; i < 1000; i++) {
        const angle = (time * 0.001 + i * 0.1) % (Math.PI * 2);
        const radius = 50 + Math.sin(i * 0.1) * 30;
        const height = Math.sin(i * 0.05 + time * 0.002) * 20;
        
        const x = centerX + Math.cos(angle) * radius + Math.sin(i * 0.2) * 10;
        const y = centerY + Math.sin(angle) * radius * 0.5 + height;
        
        // Color based on view mode
        let color;
        switch (viewMode) {
          case 'intensity':
            const intensity = Math.sin(i * 0.1) * 127 + 128;
            color = `rgb(${intensity}, ${intensity}, ${intensity})`;
            break;
          case 'height':
            const heightColor = Math.sin(i * 0.05) * 127 + 128;
            color = `rgb(${heightColor}, ${255 - heightColor}, 100)`;
            break;
          default:
            color = `hsl(${(i * 5) % 360}, 70%, 60%)`;
        }
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw wireframe overlay if enabled
      if (showWireframe && overlayData) {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        // Draw mock cylinder
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, 80, 40, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.ellipse(centerX, centerY - 60, 80, 40, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // Connect top and bottom ellipses
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(centerX - 80, centerY);
        ctx.lineTo(centerX - 80, centerY - 60);
        ctx.moveTo(centerX + 80, centerY);
        ctx.lineTo(centerX + 80, centerY - 60);
        ctx.stroke();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [viewMode, showWireframe, overlayData]);

  return (
    <div className={`viewer-3d relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
      
      {/* Controls */}
      <div className="viewer-controls">
        <button
          className="p-2 glass-panel rounded-lg hover:bg-white/20 transition-colors"
          title="重置视角"
        >
          <RotateCcw className="w-4 h-4 text-white" />
        </button>
        
        <button
          className="p-2 glass-panel rounded-lg hover:bg-white/20 transition-colors"
          title="放大"
        >
          <ZoomIn className="w-4 h-4 text-white" />
        </button>
        
        <button
          className="p-2 glass-panel rounded-lg hover:bg-white/20 transition-colors"
          title="缩小"
        >
          <ZoomOut className="w-4 h-4 text-white" />
        </button>
        
        <button
          className="p-2 glass-panel rounded-lg hover:bg-white/20 transition-colors"
          title="平移"
        >
          <Move3D className="w-4 h-4 text-white" />
        </button>
      </div>
      
      {/* View Mode Controls */}
      <div className="absolute top-2 left-2 flex space-x-1">
        {['rgb', 'intensity', 'height'].map((mode) => (
          <button
            key={mode}
            onClick={() => onViewModeChange?.(mode)}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              viewMode === mode
                ? 'bg-blue-500 text-white'
                : 'glass-panel text-gray-300 hover:bg-white/20'
            }`}
          >
            {mode.toUpperCase()}
          </button>
        ))}
      </div>
      
      {/* Stats Overlay */}
      {stats && (
        <div className="viewer-stats">
          <div className="text-xs space-y-1">
            <div>总点数: {stats.pointCount.toLocaleString()}</div>
            <div>密度: {stats.density.toFixed(2)}/m²</div>
            <div>范围: {stats.bounds}</div>
          </div>
        </div>
      )}
    </div>
  );
};