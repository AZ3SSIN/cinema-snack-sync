
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const demoAccounts = [
    { email: "customer@demo.com", password: "password123", role: "customer", redirect: "/hall-menu" },
    { email: "staff@demo.com", password: "password123", role: "staff", redirect: "/staff-dashboard" },
    { email: "admin@demo.com", password: "password123", role: "admin", redirect: "/hall-menu" }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const account = demoAccounts.find(acc => acc.email === email && acc.password === password);
    
    if (account) {
      // Store user data in localStorage for demo purposes
      localStorage.setItem("user", JSON.stringify({
        email: account.email,
        role: account.role,
        name: account.role.charAt(0).toUpperCase() + account.role.slice(1) + " User"
      }));

      toast({
        title: "Login Successful",
        description: `Welcome back, ${account.role}!`,
      });

      navigate(account.redirect);
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please use one of the demo accounts.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  const quickLogin = (account: typeof demoAccounts[0]) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <Card className="border-border/40 shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <div className="w-12 h-12 cinema-gradient rounded-lg mx-auto flex items-center justify-center mb-4">
              <span className="text-white font-bold">GSC</span>
            </div>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access GSC Cinema Live features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full cinema-gradient hover:opacity-90" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border/40">
              <p className="text-sm text-muted-foreground mb-4 text-center">Demo Accounts</p>
              <div className="space-y-2">
                {demoAccounts.map((account) => (
                  <Button
                    key={account.email}
                    variant="outline"
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => quickLogin(account)}
                  >
                    <div>
                      <div className="font-medium capitalize">{account.role}</div>
                      <div className="text-xs text-muted-foreground">{account.email}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          This is a demo application for assignment purposes
        </p>
      </div>
    </div>
  );
};

export default Login;
