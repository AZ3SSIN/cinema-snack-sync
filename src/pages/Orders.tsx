import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, MapPin, ShoppingBag, RefreshCw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  userId: string;
  hallNumber: string;
  seatNumber: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  status: string;
  orderTime: string;
  deliveryTime?: string;
  specialInstructions?: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Function to load orders from localStorage
  const loadOrders = (showToast = false) => {
    if (!user) return;
    
    const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const userOrders = allOrders.filter(
      (order: Order) => order.userId === user.email
    );
    const sortedOrders = userOrders.sort(
      (a: Order, b: Order) =>
        new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime()
    );
    
    // Check if orders have actually changed
    const ordersChanged = JSON.stringify(orders) !== JSON.stringify(sortedOrders);
    
    if (ordersChanged) {
      setOrders(sortedOrders);
      setLastUpdateTime(new Date().toLocaleTimeString());
      
      if (showToast && orders.length > 0) {
        toast({
          title: "Orders Updated",
          description: "Your order status has been updated!",
        });
      }
    }
  };

  // Manual refresh function
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    loadOrders(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    // Initial load
    loadOrders();

    // Set up polling every 2 seconds for real-time updates
    const polling = setInterval(() => {
      loadOrders(true);
    }, 2000);

    // Listen for localStorage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "orders" && e.newValue !== e.oldValue) {
        loadOrders(true);
      }
    };

    // Add storage event listener
    window.addEventListener("storage", handleStorageChange);

    // Listen for focus events to refresh when user returns to tab
    const handleFocus = () => {
      loadOrders(true);
    };
    window.addEventListener("focus", handleFocus);

    // Cleanup
    return () => {
      clearInterval(polling);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [user, orders]); // Add orders to dependency to detect changes

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "status-pending";
      case "preparing":
        return "status-preparing";
      case "out_for_delivery":
        return "status-out_for_delivery";
      case "delivered":
        return "status-delivered";
      default:
        return "status-pending";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Order Pending";
      case "preparing":
        return "Being Prepared";
      case "out_for_delivery":
        return "Out for Delivery";
      case "delivered":
        return "Delivered";
      default:
        return "Unknown";
    }
  };

  const getEstimatedDelivery = (orderTime: string, status: string) => {
    const orderDate = new Date(orderTime);
    let estimatedMinutes = 15; // Default 15 minutes

    switch (status) {
      case "pending":
        estimatedMinutes = 15;
        break;
      case "preparing":
        estimatedMinutes = 10;
        break;
      case "out_for_delivery":
        estimatedMinutes = 5;
        break;
      case "delivered":
        return "Delivered";
    }

    const estimatedTime = new Date(
      orderDate.getTime() + estimatedMinutes * 60000
    );
    return estimatedTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/hall-menu"
                className="flex items-center text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
              <div>
                <h1 className="text-xl font-bold">My Orders</h1>
                <p className="text-sm text-muted-foreground">
                  Track your snack deliveries
                  {lastUpdateTime && (
                    <span className="ml-2 text-xs">
                      • Last updated: {lastUpdateTime}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
              <Button asChild>
                <Link to="/hall-menu">Order More Snacks</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Real-time indicator */}
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live updates enabled</span>
          </div>
        </div>

        {orders.length === 0 ? (
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="py-12">
              <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't placed any orders yet. Start by browsing our
                delicious snack menu!
              </p>
              <Button asChild>
                <Link to="/hall-menu">Browse Menu</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="border-border/40">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>Order #{order.id.slice(-6)}</span>
                        <Badge
                          className={`status-badge ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusText(order.status)}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-4 mt-2">
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {order.hallNumber}, Seat {order.seatNumber}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {new Date(order.orderTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        RM{order.totalAmount.toFixed(2)}
                      </div>
                      {order.status !== "delivered" && (
                        <div className="text-sm text-muted-foreground">
                          ETA:{" "}
                          {getEstimatedDelivery(order.orderTime, order.status)}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-medium">Order Items:</h4>
                    <div className="grid gap-2">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2 px-3 bg-muted/30 rounded-md"
                        >
                          <div>
                            <span className="font-medium">{item.name}</span>
                            <span className="text-muted-foreground ml-2">
                              x{item.quantity}
                            </span>
                          </div>
                          <span className="font-medium">
                            RM{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Progress Indicator */}
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          Order Progress
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {order.status === "delivered"
                            ? "Completed"
                            : "In Progress"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {[
                          "pending",
                          "preparing",
                          "out_for_delivery",
                          "delivered",
                        ].map((status, index) => {
                          const isActive =
                            [
                              "pending",
                              "preparing",
                              "out_for_delivery",
                              "delivered",
                            ].indexOf(order.status) >= index;
                          const isCurrent = order.status === status;

                          return (
                            <div key={status} className="flex items-center">
                              <div
                                className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                                  isActive
                                    ? isCurrent
                                      ? "bg-primary border-primary animate-pulse"
                                      : "bg-primary/50 border-primary"
                                    : "bg-muted border-muted-foreground/30"
                                }`}
                              />
                              {index < 3 && (
                                <div
                                  className={`h-0.5 w-8 transition-all duration-300 ${
                                    isActive ? "bg-primary" : "bg-muted"
                                  }`}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {order.status === "delivered" && order.deliveryTime && (
                      <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-md">
                        <p className="text-sm text-green-400">
                          ✓ Delivered at{" "}
                          {new Date(order.deliveryTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;