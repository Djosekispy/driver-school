import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '@/hooks/useColors';
import { useNavigation } from '@react-navigation/native';
import { Href, useRouter } from 'expo-router';

interface QuickAction {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  screen: string;
  color: string;
}

const AdminQuickActions: React.FC = () => {
  const navigation = useRouter();
  const actions: QuickAction[] = [
    {
      icon: 'user-plus',
      label: 'Novo Usuário',
      screen: 'UserCreate',
      color: COLORS.primary
    },
    {
      icon: 'file-plus',
      label: 'Novo Teste',
      screen: '/(admin)/TestCreate',
      color: COLORS.success
    },
    {
      icon: 'video',
      label: 'Nova Aula',
      screen: '/(admin)/VideoCreate',
      color: COLORS.info
    },
    {
      icon: 'loader',
      label: 'Novo Sinal',
      screen: '/(signal)/create',
      color: COLORS.warning
    }
  ];

  return (
    <View className="mb-6">
      <Text className="text-lg font-bold mb-3" style={{ color: COLORS.text }}>
        Ações Rápidas
      </Text>
      
      <View className="flex-row flex-wrap justify-between">
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            className="w-[48%] mb-3 p-4 rounded-lg flex-row items-center"
            style={{ backgroundColor: COLORS.surface }}
            onPress={() => navigation.push(action.screen as Href)}
          >
            <View className="w-10 h-10 rounded-full justify-center items-center mr-3" 
              style={{ backgroundColor: `${action.color}20` }}>
              <Feather name={action.icon} size={18} color={action.color} />
            </View>
            <Text style={{ color: COLORS.text }}>
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default AdminQuickActions;