
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Calendar, ChevronLeft, MapPin, Share2, Users, QrCode, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useEvent, useAttendEvent } from "@/hooks/use-events";
import { formatDate, generateEventShareLink } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { CampusMap } from "@/components/CampusMap";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { QRCodeScanner } from "@/components/QRCodeScanner";
import { NetworkingList } from "@/components/NetworkingList";
import { useCheckIn } from "@/hooks/use-check-in";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { event, loading, error } = useEvent(id);
  const { isAttending, toggleAttend, isUpdating } = useAttendEvent();
  const { processCheckIn, processing, userProfile } = useCheckIn();
  const [checkInSuccess, setCheckInSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("details");
  
  const attending = id ? isAttending(id) : false;

  const handleAttend = async () => {
    if (!id) return;
    
    const success = await toggleAttend(id);
    
    if (success) {
      toast({
        title: attending 
          ? "You are no longer attending this event" 
          : "You are now attending this event",
        description: attending 
          ? "Your RSVP has been removed" 
          : "You'll receive updates about this event",
      });
    } else {
      toast({
        title: "Failed to update attendance",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    if (!event) return;
    
    const shareLink = generateEventShareLink(event.id);
    
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out this event: ${event.title}`,
        url: shareLink,
      }).catch(err => {
        console.error("Error sharing:", err);
        copyToClipboard(shareLink);
      });
    } else {
      copyToClipboard(shareLink);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Link copied to clipboard",
      description: "You can now share it with others",
    });
  };

  const handleQRScan = async (data: string) => {
    if (!event) return;
    
    try {
      const result = await processCheckIn(data, [event]);
      if (result.success) {
        setCheckInSuccess(true);
        toast({
          title: "Check-in Successful!",
          description: `You've earned ${result.pointsEarned} points for attending this event.`,
        });
      } else {
        toast({
          title: "Check-in Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("QR scan error:", error);
      toast({
        title: "Check-in Error",
        description: "Failed to process check-in. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  if (error) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
        <p className="text-muted-foreground mb-8">
          Sorry, we couldn't find the event you're looking for.
        </p>
        <Button asChild>
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  // Sample checked-in users for demonstration
  const checkedInUsers = [
    { id: '1', name: 'Alex Johnson', major: 'Computer Science', shareProfile: true },
    { id: '2', name: 'Jamie Smith', major: 'Business', shareProfile: true },
    { id: '3', name: 'Taylor Wong', major: 'Psychology', shareProfile: true },
    { id: '4', name: 'Anonymous User', shareProfile: false },
  ];

  return (
    <div className="container py-8">
      <Link 
        to="/"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to events
      </Link>
      
      {loading || !event ? (
        <div className="space-y-6">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-72 w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-2/3" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge 
                style={{ backgroundColor: `var(--category-${event.category})` }}
                className="text-white"
              >
                {event.category}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Organized by {event.organizer}
              </span>
            </div>
          </div>
          
          <div className="rounded-xl overflow-hidden mb-8 bg-card">
            <img 
              src={event.image} 
              alt={event.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid grid-cols-3 w-full md:w-auto">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="check-in">Check-in</TabsTrigger>
              <TabsTrigger value="networking">Networking</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <h2 className="text-xl font-semibold mb-4">About this event</h2>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {event.description}
                  </p>
                  
                  <div className="mt-8 space-y-4">
                    <div className="flex items-center">
                      <Calendar className="mr-3 h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-medium">Date and Time</h3>
                        <p className="text-muted-foreground">
                          {formatDate(event.date)} • {event.time}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <MapPin className="mr-3 h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-medium">Location</h3>
                        <p className="text-muted-foreground">{event.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Users className="mr-3 h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-medium">Attendees</h3>
                        <p className="text-muted-foreground">
                          {event.attendees + (attending ? 1 : 0)} people attending
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <CampusMap activeEventId={event.id} />
                  
                  <div className="bg-card rounded-xl border p-6 space-y-4">
                    <h3 className="font-semibold">Actions</h3>
                    
                    <Button 
                      onClick={handleAttend}
                      disabled={isUpdating}
                      className="w-full"
                      variant={attending ? "default" : "outline"}
                    >
                      {attending ? "Cancel Attendance" : "Attend Event"}
                    </Button>
                    
                    <Button 
                      onClick={handleShare}
                      variant="outline"
                      className="w-full"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Event
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="check-in" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  {checkInSuccess ? (
                    <div className="bg-card border rounded-xl p-6 text-center">
                      <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Check-in Successful!</h3>
                      <p className="text-muted-foreground mb-4">
                        You've earned points for attending this event.
                      </p>
                      <div className="bg-muted p-4 rounded-lg mb-4">
                        <p className="font-medium">Current Points: {userProfile.points}</p>
                      </div>
                      <Button 
                        onClick={() => setActiveTab("networking")} 
                        className="w-full"
                      >
                        View Who's Here
                      </Button>
                    </div>
                  ) : (
                    <QRCodeScanner onScan={handleQRScan} />
                  )}
                </div>
                <div>
                  <QRCodeDisplay eventId={event.id} />
                  <div className="mt-6 bg-card border rounded-xl p-6">
                    <h3 className="font-semibold mb-2">Event Check-in</h3>
                    <p className="text-sm text-muted-foreground">
                      Scan the QR code at the event to check in and unlock networking
                      with other attendees. You'll also earn points toward badges and rewards.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="networking" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <NetworkingList 
                    users={checkedInUsers} 
                    eventTitle={event.title} 
                  />
                </div>
                <div>
                  <div className="bg-card border rounded-xl p-6 space-y-4">
                    <h3 className="font-semibold">Your Profile</h3>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Name:</span> {userProfile.name}
                      </p>
                      {userProfile.major && (
                        <p className="text-sm">
                          <span className="font-medium">Major:</span> {userProfile.major}
                        </p>
                      )}
                      <p className="text-sm">
                        <span className="font-medium">Share Profile:</span> {userProfile.shareProfile ? 'Yes' : 'No'}
                      </p>
                    </div>
                    <Button variant="outline" className="w-full" disabled>
                      Edit Profile Settings
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Profile visibility controls are available in your account settings.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default EventDetail;
