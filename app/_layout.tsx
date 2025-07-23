import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import "../css/global.css"
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/AuthContext/AuthContext';


export {
  ErrorBoundary,
} from 'expo-router';



SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Poppins: require('../assets/fonts/Poppins-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {

  return (
    <AuthProvider>
    <SafeAreaView style={{flex: 1}}>
      <StatusBar  style='dark' translucent/>
     
      <Stack screenOptions={{headerShown:false}}>
          <Stack.Screen name="(home)" options={{ headerShown: false }} />
        <Stack.Screen name="(welcome)" options={{ headerShown: false }} />
         <Stack.Screen name="(auth)" options={{ headerShown: false }} />
           <Stack.Screen name="(details)" options={{ headerShown: false }} />
      </Stack>
      </SafeAreaView>
      </AuthProvider>
  );
}
