import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { User } from '../types';
import { COLORS } from '@/hooks/useColors';

const Header: React.FC<{ user: User }> = ({ user }) => {
  return (
    <View className="flex-row justify-between items-center p-5" style={{ backgroundColor: COLORS.surface }}>
      <View>
        <Text className="text-sm" style={{ color: COLORS.textLight }}>Bem-vindo de volta,</Text>
        <Text className="text-xl font-bold" style={{ color: COLORS.text }}>{user.name}</Text>
      </View>
      
      <View className="flex-row items-center space-x-3">

        <Image
          source={{ uri: user.avatar }}
          className="w-12 h-12 rounded-full border-2"
          style={{ borderColor: COLORS.yellowLighten2 }}
        />
      </View>
    </View>
  );
};

export default Header;