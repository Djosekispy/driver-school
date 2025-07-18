import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '@/constants/Colors';

const modules = [
  { id: 1, title: 'Controle de Embreagem', icon: 'car' },
  { id: 2, title: 'Estacionamento', icon: 'parking' },
  { id: 3, title: 'Sinalização', icon: 'traffic-light' },
  { id: 4, title: 'Direção Noturna', icon: 'moon' },
  { id: 5, title: 'Rodovias', icon: 'road' },
  { id: 6, title: 'Emergências', icon: 'exclamation-triangle' },
];

const LearningModules = () => {
  return (
    <View className="flex-row flex-wrap justify-between mb-6">
      {modules.map((module) => (
        <TouchableOpacity 
          key={module.id}
          className="w-[48%] bg-white rounded-xl p-4 items-center mb-4 shadow-sm"
        >
          <View className="w-12 h-12 rounded-full justify-center items-center mb-2" 
            style={{ backgroundColor: COLORS.blue.lighten5 }}>
            <FontAwesome5 name={module.icon} size={20} color={COLORS.blue.default} />
          </View>
          <Text className="text-sm text-center font-medium" style={{ color: COLORS.text.primary }}>
            {module.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default LearningModules;