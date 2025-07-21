import SinalDetalhesScreen from "@/components/trafic/screen/SinalDetalhesScreen";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



export default function Signal(){
    
  const { id } = useLocalSearchParams();
  return (
  <SafeAreaView className="flex-1">
    <StatusBar barStyle={'dark-content'} translucent/>
    <SinalDetalhesScreen id={id as string} />
  </SafeAreaView>
  );
}