import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DailyTip } from '../types';
import { COLORS } from '@/hooks/useColors';

const DailyTipCard: React.FC<{ tip: DailyTip }> = ({ tip }) => {
  return (
    <View className="mb-6 p-5 rounded-xl" style={{ backgroundColor: COLORS.yellowLighten5 }}>
      <View className="flex-row items-center mb-2">
        <Ionicons name="bulb-outline" size={20} style={{ color: COLORS.yellowDarken4 }} />
        <Text className="ml-2 font-semibold" style={{ color: COLORS.yellowDarken4 }}>
          Dica do Dia: {tip.title}
        </Text>
      </View>
      <Text style={{ color: COLORS.text }}>{tip.content}</Text>
      <TouchableOpacity className="mt-3">
        <Text className="text-xs font-medium" style={{ color: COLORS.primary }}>
          {tip.category} • Saiba mais
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DailyTipCard;