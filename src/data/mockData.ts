
import { Event, UserProfile } from "@/types";

// Mock events data (extending your existing events data)
export const events: Event[] = [
  {
    id: "1",
    title: "Introduction to Machine Learning Workshop",
    description: "Learn the basics of machine learning algorithms and their applications in the real world. This workshop is perfect for beginners who want to get started with AI and ML concepts.",
    date: "2023-11-15",
    time: "14:00-16:00",
    location: "Computer Science Building, Room 101",
    organizer: "AI Student Society",
    category: "workshop",
    image: "https://images.unsplash.com/photo-1581092921461-7031e8fbc93e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    attendees: 45,
    mapPosition: [0, 0, -5],
    approved: true
  },
  {
    id: "2",
    title: "Spring Break Beach Party",
    description: "Join us for the biggest social event of the semester! Music, games, and refreshments provided. Bring your friends and make new ones!",
    date: "2023-11-18",
    time: "19:00-23:00",
    location: "Student Union Courtyard",
    organizer: "Student Activities Board",
    category: "social",
    image: "https://images.unsplash.com/photo-1496024840928-4c417adf211d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    attendees: 120,
    mapPosition: [5, 0, 0],
    approved: true
  },
  {
    id: "3",
    title: "Tech Hackathon 2025",
    description: "Join our 48-hour coding marathon to build innovative solutions. Open to all skill levels.",
    date: "2025-04-01",
    time: "09:00-09:00",
    location: "Innovation Hub",
    organizer: "CS Department",
    category: "tech",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    attendees: 0,
    mapPosition: [-3, 0, 3],
    approved: true
  },
  {
    id: "4",
    title: "Advanced AI Tech Talk",
    description: "Learn about the latest advancements in artificial intelligence from industry experts.",
    date: "2025-04-05",
    time: "15:00-17:00",
    location: "Computer Science Building Auditorium",
    organizer: "AI Research Club",
    category: "tech",
    image: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    attendees: 0,
    mapPosition: [3, 0, -3],
    approved: false
  }
];

// Mock users data
export const users: UserProfile[] = [
  {
    id: "user1",
    name: "Jane Student",
    email: "jane@university.edu",
    major: "Computer Science",
    points: 50,
    attendedEvents: [],
    badges: ["newcomer"],
    shareProfile: true,
    preferredCategories: ["academic", "workshop"]
  },
  {
    id: "user2",
    name: "Alice Chen",
    email: "alice@university.edu",
    major: "Data Science",
    points: 0,
    attendedEvents: [],
    badges: ["newcomer"],
    shareProfile: true,
    preferredCategories: ["tech", "workshop"]
  },
  {
    id: "user3",
    name: "Bob Smith",
    email: "bob@university.edu",
    major: "Business Administration",
    points: 0,
    attendedEvents: [],
    badges: ["newcomer"],
    shareProfile: false,
    preferredCategories: ["social", "career"]
  }
];

// Mock check-ins data
export interface CheckIn {
  id: string;
  userId: string;
  eventId: string;
  timestamp: string;
  pointsEarned: number;
}

export const checkIns: CheckIn[] = [];

// Function to add a new check-in
export const addCheckIn = (userId: string, eventId: string, pointsEarned: number): CheckIn => {
  const newCheckIn: CheckIn = {
    id: `checkin_${Date.now()}`,
    userId,
    eventId,
    timestamp: new Date().toISOString(),
    pointsEarned
  };
  
  checkIns.push(newCheckIn);
  
  // Update user points
  const user = users.find(u => u.id === userId);
  if (user) {
    user.points += pointsEarned;
    if (!user.attendedEvents.includes(eventId)) {
      user.attendedEvents.push(eventId);
    }
  }
  
  return newCheckIn;
};

// Function to get a user's check-ins
export const getUserCheckIns = (userId: string): CheckIn[] => {
  return checkIns.filter(checkIn => checkIn.userId === userId);
};

// Function to get event check-ins
export const getEventCheckIns = (eventId: string): CheckIn[] => {
  return checkIns.filter(checkIn => checkIn.eventId === eventId);
};

// Function to check if a user has checked in to an event
export const hasUserCheckedIn = (userId: string, eventId: string): boolean => {
  return checkIns.some(checkIn => checkIn.userId === userId && checkIn.eventId === eventId);
};
