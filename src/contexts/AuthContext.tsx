
import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { UserProfile } from "@/types";

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Partial<UserProfile>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    const storedUser = localStorage.getItem("user");
    
    if (storedAuth === "true" && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  // Login function (simulated)
  const login = async (email: string, password: string) => {
    // In a real app, this would call an API
    console.log("Logging in with", email, password);
    
    // Simulate successful login
    const mockUser: UserProfile = {
      id: "user-1",
      name: "John Doe",
      email: email,
      major: "Computer Science",
      points: 75,
      attendedEvents: [],
      badges: ["welcome", "first-event"],
      shareProfile: true,
    };
    
    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("user", JSON.stringify(mockUser));
    
    toast({
      title: "Login successful",
      description: "Welcome back!",
    });
  };
  
  // Signup function (simulated)
  const signup = async (userData: Partial<UserProfile>) => {
    // In a real app, this would call an API
    console.log("Signing up user", userData);
    
    toast({
      title: "Account created",
      description: "Your account has been created successfully.",
    });
  };
  
  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
