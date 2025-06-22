
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Film, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

interface MovieSession {
  id: string;
  movieTitle: string;
  hallNumber: string;
  scheduledTime: Date;
  actualStartTime?: Date;
  adBufferMinutes: number;
  status: string;
}

const Countdown = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [movieSessions] = useState<MovieSession[]>([
    {
      id: "1",
      movieTitle: "Spider-Man: No Way Home",
      hallNumber: "Hall 1",
      scheduledTime: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
      adBufferMinutes: 12,
      status: "scheduled"
    },
    {
      id: "2", 
      movieTitle: "Avatar: The Way of Water",
      hallNumber: "Hall 2",
      scheduledTime: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
      adBufferMinutes: 15,
      status: "scheduled"
    },
    {
      id: "3",
      movieTitle: "Top Gun: Maverick",
      hallNumber: "Hall 3",
      scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      adBufferMinutes: 10,
      status: "scheduled"
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getActualStartTime = (session: MovieSession) => {
    return new Date(session.scheduledTime.getTime() + session.adBufferMinutes * 60 * 1000);
  };

  const getTimeUntilStart = (session: MovieSession) => {
    const actualStart = getActualStartTime(session);
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

  const getStatusColor = (session: MovieSession) => {
    const timeUntil = getTimeUntilStart(session);
    if (timeUntil.isStarted) return "bg-green-500";
    if (timeUntil.hours === 0 && timeUntil.minutes < 5) return "bg-red-500";
    if (timeUntil.hours === 0 && timeUntil.minutes < 15) return "bg-yellow-500";
    return "bg-blue-500";
  };

  const getStatusText = (session: MovieSession) => {
    const timeUntil = getTimeUntilStart(session);
    if (timeUntil.isStarted) return "Movie Started";
    if (timeUntil.hours === 0 && timeUntil.minutes < 5) return "Starting Soon!";
    if (timeUntil.hours === 0 && timeUntil.minutes < 15) return "Ads Playing";
    return "Scheduled";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
              <div>
                <h1 className="text-xl font-bold">Live Movie Countdown</h1>
                <p className="text-sm text-muted-foreground">Real-time movie start times</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-mono">{formatTime(currentTime)}</div>
              <div className="text-xs text-muted-foreground">Current Time</div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="w-16 h-16 gold-gradient rounded-full mx-auto flex items-center justify-center mb-6">
            <Clock className="h-8 w-8 text-black" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Never Miss a Movie Start
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Know exactly when your movie begins with our real-time countdown that accounts for trailers and advertisements
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Live Updates
            </div>
            <div className="flex items-center">
              <Film className="h-4 w-4 mr-2" />
              GSC Malaysia
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
          <h2 className="text-2xl font-bold mb-6 text-center">Today's Sessions</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {movieSessions.map((session) => {
              const timeUntil = getTimeUntilStart(session);
              const actualStart = getActualStartTime(session);
              
              return (
                <Card key={session.id} className="relative overflow-hidden border-border/40 hover:shadow-lg transition-all duration-300">
                  <div className={`absolute top-0 left-0 right-0 h-1 ${getStatusColor(session)}`} />
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {session.hallNumber}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(session)} text-white`}>
                        {getStatusText(session)}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-tight">{session.movieTitle}</CardTitle>
                    <CardDescription className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Scheduled:</span>
                        <span className="font-mono">{formatTime(session.scheduledTime)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Movie Starts:</span>
                        <span className="font-mono text-primary">{formatTime(actualStart)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Ad Buffer:</span>
                        <span>{session.adBufferMinutes} minutes</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!timeUntil.isStarted ? (
                      <div className="text-center">
                        <div className="text-3xl font-mono font-bold mb-2 text-primary">
                          {String(timeUntil.hours).padStart(2, '0')}:
                          {String(timeUntil.minutes).padStart(2, '0')}:
                          {String(timeUntil.seconds).padStart(2, '0')}
                        </div>
                        <div className="text-sm text-muted-foreground">
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
                        <div className="text-sm text-muted-foreground">
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

          {/* Info Card */}
          <Card className="mt-8 border-accent/20 bg-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center text-accent">
                <Clock className="h-5 w-5 mr-2" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold mt-0.5">1</div>
                <div>
                  <div className="font-medium">Scheduled Time</div>
                  <div className="text-muted-foreground">The time listed on your ticket and GSC website</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs font-bold mt-0.5">2</div>
                <div>
                  <div className="font-medium">Trailers & Ads</div>
                  <div className="text-muted-foreground">GSC typically shows 10-15 minutes of trailers and advertisements</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold mt-0.5">3</div>
                <div>
                  <div className="font-medium">Movie Begins</div>
                  <div className="text-muted-foreground">The actual movie starts after the ad buffer period</div>
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
