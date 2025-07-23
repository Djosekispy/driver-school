// components/admin/CategorySelector.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '@/hooks/useColors';
import { Category } from '../types/admin';

interface CategorySelectorProps {
  categories: Category[];
  selectedId?: string;
  onSelect: (id: string) => void;
  label?: string;
  required?: boolean;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedId,
  onSelect,
  label = 'Categoria',
  required = false
}) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const selectedCategory = categories.find(cat => cat.id === selectedId);

  return (
    <View className="mb-4">
      <Text className="mb-1" style={{ color: COLORS.text }}>
        {label} {required && <Text style={{ color: COLORS.error }}>*</Text>}
      </Text>

      <TouchableOpacity
        className={`p-3 rounded-lg border ${!selectedId ? 'border-gray-300' : 'border-gray-400'}`}
        style={{ backgroundColor: COLORS.surface }}
        onPress={() => setIsModalVisible(true)}
      >
        <View className="flex-row justify-between items-center">
          <Text style={{ color: selectedId ? COLORS.text : COLORS.textLight }}>
            {selectedCategory?.name || 'Selecione uma categoria...'}
          </Text>
          <Feather name="chevron-down" size={20} color={COLORS.textLight} />
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black bg-opacity-50">
          <View className="bg-white rounded-t-3xl p-5 max-h-3/4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold" style={{ color: COLORS.text }}>Selecionar Categoria</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Feather name="x" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={categories}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`p-4 rounded-lg mb-2 ${selectedId === item.id ? 'bg-blue-50' : 'bg-white'}`}
                  onPress={() => {
                    onSelect(item.id);
                    setIsModalVisible(false);
                  }}
                >
                  <View className="flex-row items-center">
                    {item.icon && (
                      <View className="w-8 h-8 rounded-full items-center justify-center mr-3" 
                        style={{ backgroundColor: COLORS.yellowLighten5 }}>
                        <Feather name={item.icon} size={16} color={COLORS.primary} />
                      </View>
                    )}
                    <View className="flex-1">
                      <Text className="font-medium" style={{ color: COLORS.text }}>{item.name}</Text>
                      {item.description && (
                        <Text className="text-xs mt-1" style={{ color: COLORS.textLight }}>
                          {item.description}
                        </Text>
                      )}
                    </View>
                    {selectedId === item.id && (
                      <Feather name="check" size={20} color={COLORS.primary} />
                    )}
                  </View>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View className="h-px bg-gray-100" />}
              ListEmptyComponent={
                <View className="items-center py-8">
                  <Feather name="folder" size={48} color={COLORS.textLight} />
                  <Text className="mt-4 text-center" style={{ color: COLORS.textLight }}>
                    Nenhuma categoria disponível
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CategorySelector;