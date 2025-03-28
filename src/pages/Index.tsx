
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EventList } from "@/components/EventList";
import { FeaturedEvent } from "@/components/FeaturedEvent";
import { CampusMap } from "@/components/CampusMap";
import { useEvents } from "@/hooks/use-events";
import { EventFilter } from "@/types";

const Index = () => {
  const [filter, setFilter] = useState<EventFilter>({});
  const { events, loading, error } = useEvents(filter);
  const featuredEvent = events[0] || null;
  
  const handleFilterChange = (newFilter: EventFilter) => {
    setFilter(prevFilter => ({ ...prevFilter, ...newFilter }));
  };

  const handleMapEventSelect = (eventId: string) => {
    // Redirect to event page when clicking on map
    window.location.href = `/event/${eventId}`;
  };

  return (
    <div className="container py-8">
      <section className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Campus Events</h1>
            <p className="text-muted-foreground mt-2">
              Discover and attend the best events happening around campus
            </p>
          </div>
          <Button asChild className="mt-4 md:mt-0">
            <Link to="/events">View All Events</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FeaturedEvent event={featuredEvent} loading={loading} />
          </div>
          <div className="lg:col-span-1">
            <CampusMap onSelectEvent={handleMapEventSelect} />
          </div>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold tracking-tight mb-6">Upcoming Events</h2>
        <EventList 
          events={events.slice(1)} // Skip the featured event
          loading={loading}
          error={error}
          onFilterChange={handleFilterChange}
        />
      </section>
    </div>
  );
};

export default Index;
