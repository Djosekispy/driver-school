import { Tabs } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { COLORS } from '@/hooks/useColors';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.text,
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: '600',
          },
          tabBarStyle: {
            backgroundColor: COLORS.background,
            paddingBottom: 6,
            paddingTop: 6,
            height: 60,
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
        <Tabs.Screen
          name="index"
          options={{
            title: '',
            tabBarLabel: 'Início',
            tabBarIcon: ({ color, size }) => (
              <Feather name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: '',
            tabBarLabel: 'Conversas',
            tabBarIcon: ({ color, size }) => (
              <Feather name="message-circle" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="trafic"
          options={{
            title: '',
            tabBarLabel: 'Sinais',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="traffic-light" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="testing"
          options={{
            title: '',
            tabBarLabel: 'Teste',
            tabBarIcon: ({ color, size }) => (
              <Feather name="book-open" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}
