import { User } from '@/types/User';
import * as SecureStore from 'expo-secure-store';


const CURRENT_USER_KEY = 'agua_expressa_current_user';

export async function saveUserToStorage(user: Partial<User>) {
  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl || '',
    role: user.role,
  phone: user.phone || '',
  address: user.address || '',
  createdAt : user.createdAt || null
  };
  await SecureStore.setItemAsync(CURRENT_USER_KEY, JSON.stringify(safeUser));
}

export async function getUserFromStorage(): Promise<User | null> {
  const json = await SecureStore.getItemAsync(CURRENT_USER_KEY);
  return json ? JSON.parse(json) : null;
}

export async function clearUserFromStorage() {
  await SecureStore.deleteItemAsync(CURRENT_USER_KEY);
}