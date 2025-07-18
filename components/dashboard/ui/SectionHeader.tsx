import { COLORS } from '@/constants/Colors';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';


const SectionHeader = ({ 
  title, 
  actionText 
}: { 
  title: string; 
  actionText?: string; 
}) => {
  return (
    <View className="flex-row justify-between items-center mb-4">
      <Text className="text-lg font-bold" style={{ color: COLORS.text.primary }}>
        {title}
      </Text>
      {actionText && (
        <TouchableOpacity>
          <Text className="font-medium" style={{ color: COLORS.blue.default }}>
            {actionText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SectionHeader;