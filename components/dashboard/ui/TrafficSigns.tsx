import { COLORS } from '@/constants/Colors';
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';


const signs = [
  { id: 1, name: 'Pare' },
  { id: 2, name: 'Dê a preferência' },
  { id: 3, name: 'Proibido estacionar' },
  { id: 4, name: 'Velocidade máxima' },
  { id: 5, name: 'Curva perigosa' },
];

const TrafficSigns = () => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
      {signs.map((sign) => (
        <TouchableOpacity key={sign.id} className="mr-3">
          <View className="w-24 h-24 rounded-lg mb-2" style={{ backgroundColor: COLORS.blue.lighten4 }} />
          <Text className="text-xs text-center" style={{ color: COLORS.text.primary }}>
            {sign.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default TrafficSigns;