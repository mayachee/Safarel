import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail } from "lucide-react";
import { Link } from "wouter";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoggingIn, loginError } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password }, {
      onSuccess: () => {
        toast({ title: "Login successful!", description: "Welcome to the admin dashboard." });
      },
      onError: (error: any) => {
        toast({ 
          title: "Login failed", 
          description: error?.message || "Invalid credentials",
          variant: "destructive" 
        });
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Admin Login</h2>
          <p className="mt-2 text-gray-600">Access the LogiFlow dashboard</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Sign in to your account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email">Email address</Label>
                <div className="mt-1 relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10"
                  />
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="mt-1 relative">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10"
                  />
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-white hover:bg-blue-700"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Signing in..." : "Sign in"}
              </Button>

              {loginError && (
                <div className="text-red-600 text-sm text-center">
                  Login failed. Please check your credentials.
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/">
            <Button variant="link" className="text-primary">
              ← Back to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}