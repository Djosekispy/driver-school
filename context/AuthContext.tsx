import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
  updatePhoneNumber,
  updateProfile
} from 'firebase/auth';
import {
  addDoc,
  collection,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where
} from "firebase/firestore"; 

import { clearUserFromStorage, getUserFromStorage, saveUserToStorage } from '@/firebase/storage';
import Toast from '@/components/ui/toast';
import LoadingModal from '@/components/ui/loading';
import { auth, db } from '@/firebase/firebase';
import { createLog } from '@/services/logService';
import { User } from '@/types/User';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (user: Partial<User>, password: string) => Promise<void>;
  updatedUser: (user: Partial<User>, message?: string) => Promise<void>;
  updatePhoto: (photo: string) => Promise<void>;
  logout: () => void;
  updateUserLocation: (location: { lat: number; lng: number }) => void;
  isAuthenticated: boolean;
  changePassword: (newPassword : string)=>Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' });

  const router = useRouter();

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ visible: true, message, type });
  };

  useEffect(() => {
    const loadUser = async () => {
      const savedUser = await getUserFromStorage();
      setUser(savedUser);
      router.push(savedUser ? '/(home)' : '/(auth)');
      setIsLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data() as User;
        setUser(userData);
        await saveUserToStorage(userData);
        router.push("/(home)");
      } else {
        showToast('error', 'Usuário não encontrado.');
      }
    } catch (error: any) {
      showToast('error', `Usuario ou senha inválidos`);
    } finally {
      setIsLoading(false);
    }
  };

  const updatedUser = async (userData: Partial<User>, message?: string) => {
    setIsLoading(true);
    try {
      const usersRef = collection(db, 'users');
      const q = user?.id
        ? query(usersRef, where('id', '==', user.id))
        : user?.email
        ? query(usersRef, where('email', '==', user.email))
        : null;

      if (!q) throw new Error('Nenhum ID ou email disponível para atualizar.');

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        await updateDoc(querySnapshot.docs[0].ref, { ...userData });

       if (auth.currentUser) {
        const updateData: any = {
          displayName: userData.name
        };

        if (userData.avatarUrl) {
          updateData.photoURL = userData.avatarUrl;
        }
        await updateProfile(auth.currentUser, updateData);
       // if(userData.email && userData.email !== auth.currentUser.email) {await updateEmail(auth.currentUser,userData.email)}
        // if(userData.phone && userData.phone !== auth.currentUser.phoneNumber) {await updatePhoneNumber(auth.currentUser,userData.phone as any)}
      }
        const updated = { ...user, ...userData } as User;
        setUser(updated);
        await saveUserToStorage(updated);
        showToast('success', message ?? 'Usuário atualizado com sucesso!');
      } else {
        showToast('error', 'Usuário não encontrado para atualização.');
      }
    } catch (error) {
      showToast('error', 'Erro ao atualizar usuário!');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePhoto = async (avatarUrl: string) => {
    setIsLoading(true);
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('id', '==', user?.id));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        await updateDoc(querySnapshot.docs[0].ref, { avatarUrl });
        const updated = { ...user, avatarUrl } as User;
        setUser(updated);
        await saveUserToStorage(updated);
        showToast('success', 'Foto de perfil atualizada com sucesso!');
      }
    } catch (error) {
      showToast('error', 'Erro ao atualizar foto de perfil!');
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (newPassword: string) => {
  setIsLoading(true);
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("Usuário não autenticado.");
    }

    await updatePassword(currentUser, newPassword);
    showToast('success', 'Senha atualizada com sucesso!');
  } catch (error: any) {
    const errorMessage = error.message || 'Erro ao atualizar senha.';
    showToast('error', errorMessage);
  } finally {
    setIsLoading(false);
  }
};

  const register = async (userData: Partial<User>, password: string) => {
    setIsLoading(true);
    try {
      if (!userData.email || !password) {
        throw new Error("Email e senha são obrigatórios.");
      }

      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password);
      const firebaseUser = userCredential.user;

      const newUser: User = {
        id: firebaseUser.uid,
        name: userData.name || '',
        email: userData.email,
        password: '',
        phone: userData.phone || '',
        address: userData.address || '',
        avatarUrl: firebaseUser.photoURL || '',
        role: userData.role || 'normal',
        createdAt: Timestamp.now().toDate(),
      };

      await addDoc(collection(db, "users"), newUser);
       await createLog({createdBy : '001', title : `Novo Usuário`, discription : String(userData.name) , type:'user'});
      
      router.push({
        pathname: '/(auth)/login',
        params: { email: userData.email, password }
      });
    } catch (error) {
      showToast('error', 'Erro ao cadastrar usuário!');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    await clearUserFromStorage();
    setUser(null);
    router.push('/(auth)/login');
  };

  const updateUserLocation = async (location: { lat: number; lng: number }) => {
    if (!user) return;
    const updatedUserData = { ...user, location };
    await updatedUser(updatedUserData);
    setUser(updatedUserData);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    updatedUser,
    updatePhoto,
    logout,
    changePassword,
    updateUserLocation,
    isAuthenticated: !!user,
  };

  return (
    <>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />
      <LoadingModal visible={isLoading} />
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    </>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
