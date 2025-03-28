
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EventList } from "@/components/EventList";
import { useEvents } from "@/hooks/use-events";
import { EventFilter } from "@/types";

const AllEvents = () => {
  const [filter, setFilter] = useState<EventFilter>({});
  const { events, loading, error } = useEvents(filter);

  const handleFilterChange = (newFilter: EventFilter) => {
    setFilter(prevFilter => ({ ...prevFilter, ...newFilter }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    handleFilterChange({ query });
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Events</h1>
          <p className="text-muted-foreground mt-2">
            Browse and filter all upcoming campus events
          </p>
        </div>
        <div className="relative mt-4 md:mt-0 w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-9"
            onChange={handleSearch}
          />
        </div>
      </div>
      
      <EventList 
        events={events}
        loading={loading}
        error={error}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
};

export default AllEvents;
