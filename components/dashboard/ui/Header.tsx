import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '@/hooks/useColors';
import { User } from '@/types/User';
import { auth } from '@/firebase/firebase';

const Header: React.FC<{ user: User }> = ({ user }) => {
  return (
    <View className="flex-row justify-between items-center p-5" style={{ backgroundColor: COLORS.surface }}>
      <View>
        <Text className="text-sm" style={{ color: COLORS.textLight }}>Bem-vindo de volta,</Text>
        <Text className="text-xl font-bold" style={{ color: COLORS.text }}>{user.name}</Text>
      </View>
      
      <View className="flex-row items-center space-x-3">

        <Image
          source={{ uri: user.avatarUrl || auth.currentUser?.photoURL  || 'https://randomuser.me/api/portraits/men/1.jpg' }}
          className="w-12 h-12 rounded-full border-2"
          style={{ borderColor: COLORS.yellowLighten2 }}
        />
      </View>
    </View>
  );
};

export default Header;