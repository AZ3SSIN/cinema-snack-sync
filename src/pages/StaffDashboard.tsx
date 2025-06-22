
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, MapPin, CheckCircle, Package, Truck } from "lucide-react";
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

const StaffDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<any>(null);
  const [filter, setFilter] = useState<string>("all");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    if (parsedUser.role !== "staff" && parsedUser.role !== "admin") {
      navigate("/hall-menu");
      return;
    }

    loadOrders();
    
    // Set up real-time polling for new orders
    const interval = setInterval(loadOrders, 3000);
    return () => clearInterval(interval);
  }, [navigate]);

  const loadOrders = () => {
    const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(allOrders.sort((a: Order, b: Order) => new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime()));
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const updatedOrders = allOrders.map((order: Order) => {
      if (order.id === orderId) {
        const updatedOrder = { ...order, status: newStatus };
        if (newStatus === "delivered") {
          updatedOrder.deliveryTime = new Date().toISOString();
        }
        return updatedOrder;
      }
      return order;
    });
    
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    setOrders(updatedOrders.sort((a: Order, b: Order) => new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime()));
    
    const statusText = newStatus.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    toast({
      title: "Order Updated",
      description: `Order #${orderId.slice(-6)} marked as ${statusText}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "status-pending";
      case "preparing": return "status-preparing";
      case "out_for_delivery": return "status-out_for_delivery";
      case "delivered": return "status-delivered";
      default: return "status-pending";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Pending";
      case "preparing": return "Preparing";
      case "out_for_delivery": return "Out for Delivery";
      case "delivered": return "Delivered";
      default: return "Unknown";
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case "pending": return "preparing";
      case "preparing": return "out_for_delivery";
      case "out_for_delivery": return "delivered";
      default: return null;
    }
  };

  const getNextStatusText = (currentStatus: string) => {
    switch (currentStatus) {
      case "pending": return "Start Preparing";
      case "preparing": return "Out for Delivery";
      case "out_for_delivery": return "Mark Delivered";
      default: return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4" />;
      case "preparing": return <Package className="h-4 w-4" />;
      case "out_for_delivery": return <Truck className="h-4 w-4" />;
      case "delivered": return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === "all") return true;
    return order.status === filter;
  });

  const orderCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    preparing: orders.filter(o => o.status === "preparing").length,
    out_for_delivery: orders.filter(o => o.status === "out_for_delivery").length,
    delivered: orders.filter(o => o.status === "delivered").length,
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
              <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
              <div>
                <h1 className="text-xl font-bold">Staff Dashboard</h1>
                <p className="text-sm text-muted-foreground">Manage snack orders and deliveries</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">Live Updates</Badge>
              <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: "all", label: "All Orders", count: orderCounts.all },
            { key: "pending", label: "Pending", count: orderCounts.pending },
            { key: "preparing", label: "Preparing", count: orderCounts.preparing },
            { key: "out_for_delivery", label: "Out for Delivery", count: orderCounts.out_for_delivery },
            { key: "delivered", label: "Delivered", count: orderCounts.delivered },
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={filter === tab.key ? "default" : "outline"}
              onClick={() => setFilter(tab.key)}
              className="relative"
            >
              {tab.label}
              {tab.count > 0 && (
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {tab.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Orders</h3>
              <p className="text-muted-foreground">
                {filter === "all" ? "No orders yet." : `No ${filter.replace(/_/g, " ")} orders.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredOrders.map((order) => {
              const nextStatus = getNextStatus(order.status);
              const nextStatusText = getNextStatusText(order.status);
              
              return (
                <Card key={order.id} className="border-border/40 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Order #{order.id.slice(-6)}</CardTitle>
                      <Badge className={`status-badge ${getStatusColor(order.status)} flex items-center gap-1`}>
                        {getStatusIcon(order.status)}
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                    <CardDescription className="space-y-1">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {order.hallNumber}, Seat {order.seatNumber}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(order.orderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                        <span className="ml-2 text-xs">
                          ({Math.floor((Date.now() - new Date(order.orderTime).getTime()) / 60000)}m ago)
                        </span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium mb-2 text-sm">Items:</h4>
                        <div className="space-y-1 max-h-24 overflow-y-auto">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.name} x{item.quantity}</span>
                              <span>RM{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2 border-t border-border/40">
                        <span className="font-semibold">Total: RM{order.totalAmount.toFixed(2)}</span>
                      </div>

                      {nextStatus && nextStatusText && (
                        <Button
                          className="w-full mt-3"
                          onClick={() => updateOrderStatus(order.id, nextStatus)}
                          variant={order.status === "out_for_delivery" ? "default" : "outline"}
                        >
                          {nextStatusText}
                        </Button>
                      )}

                      {order.status === "delivered" && order.deliveryTime && (
                        <div className="mt-3 p-2 bg-green-500/10 border border-green-500/20 rounded-md">
                          <p className="text-xs text-green-400">
                            ✓ Delivered at {new Date(order.deliveryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
