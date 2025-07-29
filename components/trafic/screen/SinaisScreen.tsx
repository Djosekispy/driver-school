import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, Modal, FlatList } from 'react-native';
import { MaterialIcons, Feather, AntDesign } from '@expo/vector-icons';
import { COLORS } from '@/hooks/useColors';
import { TrafficSign, TrafficSignCategory } from '@/types/TrafficSign';
import { useFirebase } from '@/context/FirebaseContext';

const TrafficSignsScreen = () => {
  const { trafficSigns, loadTrafficSigns, getSignById } = useFirebase();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TrafficSignCategory | 'todos'>('todos');
  const [selectedSign, setSelectedSign] = useState<TrafficSign | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    loadTrafficSigns();
  }, []);

  const categories: TrafficSignCategory[] = [
    'regulamentação',
    'advertência',
    'indicação',
    'educativo',
    'serviço'
  ];

  const filteredSigns = trafficSigns.filter(sign => {
    const matchesSearch = sign.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         sign.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || sign.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openSignDetails = async (id: string) => {
    const sign = await getSignById(id);
    if (sign) {
      setSelectedSign(sign);
      setIsModalVisible(true);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="p-4 bg-white shadow-sm" style={{ borderBottomColor: COLORS.border, borderBottomWidth: 1 }}>
        <Text className="text-2xl font-bold" style={{ color: COLORS.text }}>Sinais de Trânsito</Text>
        <Text className="text-sm mt-1" style={{ color: COLORS.textLight }}>
          Conheça todos os sinais e suas significados
        </Text>
      </View>

      {/* Search Bar */}
      <View className="p-4 bg-white">
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
          <Feather name="search" size={20} style={{ color: COLORS.textLight, marginRight: 8 }} />
          <TextInput
            placeholder="Buscar sinais..."
            placeholderTextColor={COLORS.textLight}
            className="flex-1 text-base"
            style={{ color: COLORS.text }}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={20} style={{ color: COLORS.textLight }} />
            </TouchableOpacity>
          )}
        </View>
              {/* Category Filter */}
    <ScrollView 
  horizontal 
  showsHorizontalScrollIndicator={false}
  className="px-4 py-2 bg-white"
  contentContainerStyle={{ paddingRight: 16 }}
>
  <View className="flex-row items-center gap-2">
    <TouchableOpacity
      className={`rounded-full mr-2 px-4 py-2`}
      style={{
        backgroundColor: selectedCategory === 'todos' ? COLORS.primary : COLORS.surface,
      }}
      onPress={() => setSelectedCategory('todos')}
    >
      <Text
        className={`text-sm font-medium`}
        style={{
          color: selectedCategory === 'todos' ? 'white' : COLORS.text
        }}
      >
        Todos
      </Text>
    </TouchableOpacity>

    {categories.map(category => (
      <TouchableOpacity
        key={category}
        className={`rounded-full mr-2 px-4 py-2`}
        style={{
          backgroundColor: selectedCategory === category ? COLORS.primary : COLORS.surface,
        }}
        onPress={() => setSelectedCategory(category)}
      >
        <Text
          className={`text-sm font-medium`}
          style={{
            color: selectedCategory === category ? 'white' : COLORS.text
          }
          }
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
</ScrollView>
      </View>




      {/* Signs Grid */}
      {filteredSigns.length > 0 ? (
        <FlatList
          data={filteredSigns}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: 16 }}
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
         renderItem={({ item }) => (
  <TouchableOpacity 
    className="w-full flex-row bg-white rounded-xl shadow-sm overflow-hidden mb-3"
    onPress={() => openSignDetails(item.id)}
  >
    <View className="w-24 h-24 bg-gray-100 justify-center items-center">
      <Image 
        source={{ uri: item.imageUrl }} 
        className="w-full h-full" 
        resizeMode="cover"
      />
    </View>

    <View className="flex-1 p-3 justify-between">
      <Text 
        className="font-semibold text-sm" 
        style={{ color: COLORS.text }} 
        numberOfLines={1}
      >
        {item.name}
      </Text>

      <Text 
        className="text-xs mt-1" 
        style={{ color: COLORS.textLight }}
        numberOfLines={2}
      >
        {item.description}
      </Text>

      <View className="flex-row items-center mt-2">
        <View 
          className="px-2 py-1 rounded-full" 
          style={{ backgroundColor: COLORS.yellowLighten5 }}
        >
          <Text className="text-[10px]" style={{ color: COLORS.primary }}>
            {item.category}
          </Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
)}

        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Feather name="alert-circle" size={48} style={{ color: COLORS.textLight }} />
          <Text className="text-lg mt-4 font-medium" style={{ color: COLORS.text }}>
            Nenhum sinal encontrado
          </Text>
          <Text className="text-sm mt-1" style={{ color: COLORS.textLight }}>
            Tente ajustar sua busca ou filtro
          </Text>
        </View>
      )}

      {/* Sign Details Modal */}
<Modal
  visible={isModalVisible}
  animationType="slide"
  transparent
  onRequestClose={() => setIsModalVisible(false)}
>
  <View className="flex-1 bg-black/50 justify-end">
    <View className="max-h-[90%] bg-white rounded-t-3xl">
      {selectedSign ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Modal Header */}
          <View className="p-5 border-b border-gray-200 bg-white">
            <View className="flex-row justify-between items-center">
              <Text className="text-xl font-bold" style={{ color: COLORS.text }}>
                {selectedSign.name}
              </Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Feather name="x" size={24} style={{ color: COLORS.text }} />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center mt-2">
              <View
                className="px-3 py-1 rounded-full"
                style={{ backgroundColor: COLORS.yellowLighten5 }}
              >
                <Text className="text-xs font-medium" style={{ color: COLORS.primary }}>
                  {selectedSign.category}
                </Text>
              </View>
            </View>
          </View>

          {/* Image */}
          <View className="aspect-video bg-gray-100 justify-center items-center">
            <Image
              source={{ uri: selectedSign.imageUrl }}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>

          {/* Descrição */}
          <View className="px-5 pt-4 pb-10">
            <Text className="text-lg font-semibold mb-2" style={{ color: COLORS.text }}>
              Descrição
            </Text>
            <Text className="text-base mb-4 leading-relaxed" style={{ color: COLORS.text }}>
              {selectedSign.description}
            </Text>

            {/* Significado */}
            {selectedSign.meaning && (
              <>
                <Text className="text-lg font-semibold mb-2" style={{ color: COLORS.text }}>
                  Significado
                </Text>
                <Text className="text-base mb-4 leading-relaxed" style={{ color: COLORS.text }}>
                  {selectedSign.meaning}
                </Text>
              </>
            )}

            {/* Regras */}
            {selectedSign.rules && selectedSign.rules?.length > 0 && (
              <>
                <Text className="text-lg font-semibold mb-2" style={{ color: COLORS.text }}>
                  Regras Relacionadas
                </Text>
                <View className="mb-4 space-y-2">
                  {selectedSign.rules.map((rule, index) => (
                    <View key={index} className="flex-row items-start">
                      <View
                        className="w-5 h-5 rounded-full justify-center items-center mr-2 mt-1"
                        style={{ backgroundColor: COLORS.primary }}
                      >
                        <Text className="text-xs text-white">{index + 1}</Text>
                      </View>
                      <Text className="flex-1 text-base leading-snug" style={{ color: COLORS.text }}>
                        {rule}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* Erros Comuns */}
            {selectedSign.commonMistakes && selectedSign.commonMistakes?.length > 0 && (
              <>
                <Text className="text-lg font-semibold mb-2" style={{ color: COLORS.text }}>
                  Erros Comuns
                </Text>
                <View className="mb-4 space-y-2">
                  {selectedSign.commonMistakes.map((mistake, index) => (
                    <View key={index} className="flex-row items-start">
                      <Feather
                        name="alert-triangle"
                        size={16}
                        style={{ color: COLORS.error, marginTop: 2, marginRight: 8 }}
                      />
                      <Text className="flex-1 text-base leading-snug" style={{ color: COLORS.text }}>
                        {mistake}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* Botão Fechar */}
            <TouchableOpacity
              className="mx-5 mb-6 p-4 rounded-xl justify-center items-center shadow-sm"
              style={{ backgroundColor: COLORS.primary }}
              onPress={() => setIsModalVisible(false)}
            >
              <Text className="text-white font-medium text-base">Fechar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View className="p-6">
          <Text style={{ color: COLORS.text }}>Sinal não encontrado.</Text>
        </View>
      )}
    </View>
  </View>
</Modal>


    </View>
  );
};

export default TrafficSignsScreen;