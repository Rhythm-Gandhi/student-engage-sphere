export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  category: string;
  image: string;
  attendees: number;
  mapPosition: [number, number, number];
  approved?: boolean;
}

export interface EventFilter {
  category?: string;
  date?: string;
  query?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  major?: string;
  points: number;
  attendedEvents: string[];
  badges: string[];
  shareProfile: boolean;
  preferredCategories: string[];
}
