// contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  User
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '@/firebase/firebase';


interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Observar mudanças no estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setIsLoading(false);
      
      if (user) {
        await AsyncStorage.setItem('@user', JSON.stringify(user));
      } else {
        await AsyncStorage.removeItem('@user');
      }
    });

    return unsubscribe;
  }, []);

  // Registrar novo usuário
  const register = async (email: string, password: string, displayName: string) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      setUser({ ...userCredential.user, displayName } as User);
    } catch (error) {
      console.error('Registration Error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Login com email e senha
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('@user');
    } catch (error) {
      console.error('Logout Error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Redefinir senha
  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password Reset Error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar perfil do usuário
  const updateUserProfile = async (displayName: string) => {
    if (!auth.currentUser) return;
    
    setIsLoading(true);
    try {
      await updateProfile(auth.currentUser, { displayName });
      setUser({ ...auth.currentUser, displayName } as User);
    } catch (error) {
      console.error('Profile Update Error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
   <AuthContext.Provider value={{ 
  user, 
  isLoading, 
  register, 
  login, 
  logout, 
  resetPassword,
  updateUserProfile,
  isAuthenticated: !!user,
}}>

      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};