import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '@/hooks/useColors';
import { ActivityItem } from '../types/admin';



interface AdminRecentActivityProps {
  activities: ActivityItem[];
}

const AdminRecentActivity: React.FC<AdminRecentActivityProps> = ({ activities }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'user': return 'user';
      case 'test': return 'file-text';
      case 'video': return 'video';
      case 'sign': return 'traffic-light';
      default: return 'activity';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'user': return COLORS.primary;
      case 'test': return COLORS.success;
      case 'video': return COLORS.info;
      case 'sign': return COLORS.warning;
      default: return COLORS.text;
    }
  };

  return (
    <View className="mb-6">
      <Text className="text-lg font-bold mb-3" style={{ color: COLORS.text }}>
        Atividades Recentes
      </Text>
      
      {activities.length === 0 ? (
        <View className="bg-white p-4 rounded-lg items-center">
          <Feather name="clock" size={24} color={COLORS.textLight} />
          <Text className="mt-2" style={{ color: COLORS.textLight }}>
            Nenhuma atividade recente
          </Text>
        </View>
      ) : (
        <FlatList
          data={activities}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View className="bg-white p-4 rounded-lg mb-2 flex-row items-center">
              <View className="w-10 h-10 rounded-full justify-center items-center mr-3" 
                style={{ backgroundColor: `${getIconColor(item.type)}20` }}>
                <Feather name={getIcon(item.type)} size={16} color={getIconColor(item.type)} />
              </View>
              <View className="flex-1">
                <Text className="font-medium" style={{ color: COLORS.text }}>
                  {item.action}
                </Text>
                <Text className="text-sm" style={{ color: COLORS.textLight }}>
                  {item.name}
                </Text>
              </View>
              <Text className="text-xs" style={{ color: COLORS.textLight }}>
                {item.time}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default AdminRecentActivity;