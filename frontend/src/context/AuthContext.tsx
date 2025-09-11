import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types für Authentication
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Context erstellen
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated when app loads
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'GET',
        credentials: 'include', // Für HTTP-Only Cookies
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        return { success: true };
      } else {
        console.error('Login failed:', data.message);
        return { success: false, message: data.message || 'Anmeldung fehlgeschlagen' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Verbindungsfehler. Bitte prüfen Sie Ihre Internetverbindung.' };
    }
  };

  const register = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        return { success: true };
      } else {
        console.error('Registration failed:', data.message);
        return { success: false, message: data.message || 'Registrierung fehlgeschlagen' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Verbindungsfehler. Bitte prüfen Sie Ihre Internetverbindung.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
