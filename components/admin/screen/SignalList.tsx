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
  ActivityIndicator
} from 'react-native';
import { COLORS } from '@/hooks/useColors';
import { useNavigation, useRouter } from 'expo-router';
import { AntDesign, Feather, MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { TrafficSign, TrafficSignCategory } from '@/types/TrafficSign';
import { useFirebase } from '@/context/FirebaseContext';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebase/firebase';

const TrafficSignList = () => {
  const { 
    trafficSigns, 
    loadTrafficSigns, 
    deleteSign,
    createSign,
    updateSign,
    getSignById
  } = useFirebase();
  const router = useRouter();
  const [selectedSign, setSelectedSign] = useState<TrafficSign | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TrafficSignCategory | 'todos'>('todos');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
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

  const handleEdit = (sign: TrafficSign) => {
    router.push({ pathname: '/(traffic-signs)/update', params: { id: sign.id } });
  };

  const handlePreview = (sign: TrafficSign) => {
    setSelectedSign(sign);
    setModalVisible(true);
  };

  const handleAddNew = () => {
    router.push('/(signal)/create');
  };

  const uploadImage = async (uri: string) => {
    setIsUploading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `traffic-signs/${Date.now()}`);
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Erro no upload:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
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
    const matchesSearch = sign.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         sign.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || sign.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories: { id: TrafficSignCategory | 'todos'; name: string }[] = [
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
        activeOpacity={0.9}
        onPress={() => handlePreview(item)}
      >
        <View 
          className="mb-6 rounded-2xl overflow-hidden shadow-lg"
          style={{ 
            backgroundColor: COLORS.surface,
            shadowColor: COLORS.yellowDarken4,
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4
          }}
        >
          {/* Imagem do sinal */}
          <View className="h-48 bg-gray-200 relative">
            {item.imageUrl ? (
              <Image 
                source={{ uri: item.imageUrl }} 
                className="w-full h-full"
                resizeMode="contain"
              />
            ) : (
              <View className="flex-1 items-center justify-center bg-gray-100">
                <MaterialCommunityIcons 
                  name="traffic-light" 
                  size={48} 
                  color={COLORS.textLight} 
                />
              </View>
            )}
            
            {/* Categoria Badge */}
            <View 
              className="absolute top-2 left-2 px-3 py-1 rounded-full"
              style={{ backgroundColor: categoryStyle.bg }}
            >
              <Text 
                className="text-xs font-medium"
                style={{ color: categoryStyle.text }}
              >
                {categories.find(c => c.id === item.category)?.name}
              </Text>
            </View>
          </View>

          {/* Conteúdo */}
          <View className="p-4">
            <Text 
              className="text-lg font-bold mb-2" 
              style={{ color: COLORS.text }}
              numberOfLines={1}
            >
              {item.name}
            </Text>

            <Text 
              className="text-sm" 
              style={{ color: COLORS.textLight }}
              numberOfLines={3}
            >
              {item.description}
            </Text>

            {/* Ações */}
            <View className="flex-row justify-end items-center border-t pt-3 mt-4"
              style={{ borderTopColor: COLORS.border }}
            >
              <View className="flex-row gap-4">
                <TouchableOpacity 
                  className="flex-row items-center"
                  onPress={(e) => {
                    e.stopPropagation();
                    handleEdit(item);
                  }}
                >
                  <Feather name="edit" size={18} color={COLORS.primary} />
                  <Text 
                    className="ml-1 text-sm"
                    style={{ color: COLORS.primary }}
                  >
                    Editar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  className="flex-row items-center"
                  onPress={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                >
                  <AntDesign name="delete" size={18} color={COLORS.error} />
                  <Text 
                    className="ml-1 text-sm"
                    style={{ color: COLORS.error }}
                  >
                    Excluir
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
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
    <View 
      className="flex-1"
      style={{ backgroundColor: COLORS.background }}
    >
      {/* Header */}
      <View className="mb-4 pt-4 pb-4 px-4 bg-white shadow-sm">
        <View className="flex-row justify-between items-center mb-2">
          <View className="flex-row items-center">
            <TouchableOpacity 
              onPress={() => router.back()} 
              className="p-2 mr-2 rounded-full"
              style={{ backgroundColor: COLORS.yellowLighten4 }}
            >
              <Feather name="arrow-left" size={20} color={COLORS.yellowDarken4} />
            </TouchableOpacity>

            <Text className="text-2xl font-bold" style={{ color: COLORS.text }}>
              Sinais de Trânsito
            </Text>
          </View>

          <View 
            className="px-3 py-1 rounded-full" 
            style={{ backgroundColor: COLORS.yellowLighten4 }}
          >
            <Text 
              className="text-xs font-semibold" 
              style={{ color: COLORS.yellowDarken4 }}
            >
              {filteredSigns.length} itens
            </Text>
          </View>
        </View>

        {/* Barra de pesquisa */}
        <View className="relative mb-3">
          <TextInput
            className="pl-10 pr-4 py-3 rounded-xl"
            style={{
              backgroundColor: COLORS.surface,
              color: COLORS.text,
              borderColor: COLORS.border,
              borderWidth: 1
            }}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Pesquisar sinais..."
            placeholderTextColor={COLORS.textLight}
          />
          <Feather
            name="search"
            size={18}
            color={COLORS.textLight}
            style={{ position: 'absolute', left: 12, top: 14 }}
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
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        ListEmptyComponent={
          <View 
            className="items-center justify-center py-12 px-4"
            style={{ backgroundColor: COLORS.yellowLighten5, borderRadius: 12, marginHorizontal: 16 }}
          >
            <MaterialCommunityIcons 
              name="traffic-light" 
              size={48} 
              color={COLORS.yellowDarken2} 
            />
            <Text 
              className="text-lg mt-4 text-center"
              style={{ color: COLORS.textLight }}
            >
              Nenhum sinal encontrado
            </Text>
            <Text 
              className="text-sm mt-1 text-center max-w-xs"
              style={{ color: COLORS.textLight }}
            >
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
        onPress={handleAddNew}
        disabled={isUploading}
      >
        {isUploading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Feather name="plus" size={24} color="white" />
        )}
      </TouchableOpacity>

      {/* Modal de visualização */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View 
          className="flex-1 justify-center bg-black/90 p-4"
          style={Platform.OS === 'ios' ? { paddingTop: 60 } : {}}
        >
          <TouchableOpacity 
            className="absolute top-4 right-4 z-10 p-2"
            onPress={() => setModalVisible(false)}
          >
            <AntDesign name="close" size={24} color="white" />
          </TouchableOpacity>

          {selectedSign && (
            <ScrollView 
              contentContainerStyle={{ paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
            >
              <View className="bg-white rounded-2xl p-6">
                {/* Imagem em destaque */}
                <View className="h-64 bg-gray-100 rounded-xl mb-4 items-center justify-center">
                  {selectedSign.imageUrl ? (
                    <Image 
                      source={{ uri: selectedSign.imageUrl }} 
                      className="w-full h-full"
                      resizeMode="contain"
                    />
                  ) : (
                    <MaterialCommunityIcons 
                      name="traffic-light" 
                      size={64} 
                      color={COLORS.textLight} 
                    />
                  )}
                </View>

                {/* Categoria */}
                <View className="flex-row items-center mb-2">
                  <View 
                    className="px-3 py-1 rounded-full mr-3"
                    style={{ 
                      backgroundColor: getCategoryStyle(selectedSign.category).bg 
                    }}
                  >
                    <Text 
                      className="text-xs font-medium"
                      style={{ color: getCategoryStyle(selectedSign.category).text }}
                    >
                      {categories.find(c => c.id === selectedSign.category)?.name}
                    </Text>
                  </View>
                </View>

                {/* Nome */}
                <Text 
                  className="text-2xl font-bold mb-3" 
                  style={{ color: COLORS.text }}
                >
                  {selectedSign.name}
                </Text>

                {/* Descrição */}
                <Text 
                  className="text-base mb-6" 
                  style={{ color: COLORS.text }}
                >
                  {selectedSign.description}
                </Text>

                {/* Ações */}
                <View className="flex-row justify-between border-t pt-4"
                  style={{ borderTopColor: COLORS.border }}
                >
                  <TouchableOpacity 
                    className="flex-row items-center"
                    onPress={() => {
                      setModalVisible(false);
                      handleEdit(selectedSign);
                    }}
                  >
                    <Feather name="edit" size={18} color={COLORS.primary} />
                    <Text 
                      className="ml-2 text-sm"
                      style={{ color: COLORS.primary }}
                    >
                      Editar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    className="flex-row items-center"
                    onPress={() => {
                      setModalVisible(false);
                      handleDelete(selectedSign.id);
                    }}
                  >
                    <AntDesign name="delete" size={18} color={COLORS.error} />
                    <Text 
                      className="ml-2 text-sm"
                      style={{ color: COLORS.error }}
                    >
                      Excluir
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default TrafficSignList;