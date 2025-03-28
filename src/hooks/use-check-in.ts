
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { calculatePointsForCheckIn } from '@/lib/utils';
import { Event, UserProfile } from '@/types';
import { users, addCheckIn, hasUserCheckedIn } from '@/data/mockData';

interface CheckInResult {
  success: boolean;
  message: string;
  pointsEarned?: number;
}

// Get current user's profile (In a real app, this would come from authentication)
const currentUser = users[0]; // Default to the first user

export function useCheckIn() {
  const [userProfile, setUserProfile] = useState<UserProfile>(currentUser);
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

      // Check if event is approved
      if (event.approved === false) {
        return { success: false, message: 'This event has not been approved yet' };
      }
      
      // Check if already checked in
      if (hasUserCheckedIn(userProfile.id, eventId)) {
        return { success: false, message: 'You have already checked in to this event' };
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Award points based on event category
      const pointsEarned = calculatePointsForCheckIn(event.category);
      
      // Record check-in
      addCheckIn(userProfile.id, eventId, pointsEarned);
      
      // Update local user profile state
      setUserProfile(prev => ({
        ...prev,
        points: prev.points + pointsEarned,
        attendedEvents: [...prev.attendedEvents, eventId]
      }));
      
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
    processCheckIn
  };
}
