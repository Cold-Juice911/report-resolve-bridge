import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

export interface User {
  id: string;
  email: string;
  name: string;
  mobile?: string;
  role: 'user' | 'admin';
  preferredLanguage: 'en' | 'hi';
  theme: 'light' | 'dark';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  isAdmin: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  mobile?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Load user from localStorage on app start
    const savedUser = localStorage.getItem('sudhaar-user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      i18n.changeLanguage(userData.preferredLanguage);
      document.documentElement.classList.toggle('dark', userData.theme === 'dark');
    }

    // Initialize seed data
    initializeSeedData();
  }, [i18n]);

  const initializeSeedData = () => {
    // Initialize admin user if not exists
    const users = JSON.parse(localStorage.getItem('sudhaar-users') || '[]');
    if (!users.find((u: User) => u.email === 'admin@sudhaar.gov.in')) {
      const adminUser: User = {
        id: 'admin-1',
        email: 'admin@sudhaar.gov.in',
        name: 'System Administrator',
        role: 'admin',
        preferredLanguage: 'en',
        theme: 'light'
      };
      users.push(adminUser);
      
      // Add sample user
      const sampleUser: User = {
        id: 'user-1',
        email: 'user@example.com',
        name: 'Sample User',
        mobile: '+91 9876543210',
        role: 'user',
        preferredLanguage: 'en',
        theme: 'light'
      };
      users.push(sampleUser);
      
      localStorage.setItem('sudhaar-users', JSON.stringify(users));
      
      // Store passwords separately (in real app, these would be hashed)
      const passwords = JSON.parse(localStorage.getItem('sudhaar-passwords') || '{}');
      passwords['admin@sudhaar.gov.in'] = 'admin123';
      passwords['user@example.com'] = 'user123';
      localStorage.setItem('sudhaar-passwords', JSON.stringify(passwords));
    }

    // Initialize sample complaints if not exists
    if (!localStorage.getItem('sudhaar-complaints')) {
      const sampleComplaints = [
        {
          id: 'C001',
          userId: 'user-1',
          title: 'Pothole on Main Street',
          category: 'roads',
          location: 'Main Street, near City Center',
          description: 'Large pothole causing traffic issues and vehicle damage. Approximately 2 feet wide and 6 inches deep.',
          photos: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
          status: 'pending',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          messages: []
        },
        {
          id: 'C002',
          userId: 'user-1',
          title: 'Water Supply Disruption',
          category: 'water',
          location: 'Residential Block A, Sector 5',
          description: 'No water supply for the past 3 days. Multiple families affected in the building.',
          photos: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
          status: 'in_progress',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          messages: [
            {
              id: 'msg-1',
              type: 'admin',
              message: 'Your complaint has been forwarded to the Water Department. Expected resolution time: 2-3 days.',
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              adminId: 'admin-1'
            }
          ]
        }
      ];
      localStorage.setItem('sudhaar-complaints', JSON.stringify(sampleComplaints));
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('sudhaar-users') || '[]');
    const passwords = JSON.parse(localStorage.getItem('sudhaar-passwords') || '{}');
    
    const foundUser = users.find((u: User) => u.email === email);
    if (foundUser && passwords[email] === password) {
      setUser(foundUser);
      localStorage.setItem('sudhaar-user', JSON.stringify(foundUser));
      i18n.changeLanguage(foundUser.preferredLanguage);
      document.documentElement.classList.toggle('dark', foundUser.theme === 'dark');
      
      toast({
        title: t('auth.loginSuccess'),
        description: `Welcome back, ${foundUser.name}!`
      });
      return true;
    }
    
    toast({
      title: t('common.error'),
      description: t('auth.invalidCredentials'),
      variant: 'destructive'
    });
    return false;
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('sudhaar-users') || '[]');
    const passwords = JSON.parse(localStorage.getItem('sudhaar-passwords') || '{}');
    
    // Check if user already exists
    if (users.find((u: User) => u.email === userData.email)) {
      toast({
        title: t('common.error'),
        description: 'User already exists',
        variant: 'destructive'
      });
      return false;
    }
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: userData.email,
      name: userData.name,
      mobile: userData.mobile,
      role: 'user',
      preferredLanguage: 'en',
      theme: 'light'
    };
    
    users.push(newUser);
    passwords[userData.email] = userData.password;
    
    localStorage.setItem('sudhaar-users', JSON.stringify(users));
    localStorage.setItem('sudhaar-passwords', JSON.stringify(passwords));
    
    setUser(newUser);
    localStorage.setItem('sudhaar-user', JSON.stringify(newUser));
    
    toast({
      title: t('auth.registerSuccess'),
      description: `Welcome, ${newUser.name}!`
    });
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sudhaar-user');
    toast({
      title: t('common.success'),
      description: 'Logged out successfully'
    });
  };

  const updateProfile = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('sudhaar-user', JSON.stringify(updatedUser));
    
    // Update language if changed
    if (userData.preferredLanguage) {
      i18n.changeLanguage(userData.preferredLanguage);
    }
    
    // Update theme if changed
    if (userData.theme) {
      document.documentElement.classList.toggle('dark', userData.theme === 'dark');
    }
    
    // Update in users array
    const users = JSON.parse(localStorage.getItem('sudhaar-users') || '[]');
    const userIndex = users.findIndex((u: User) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('sudhaar-users', JSON.stringify(users));
    }
    
    toast({
      title: t('common.success'),
      description: 'Profile updated successfully'
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};