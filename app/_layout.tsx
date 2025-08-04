import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import "../css/global.css"
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/context/AuthContext';
import { FirebaseProvider } from '@/context/FirebaseContext';
import 'react-native-get-random-values';

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
      <FirebaseProvider>
    <SafeAreaView style={{flex: 1}}>
      <StatusBar  style='light' networkActivityIndicatorVisible/>
       <Stack screenOptions={{headerShown:false}}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(home)" options={{ headerShown: false }} />
        <Stack.Screen name="(details)" options={{ headerShown: false }} />
        <Stack.Screen name="(admin)" options={{ headerShown: false }} />
        <Stack.Screen name="(more)" options={{ headerShown: false }} />
        <Stack.Screen name="(users)" options={{ headerShown: false }} />
        <Stack.Screen name="(videos)" options={{ headerShown: false }} />
        <Stack.Screen name="(test)" options={{ headerShown: false }} />
         <Stack.Screen name="(signal)" options={{ headerShown: false }} />
      </Stack>
      </SafeAreaView>
      </FirebaseProvider>
      </AuthProvider>
  );
}