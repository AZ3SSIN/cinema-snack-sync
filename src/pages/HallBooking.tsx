
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Clock, MapPin, Film, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { isUserLoggedIn, getCurrentUser, saveDynamicBooking, UserTicket } from "@/utils/userTickets";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

interface Cinema {
  id: string;
  name: string;
  location: string;
}

interface Movie {
  id: string;
  title: string;
  poster: string;
  duration: string;
  genre: string;
}

const HallBooking = () => {
  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [selectedShowtime, setSelectedShowtime] = useState<Date | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoggedIn()) {
      toast({
        title: "Access Denied",
        description: "Please login to access hall booking.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
  }, [navigate, toast]);

  const cinemas: Cinema[] = [
    {
      id: "gsc-pavilion",
      name: "GSC Pavilion KL",
      location: "Pavilion Kuala Lumpur"
    },
    {
      id: "gsc-midvalley",
      name: "GSC Mid Valley",
      location: "Mid Valley Megamall"
    }
  ];

  const movies: Movie[] = [
    {
      id: "spiderman",
      title: "Spider-Man: No Way Home",
      poster: "/placeholder.svg",
      duration: "148 min",
      genre: "Action, Adventure"
    },
    {
      id: "avatar",
      title: "Avatar: The Way of Water",
      poster: "/placeholder.svg",
      duration: "192 min",
      genre: "Action, Adventure, Drama"
    },
    {
      id: "topgun",
      title: "Top Gun: Maverick",
      poster: "/placeholder.svg",
      duration: "130 min",
      genre: "Action, Drama"
    },
    {
      id: "johnwick",
      title: "John Wick: Chapter 4",
      poster: "/placeholder.svg",
      duration: "169 min",
      genre: "Action, Crime, Thriller"
    },
    {
      id: "batman",
      title: "The Batman",
      poster: "/placeholder.svg",
      duration: "176 min",
      genre: "Action, Crime, Drama"
    }
  ];

  const generateShowtimes = () => {
    const showtimes = [];
    const now = new Date();
    
    // Start 5 minutes from now
    let startTime = new Date(now.getTime() + 5 * 60 * 1000);
    
    // Generate 5 showtimes, each 45 minutes apart
    for (let i = 0; i < 5; i++) {
      showtimes.push(new Date(startTime.getTime() + i * 45 * 60 * 1000));
    }
    
    return showtimes;
  };

  const handleCinemaSelect = (cinema: Cinema) => {
    setSelectedCinema(cinema);
    setSelectedMovie(movies[0]);
    setCurrentMovieIndex(0);
    setSelectedShowtime(null);
  };

  const handleMovieNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      const newIndex = currentMovieIndex > 0 ? currentMovieIndex - 1 : movies.length - 1;
      setCurrentMovieIndex(newIndex);
      setSelectedMovie(movies[newIndex]);
    } else {
      const newIndex = currentMovieIndex < movies.length - 1 ? currentMovieIndex + 1 : 0;
      setCurrentMovieIndex(newIndex);
      setSelectedMovie(movies[newIndex]);
    }
    setSelectedShowtime(null);
  };

  const handlePayment = async () => {
    if (!selectedCinema || !selectedMovie || !selectedShowtime) return;
    
    setIsProcessingPayment(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const currentUser = getCurrentUser();
    if (currentUser) {
      const newBooking: UserTicket = {
        id: `booking-${Date.now()}`,
        movieTitle: selectedMovie.title,
        hallNumber: `Hall ${Math.floor(Math.random() * 5) + 1}`,
        scheduledTime: selectedShowtime,
        seatNumber: `${String.fromCharCode(65 + Math.floor(Math.random() * 5))}${Math.floor(Math.random() * 20) + 1}`,
        ticketPrice: 25.00,
        bookingDate: new Date(),
        adBufferMinutes: Math.floor(Math.random() * 6) + 10, // 10-15 minutes
        cinemaName: selectedCinema.name
      };
      
      saveDynamicBooking(currentUser.email, newBooking);
      
      toast({
        title: "Booking Successful!",
        description: `Your ticket for ${selectedMovie.title} has been booked.`,
      });
      
      navigate("/countdown");
    }
    
    setIsProcessingPayment(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const currentUser = getCurrentUser();

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background-dark">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-yellow rounded-full mx-auto flex items-center justify-center mb-6">
            <Calendar className="h-8 w-8 text-black" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-white">Book Your Movie</h1>
          <p className="text-xl text-white/80">
            Select your cinema, movie, and showtime for today
          </p>
        </div>

        {!selectedCinema ? (
          /* Cinema Selection */
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-white">Choose Your Cinema</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {cinemas.map((cinema) => (
                <Card 
                  key={cinema.id} 
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-card-black border-primary-yellow/40 hover:border-primary-yellow/60"
                  onClick={() => handleCinemaSelect(cinema)}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-8 w-8 text-primary-yellow" />
                      <div>
                        <CardTitle className="text-xl text-white">{cinema.name}</CardTitle>
                        <CardDescription className="text-white/70">{cinema.location}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-primary-yellow text-black hover:bg-primary-yellow/90">
                      Select Cinema
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          /* Movie and Showtime Selection */
          <div className="max-w-6xl mx-auto">
            {/* Selected Cinema Info */}
            <div className="mb-8 text-center">
              <Badge className="bg-primary-yellow text-black mb-2">
                <MapPin className="h-4 w-4 mr-2" />
                {selectedCinema.name}
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedCinema(null)}
                className="ml-4 border-primary-yellow/30 text-primary-yellow hover:bg-primary-yellow hover:text-black"
              >
                Change Cinema
              </Button>
            </div>

            {/* Movie Selection */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6 text-center text-white">Select Movie</h3>
              <div className="relative">
                <Card className="bg-card-black border-primary-yellow/40">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleMovieNavigation('prev')}
                        className="border-primary-yellow/30 text-primary-yellow hover:bg-primary-yellow hover:text-black"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      {selectedMovie && (
                        <div className="flex-1 mx-8 text-center">
                          <div className="flex items-center justify-center space-x-6">
                            <img 
                              src={selectedMovie.poster} 
                              alt={selectedMovie.title}
                              className="w-32 h-48 object-cover rounded-lg bg-primary-yellow/20"
                            />
                            <div className="text-left">
                              <h4 className="text-2xl font-bold mb-2 text-white">{selectedMovie.title}</h4>
                              <div className="space-y-2 text-white/80">
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-2" />
                                  {selectedMovie.duration}
                                </div>
                                <div className="flex items-center">
                                  <Film className="h-4 w-4 mr-2" />
                                  {selectedMovie.genre}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleMovieNavigation('next')}
                        className="border-primary-yellow/30 text-primary-yellow hover:bg-primary-yellow hover:text-black"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Showtime Selection */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6 text-center text-white">Select Showtime</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {generateShowtimes().map((showtime, index) => (
                  <Button
                    key={index}
                    variant={selectedShowtime?.getTime() === showtime.getTime() ? "default" : "outline"}
                    className={`p-4 h-auto ${
                      selectedShowtime?.getTime() === showtime.getTime() 
                        ? "bg-primary-yellow text-black" 
                        : "border-primary-yellow/30 text-white hover:bg-primary-yellow hover:text-black"
                    }`}
                    onClick={() => setSelectedShowtime(showtime)}
                  >
                    <div className="text-center">
                      <div className="font-bold">{formatTime(showtime)}</div>
                      <div className="text-xs opacity-80">Hall {index + 1}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Payment */}
            {selectedShowtime && (
              <div className="max-w-md mx-auto">
                <Card className="bg-card-black border-primary-yellow/40">
                  <CardHeader>
                    <CardTitle className="text-center text-white">Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-white">
                        <span>Movie:</span>
                        <span>{selectedMovie?.title}</span>
                      </div>
                      <div className="flex justify-between text-white">
                        <span>Cinema:</span>
                        <span>{selectedCinema.name}</span>
                      </div>
                      <div className="flex justify-between text-white">
                        <span>Time:</span>
                        <span>{formatTime(selectedShowtime)}</span>
                      </div>
                      <div className="flex justify-between text-white">
                        <span>Price:</span>
                        <span>RM 25.00</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-primary-yellow text-black hover:bg-primary-yellow/90" 
                      onClick={handlePayment}
                      disabled={isProcessingPayment}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      {isProcessingPayment ? "Processing..." : "Pay & Book Now"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HallBooking;
