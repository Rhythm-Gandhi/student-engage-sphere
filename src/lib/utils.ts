
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Event } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

export function generateEventShareLink(eventId: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/event/${eventId}`;
}

// New utility functions

export function generateQRCodeValue(eventId: string): string {
  // In a real implementation, this would create a more secure or encoded value
  // For demo purposes, we're using a simple format
  return `event-${eventId}`;
}

export function hasScheduleConflict(event: Event, userEvents: Event[]): boolean {
  // Check if the new event conflicts with any existing events
  const eventDate = new Date(`${event.date}T${event.time.split('-')[0]}`);
  const eventEndTimeStr = event.time.split('-')[1] || 
                          event.time.split('-')[0]; // Default to start time if no end time
  const eventEndDate = new Date(`${event.date}T${eventEndTimeStr}`);
  
  return userEvents.some(userEvent => {
    // Skip comparing with the same event
    if (userEvent.id === event.id) return false;
    
    const userEventDate = new Date(`${userEvent.date}T${userEvent.time.split('-')[0]}`);
    const userEventEndTimeStr = userEvent.time.split('-')[1] || 
                               userEvent.time.split('-')[0];
    const userEventEndDate = new Date(`${userEvent.date}T${userEventEndTimeStr}`);
    
    // Check if events overlap
    return (eventDate <= userEventEndDate && eventEndDate >= userEventDate);
  });
}

export function getCategoryDistribution(attendedEvents: Event[]): Record<string, number> {
  // Count the number of events attended by category
  return attendedEvents.reduce((acc, event) => {
    const category = event.category;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

export function getUnderrepresentedCategories(
  distribution: Record<string, number>, 
  allCategories: string[]
): string[] {
  // Find categories with below-average attendance
  const totalEvents = Object.values(distribution).reduce((sum, count) => sum + count, 0);
  const averagePerCategory = totalEvents / allCategories.length;
  
  return allCategories.filter(category => 
    !distribution[category] || distribution[category] < averagePerCategory
  );
}

// Gamification utility
export function calculatePointsForCheckIn(eventCategory: string): number {
  // Different points for different event types
  const pointsMap: Record<string, number> = {
    "workshop": 15,
    "academic": 20,
    "career": 15,
    "social": 10,
    "sports": 10
  };
  
  return pointsMap[eventCategory] || 10; // Default to 10 points
}
