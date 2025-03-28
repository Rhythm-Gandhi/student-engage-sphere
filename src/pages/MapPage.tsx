
import { useState } from "react";
import { Link } from "react-router-dom";
import { useEvents } from "@/hooks/use-events";
import { CampusMap } from "@/components/CampusMap";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/EventCard";

const MapPage = () => {
  const [activeEventId, setActiveEventId] = useState<string | undefined>();
  const { events } = useEvents();
  
  const activeEvent = events.find(event => event.id === activeEventId);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Campus Map</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="h-[600px] rounded-xl border overflow-hidden">
            <CampusMap 
              activeEventId={activeEventId} 
              onSelectEvent={setActiveEventId}
            />
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-card rounded-xl border p-6">
            <h2 className="text-xl font-semibold mb-4">
              {activeEvent ? "Selected Event" : "Event Information"}
            </h2>
            
            {activeEvent ? (
              <div className="space-y-4">
                <EventCard event={activeEvent} />
                <Button asChild className="w-full">
                  <Link to={`/event/${activeEvent.id}`}>View Details</Link>
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Click on an event marker on the map to see details.
              </p>
            )}
          </div>
          
          <div className="bg-card rounded-xl border p-6">
            <h2 className="text-xl font-semibold mb-4">Legend</h2>
            <div className="space-y-3">
              {["workshop", "social", "academic", "sports", "career"].map((category) => (
                <div key={category} className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: `var(--category-${category})` }}
                  />
                  <span className="capitalize">{category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
