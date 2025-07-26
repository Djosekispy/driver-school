import React from 'react';
import { View } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function CustomDrawerContent(props : any) {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <View style={{ marginTop: 16, borderTopWidth: 1, borderColor: '#ccc' }} />
      <DrawerItem
        label="Sair"
        onPress={() => {
          logout();        
          router.replace('/(auth)/login'); 
        }}
      />
    </DrawerContentScrollView>
  );
}
