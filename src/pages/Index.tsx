import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Clock,
  ShoppingCart,
  Users,
  Film,
  MapPin,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background-dark">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm bg-card-black/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img
                src="https://www.gsc.com.my/_nuxt/img/logo.4f87efa.png"
                alt="GSC Logo"
                className="w-20 h-20 object-contain"
              />
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Button
                variant="ghost"
                className="text-white hover:text-black hover:bg-primary-yellow"
              >
                <Film className="h-4 w-4 mr-2" />
                Showtime by Movies
              </Button>
              <Button
                variant="ghost"
                className="text-white hover:text-black hover:bg-primary-yellow"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Showtimes by Cinemas
              </Button>
              <Button
                variant="ghost"
                className="text-white hover:text-black hover:bg-primary-yellow"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Hall Booking
              </Button>
              <Link to="/login?redirect=snacks">
                <Button
                  variant="ghost"
                  className="text-white hover:text-black hover:bg-primary-yellow"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Snack Delivery
                </Button>
              </Link>
              <Link to="/login?redirect=countdown">
                <Button
                  variant="ghost"
                  className="text-white hover:text-black hover:bg-primary-yellow"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Movie Countdown
                </Button>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {currentTime.toLocaleTimeString()}
              </span>
              <Link to="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary-yellow text-primary-yellow hover:bg-primary-yellow hover:text-black"
                >
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-yellow via-primary-yellow to-primary-yellow bg-clip-text">
            Real-Time Cinema Experience
          </h1>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Experience the future of cinema with in-hall snack delivery and live
            movie countdowns. Never miss a moment of your movie again.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button
                size="lg"
                className="bg-primary-yellow text-black hover:bg-primary-yellow/90 transition-all duration-300 transform hover:scale-105"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-primary-yellow text-primary-yellow hover:bg-primary-yellow hover:text-black"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Demo Accounts Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="border-primary-yellow/20 bg-card-black/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-2 text-white">
                Demo Accounts
              </CardTitle>
              <CardDescription className="text-base text-white/80">
                Try out different user roles with these pre-configured demo
                accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-lg border border-primary-yellow/20 bg-primary-yellow/5">
                  <Users className="h-8 w-8 text-primary-yellow mx-auto mb-3" />
                  <h3 className="font-semibold mb-2 text-white">Customer</h3>
                  <p className="text-sm text-white/80 mb-3">
                    Order snacks from your seat
                  </p>
                  <code className="text-xs bg-card-black p-2 rounded block mb-1 text-primary-yellow">
                    customer@demo.com
                  </code>
                  <code className="text-xs bg-card-black p-2 rounded block text-primary-yellow">
                    password123
                  </code>
                </div>
                <div className="text-center p-4 rounded-lg border border-primary-yellow/20 bg-primary-yellow/5">
                  <Users className="h-8 w-8 text-primary-yellow mx-auto mb-3" />
                  <h3 className="font-semibold mb-2 text-white">Staff</h3>
                  <p className="text-sm text-white/80 mb-3">
                    Manage orders and deliveries
                  </p>
                  <code className="text-xs bg-card-black p-2 rounded block mb-1 text-primary-yellow">
                    staff@demo.com
                  </code>
                  <code className="text-xs bg-card-black p-2 rounded block text-primary-yellow">
                    password123
                  </code>
                </div>
                <div className="text-center p-4 rounded-lg border border-primary-yellow/20 bg-primary-yellow/5">
                  <Users className="h-8 w-8 text-primary-yellow mx-auto mb-3" />
                  <h3 className="font-semibold mb-2 text-white">Admin</h3>
                  <p className="text-sm text-white/80 mb-3">
                    Full system access
                  </p>
                  <code className="text-xs bg-card-black p-2 rounded block mb-1 text-primary-yellow">
                    admin@demo.com
                  </code>
                  <code className="text-xs bg-card-black p-2 rounded block text-primary-yellow">
                    password123
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="rounded flex items-center justify-center">
                <img
                  src="https://www.gsc.com.my/_nuxt/img/logo.4f87efa.png"
                  alt="GSC Logo"
                  className="w-6 h-6 object-contain"
                />
              </div>
              <span className="font-semibold text-white">Cinema Live Demo</span>
            </div>
            <p className="text-sm text-white/80 mb-4">
              Real-Time Feature Extension for GSC Cinema Malaysia
            </p>
            <p className="text-xs text-white/60">
              Assignment Demo by Ziqreey | Syaza | Asyikin | Farihah
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
