
import { Link } from "react-router-dom";
import { Calendar, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Input } from "@/components/ui/input";
import { UserButton } from "@/components/UserButton";
import { NotificationsDropdown } from "@/components/NotificationsDropdown";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">CampusEvents</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="nav-link text-sm font-medium">Home</Link>
            <Link to="/events" className="nav-link text-sm font-medium">All Events</Link>
            <Link to="/map" className="nav-link text-sm font-medium">Campus Map</Link>
            <Link to="/calendar" className="nav-link text-sm font-medium">Calendar</Link>
          </nav>
        </div>
        <div className="hidden md:flex relative w-full max-w-sm items-center mx-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search events..."
            className="pl-8 bg-background" 
          />
        </div>
        <div className="flex items-center space-x-2">
          <NotificationsDropdown />
          <UserButton />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
