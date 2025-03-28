
import { useRef, useEffect } from "react";
import { events } from "@/data/events";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface CampusMapProps {
  activeEventId?: string;
  onSelectEvent?: (eventId: string) => void;
}

export function CampusMap({ activeEventId, onSelectEvent }: CampusMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        drawMap();
      }
    };
    
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Draw campus map
    function drawMap() {
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw campus background
      ctx.fillStyle = "#e5e7eb";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw campus buildings
      ctx.fillStyle = "#d1d5db";
      
      // Main building
      ctx.fillRect(canvas.width / 2 - 100, canvas.height / 2 - 100, 200, 200);
      
      // Library
      ctx.fillRect(canvas.width / 2 - 250, canvas.height / 2 - 50, 100, 100);
      
      // Student center
      ctx.fillRect(canvas.width / 2 + 150, canvas.height / 2 - 70, 120, 140);
      
      // Sports complex
      ctx.fillRect(canvas.width / 2 - 50, canvas.height / 2 + 150, 150, 100);
      
      // Science building
      ctx.fillRect(canvas.width / 2 - 200, canvas.height / 2 - 200, 150, 80);

      // Draw paths
      ctx.strokeStyle = "#9ca3af";
      ctx.lineWidth = 4;
      ctx.beginPath();
      
      // Main horizontal path
      ctx.moveTo(canvas.width / 2 - 300, canvas.height / 2);
      ctx.lineTo(canvas.width / 2 + 300, canvas.height / 2);
      
      // Main vertical path
      ctx.moveTo(canvas.width / 2, canvas.height / 2 - 250);
      ctx.lineTo(canvas.width / 2, canvas.height / 2 + 250);
      
      // Connection to student center
      ctx.moveTo(canvas.width / 2 + 100, canvas.height / 2);
      ctx.lineTo(canvas.width / 2 + 150, canvas.height / 2);
      
      // Connection to library
      ctx.moveTo(canvas.width / 2 - 100, canvas.height / 2);
      ctx.lineTo(canvas.width / 2 - 150, canvas.height / 2);
      
      ctx.stroke();

      // Draw event locations
      events.forEach(event => {
        if (!event.mapPosition) return;
        
        const [x, y] = event.mapPosition;
        
        // Transform coordinates to canvas space
        const canvasX = canvas.width / 2 + x * 30;
        const canvasY = canvas.height / 2 + y * 30;
        
        // Draw pin
        const isActive = event.id === activeEventId;
        
        ctx.fillStyle = isActive 
          ? `var(--color-primary-600)` 
          : `var(--category-${event.category}, #6366f1)`;
        
        // Pin circle
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, isActive ? 12 : 8, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add halo for active event
        if (isActive) {
          ctx.strokeStyle = `var(--color-primary-400)`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(canvasX, canvasY, 16, 0, 2 * Math.PI);
          ctx.stroke();
          
          // Pulse animation
          const now = Date.now();
          const pulse = Math.sin(now / 200) * 0.5 + 0.5;
          
          ctx.strokeStyle = `rgba(99, 102, 241, ${0.3 + pulse * 0.2})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(canvasX, canvasY, 20 + pulse * 5, 0, 2 * Math.PI);
          ctx.stroke();
        }
      });
    }

    // Animation loop
    let animationId: number;
    const animate = () => {
      drawMap();
      animationId = requestAnimationFrame(animate);
    };
    
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [activeEventId]);

  return (
    <div className="rounded-xl border overflow-hidden bg-card p-0 h-[400px] relative">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full" 
      />
      <div className="absolute bottom-4 left-4 right-4 bg-card/80 backdrop-blur-sm p-3 rounded-lg border shadow-sm">
        <h3 className="font-medium flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-primary" />
          Campus Map
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Find events across campus. Click on pins to see event details.
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {events.slice(0, 3).map(event => (
            <Button 
              key={event.id}
              variant="outline" 
              size="sm"
              className="text-xs"
              onClick={() => onSelectEvent?.(event.id)}
            >
              <div 
                className="w-2 h-2 rounded-full mr-1.5"
                style={{ backgroundColor: `var(--category-${event.category})` }}
              />
              {event.title.slice(0, 20)}...
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
