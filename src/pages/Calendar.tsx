
import { Link } from "react-router-dom";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEvents } from "@/hooks/use-events";
import { useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useCheckIn } from "@/hooks/use-check-in";
import { useRecommendations } from "@/hooks/use-recommendations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Group events by date
const groupEventsByDate = (events: any[]) => {
  return events.reduce((acc, event) => {
    if (!acc[event.date]) {
      acc[event.date] = [];
    }
    acc[event.date].push(event);
    return acc;
  }, {} as Record<string, any[]>);
};

// Get days in month
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

// Get day of week (0-6) for first day of month
const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

const Calendar = () => {
  const { events } = useEvents();
  const [currentDate, setCurrentDate] = useState(new Date());
  const { userProfile } = useCheckIn();
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  
  // Create calendar days array
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const day = i - firstDayOfMonth + 1;
    if (day > 0 && day <= daysInMonth) {
      return day;
    }
    return null;
  });
  
  // Format date string for lookup in events
  const formatDateString = (day: number | null) => {
    if (day === null) return '';
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };
  
  // Group events by date
  const eventsByDate = groupEventsByDate(events);
  
  // Check if a date has events
  const hasEvents = (day: number | null) => {
    if (day === null) return false;
    const dateString = formatDateString(day);
    return !!eventsByDate[dateString]?.length;
  };
  
  // Get events for a specific date
  const getEventsForDate = (day: number | null) => {
    if (day === null) return [];
    const dateString = formatDateString(day);
    return eventsByDate[dateString] || [];
  };
  
  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  
  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  // Set to current month
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get attended events for recommendations
  const attendedEvents = events.filter(event => 
    userProfile.attendedEvents.includes(event.id)
  );
  
  // Get events the user is registered for
  const registeredEvents = events.filter(event => event.isRegistered);
  
  // Get event recommendations
  const { recommendations, recommendationReason } = useRecommendations(
    events, 
    userProfile,
    registeredEvents
  );

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Events Calendar</h1>
      
      {/* Event Recommendations */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Recommended for You</CardTitle>
            <CardDescription>{recommendationReason}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.length > 0 ? (
                recommendations.map(event => (
                  <Link 
                    key={event.id} 
                    to={`/event/${event.id}`}
                    className="block hover:no-underline"
                  >
                    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="h-32 overflow-hidden">
                        <img 
                          src={event.image} 
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <Badge 
                          style={{ backgroundColor: `var(--category-${event.category})` }}
                          className="text-white mb-2"
                        >
                          {event.category}
                        </Badge>
                        <h3 className="font-medium text-foreground">{event.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(event.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-3 py-8 text-center">
                  <p className="text-muted-foreground">No recommendations available at this time.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b">
          <h2 className="text-xl font-medium">{monthName} {year}</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 text-center border-b">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div 
              key={day} 
              className="py-2 text-sm font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 auto-rows-fr">
          {calendarDays.map((day, index) => (
            <div 
              key={index} 
              className={`
                min-h-[100px] border-b border-r p-1 relative
                ${day === null ? 'bg-muted/20' : ''}
                ${
                  day === new Date().getDate() && 
                  month === new Date().getMonth() && 
                  year === new Date().getFullYear()
                    ? 'bg-muted/50'
                    : ''
                }
              `}
            >
              {day !== null && (
                <>
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium p-1">{day}</span>
                    {hasEvents(day) && (
                      <CalendarIcon className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="mt-1 space-y-1">
                    {getEventsForDate(day).slice(0, 3).map((event) => (
                      <Link
                        key={event.id}
                        to={`/event/${event.id}`}
                        className="block text-xs truncate hover:text-primary"
                      >
                        <Badge 
                          variant="outline" 
                          className="w-full justify-start text-left font-normal py-0.5 flex items-center gap-1"
                          style={{ borderColor: `var(--category-${event.category})` }}
                        >
                          {userProfile.attendedEvents.includes(event.id) && (
                            <CheckCircle className="h-2.5 w-2.5 text-green-500 flex-shrink-0" />
                          )}
                          <span className="truncate">{event.title}</span>
                        </Badge>
                      </Link>
                    ))}
                    {getEventsForDate(day).length > 3 && (
                      <span className="text-xs text-muted-foreground block text-center">
                        +{getEventsForDate(day).length - 3} more
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* PWA installation prompt */}
      <Alert className="mt-8">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Install as App</AlertTitle>
        <AlertDescription>
          This site can be installed as an app on your device for offline access to event information.
          Look for the "Add to Home Screen" option in your browser menu.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default Calendar;
