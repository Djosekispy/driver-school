import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import { COLORS } from '@/constants/Colors';


const ProgressCard = ({ 
  progress, 
  testsCompleted, 
  signsLearned, 
  hoursPracticed 
}: {
  progress: number;
  testsCompleted: number;
  signsLearned: number;
  hoursPracticed: number;
}) => {
  return (
    <View className="bg-white rounded-xl p-5 mb-6 shadow-sm">
      <Text className="text-lg font-bold mb-4" style={{ color: COLORS.text.primary }}>
        Seu Progresso Geral
      </Text>
      
      <View className="flex-row items-center mb-4">
        {/* Círculo de Progresso */}
        <View className="w-24 h-24 rounded-full border-8 justify-center items-center mr-5" 
          style={{ borderColor: COLORS.blue.default }}>
          <Text className="text-2xl font-bold" style={{ color: COLORS.text.primary }}>
            {progress}%
          </Text>
        </View>
        
        {/* Estatísticas */}
        <View className="flex-1">
          <StatItem icon="quiz" value={`${testsCompleted} testes`} />
          <StatItem icon="traffic" value={`${signsLearned} sinais`} />
          <StatItem icon="timer" value={`${hoursPracticed}h`} />
        </View>
      </View>
      
      <TouchableOpacity className="flex-row justify-center items-center py-2 border-t border-gray-100">
        <Text className="font-medium mr-1" style={{ color: COLORS.blue.default }}>
          Ver Estatísticas Completas
        </Text>
        <AntDesign name="arrowright" size={16} color={COLORS.blue.default} />
      </TouchableOpacity>
    </View>
  );
};

const StatItem = ({ icon, value }: { icon: keyof typeof MaterialIcons.glyphMap; value: string }) => (
  <View className="flex-row items-center mb-3">
    <MaterialIcons name={icon} size={20} color={COLORS.blue.accent3} />
    <Text className="ml-2" style={{ color: COLORS.text.primary }}>{value}</Text>
  </View>
);

export default ProgressCard;