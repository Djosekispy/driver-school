import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/Colors';

const ChatHeader = () => {
  return (
    <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
      <View className="flex-row items-center">

        <View>
          <Text className="text-lg font-bold" style={{ color: COLORS.text.primary }}>
            Assistente de Direção
          </Text>
          <Text className="text-sm" style={{ color: COLORS.text.secondary }}>
            Online
          </Text>
        </View>
      </View>
      <TouchableOpacity>
        <Ionicons name="information-circle-outline" size={24} color={COLORS.blue.default} />
      </TouchableOpacity>
    </View>
  );
};

export default ChatHeader;