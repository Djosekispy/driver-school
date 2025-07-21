import { COLORS } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';


const SectionHeader = ({ 
  title, 
  actionText 
}: { 
  title: string; 
  actionText?: string; 
}) => {
  const router = useRouter()
  return (
    <View className="flex-row justify-between items-center mb-4">
      <Text className="text-lg font-bold" style={{ color: COLORS.text.primary }}>
        {title}
      </Text>
      {actionText && (
        <TouchableOpacity
        onPress={()=>router.push('/(test)/test')}
        >
          <Text className="font-medium" style={{ color: COLORS.blue.default }}>
            {actionText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SectionHeader;