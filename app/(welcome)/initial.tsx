import React, { useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LottieView from 'lottie-react-native';
import animation from '@/assets/animations/driver.json';
import { useRouter } from 'expo-router';


export default function Initial() {
  const router = useRouter();

  return (
    <View className='flex-1 items-center justify-center'>
         <View className='items-center justify-center text-justify px-8 absolute top-20'>
                <Text style={{fontFamily : 'Poppins'}} className='text-center text-lg text-bold'>
                    Aprenda Tudo sobre condução em qualquer lugar e saia na frente em qualquer teste
                    </Text>
          </View>
       <LottieView
            source={animation} 
            autoPlay
            loop
            style={styles.animation}
          />
          <View  className='items-center justify-center'>
            <TouchableOpacity className='bg-[#383A44] px-8 py-4 rounded-full' onPress={()=>router.push('/(auth)/login')}>
                <Text className='text-center font-bold text-lg text-white' style={{fontFamily : 'Poppins'}}>Começar</Text>
            </TouchableOpacity>
          </View>
    </View>
  );
}

const styles = StyleSheet.create({
  animation: {
    width: 500,
    height: 500,
  }
});