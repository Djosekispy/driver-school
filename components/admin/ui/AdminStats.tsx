import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '@/hooks/useColors';

interface StatItem {
  icon: keyof typeof Feather.glyphMap;
  value: number | string;
  label: string;
  color: string;
}

interface AdminStatsProps {
  data: {
    totalUsers: number;
    activeTests: number;
    trafficSigns: number;
    videoLessons: number;
    recentRegistrations: number;
  };
}

const AdminStats: React.FC<AdminStatsProps> = ({ data }) => {
  const stats: StatItem[] = [
    {
      icon: 'users',
      value: data.totalUsers,
      label: 'Usuários',
      color: COLORS.primary
    },
    {
      icon: 'file-text',
      value: data.activeTests,
      label: 'Testes Ativos',
      color: COLORS.success
    },
    {
      icon: 'loader',
      value: data.trafficSigns,
      label: 'Sinais',
      color: COLORS.warning
    },
    {
      icon: 'video',
      value: data.videoLessons,
      label: 'Vídeo Aulas',
      color: COLORS.info
    },
    {
      icon: 'user-plus',
      value: data.recentRegistrations,
      label: 'Novos Registros',
      color: COLORS.secondary
    }
  ];

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold" style={{ color: COLORS.text }}>
          Visão Geral
        </Text>
        <TouchableOpacity>
          <Text className="text-sm" style={{ color: COLORS.primary }}>
            Últimos 30 dias
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row flex-wrap justify-between">
        {stats.map((stat, index) => (
          <View key={index} className="w-[30%] mb-4 p-3 rounded-lg items-center" 
            style={{ backgroundColor: COLORS.surface }}>
            <View className="w-12 h-12 rounded-full justify-center items-center mb-2" 
              style={{ backgroundColor: `${stat.color}20` }}>
              <Feather name={stat.icon} size={20} color={stat.color} />
            </View>
            <Text className="text-xl font-bold" style={{ color: COLORS.text }}>
              {stat.value}
            </Text>
            <Text className="text-xs text-center" style={{ color: COLORS.textLight }}>
              {stat.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default AdminStats;