
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { calculatePointsForCheckIn } from '@/lib/utils';
import { Event, UserProfile } from '@/types';

interface CheckInResult {
  success: boolean;
  message: string;
  pointsEarned?: number;
}

// Mock storage for user profile - in a real app, this would come from a database
const mockUserProfile: UserProfile = {
  id: 'user1',
  name: 'Jane Student',
  email: 'jane@university.edu',
  major: 'Computer Science',
  points: 50,
  attendedEvents: [],
  badges: ['newcomer'],
  shareProfile: true,
  preferredCategories: ['academic', 'workshop']
};

// Mock storage for checked-in events
const checkedInEvents: Record<string, boolean> = {};

export function useCheckIn() {
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile);
  const [processing, setProcessing] = useState(false);

  const processCheckIn = async (qrValue: string, events: Event[]): Promise<CheckInResult> => {
    setProcessing(true);
    
    try {
      // Parse the event ID from the QR code
      const eventIdMatch = qrValue.match(/event-(.+)/);
      if (!eventIdMatch) {
        return { success: false, message: 'Invalid QR code format' };
      }
      
      const eventId = eventIdMatch[1];
      const event = events.find(e => e.id === eventId);
      
      if (!event) {
        return { success: false, message: 'Event not found' };
      }
      
      // Check if already checked in
      if (checkedInEvents[eventId]) {
        return { success: false, message: 'You have already checked in to this event' };
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Award points based on event category
      const pointsEarned = calculatePointsForCheckIn(event.category);
      
      // Update mock user profile
      setUserProfile(prev => ({
        ...prev,
        points: prev.points + pointsEarned,
        attendedEvents: [...prev.attendedEvents, eventId]
      }));
      
      // Mark as checked in
      checkedInEvents[eventId] = true;
      
      // Show success toast
      toast({
        title: "Check-in Successful!",
        description: `You earned ${pointsEarned} points for attending ${event.title}.`,
      });
      
      return { 
        success: true, 
        message: 'Check-in successful', 
        pointsEarned 
      };
    } catch (error) {
      console.error('Check-in error:', error);
      return { success: false, message: 'An error occurred during check-in' };
    } finally {
      setProcessing(false);
    }
  };

  return {
    userProfile,
    processing,
    processCheckIn,
    checkedInEvents
  };
}
