import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const demoAccounts = [
    { email: "customer@demo.com", password: "password123", role: "customer" },
    { email: "staff@demo.com", password: "password123", role: "staff" },
    { email: "admin@demo.com", password: "password123", role: "admin" },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const account = demoAccounts.find(
      (acc) => acc.email === email && acc.password === password
    );

    if (account) {
      // Store user data in localStorage for demo purposes
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: account.email,
          role: account.role,
          name:
            account.role.charAt(0).toUpperCase() +
            account.role.slice(1) +
            " User",
        })
      );

      toast({
        title: "Login Successful",
        description: `Welcome back, ${account.role}!`,
      });

      // Check if there's a redirect parameter
      const redirectTo = searchParams.get("redirect");

      if (redirectTo === "countdown") {
        navigate("/countdown");
      } else if (redirectTo === "snacks") {
        navigate("/hall-menu");
      } else if (account.role === "staff") {
        navigate("/staff-dashboard");
      } else {
        navigate("/home");
      }
    } else {
      toast({
        title: "Login Failed",
        description:
          "Invalid credentials. Please use one of the demo accounts.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  const quickLogin = (account: (typeof demoAccounts)[0]) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center text-sm text-white/70 hover:text-primary-yellow mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <Card className="border-primary-yellow/40 shadow-2xl bg-card-black">
          <CardHeader className="text-center space-y-2">
            {/* <div className="w-12 h-12 bg-primary-yellow rounded-lg mx-auto flex items-center justify-center mb-4">
              <span className="text-black font-bold">GSC</span>
            </div> */}
            <div className="mx-auto flex items-center justify-center mt-5 mb-5">
              <img
                src="https://www.gsc.com.my/_nuxt/img/logo.4f87efa.png"
                alt="GSC Logo"
                className="w-12 h-12 object-contain"
              />
            </div>
            <CardTitle className="text-2xl text-white">Welcome Back</CardTitle>
            <CardDescription className="text-white/80">
              Sign in to access GSC Cinema Live features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background-dark border-primary-yellow/30 text-white placeholder:text-white/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background-dark border-primary-yellow/30 text-white placeholder:text-white/50"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary-yellow text-black hover:bg-primary-yellow/90"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-primary-yellow/20">
              <p className="text-sm text-white/70 mb-4 text-center">
                Demo Accounts
              </p>
              <div className="space-y-2">
                {demoAccounts.map((account) => (
                  <Button
                    key={account.email}
                    variant="outline"
                    className="w-full justify-start text-left h-auto p-3 border-primary-yellow/30 text-white hover:bg-primary-yellow hover:text-black"
                    onClick={() => quickLogin(account)}
                  >
                    <div>
                      <div className="font-medium capitalize">
                        {account.role}
                      </div>
                      <div className="text-xs text-white/60">
                        {account.email}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-white/50 mt-6">
          This is a demo application for assignment purposes
        </p>
      </div>
    </div>
  );
};

export default Login;
