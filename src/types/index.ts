
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  category: "workshop" | "social" | "academic" | "sports" | "career";
  image: string;
  attendees: number;
  isRegistered?: boolean;
  mapPosition?: [number, number, number]; // [x, y, z] coordinates for 3D map
  qrCode?: string; // Added for QR code check-in
  checkedInUsers?: Array<{
    id: string;
    name: string;
    major?: string;
    shareProfile: boolean;
  }>; // Users who have checked in to this event
}

export interface EventFilter {
  category?: string;
  date?: string;
  query?: string;
}

export type ThemeMode = "light" | "dark" | "system";

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  major?: string;
  points: number;
  attendedEvents: string[]; // IDs of events attended
  badges: string[]; // Badges earned
  shareProfile: boolean; // Whether to share profile in networking
  preferredCategories?: string[]; // Categories user prefers
}
