
import { Calendar, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Event } from "@/types";
import { useAttendEvent } from "@/hooks/use-events";
import { formatDate } from "@/lib/utils";

interface EventCardProps {
  event: Event;
  featured?: boolean;
}

export function EventCard({ event, featured = false }: EventCardProps) {
  const { isAttending, toggleAttend, isUpdating } = useAttendEvent();
  const attending = isAttending(event.id);

  const handleAttend = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleAttend(event.id);
  };

  return (
    <Link 
      to={`/event/${event.id}`}
      className={`event-card group flex flex-col animate-fade-in ${
        featured ? "md:flex-row md:gap-6" : ""
      }`}
    >
      <div 
        className={`relative overflow-hidden rounded-lg ${
          featured ? "md:w-1/3 h-48 md:h-auto" : "h-48"
        }`}
      >
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute top-2 left-2">
          <Badge 
            style={{ backgroundColor: `var(--category-${event.category})` }}
            className="text-white"
          >
            {event.category}
          </Badge>
        </div>
      </div>
      
      <div className={`flex flex-col ${featured ? "md:w-2/3" : ""} mt-4`}>
        <h3 className="font-bold text-lg transition-colors group-hover:text-primary">
          {event.title}
        </h3>
        
        <p className="text-muted-foreground line-clamp-2 text-sm mt-1">
          {event.description}
        </p>
        
        <div className="mt-4 flex flex-col space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            <span>{formatDate(event.date)} • {event.time}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4" />
            <span>{event.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="mr-2 h-4 w-4" />
            <span>{event.attendees + (attending ? 1 : 0)} attending</span>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm font-medium">By {event.organizer}</span>
          <Button 
            size="sm" 
            variant={attending ? "default" : "outline"}
            onClick={handleAttend}
            disabled={isUpdating}
            className="transition-all"
          >
            {attending ? "Attending" : "Attend"}
          </Button>
        </div>
      </div>
    </Link>
  );
}
