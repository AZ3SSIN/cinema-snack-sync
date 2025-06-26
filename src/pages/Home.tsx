import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingCart, Clock, Star, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  isUserLoggedIn,
  getCurrentUser,
  getUserTickets,
} from "@/utils/userTickets";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    if (!isUserLoggedIn()) {
      toast({
        title: "Access Denied",
        description: "Please login to access this page.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
  }, [navigate, toast]);

  const currentUser = getCurrentUser();
  const userTickets = currentUser ? getUserTickets(currentUser.email) : [];

  if (!currentUser) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-background-dark">
      <Navigation />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-yellow via-primary-yellow to-primary-yellow bg-clip-text">
            Welcome to GSC Cinema Live
          </h1>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Your personalized cinema experience awaits. Access in-hall snack
            delivery and live movie countdowns.
          </p>
          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <Link to="/hall-booking">
              <Button
                size="lg"
                className="w-full bg-primary-yellow text-black hover:bg-primary-yellow/90"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Book Movies
              </Button>
            </Link>
            <Link to="/hall-menu">
              <Button
                size="lg"
                className="w-full bg-primary-yellow text-black hover:bg-primary-yellow/90"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Order Snacks
              </Button>
            </Link>
            <Link to="/countdown">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-primary-yellow text-primary-yellow hover:bg-primary-yellow hover:text-black"
              >
                <Clock className="mr-2 h-5 w-5" />
                Movie Countdown
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">
            Your Cinema Features
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Enjoy these exclusive features designed to enhance your movie
            experience
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1: Movie Booking */}
          <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 bg-card-black border-primary-yellow/20 hover:border-primary-yellow/40">
            <div className="absolute inset-0 bg-primary-yellow/5 group-hover:bg-primary-yellow/10 transition-opacity duration-300" />
            <CardHeader className="relative">
              <div className="w-12 h-12 bg-primary-yellow rounded-lg flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-black" />
              </div>
              <CardTitle className="text-2xl text-white">
                Movie Booking
              </CardTitle>
              <CardDescription className="text-base text-white/80">
                Book your favorite movies at your preferred cinema
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-white">
                  <Star className="h-4 w-4 text-primary-yellow mr-2" />
                  Multiple cinema locations
                </div>
                <div className="flex items-center text-sm text-white">
                  <Star className="h-4 w-4 text-primary-yellow mr-2" />
                  Latest movie releases
                </div>
                <div className="flex items-center text-sm text-white">
                  <Star className="h-4 w-4 text-primary-yellow mr-2" />
                  Flexible showtimes
                </div>
              </div>
              <Link to="/hall-booking">
                <Button className="w-full bg-primary-yellow text-black hover:bg-primary-yellow/90">
                  Book Now
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Feature 2: Snack Delivery */}
          <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 bg-card-black border-primary-yellow/20 hover:border-primary-yellow/40">
            <div className="absolute inset-0 bg-primary-yellow/5 group-hover:bg-primary-yellow/10 transition-opacity duration-300" />
            <CardHeader className="relative">
              <div className="w-12 h-12 bg-primary-yellow rounded-lg flex items-center justify-center mb-4">
                <ShoppingCart className="h-6 w-6 text-black" />
              </div>
              <CardTitle className="text-2xl text-white">
                In-Hall Snack Delivery
              </CardTitle>
              <CardDescription className="text-base text-white/80">
                Order snacks directly to your seat without missing any action
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-white">
                  <Star className="h-4 w-4 text-primary-yellow mr-2" />
                  Real-time order tracking
                </div>
                <div className="flex items-center text-sm text-white">
                  <Star className="h-4 w-4 text-primary-yellow mr-2" />
                  Silent delivery to your seat
                </div>
                <div className="flex items-center text-sm text-white">
                  <Star className="h-4 w-4 text-primary-yellow mr-2" />
                  Full GSC menu available
                </div>
              </div>
              <Link to="/hall-menu">
                <Button className="w-full bg-primary-yellow text-black hover:bg-primary-yellow/90">
                  Order Now
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Feature 3: Movie Countdown */}
          <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 bg-card-black border-primary-yellow/20 hover:border-primary-yellow/40">
            <div className="absolute inset-0 bg-primary-yellow/5 group-hover:bg-primary-yellow/10 transition-opacity duration-300" />
            <CardHeader className="relative">
              <div className="w-12 h-12 bg-primary-yellow rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-black" />
              </div>
              <CardTitle className="text-2xl text-white">
                Live Movie Countdown
              </CardTitle>
              <CardDescription className="text-base text-white/80">
                Know exactly when your movie starts, accounting for trailers and
                ads
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-white">
                  <Star className="h-4 w-4 text-primary-yellow mr-2" />
                  Real-time countdown display
                </div>
                <div className="flex items-center text-sm text-white">
                  <Star className="h-4 w-4 text-primary-yellow mr-2" />
                  Your booked movies only
                </div>
                <div className="flex items-center text-sm text-white">
                  <Star className="h-4 w-4 text-primary-yellow mr-2" />
                  {userTickets.length} tickets found
                </div>
              </div>
              <Link to="/countdown">
                <Button className="w-full bg-primary-yellow text-black hover:bg-primary-yellow/90">
                  View Countdown
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <Card className="border-primary-yellow/20 bg-card-black/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2 text-white">
                Your Account
              </CardTitle>
              <CardDescription className="text-white/80">
                Welcome back, {currentUser.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="p-4">
                  <div className="text-3xl font-bold text-primary-yellow mb-2">
                    {userTickets.length}
                  </div>
                  <div className="text-sm text-white/70">Upcoming Movies</div>
                </div>
                <div className="p-4">
                  <div className="text-3xl font-bold text-primary-yellow mb-2">
                    {currentUser.role}
                  </div>
                  <div className="text-sm text-white/70">Account Type</div>
                </div>
                <div className="p-4">
                  <div className="text-3xl font-bold text-primary-yellow mb-2">
                    Active
                  </div>
                  <div className="text-sm text-white/70">Status</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
