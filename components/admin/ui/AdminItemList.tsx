import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '@/hooks/useColors';

interface AdminItemListProps {
  items: any[];
  type: 'signs' | 'videos' | 'tests';
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
}

const AdminItemList: React.FC<AdminItemListProps> = ({ items, type, onEdit, onDelete }) => {
  const renderItemContent = (item: any) => {
    switch (type) {
      case 'signs':
        return (
          <View className="flex-row items-center">
            <Image source={{ uri: item.image }} className="w-12 h-12 rounded-md mr-3" />
            <View>
              <Text className="font-medium" style={{ color: COLORS.text }}>{item.name}</Text>
              <Text className="text-xs" style={{ color: COLORS.textLight }}>{item.category}</Text>
            </View>
          </View>
        );
      case 'videos':
        return (
          <View className="flex-1">
            <Text className="font-medium" style={{ color: COLORS.text }}>{item.title}</Text>
            <View className="flex-row mt-1">
              <Text className="text-xs mr-3" style={{ color: COLORS.textLight }}>
                <Feather name="clock" size={12} /> {item.duration}
              </Text>
              <Text className="text-xs" style={{ color: COLORS.textLight }}>
                <Feather name="eye" size={12} /> {item.views} visualizações
              </Text>
            </View>
          </View>
        );
      case 'tests':
        return (
          <View className="flex-1">
            <Text className="font-medium" style={{ color: COLORS.text }}>{item.title}</Text>
            <View className="flex-row mt-1">
              <Text className="text-xs mr-3" style={{ color: COLORS.textLight }}>
                {item.questions} questões
              </Text>
              <Text className="text-xs" style={{ color: COLORS.textLight }}>
                Dificuldade: {item.difficulty}
              </Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View className="mt-4">
      {items.map(item => (
        <View key={item.id} className="bg-white p-4 rounded-lg mb-3 flex-row justify-between items-center">
          {renderItemContent(item)}
          <View className="flex-row">
            <TouchableOpacity className="p-2" onPress={() => onEdit(item)}>
              <Feather name="edit" size={18} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity className="p-2" onPress={() => onDelete(item.id)}>
              <Feather name="trash-2" size={18} color={COLORS.error} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};

export default AdminItemList;