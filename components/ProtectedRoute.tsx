// components/ProtectedRoute.tsx
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { useAuth } from '@/AuthContext/AuthContext';
import { View, ActivityIndicator } from 'react-native';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/(auth)/login'); 
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}
