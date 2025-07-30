import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '@/hooks/useColors';
import { User } from '@/types/User';
import { auth } from '@/firebase/firebase';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react-native';

const Header: React.FC<{ user: User }> = ({ user }) => {
  const { logout } = useAuth();
  return (
    <View className="flex-row justify-between items-center p-5" style={{ backgroundColor: COLORS.surface }}>
      <View>
        <Text className="text-sm" style={{ color: COLORS.textLight }}>Bem-vindo de volta,</Text>
        <Text className="text-xl font-bold" style={{ color: COLORS.text }}>{user.name}</Text>
      </View>
      
      <View className="flex-row relative items-center space-x-3">

        <Image
          source={{ uri: user.avatarUrl || auth.currentUser?.photoURL  || 'https://randomuser.me/api/portraits/men/1.jpg' }}
          className="w-12 h-12 rounded-full border-2"
          style={{ borderColor: COLORS.yellowLighten2 }}
        />
        <TouchableOpacity
          className="absolute right-[-12] bottom-[-6] p-2 rounded-full"
          onPress={() =>logout()}
          style={{ backgroundColor: COLORS.primary }}
        >
          <LogOut size={10} color={COLORS.surface} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;