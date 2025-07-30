import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import CustomDrawerContent from '../(welcome)/CustomDrawerContent';
import { COLORS } from '@/hooks/useColors';

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: true,
          drawerActiveTintColor: COLORS.primary,
          drawerInactiveTintColor: COLORS.text,
          drawerLabelStyle: {
            fontSize: 16,
            fontWeight: '600',
            marginLeft: -10,
          },
          drawerStyle: {
            backgroundColor: COLORS.background,
            paddingTop: 20,
          },
          headerStyle: {
            backgroundColor: COLORS.surface,
          },
          headerTitleStyle: {
            color: COLORS.text,
            fontWeight: 'bold',
          },
        }}
      >
        <Drawer.Screen name="index" options={{ drawerLabel: '🏠 Início', title: '' }} />
        <Drawer.Screen name="chat" options={{ drawerLabel: '💬 Conversas', title: '' }} />
        <Drawer.Screen name="trafic" options={{ drawerLabel: '🚦 Sinais de Trânsito', title: '' }} />
        <Drawer.Screen name="testing" options={{ drawerLabel: '🧠 Teste de Conhecimento', title: '' }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}
