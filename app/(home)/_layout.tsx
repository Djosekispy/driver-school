import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'react-native';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      
          <StatusBar barStyle={'light-content'}  translucent/>
      <Drawer>
        <Drawer.Screen
          name="index" 
          options={{
            drawerLabel: 'Home',
            title: '',
          }}
        />
         <Drawer.Screen
          name="chat" 
          options={{
            drawerLabel: 'conversas',
            title: '',
          }}
        />
          <Drawer.Screen
          name="trafic" 
          options={{
            drawerLabel: 'Sinais de Trânsito',
            title: '',
          }}
        />
          <Drawer.Screen
          name="testing" 
          options={{
            drawerLabel: 'Teste de conhecimento',
            title: '',
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
