
import { EventCard } from "@/components/EventCard";
import { Event } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface FeaturedEventProps {
  event: Event | null;
  loading: boolean;
}

export function FeaturedEvent({ event, loading }: FeaturedEventProps) {
  if (loading) {
    return (
      <div className="rounded-xl border bg-card p-0 overflow-hidden">
        <Skeleton className="h-64 w-full" />
        <div className="p-6 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <div className="rounded-xl overflow-hidden border bg-card p-0">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end text-white p-6">
          <h2 className="text-2xl md:text-3xl font-bold">{event.title}</h2>
          <p className="text-white/80 line-clamp-2 mt-2">{event.description}</p>
        </div>
      </div>
      <div className="p-4">
        <EventCard event={event} featured />
      </div>
    </div>
  );
}
