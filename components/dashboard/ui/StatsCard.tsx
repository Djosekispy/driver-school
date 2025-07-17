import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';

interface StatsCardProps {
  icon: ReactNode;
  value: string;
  label: string;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, value, label, color }) => {
  return (
    <View className="w-1/2 px-2 mb-4">
      <View className={`${color} rounded-xl p-4 shadow-xs`}>
        <View className="mb-2">
          {icon}
        </View>
        <Text className="text-2xl font-bold text-gray-900">{value}</Text>
        <Text className="text-sm text-gray-500 mt-1">{label}</Text>
      </View>
    </View>
  );
};

export default StatsCard;