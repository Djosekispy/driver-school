import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  Platform,
  TextInput,
  ScrollView,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { COLORS } from '@/hooks/useColors';
import { useRouter } from 'expo-router';
import { AntDesign, Feather, MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { TrafficSign, TrafficSignCategory } from '@/types/TrafficSign';
import { useFirebase } from '@/context/FirebaseContext';

const TrafficSignList = () => {
  const { 
    trafficSigns, 
    loadTrafficSigns, 
    deleteSign
  } = useFirebase();
  const router = useRouter();
  const [selectedSign, setSelectedSign] = useState<TrafficSign | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TrafficSignCategory | 'todos'>('todos');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await loadTrafficSigns();
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este sinal de trânsito?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSign(id);
              Alert.alert('Sucesso', 'Sinal excluído com sucesso');
            } catch (error) {
              console.error('Erro ao excluir sinal:', error);
              Alert.alert('Erro', 'Falha ao excluir sinal de trânsito');
            }
          },
        },
      ]
    );
  };

  const handlePreview = (sign: TrafficSign) => {
    setSelectedSign(sign);
    setModalVisible(true);
  };

  const getCategoryStyle = (category: TrafficSignCategory) => {
    switch (category) {
      case 'regulamentação': return { bg: COLORS.error, text: 'white' };
      case 'advertência': return { bg: COLORS.warning, text: 'white' };
      case 'indicação': return { bg: COLORS.info, text: 'white' };
      case 'educativo': return { bg: COLORS.success, text: 'white' };
      case 'serviço': return { bg: COLORS.primary, text: 'white' };
      default: return { bg: COLORS.border, text: COLORS.text };
    }
  };

  const filteredSigns = trafficSigns.filter(sign => {
    const matchesSearch = sign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || sign.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'todos', name: 'Todos' },
    { id: 'regulamentação', name: 'Regulamentação' },
    { id: 'advertência', name: 'Advertência' },
    { id: 'indicação', name: 'Indicação' },
    { id: 'educativo', name: 'Educativo' },
    { id: 'serviço', name: 'Serviço' }
  ];

  const renderItem = ({ item }: { item: TrafficSign }) => {
    const categoryStyle = getCategoryStyle(item.category);

    return (
      <TouchableOpacity 
        className="flex-row items-center p-3 mb-2 rounded-lg shadow-sm"
        style={{ backgroundColor: COLORS.surface }}
        activeOpacity={0.8}
        onPress={() => handlePreview(item)}
      >
        {/* Miniatura da imagem */}
        <View className="w-12 h-12 rounded-lg mr-3 items-center justify-center" 
          style={{ backgroundColor: COLORS.background }}>
          {item.imageUrl ? (
            <Image 
              source={{ uri: item.imageUrl }} 
              className="w-full h-full rounded-lg"
            />
          ) : (
            <MaterialCommunityIcons 
              name="traffic-light" 
              size={20} 
              color={COLORS.textLight} 
            />
          )}
        </View>

        {/* Conteúdo principal */}
        <View className="flex-1">
          <View className="flex-row items-center">
            <Text className="flex-1 text-base font-semibold mr-2" numberOfLines={1}
              style={{ color: COLORS.text }}>
              {item.name}
            </Text>
            <View className="w-6 h-6 rounded-full items-center justify-center"
              style={{ backgroundColor: categoryStyle.bg }}>
              <Text className="text-xs font-bold" style={{ color: categoryStyle.text }}>
                {categories.find(c => c.id === item.category)?.name.charAt(0)}
              </Text>
            </View>
          </View>
          
          <Text className="text-sm mt-1" numberOfLines={1}
            style={{ color: COLORS.textLight }}>
            {item.description}
          </Text>
        </View>

        {/* Ícone de ação */}
        <Feather name="chevron-right" size={18} color={COLORS.textLight} />
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.background }}>
      {/* Header */}
      <View className="px-4 pt-4 pb-3 bg-white shadow-sm"
        style={{ paddingTop: Platform.OS === 'ios' ? 50 : 16 }}>
        <Text className="text-2xl font-bold mb-4" style={{ color: COLORS.text }}>
          Sinais de Trânsito
        </Text>
        
        {/* Barra de pesquisa */}
        <View className="flex-row items-center px-3 py-2 rounded-lg mb-3"
          style={{ backgroundColor: COLORS.surface }}>
          <Feather name="search" size={18} color={COLORS.textLight} />
          <TextInput
            className="flex-1 ml-2 text-base"
            style={{ color: COLORS.text }}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Pesquisar sinais..."
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        {/* Filtros de categoria */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="mb-2"
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              className={`px-4 py-2 rounded-full mr-2 ${selectedCategory === category.id ? 'opacity-100' : 'opacity-70'}`}
              style={{ 
                backgroundColor: 
                  category.id === 'todos' ? COLORS.border :
                  category.id === 'regulamentação' ? COLORS.error :
                  category.id === 'advertência' ? COLORS.warning :
                  category.id === 'indicação' ? COLORS.info :
                  category.id === 'educativo' ? COLORS.success :
                  COLORS.primary
              }}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text 
                className="text-xs font-medium"
                style={{ 
                  color: category.id === 'todos' ? COLORS.text : 'white'
                }}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista */}
      <FlatList
        data={filteredSigns}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        className="px-4 pt-3"
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-12 px-4 rounded-lg mx-4 mt-4"
            style={{ backgroundColor: COLORS.yellowLighten5 }}>
            <MaterialCommunityIcons 
              name="traffic-light" 
              size={48} 
              color={COLORS.yellowDarken2} 
            />
            <Text className="text-lg mt-4 text-center"
              style={{ color: COLORS.textLight }}>
              Nenhum sinal encontrado
            </Text>
            <Text className="text-sm mt-1 text-center"
              style={{ color: COLORS.textLight }}>
              {searchQuery ? 'Tente ajustar sua busca' : 'Adicione novos sinais de trânsito'}
            </Text>
          </View>
        }
        refreshing={isLoading}
        onRefresh={loadTrafficSigns}
      />

      {/* Botão de adicionar */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 p-4 rounded-full shadow-lg"
        style={{
          backgroundColor: COLORS.primary,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        }}
        onPress={() => router.push('/(signal)/create')}
      >
        <Feather name="plus" size={24} color="white" />
      </TouchableOpacity>

      {/* Modal de detalhes */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center bg-black/90 p-4"
          style={Platform.OS === 'ios' ? { paddingTop: 60 } : {}}>
          <TouchableOpacity 
            className="absolute top-4 right-4 z-10 p-2"
            onPress={() => setModalVisible(false)}
          >
            <AntDesign name="close" size={24} color="white" />
          </TouchableOpacity>

          {selectedSign && (
            <View className="bg-white rounded-2xl max-h-[80%]">
              <ScrollView 
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
              >
                {/* Imagem em destaque */}
                <View className="h-48 bg-gray-100 rounded-t-2xl items-center justify-center">
                  {selectedSign.imageUrl ? (
                    <Image 
                      source={{ uri: selectedSign.imageUrl }} 
                      className="w-full h-full rounded-t-2xl"
                    />
                  ) : (
                    <MaterialCommunityIcons 
                      name="traffic-light" 
                      size={64} 
                      color={COLORS.textLight} 
                    />
                  )}
                </View>

                {/* Detalhes */}
                <View className="p-5">
                  <View className="flex-row mb-3">
                    <View 
                      className="px-3 py-1 rounded-full"
                      style={{ backgroundColor: getCategoryStyle(selectedSign.category).bg }}
                    >
                      <Text className="text-xs font-semibold text-white">
                        {categories.find(c => c.id === selectedSign.category)?.name}
                      </Text>
                    </View>
                  </View>

                  <Text className="text-2xl font-bold mb-3" style={{ color: COLORS.text }}>
                    {selectedSign.name}
                  </Text>
                  <Text className="text-base mb-5" style={{ color: COLORS.text }}>
                    {selectedSign.description}
                  </Text>

                  {selectedSign.meaning && (
                    <>
                      <Text className="text-lg font-semibold mb-2" style={{ color: COLORS.text }}>
                        Significado:
                      </Text>
                      <Text className="text-base mb-4" style={{ color: COLORS.text }}>
                        {selectedSign.meaning}
                      </Text>
                    </>
                  )}

                  {selectedSign.rules.length > 0 && (
                    <>
                      <Text className="text-lg font-semibold mb-2" style={{ color: COLORS.text }}>
                        Regras Relacionadas:
                      </Text>
                      {selectedSign.rules.map((rule, index) => (
                        <View key={`rule-${index}`} className="flex-row mb-2">
                          <View className="w-2 h-2 rounded-full mt-2 mr-2" 
                            style={{ backgroundColor: COLORS.text }} />
                          <Text className="text-base flex-1" style={{ color: COLORS.text }}>
                            {rule}
                          </Text>
                        </View>
                      ))}
                    </>
                  )}

                  {selectedSign.commonMistakes.length > 0 && (
                    <>
                      <Text className="text-lg font-semibold mt-4 mb-2" style={{ color: COLORS.text }}>
                        Erros Comuns:
                      </Text>
                      {selectedSign.commonMistakes.map((mistake, index) => (
                        <View key={`mistake-${index}`} className="flex-row mb-2">
                          <View className="w-2 h-2 rounded-full mt-2 mr-2" 
                            style={{ backgroundColor: COLORS.text }} />
                          <Text className="text-base flex-1" style={{ color: COLORS.text }}>
                            {mistake}
                          </Text>
                        </View>
                      ))}
                    </>
                  )}
                </View>
              </ScrollView>

              {/* Ações */}
              <View className="flex-row justify-between border-t p-4"
                style={{ borderTopColor: COLORS.border }}>
                <TouchableOpacity 
                  className="flex-row items-center px-5 py-2"
                  onPress={() => {
                    setModalVisible(false);
                    router.push({ pathname: '/(signal)/update-signal', params: { id: selectedSign.id } });
                  }}
                >
                  <Feather name="edit" size={18} color={COLORS.primary} />
                  <Text className="ml-2 text-base font-medium" style={{ color: COLORS.primary }}>
                    Editar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  className="flex-row items-center px-5 py-2"
                  onPress={() => {
                    setModalVisible(false);
                    handleDelete(selectedSign.id);
                  }}
                >
                  <AntDesign name="delete" size={18} color={COLORS.error} />
                  <Text className="ml-2 text-base font-medium" style={{ color: COLORS.error }}>
                    Excluir
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default TrafficSignList;