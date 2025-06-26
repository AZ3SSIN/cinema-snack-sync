import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Film,
  MapPin,
  Calendar,
  ShoppingCart,
  Clock,
  LogOut,
  Home,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "@/utils/userTickets";
import { useToast } from "@/hooks/use-toast";

const Navigation = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const currentUser = getCurrentUser();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b border-border/40 backdrop-blur-sm bg-card-black/80 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 pr-3">
            <div className="w-20 h-20 flex items-center justify-center mr-3">
              <img
                src="https://www.gsc.com.my/_nuxt/img/logo.4f87efa.png"
                alt="GSC Logo"
                className="w-20 h-20 object-contain"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/home">
              <Button
                variant="ghost"
                className={`text-white hover:text-black hover:bg-primary-yellow ${
                  isActive("/home") ? "bg-primary-yellow text-black" : ""
                }`}
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
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
            <Link to="/hall-booking">
              <Button
                variant="ghost"
                className={`text-white hover:text-black hover:bg-primary-yellow ${
                  isActive("/hall-booking")
                    ? "bg-primary-yellow text-black"
                    : ""
                }`}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Hall Booking
              </Button>
            </Link>
            <Link to="/hall-menu">
              <Button
                variant="ghost"
                className={`text-white hover:text-black hover:bg-primary-yellow ${
                  isActive("/hall-menu") ? "bg-primary-yellow text-black" : ""
                }`}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Snack Delivery
              </Button>
            </Link>
            <Link to="/countdown">
              <Button
                variant="ghost"
                className={`text-white hover:text-black hover:bg-primary-yellow ${
                  isActive("/countdown") ? "bg-primary-yellow text-black" : ""
                }`}
              >
                <Clock className="h-4 w-4 mr-2" />
                Movie Countdown
              </Button>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {currentUser && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="border-primary-yellow/30 text-primary-yellow hover:bg-primary-yellow hover:text-black"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
