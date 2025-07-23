import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '@/hooks/useColors';
import { useRouter } from 'expo-router';

interface AdminHeaderProps {
  title: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ title }) => {
  const router = useRouter();
  return (
    <View className="p-5 bg-white flex-row  gap-9 items-center">
      <TouchableOpacity onPress={()=> router.back()}>
        <Feather name="arrow-left" size={24} color={COLORS.text} />
      </TouchableOpacity>
      <TouchableOpacity
      onPress={()=> router.push('/(admin)')}
      >
      <Text className="text-xl font-bold" style={{ color: COLORS.text }}>{title}</Text>
      </TouchableOpacity>
      
    </View>
  );
};

export default AdminHeader;