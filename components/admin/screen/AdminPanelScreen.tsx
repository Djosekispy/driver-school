import React from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AdminHeader from '../ui/AdminHeader';
import AdminStats from '../ui/AdminStats';
import AdminQuickActions from '../ui/AdminQuickActions';
import AdminRecentActivity from '../ui/AdminRecentActivity';
import { COLORS } from '@/hooks/useColors';
import { ActivityItem } from '../types/admin';
import { Href, useRouter } from 'expo-router';
import { useFirebase } from '@/context/FirebaseContext';

const AdminDashboard = () => {
  const router = useRouter();
  const { logs } = useFirebase()

  const statsData = {
    totalUsers: 1245,
    activeTests: 18,
    trafficSigns: 56,
    videoLessons: 32,
    recentRegistrations: 24
  };
  
  const navigationButtons = [
    {
      label: 'Usuários',
      icon: 'users',
      path: '/(users)/userlist',
      bgColor: COLORS.primary,
    },
    {
      label: 'Testes',
      icon: 'file-text',
      path: '/(test)/test',
      bgColor: '#FFB703',
    },
    {
      label: 'Sinais',
      icon: 'alert-circle',
      path: '/(signal)/signs',
      bgColor: '#E63946',
    },
    {
      label: 'Vídeos',
      icon: 'video',
      path: '/(videos)/VideoList',
      bgColor: '#3A86FF',
    },
  ];

  const handleNavigate = (path: string) => {
    router.push(path as Href);
  };

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.background }}>
      <AdminHeader title="Painel de Administração" />

      <ScrollView className="flex-1 px-5 pt-4">
        {/* Botões de Navegação */}
        <View className="flex-row flex-wrap justify-between mb-6">
          {navigationButtons.map((btn, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => handleNavigate(btn.path)}
              style={{
                backgroundColor: btn.bgColor,
                width: '47%',
                marginBottom: 12,
                borderRadius: 16,
                paddingVertical: 16,
                paddingHorizontal: 12,
                shadowColor: '#000',
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              <View className="flex-row items-center justify-center">
                <Feather name={btn.icon as any} size={20} color="#fff" />
                <Text className="text-white text-base font-semibold ml-2">{btn.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Conteúdo do Dashboard */}
        <AdminStats data={statsData} />
        <AdminQuickActions />
        <AdminRecentActivity activities={logs} />
      </ScrollView>
    </View>
  );
};

export default AdminDashboard;
