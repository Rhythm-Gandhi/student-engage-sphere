
import { Link } from "react-router-dom";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEvents } from "@/hooks/use-events";
import { useState } from "react";

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

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Events Calendar</h1>
      
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
                          className="w-full justify-start text-left font-normal py-0.5"
                          style={{ borderColor: `var(--category-${event.category})` }}
                        >
                          {event.title}
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
    </div>
  );
};

export default Calendar;
