import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import CustomDrawerContent from '../(welcome)/CustomDrawerContent';

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{ headerShown: true }}
      >
        <Drawer.Screen name="index" options={{ drawerLabel: 'Home', title : '' }} />
        <Drawer.Screen name="chat" options={{ drawerLabel: 'Conversas', title : '' }} />
        <Drawer.Screen name="trafic" options={{ drawerLabel: 'Sinais de Trânsito', title : '' }} />
        <Drawer.Screen name="testing" options={{ drawerLabel: 'Teste de Conhecimento', title : '' }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}
