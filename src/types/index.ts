
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
}

export interface EventFilter {
  category?: string;
  date?: string;
  query?: string;
}

export type ThemeMode = "light" | "dark" | "system";
