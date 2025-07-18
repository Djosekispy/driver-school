import { COLORS } from '@/constants/Colors';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';


const DailyTip = () => {
  return (
    <View className="rounded-xl p-5 mb-6" style={{ backgroundColor: COLORS.blue.darken2 }}>
      <Text className="text-lg font-bold mb-3 text-white">Dica do Dia</Text>
      <Text className="text-white mb-4 leading-5">
        Ao mudar de faixa, sempre verifique os pontos cegos com uma rápida olhada por 
        cima do ombro. Os espelhos retrovisores não mostram toda a área ao lado do seu veículo.
      </Text>
      <TouchableOpacity className="bg-white rounded-lg py-3">
        <Text className="text-center font-bold" style={{ color: COLORS.blue.darken2 }}>
          Mais Dicas de Direção
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DailyTip;