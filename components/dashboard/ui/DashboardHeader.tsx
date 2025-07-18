import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '@/constants/Colors';

const DashboardHeader = ({ userName }: { userName: string }) => {
  return (
    <View className="flex-row justify-between items-center mb-6">
      <View>
        <Text className="text-2xl font-bold" style={{ color: COLORS.text.primary }}>
          Bem-vindo, {userName}!
        </Text>
        <Text className="text-base" style={{ color: COLORS.text.secondary }}>
          Continue seu aprendizado
        </Text>
      </View>
      <View className="w-12 h-12 rounded-full justify-center items-center" 
        style={{ backgroundColor: COLORS.blue.default }}>
        <FontAwesome5 name="user-graduate" size={24} color={COLORS.text.light} />
      </View>
    </View>
  );
};

export default DashboardHeader;