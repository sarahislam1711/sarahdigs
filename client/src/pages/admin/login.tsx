import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        // Invalidate auth query to refetch user
        await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
        navigate("/admin");
      } else {
        const data = await response.json();
        toast({
          title: "Login Failed",
          description: data.message || "Invalid password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-[#181612]/10 rounded-md p-8 shadow-xl shadow-[#181612]/5">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#6B1421]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-[#6B1421]" />
            </div>
            <h1 className="font-['Syne'] text-2xl font-bold text-[#181612] mb-2 lowercase">
              admin login
            </h1>
            <p className="text-[#6F6A5F] text-sm lowercase">
              enter your admin password to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#181612]">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="enter admin password"
                className="bg-[#FBF9F3] border-[#181612]/15 text-[#181612] placeholder:text-[#181612]/30 focus:border-[#6B1421] focus:ring-[#6B1421]"
                required
                autoFocus
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !password}
              className="w-full bg-[#6B1421] hover:bg-[#8C2331] text-white font-medium py-3 lowercase"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  signing in...
                </>
              ) : (
                "sign in"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-[#6F6A5F] hover:text-[#6B1421] text-sm transition-colors lowercase"
            >
              ← back to website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
