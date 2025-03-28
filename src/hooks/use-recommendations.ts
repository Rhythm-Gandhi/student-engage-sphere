
import { useState, useEffect } from 'react';
import { Event, UserProfile } from '@/types';
import { 
  hasScheduleConflict, 
  getCategoryDistribution, 
  getUnderrepresentedCategories 
} from '@/lib/utils';

export function useRecommendations(
  events: Event[], 
  userProfile: UserProfile,
  userAttendingEvents: Event[]
) {
  const [recommendations, setRecommendations] = useState<Event[]>([]);
  const [recommendationReason, setRecommendationReason] = useState<string>('');

  useEffect(() => {
    if (!events.length) return;

    // Get all events the user has attended
    const attendedEvents = events.filter(event => 
      userProfile.attendedEvents.includes(event.id)
    );
    
    // Get category distribution of attended events
    const categoryDistribution = getCategoryDistribution(attendedEvents);
    
    // Get all available categories
    const allCategories = Array.from(
      new Set(events.map(event => event.category))
    );
    
    // Find underrepresented categories in user's attendance
    const underrepresented = getUnderrepresentedCategories(
      categoryDistribution, 
      allCategories as string[]
    );
    
    // Filter events to only future events
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const futureEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= today;
    });
    
    // Filter out events user is already attending
    const availableEvents = futureEvents.filter(
      event => !userAttendingEvents.some(e => e.id === event.id)
    );
    
    // Filter for events that don't conflict with user's schedule
    const nonConflictingEvents = availableEvents.filter(
      event => !hasScheduleConflict(event, userAttendingEvents)
    );
    
    // Prioritize events from underrepresented categories
    const balancedRecommendations = nonConflictingEvents.sort((a, b) => {
      // Higher priority for underrepresented categories
      const aUnderrepresented = underrepresented.includes(a.category);
      const bUnderrepresented = underrepresented.includes(b.category);
      
      if (aUnderrepresented && !bUnderrepresented) return -1;
      if (!aUnderrepresented && bUnderrepresented) return 1;
      
      // If both or neither are underrepresented, sort by date (sooner first)
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    
    // Take top recommendations
    const topRecommendations = balancedRecommendations.slice(0, 3);
    setRecommendations(topRecommendations);
    
    // Set recommendation reason based on underrepresented categories
    if (underrepresented.length && topRecommendations.length) {
      const categoryNames = underrepresented.map(c => 
        c.charAt(0).toUpperCase() + c.slice(1)
      ).join(', ');
      
      setRecommendationReason(
        `We recommend balancing your schedule with more ${categoryNames} events!`
      );
    } else if (topRecommendations.length) {
      setRecommendationReason('Events you might be interested in:');
    } else {
      setRecommendationReason('No upcoming events match your schedule at this time.');
    }
  }, [events, userProfile, userAttendingEvents]);

  return { recommendations, recommendationReason };
}
