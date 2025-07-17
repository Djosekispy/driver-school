import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ActionCardProps } from '../types';

const ActionCard: React.FC<ActionCardProps> = ({ title, icon, color, onPress }) => {
  return (
    <TouchableOpacity 
      className="w-1/2 px-2 mb-4" 
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View className={`${color} rounded-xl p-5 aspect-square justify-between`}>
        <View className="w-10 h-10 bg-white rounded-lg items-center justify-center">
          {icon}
        </View>
        <Text className="text-gray-900 font-medium">{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ActionCard;