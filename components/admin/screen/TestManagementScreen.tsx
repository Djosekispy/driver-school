import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  FlatList, 
  Alert,
  ActivityIndicator,
  RefreshControl 
} from 'react-native';
import { Feather, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { COLORS } from '@/hooks/useColors';
import { useRouter } from 'expo-router';
import { mockTestCategories, mockTests } from '../data/tests.mock';

const TestManagementScreen = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [tests, setTests] = useState(mockTests);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const categories = [
    { id: 'all', name: 'Todos' },
    ...mockTestCategories
  ];

  const filteredTests = selectedCategory === 'all' 
    ? tests 
    : tests.filter(test => test.categoryId === selectedCategory);

  const loadTests = () => {
    setIsLoading(true);
    setTimeout(() => {
      setTests(mockTests);
      setIsLoading(false);
    }, 1000);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const deleteTest = (id: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este teste? Todas as questões associadas serão removidas permanentemente.',
      [
        { 
          text: 'Cancelar', 
          style: 'cancel',
        },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => {
            setIsLoading(true);
            setTimeout(() => {
              setTests(tests.filter(test => test.id !== id));
              setIsLoading(false);
              Alert.alert('Sucesso', 'Teste excluído com sucesso!');
            }, 800);
          }
        }
      ],
      { cancelable: true }
    );
  };

  const TestCard = ({ 
    test, 
    onAddQuestions, 
    onDelete,
    categoryName 
  }: { 
    test: typeof mockTests[0];
    onAddQuestions: () => void;
    onDelete: () => void;
    categoryName?: string;
  }) => {
    const [expanded, setExpanded] = useState(false);

    return (
      <View className="mb-3 rounded-xl shadow-sm" style={{
        backgroundColor: COLORS.surface,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}>
        <TouchableOpacity 
          onPress={() => setExpanded(!expanded)}
          activeOpacity={0.9}
          className="p-4"
        >
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-base font-semibold mb-1" style={{ color: COLORS.text }}>
                {test.title}
              </Text>
              <View className="flex-row items-center">
                <Text className="text-xs" style={{ color: COLORS.textLight }}>
                  {categoryName || 'Geral'}
                </Text>
                <View className="w-1 h-1 rounded-full mx-2" style={{ backgroundColor: COLORS.textLight }} />
                <Text className="text-xs" style={{ color: COLORS.textLight }}>
                  Ordem: {test.order}
                </Text>
                <View className="w-1 h-1 rounded-full mx-2" style={{ backgroundColor: COLORS.textLight }} />
                <Text className="text-xs" style={{ color: COLORS.textLight }}>
                  {test.questions?.length || 0} questões
                </Text>
              </View>
            </View>
            <Feather 
              name={expanded ? "chevron-up" : "chevron-down"} 
              size={20} 
              color={COLORS.textLight} 
            />
          </View>
        </TouchableOpacity>

        {expanded && (
          <View className="px-4 pb-4 border-t" style={{ borderTopColor: COLORS.border }}>
            <Text className="text-sm mb-4 leading-5" style={{ color: COLORS.text }}>
              {test.description || 'Nenhuma descrição fornecida'}
            </Text>
            
            <View className="flex-row justify-between">
              <TouchableOpacity 
                className="flex-row items-center justify-center py-2 px-3 rounded flex-1 mx-1"
                style={{ backgroundColor: COLORS.primary }}
                onPress={onAddQuestions}
              >
                <Feather name="plus" size={16} color="white" />
                <Text className="text-white text-sm font-medium ml-1.5">
                  Questões
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-row items-center justify-center py-2 px-3 rounded flex-1 mx-1"
                style={{ backgroundColor: COLORS.info }}
                onPress={() => console.log('Editar')}
              >
                <Feather name="edit" size={16} color="white" />
                <Text className="text-white text-sm font-medium ml-1.5">
                  Editar
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-row items-center justify-center py-2 px-3 rounded flex-1 mx-1"
                style={{ backgroundColor: COLORS.error }}
                onPress={onDelete}
              >
                <Feather name="trash-2" size={16} color="white" />
                <Text className="text-white text-sm font-medium ml-1.5">
                  Excluir
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text className="mt-4" style={{ color: COLORS.textLight }}>
          Carregando testes...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.background }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-12 pb-4 border-b" 
        style={{ 
          backgroundColor: COLORS.surface,
          borderBottomColor: COLORS.border 
        }}>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="p-2 mr-2"
        >
          <Feather name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold flex-1 text-center" style={{ color: COLORS.text }}>
          Gerenciamento de Testes
        </Text>
        <View className="w-10" />
      </View>

      {/* Filtros por Categoria */}
      <View className="py-3 border-b" style={{ 
        backgroundColor: COLORS.surface,
        borderBottomColor: COLORS.border 
      }}>
        <Text className="text-base font-medium px-4 pb-3" style={{ color: COLORS.text }}>
          Filtrar por Categoria
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="px-3"
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              className="px-4 py-2 rounded-full mr-2"
              style={{
                backgroundColor: selectedCategory === category.id ? COLORS.primary : COLORS.surface,
                borderWidth: 1,
                borderColor: selectedCategory === category.id ? COLORS.primary : COLORS.border,
              }}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text className="text-sm" style={{ 
                color: selectedCategory === category.id ? 'white' : COLORS.text,
                fontWeight: selectedCategory === category.id ? '500' : 'normal',
              }}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista de Testes */}
      <FlatList
        data={filteredTests.sort((a, b) => a.order - b.order)}
        keyExtractor={item => item.id}
        className="px-4 pb-20"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListHeaderComponent={
          <Text className="text-base font-medium pb-3" style={{ color: COLORS.text }}>
            {filteredTests.length} {filteredTests.length === 1 ? 'Teste Encontrado' : 'Testes Encontrados'}
          </Text>
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <MaterialIcons 
              name="quiz" 
              size={64} 
              color={COLORS.textLight} 
              style={{ opacity: 0.5, marginBottom: 16 }}
            />
            <Text className="text-base text-center max-w-[80%] mb-6" style={{ color: COLORS.textLight }}>
              Nenhum teste encontrado nesta categoria
            </Text>
            <TouchableOpacity
              className="px-6 py-3 rounded"
              style={{ backgroundColor: COLORS.primary }}
              onPress={() => router.push('/add-test')}
            >
              <Text className="text-white font-medium">
                Criar Primeiro Teste
              </Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <TestCard 
            test={item}
            onAddQuestions={() => router.push({pathname : '/(admin)/add-question', params : { id : item.id}})}
            onDelete={() => deleteTest(item.id)}
            categoryName={mockTestCategories.find(c => c.id === item.categoryId)?.name}
          />
        )}
      />

      {/* Botão Flutuante */}
      <TouchableOpacity
        className="absolute right-6 bottom-6 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        style={{ 
          backgroundColor: COLORS.primary,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 4,
        }}
        onPress={() => router.push('/(admin)/add-test')}
        activeOpacity={0.8}
      >
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default TestManagementScreen;