import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Admin {
  id: number;
  email: string;
}

interface LoginData {
  email: string;
  password: string;
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState<Admin | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status once on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check");
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
        setAdmin(data.admin);
      } catch (error) {
        setIsAuthenticated(false);
        setAdmin(undefined);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const response = await apiRequest("POST", "/api/login", credentials);
      return response.json();
    },
    onSuccess: (data) => {
      setIsAuthenticated(true);
      setAdmin(data.admin);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/logout", {});
      return response.json();
    },
    onSuccess: () => {
      setIsAuthenticated(false);
      setAdmin(undefined);
    },
  });

  return {
    isAuthenticated,
    admin,
    isLoading,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,
  };
}