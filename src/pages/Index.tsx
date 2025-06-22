
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Clock, ShoppingCart, Users, Star } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 cinema-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GSC</span>
            </div>
            <span className="text-xl font-bold">Cinema Live</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              {currentTime.toLocaleTimeString()}
            </span>
            <Link to="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Real-Time Cinema Experience
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience the future of cinema with in-hall snack delivery and live movie countdowns. 
            Never miss a moment of your movie again.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="cinema-gradient hover:opacity-90 transition-all duration-300 transform hover:scale-105">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Revolutionary Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Two groundbreaking features designed to enhance your cinema experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Feature 1: Snack Delivery */}
          <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-primary/20 hover:border-primary/40">
            <div className="absolute inset-0 cinema-gradient opacity-5 group-hover:opacity-10 transition-opacity duration-300" />
            <CardHeader className="relative">
              <div className="w-12 h-12 cinema-gradient rounded-lg flex items-center justify-center mb-4">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl">In-Hall Snack Delivery</CardTitle>
              <CardDescription className="text-base">
                Order snacks directly to your seat without missing any action
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm">
                  <Star className="h-4 w-4 text-accent mr-2" />
                  Real-time order tracking
                </div>
                <div className="flex items-center text-sm">
                  <Star className="h-4 w-4 text-accent mr-2" />
                  Silent delivery to your seat
                </div>
                <div className="flex items-center text-sm">
                  <Star className="h-4 w-4 text-accent mr-2" />
                  Full GSC menu available
                </div>
              </div>
              <Link to="/login">
                <Button className="w-full cinema-gradient hover:opacity-90">
                  Try Snack Delivery
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Feature 2: Movie Countdown */}
          <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-accent/20 hover:border-accent/40">
            <div className="absolute inset-0 gold-gradient opacity-5 group-hover:opacity-10 transition-opacity duration-300" />
            <CardHeader className="relative">
              <div className="w-12 h-12 gold-gradient rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-black" />
              </div>
              <CardTitle className="text-2xl">Live Movie Countdown</CardTitle>
              <CardDescription className="text-base">
                Know exactly when your movie starts, accounting for trailers and ads
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm">
                  <Star className="h-4 w-4 text-accent mr-2" />
                  Real-time countdown display
                </div>
                <div className="flex items-center text-sm">
                  <Star className="h-4 w-4 text-accent mr-2" />
                  Trailer buffer calculation
                </div>
                <div className="flex items-center text-sm">
                  <Star className="h-4 w-4 text-accent mr-2" />
                  Perfect timing alerts
                </div>
              </div>
              <Link to="/countdown">
                <Button className="w-full gold-gradient text-black hover:opacity-90">
                  View Countdown
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Demo Accounts Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="border-muted/20 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-2">Demo Accounts</CardTitle>
              <CardDescription className="text-base">
                Try out different user roles with these pre-configured demo accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-lg border border-primary/20 bg-primary/5">
                  <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Customer</h3>
                  <p className="text-sm text-muted-foreground mb-3">Order snacks from your seat</p>
                  <code className="text-xs bg-background p-2 rounded block mb-1">customer@demo.com</code>
                  <code className="text-xs bg-background p-2 rounded block">password123</code>
                </div>
                <div className="text-center p-4 rounded-lg border border-accent/20 bg-accent/5">
                  <Users className="h-8 w-8 text-accent mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Staff</h3>
                  <p className="text-sm text-muted-foreground mb-3">Manage orders and deliveries</p>
                  <code className="text-xs bg-background p-2 rounded block mb-1">staff@demo.com</code>
                  <code className="text-xs bg-background p-2 rounded block">password123</code>
                </div>
                <div className="text-center p-4 rounded-lg border border-green-500/20 bg-green-500/5">
                  <Users className="h-8 w-8 text-green-500 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Admin</h3>
                  <p className="text-sm text-muted-foreground mb-3">Full system access</p>
                  <code className="text-xs bg-background p-2 rounded block mb-1">admin@demo.com</code>
                  <code className="text-xs bg-background p-2 rounded block">password123</code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-6 h-6 cinema-gradient rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">GSC</span>
              </div>
              <span className="font-semibold">Cinema Live Demo</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Real-Time Feature Extension for GSC Cinema Malaysia
            </p>
            <p className="text-xs text-muted-foreground">
              Assignment Demo by Mohamad Ziqreey Bin Rahmat
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
