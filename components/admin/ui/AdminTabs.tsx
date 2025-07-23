import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/hooks/useColors';


interface AdminTabsProps {
  activeTab: string;
  onChangeTab: (tab: 'dashboard' | 'users' | 'tests' | 'signs' | 'videos') => void;
}

const AdminTabs: React.FC<AdminTabsProps> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { id: 'signs', icon: 'traffic-light', label: 'Sinais', IconComponent: MaterialCommunityIcons },
    { id: 'videos', icon: 'video', label: 'Vídeos', IconComponent: FontAwesome5 },
    { id: 'tests', icon: 'assignment', label: 'Testes', IconComponent: MaterialIcons }
  ];

  return (
    <View className="flex-row border-b border-gray-200">
      {tabs.map(tab => (
        <TouchableOpacity 
          key={tab.id}
          className={`flex-1 py-3 items-center ${activeTab === tab.id ? 'border-b-2' : ''}`}
          style={{ borderBottomColor: activeTab === tab.id ? COLORS.primary : 'transparent' }}
          onPress={() => onChangeTab(tab.id)}
        >
          <tab.IconComponent 
            name={tab.icon} 
            size={24} 
            color={activeTab === tab.id ? COLORS.primary : COLORS.textLight} 
          />
          <Text 
            className="text-xs mt-1" 
            style={{ color: activeTab === tab.id ? COLORS.primary : COLORS.textLight }}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default AdminTabs;