
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShoppingCart, Plus, Minus, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

const HallMenu = () => {
  const [selectedHall, setSelectedHall] = useState("");
  const [selectedSeat, setSelectedSeat] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Sample menu items
  const menuItems: MenuItem[] = [
    // Popcorn
    { id: "pop-s", name: "Small Popcorn", description: "Perfect single serving", price: 8.90, category: "Popcorn" },
    { id: "pop-m", name: "Medium Popcorn", description: "Great for sharing", price: 12.90, category: "Popcorn" },
    { id: "pop-l", name: "Large Popcorn", description: "Family size portion", price: 16.90, category: "Popcorn" },
    { id: "pop-c", name: "Caramel Popcorn", description: "Sweet caramel coating", price: 14.90, category: "Popcorn" },
    
    // Beverages
    { id: "coke", name: "Coca-Cola", description: "Classic refreshment", price: 6.90, category: "Beverages" },
    { id: "sprite", name: "Sprite", description: "Lemon-lime soda", price: 6.90, category: "Beverages" },
    { id: "coffee", name: "Hot Coffee", description: "Freshly brewed", price: 8.90, category: "Beverages" },
    { id: "water", name: "Mineral Water", description: "500ml bottle", price: 4.90, category: "Beverages" },
    
    // Snacks
    { id: "nachos", name: "Nachos & Cheese", description: "Crispy tortilla chips", price: 11.90, category: "Snacks" },
    { id: "hotdog", name: "Cinema Hot Dog", description: "Classic frankfurter", price: 9.90, category: "Snacks" },
    { id: "candy", name: "Mixed Candy", description: "Assorted sweets", price: 7.90, category: "Snacks" },
    
    // Combos
    { id: "combo1", name: "Movie Night Combo", description: "Medium popcorn + 2 drinks", price: 22.90, category: "Combos" },
    { id: "combo2", name: "Sweet Tooth Combo", description: "Caramel popcorn + candy", price: 19.90, category: "Combos" },
  ];

  const categories = ["Popcorn", "Beverages", "Snacks", "Combos"];
  const halls = ["Hall 1", "Hall 2", "Hall 3", "Hall 4", "Hall 5"];

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    
    toast({
      title: "Added to Cart",
      description: `${item.name} added to your order`,
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(cartItem =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      }
      return prev.filter(cartItem => cartItem.id !== itemId);
    });
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const placeOrder = () => {
    if (!selectedHall || !selectedSeat) {
      toast({
        title: "Missing Information",
        description: "Please select your hall and seat number",
        variant: "destructive",
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before ordering",
        variant: "destructive",
      });
      return;
    }

    // Create order object
    const order = {
      id: Date.now().toString(),
      userId: user?.email,
      hallNumber: selectedHall,
      seatNumber: selectedSeat,
      items: cart,
      totalAmount: getCartTotal(),
      status: "pending",
      orderTime: new Date().toISOString(),
      specialInstructions: ""
    };

    // Store order in localStorage for demo purposes
    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    existingOrders.push(order);
    localStorage.setItem("orders", JSON.stringify(existingOrders));

    // Clear cart
    setCart([]);

    toast({
      title: "Order Placed Successfully!",
      description: `Your order will be delivered to ${selectedHall}, Seat ${selectedSeat}`,
    });

    // Navigate to order tracking or stay on page
    navigate("/orders");
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
                <h1 className="text-xl font-bold">Cinema Snack Menu</h1>
                <p className="text-sm text-muted-foreground">Welcome, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link to="/orders">My Orders</Link>
              </Button>
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                {getCartItemCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary">
                    {getCartItemCount()}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Location Selection */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  Your Location
                </CardTitle>
                <CardDescription>Select your current hall and seat</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Hall</label>
                  <select 
                    className="w-full p-2 rounded-md border border-border bg-background"
                    value={selectedHall}
                    onChange={(e) => setSelectedHall(e.target.value)}
                  >
                    <option value="">Select Hall</option>
                    {halls.map(hall => (
                      <option key={hall} value={hall}>{hall}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Seat</label>
                  <input
                    type="text"
                    placeholder="e.g., J12"
                    className="w-full p-2 rounded-md border border-border bg-background"
                    value={selectedSeat}
                    onChange={(e) => setSelectedSeat(e.target.value.toUpperCase())}
                  />
                </div>
                
                {/* Cart Summary */}
                {cart.length > 0 && (
                  <div className="pt-4 border-t border-border/40">
                    <h3 className="font-medium mb-3">Cart Summary</h3>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                          <span>{item.name} x{item.quantity}</span>
                          <span>RM{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-border/40 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>RM{getCartTotal().toFixed(2)}</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-4 cinema-gradient hover:opacity-90"
                      onClick={placeOrder}
                    >
                      Place Order
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Menu Items */}
          <div className="lg:col-span-3">
            {categories.map(category => (
              <div key={category} className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  {category}
                  <Badge variant="secondary" className="ml-2">
                    {menuItems.filter(item => item.category === category).length} items
                  </Badge>
                </h2>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {menuItems
                    .filter(item => item.category === category)
                    .map(item => {
                      const cartItem = cart.find(cartItem => cartItem.id === item.id);
                      const quantity = cartItem?.quantity || 0;
                      
                      return (
                        <Card key={item.id} className="hover:shadow-lg transition-all duration-300 border-border/40 hover:border-primary/40">
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">{item.name}</CardTitle>
                                <CardDescription className="text-sm">{item.description}</CardDescription>
                              </div>
                              <span className="text-lg font-bold text-primary">RM{item.price.toFixed(2)}</span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeFromCart(item.id)}
                                  disabled={quantity === 0}
                                  className="h-8 w-8 p-0"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-8 text-center font-medium">{quantity}</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addToCart(item)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => addToCart(item)}
                                className="cinema-gradient hover:opacity-90"
                              >
                                Add to Cart
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HallMenu;
