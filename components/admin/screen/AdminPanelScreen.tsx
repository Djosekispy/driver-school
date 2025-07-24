import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import AdminHeader from '../ui/AdminHeader';
import AdminTabs from '../ui/AdminTabs';
import { 
  mockAdminUsers, 
  mockAdminTests, 
  mockCategories
} from '../data/admin.mock';
import AdminStats from '../ui/AdminStats';
import AdminQuickActions from '../ui/AdminQuickActions';
import AdminRecentActivity from '../ui/AdminRecentActivity';
import AdminContentSection from '../ui/AdminContentSection';
import { COLORS } from '@/hooks/useColors';
import { ActivityItem } from '../types/admin';
import { mockTrafficSigns } from '../data/trafficSigns.mock';
import { mockVideoLessons } from '../data/videoLessons.mock';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import VideoList from './VideoList';



const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'tests' | 'signs' | 'videos'>('dashboard');
  const router = useRouter();
 

  const statsData = {
    totalUsers: 1245,
    activeTests: 18,
    trafficSigns: 56,
    videoLessons: 32,
    recentRegistrations: 24
  };

  const recentActivities: ActivityItem[] = [
    { id: '1', type: 'user', action: 'Novo cadastro', name: 'João Silva', time: '10 min atrás' },
    { id: '2', type: 'test', action: 'Teste completado', name: 'Legislação Básica', time: '25 min atrás' },
    { id: '3', type: 'video', action: 'Vídeo adicionado', name: 'Direção Noturna', time: '2 horas atrás' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <AdminStats data={statsData} />
            <AdminQuickActions />
            <AdminRecentActivity activities={recentActivities} />
          </>
        );
      case 'users':
        return <AdminContentSection type="users" data={mockAdminUsers} />;
      case 'tests':
        return <AdminContentSection type="tests" data={mockAdminTests} categories={mockCategories} />;
      case 'signs':
        return <AdminContentSection type="signs" data={mockTrafficSigns} categories={mockCategories} />;
          case 'videos':
        return router.push('/(videos)/VideoList');
        default:
        return null;
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.background }}>
      <AdminHeader 
        title="Painel de Administração"  
      />

      <AdminTabs 
        activeTab={activeTab} 
        onChangeTab={(tab: 'dashboard' | 'users' | 'tests' | 'signs' | 'videos') => setActiveTab(tab)} 
        
      />

      <ScrollView className="flex-1 px-5 pt-4">
        {renderContent()}
      </ScrollView>
    </View>
  );
};

export default AdminDashboard;