import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Film, Calendar, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getUserTickets, isUserLoggedIn, getCurrentUser, UserTicket, deleteDynamicBooking } from "@/utils/userTickets";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

const Countdown = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userTickets, setUserTickets] = useState<UserTicket[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    if (!isUserLoggedIn()) {
      toast({
        title: "Access Denied",
        description: "Please login to view your movie countdowns.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    // Get current user and their tickets
    const user = getCurrentUser();
    if (user) {
      const tickets = getUserTickets(user.email);
      setUserTickets(tickets);
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate, toast]);

  const refreshTickets = () => {
    const user = getCurrentUser();
    if (user) {
      const tickets = getUserTickets(user.email);
      setUserTickets(tickets);
    }
  };

  const handleDeleteBooking = (ticketId: string) => {
    const user = getCurrentUser();
    if (user) {
      deleteDynamicBooking(user.email, ticketId);
      refreshTickets();
      toast({
        title: "Booking Deleted",
        description: "Your movie booking has been removed.",
      });
    }
  };

  const getActualStartTime = (ticket: UserTicket) => {
    return new Date(ticket.scheduledTime.getTime() + ticket.adBufferMinutes * 60 * 1000);
  };

  const getTimeUntilStart = (ticket: UserTicket) => {
    const actualStart = getActualStartTime(ticket);
    const diffMs = actualStart.getTime() - currentTime.getTime();
    
    if (diffMs <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, isStarted: true };
    }

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    return { hours, minutes, seconds, isStarted: false };
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (ticket: UserTicket) => {
    const timeUntil = getTimeUntilStart(ticket);
    if (timeUntil.isStarted) return "bg-green-500";
    if (timeUntil.hours === 0 && timeUntil.minutes < 5) return "bg-red-500";
    if (timeUntil.hours === 0 && timeUntil.minutes < 15) return "bg-yellow-500";
    return "bg-blue-500";
  };

  const getStatusText = (ticket: UserTicket) => {
    const timeUntil = getTimeUntilStart(ticket);
    if (timeUntil.isStarted) return "Movie Started";
    if (timeUntil.hours === 0 && timeUntil.minutes < 5) return "Starting Soon!";
    if (timeUntil.hours === 0 && timeUntil.minutes < 15) return "Ads Playing";
    return "Scheduled";
  };

  const currentUser = getCurrentUser();

  return (
    <div className="min-h-screen bg-background-dark">
      <Navigation />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="w-16 h-16 bg-primary-yellow rounded-full mx-auto flex items-center justify-center mb-6">
            <Clock className="h-8 w-8 text-black" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Never Miss Your Movie Start
          </h1>
          <p className="text-xl text-white/80 mb-8">
            Know exactly when your booked movies begin with our real-time countdown that accounts for trailers and advertisements
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-white/70">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Live Updates
            </div>
            <div className="flex items-center">
              <Film className="h-4 w-4 mr-2" />
              Your Bookings Only
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Real-time Tracking
            </div>
          </div>
        </div>
      </section>

      {/* Movie Sessions */}
      <section className="container mx-auto px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">Your Booked Movies</h2>
          
          {userTickets.length === 0 ? (
            <Card className="bg-card-black border-primary-yellow/20 text-center p-8">
              <CardContent>
                <Film className="h-12 w-12 text-primary-yellow mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">No Movies Booked</h3>
                <p className="text-white/70 mb-4">You don't have any upcoming movie bookings.</p>
                <Link to="/hall-booking">
                  <Button className="bg-primary-yellow text-black hover:bg-primary-yellow/90">
                    Book Movies
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {userTickets.map((ticket) => {
                const timeUntil = getTimeUntilStart(ticket);
                const actualStart = getActualStartTime(ticket);
                
                return (
                  <Card key={ticket.id} className="relative overflow-hidden bg-card-black border-primary-yellow/40 hover:shadow-lg transition-all duration-300">
                    <div className={`absolute top-0 left-0 right-0 h-1 ${getStatusColor(ticket)}`} />
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs border-primary-yellow/50 text-primary-yellow">
                            {ticket.hallNumber}
                          </Badge>
                          {ticket.cinemaName && (
                            <Badge variant="outline" className="text-xs border-blue-500/50 text-blue-400">
                              {ticket.cinemaName}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`text-xs ${getStatusColor(ticket)} text-white`}>
                            {getStatusText(ticket)}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteBooking(ticket.id)}
                            className="h-6 w-6 p-0 border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-lg leading-tight text-white">{ticket.movieTitle}</CardTitle>
                      <CardDescription className="space-y-1">
                        <div className="flex justify-between text-sm text-white/80">
                          <span>Seat:</span>
                          <span className="font-mono text-primary-yellow">{ticket.seatNumber}</span>
                        </div>
                        <div className="flex justify-between text-sm text-white/80">
                          <span>Scheduled:</span>
                          <span className="font-mono">{formatTime(ticket.scheduledTime)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-white/80">
                          <span>Movie Starts:</span>
                          <span className="font-mono text-primary-yellow">{formatTime(actualStart)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-white/60">
                          <span>Ad Buffer:</span>
                          <span>{ticket.adBufferMinutes} minutes</span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {!timeUntil.isStarted ? (
                        <div className="text-center">
                          <div className="text-3xl font-mono font-bold mb-2 text-primary-yellow">
                            {String(timeUntil.hours).padStart(2, '0')}:
                            {String(timeUntil.minutes).padStart(2, '0')}:
                            {String(timeUntil.seconds).padStart(2, '0')}
                          </div>
                          <div className="text-sm text-white/70">
                            Time until movie starts
                          </div>
                          
                          {timeUntil.hours === 0 && timeUntil.minutes < 15 && (
                            <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                              <p className="text-xs text-yellow-400">
                                {timeUntil.minutes < 5 ? "🎬 Movie starting soon!" : "📺 Trailers and ads playing"}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-500 mb-2">
                            🎬 MOVIE STARTED
                          </div>
                          <div className="text-sm text-white/70">
                            Started at {formatTime(actualStart)}
                          </div>
                          <div className="mt-3 p-2 bg-green-500/10 border border-green-500/20 rounded-md">
                            <p className="text-xs text-green-400">
                              Enjoy the show!
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Info Card */}
          <Card className="mt-8 border-primary-yellow/20 bg-primary-yellow/5">
            <CardHeader>
              <CardTitle className="flex items-center text-primary-yellow">
                <Clock className="h-5 w-5 mr-2" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold mt-0.5">1</div>
                <div>
                  <div className="font-medium text-white">Scheduled Time</div>
                  <div className="text-white/70">The time listed on your ticket and GSC website</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs font-bold mt-0.5">2</div>
                <div>
                  <div className="font-medium text-white">Trailers & Ads</div>
                  <div className="text-white/70">GSC typically shows 10-15 minutes of trailers and advertisements</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold mt-0.5">3</div>
                <div>
                  <div className="font-medium text-white">Movie Begins</div>
                  <div className="text-white/70">The actual movie starts after the ad buffer period</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Countdown;
