import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '@/hooks/useColors';
import { Category } from '../types/admin';

interface ContentItem {
  id: string;
  [key: string]: any;
}

interface AdminContentSectionProps {
  type: 'users' | 'tests' | 'signs' | 'videos';
  data: ContentItem[];
  categories?: Category[];
}

const AdminContentSection: React.FC<AdminContentSectionProps> = ({ 
  type, 
  data, 
  categories 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'users': return 'users';
      case 'tests': return 'file-text';
      case 'signs': return 'traffic-light';
      case 'videos': return 'video';
      default: return 'grid';
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'users': return 'Usuários';
      case 'tests': return 'Testes';
      case 'signs': return 'Sinais';
      case 'videos': return 'Vídeos';
      default: return '';
    }
  };

  const renderItem = ({ item }: { item: ContentItem }) => {
    const category = categories?.find(cat => cat.id === item.categoryId);
    
    return (
      <TouchableOpacity 
        className="bg-white p-4 rounded-lg mb-3 flex-row justify-between items-center"
      >
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-full justify-center items-center mr-3" 
            style={{ backgroundColor: COLORS.yellowLighten5 }}>
            <Feather name={getIcon()} size={18} color={COLORS.primary} />
          </View>
          <View>
            <Text className="font-medium" style={{ color: COLORS.text }}>
              {item.title}
            </Text>
            {category && (
              <Text className="text-xs" style={{ color: COLORS.textLight }}>
                {category.name}
              </Text>
            )}
          </View>
        </View>
        <Feather name="chevron-right" size={20} color={COLORS.textLight} />
      </TouchableOpacity>
    );
  };

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-bold" style={{ color: COLORS.text }}>
          {getLabel()}
        </Text>
        <TouchableOpacity>
          <Text className="text-sm" style={{ color: COLORS.primary }}>
            Ver todos
          </Text>
        </TouchableOpacity>
      </View>

      {data.length === 0 ? (
        <View className="bg-white p-4 rounded-lg items-center">
          <Feather name={getIcon()} size={24} color={COLORS.textLight} />
          <Text className="mt-2" style={{ color: COLORS.textLight }}>
            Nenhum {getLabel().toLowerCase()} encontrado
          </Text>
        </View>
      ) : (
        <FlatList
          data={data.slice(0, 3)}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default AdminContentSection;