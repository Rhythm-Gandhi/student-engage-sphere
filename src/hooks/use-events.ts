
import { useEffect, useState } from "react";
import { Event, EventFilter } from "@/types";
import { events as mockEvents } from "@/data/events";

export function useEvents(filter?: EventFilter) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call delay
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        let filteredEvents = [...mockEvents];

        if (filter) {
          if (filter.category && filter.category !== "all") {
            filteredEvents = filteredEvents.filter(
              event => event.category === filter.category
            );
          }

          if (filter.date) {
            filteredEvents = filteredEvents.filter(
              event => event.date === filter.date
            );
          }

          if (filter.query) {
            const query = filter.query.toLowerCase();
            filteredEvents = filteredEvents.filter(
              event =>
                event.title.toLowerCase().includes(query) ||
                event.description.toLowerCase().includes(query) ||
                event.organizer.toLowerCase().includes(query)
            );
          }
        }

        setEvents(filteredEvents);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [filter]);

  return { events, loading, error };
}

export function useEvent(id: string | undefined) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      setLoading(true);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const foundEvent = mockEvents.find(e => e.id === id) || null;
        
        if (!foundEvent) {
          setError("Event not found");
        } else {
          setEvent(foundEvent);
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Failed to load event details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  return { event, loading, error };
}

export function useAttendEvent() {
  const [attending, setAttending] = useState<Record<string, boolean>>({});
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Load attending status from localStorage
    try {
      const savedAttending = localStorage.getItem("attending");
      if (savedAttending) {
        setAttending(JSON.parse(savedAttending));
      }
    } catch (err) {
      console.error("Error loading attending status:", err);
    }
  }, []);

  const toggleAttend = async (eventId: string) => {
    setIsUpdating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newAttending = {
        ...attending,
        [eventId]: !attending[eventId]
      };
      
      setAttending(newAttending);
      localStorage.setItem("attending", JSON.stringify(newAttending));
      
      return true;
    } catch (err) {
      console.error("Error updating attendance:", err);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return { 
    isAttending: (eventId: string) => !!attending[eventId],
    toggleAttend,
    isUpdating
  };
}
