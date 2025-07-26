import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Platform
} from 'react-native';
import { COLORS } from '@/hooks/useColors';
import { useRouter } from 'expo-router';
import { AntDesign, Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { QuizTest } from '@/types/TestQuiz';
import { useFirebase } from '@/context/FirebaseContext';

const TestListScreen = () => {
  const { 
    quizTests, 
    quizQuestions,
    deleteTest,
  } = useFirebase();
  const router = useRouter();
  const [selectedTest, setSelectedTest] = useState<QuizTest | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [isLoading, setIsLoading] = useState(true);
  


  const handleDelete = async (id: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este teste? Todas as perguntas relacionadas também serão removidas.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTest(id);
              Alert.alert('Sucesso', 'Teste excluído com sucesso');
              setModalVisible(false);
            } catch (error) {
              console.error('Erro ao excluir teste:', error);
              Alert.alert('Erro', 'Falha ao excluir teste');
            }
          },
        },
      ]
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'regulamentação': return COLORS.error;
      case 'advertência': return COLORS.warning;
      case 'indicação': return COLORS.info;
      case 'educativo': return COLORS.success;
      case 'serviço': return COLORS.primary;
      default: return COLORS.secondary;
    }
  };

  const filteredTests = quizTests.filter(test => {
    const matchesSearch = (
      test.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      test.discription.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesCategory = selectedCategory === 'todos' || test.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Extrai categorias únicas dos testes
  const categories = [
    { id: 'todos', name: 'Todos' },
    ...Array.from(new Set(quizTests.map(test => test.category)))
      .map(category => ({ id: category, name: category }))
  ];

  const renderItem = ({ item }: { item: QuizTest }) => {
    const categoryColor = getCategoryColor(item.category);

    return (
      <TouchableOpacity 
        className="flex-row items-center p-4 mb-3 rounded-lg"
        style={{ backgroundColor: COLORS.surface }}
        activeOpacity={0.8}
        onPress={() => {
          setSelectedTest(item);
          setModalVisible(true);
        }}
      >
        {/* Ícone do teste */}
        <View className="w-12 h-12 rounded-lg mr-3 items-center justify-center"
          style={{ backgroundColor: categoryColor }}>
          <Ionicons name="document-text-outline" size={24} color="white" />
        </View>

        {/* Informações do teste */}
        <View className="flex-1">
          <Text className="text-base font-semibold mb-1" numberOfLines={1}
            style={{ color: COLORS.text }}>
            {item.title}
          </Text>
          <Text className="text-sm mb-2" numberOfLines={1}
            style={{ color: COLORS.textLight }}>
            {item.discription || 'Sem descrição disponível'}
          </Text>
          <View className="flex-row items-center">
            <View className="px-2 py-1 rounded-full mr-2"
              style={{ backgroundColor: categoryColor }}>
              <Text className="text-xs text-white">
                {item.category}
              </Text>
            </View>
            <Text className="text-xs" style={{ color: COLORS.textLight }}>
              Pontos para aprovar: {item.pointToAprove}
            </Text>
          </View>
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
        <Text className="mt-4" style={{ color: COLORS.text }}>Carregando testes...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.background }}>
      {/* Header */}
      <View className="px-4 pt-4 pb-3 bg-white shadow-sm"
        style={{ paddingTop: Platform.OS === 'ios' ? 50 : 16 }}>
        <Text className="text-2xl font-bold mb-4" style={{ color: COLORS.text }}>
          Gerenciamento de Testes
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
            placeholder="Pesquisar testes..."
            placeholderTextColor={COLORS.textLight}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <AntDesign name="close" size={16} color={COLORS.textLight} />
            </TouchableOpacity>
          )}
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
                  getCategoryColor(category.id)
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

      {/* Lista de testes */}
      <FlatList
        data={filteredTests}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        className="px-4 pt-3"
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-12 px-4 rounded-lg mx-4 mt-4"
            style={{ backgroundColor: COLORS.yellowLighten5 }}>
            <Ionicons 
              name="document-text-outline" 
              size={48} 
              color={COLORS.yellowDarken2} 
            />
            <Text className="text-lg mt-4 text-center"
              style={{ color: COLORS.textLight }}>
              Nenhum teste encontrado
            </Text>
            <Text className="text-sm mt-1 text-center"
              style={{ color: COLORS.textLight }}>
              {searchQuery ? 'Tente ajustar sua busca' : 'Crie seu primeiro teste'}
            </Text>
          </View>
        }
        refreshing={isLoading}
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
        onPress={() => router.push('/(test)/TestFormScreen')}
      >
        <Feather name="plus" size={24} color="white" />
      </TouchableOpacity>

      {/* Modal de detalhes do teste */}
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

          {selectedTest && (
            <View className="bg-white rounded-2xl max-h-[80%]">
              <ScrollView 
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
              >
                {/* Cabeçalho */}
                <View className="p-5 border-b"
                  style={{ borderBottomColor: COLORS.border }}>
                  <View className="items-center mb-4">
                    <View className="w-16 h-16 rounded-lg items-center justify-center mb-3"
                      style={{ backgroundColor: getCategoryColor(selectedTest.category) }}>
                      <Ionicons name="document-text-outline" size={32} color="white" />
                    </View>
                    <Text className="text-2xl font-bold text-center" style={{ color: COLORS.text }}>
                      {selectedTest.title}
                    </Text>
                  </View>
                  
                  <View className="flex-row justify-center">
                    <View className="px-3 py-1 rounded-full"
                      style={{ backgroundColor: getCategoryColor(selectedTest.category) }}>
                      <Text className="text-sm font-semibold text-white">
                        {selectedTest.category}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Detalhes do teste */}
                <View className="p-5">
                  <View className="mb-6">
                    <Text className="text-sm uppercase font-semibold mb-3"
                      style={{ color: COLORS.textLight }}>
                      Informações do Teste
                    </Text>
                    
                    <View className="mb-4">
                      <Text className="text-base font-medium mb-1" style={{ color: COLORS.text }}>
                        Descrição
                      </Text>
                      <Text className="text-base" style={{ color: COLORS.text }}>
                        {selectedTest.discription}
                      </Text>
                    </View>
                    
                    <View className="flex-row justify-between">
                      <View>
                        <Text className="text-base font-medium mb-1" style={{ color: COLORS.text }}>
                          Pontos para Aprovação
                        </Text>
                        <Text className="text-2xl font-bold" style={{ color: COLORS.primary }}>
                          {selectedTest.pointToAprove}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Ações rápidas */}
                  <View className="flex-row justify-between mb-6">
                    <TouchableOpacity
                      className="flex-1 items-center py-3 rounded-lg mr-2"
                      style={{ backgroundColor: COLORS.primary }}
                      onPress={() => {
                        setModalVisible(false);
                        router.push({
                          pathname: '/(test)/QuestionManagerScreen',
                          params: { testId: selectedTest.id }
                        });
                      }}
                    >
                      <Feather name="list" size={20} color="white" />
                      <Text className="text-white font-medium mt-1">Gerenciar Perguntas</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      className="flex-1 items-center py-3 rounded-lg ml-2"
                      style={{ backgroundColor: COLORS.secondary }}
                      onPress={() => {
                        setModalVisible(false);
                        router.push({
                          pathname: '/(test)/edit-test',
                          params: { id: selectedTest.id }
                        });
                      }}
                    >
                      <Feather name="edit" size={20} color="white" />
                      <Text className="text-white font-medium mt-1">Editar Teste</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>

              {/* Ações */}
              <View className="flex-row justify-between border-t p-4"
                style={{ borderTopColor: COLORS.border }}>
                <TouchableOpacity 
                  className="flex-row items-center px-5 py-2"
                  onPress={() => handleDelete(selectedTest.id)}
                >
                  <AntDesign name="delete" size={18} color={COLORS.error} />
                  <Text className="ml-2 text-base font-medium" style={{ color: COLORS.error }}>
                    Excluir Teste
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

export default TestListScreen;