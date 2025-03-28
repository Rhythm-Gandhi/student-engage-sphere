
import { useState } from "react";
import { Event, EventFilter } from "@/types";
import { EventCard } from "@/components/EventCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Skeleton } from "@/components/ui/skeleton";

interface EventListProps {
  events: Event[];
  loading: boolean;
  error: string | null;
  onFilterChange?: (filter: EventFilter) => void;
}

export function EventList({ events, loading, error, onFilterChange }: EventListProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (onFilterChange) {
      onFilterChange({ 
        category: category === "all" ? undefined : category 
      });
    }
  };

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-destructive">{error}</p>
        <button 
          className="mt-4 text-primary hover:underline"
          onClick={() => window.location.reload()}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CategoryFilter 
        activeCategory={activeCategory} 
        onChange={handleCategoryChange} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="event-card space-y-4">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          ))
        ) : events.length === 0 ? (
          <div className="col-span-full p-8 text-center">
            <p className="text-muted-foreground">No events found. Try adjusting your filters.</p>
          </div>
        ) : (
          events.map(event => (
            <EventCard key={event.id} event={event} />
          ))
        )}
      </div>
    </div>
  );
}
