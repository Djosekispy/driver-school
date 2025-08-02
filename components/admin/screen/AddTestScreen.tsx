import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { COLORS } from '@/hooks/useColors';
import { useRouter } from 'expo-router';
import CategorySelector from '../ui/CategorySelector';
import { mockTestCategories } from '../data/tests.mock';

const AddTestScreen = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    description: '',
    order: '',
    passingScore: '70'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.title || !formData.categoryId || !formData.order) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos marcados com *');
      return;
    }

    const orderNumber = parseInt(formData.order);
    if (isNaN(orderNumber)) {
      Alert.alert('Valor inválido', 'A ordem deve ser um número válido');
      return;
    }

    setIsLoading(true);

    try {
      // Simulação de chamada à API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert('Sucesso', 'Teste criado com sucesso!');
      router.push({ 
        pathname: '/(admin)/add-question', 
        params: { id: formData.categoryId } 
      });
    } catch (error) {
      console.error('Erro ao criar teste:', error);
      Alert.alert('Erro', 'Não foi possível criar o teste');
    } finally {
      setIsLoading(false);
    }
  };

  return (
       <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: COLORS.background }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
            <View className="flex-row items-center justify-between px-4 pt-4 pb-4 border-b" 
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
            Novo Teste
          </Text>
          <View className="w-10" />
        </View>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 10, paddingVertical: 10 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
        {/* Header */}
      
          {/* Seção de Título */}
          <View>
            <Text className="text-sm font-medium mb-2" style={{ color: COLORS.text }}>
              Título do Teste *
            </Text>
            <TextInput
              className="p-4 rounded-xl"
              style={{ 
                backgroundColor: COLORS.surface,
                color: COLORS.text,
                borderColor: COLORS.border,
                borderWidth: 1
              }}
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              placeholder="Ex: Teste de Matemática Básica"
              placeholderTextColor={COLORS.textLight}
            />
          </View>

          {/* Seção de Categoria */}
          <View className="mt-4">
            <Text className="text-sm font-medium mb-2" style={{ color: COLORS.text }}>
              Categoria *
            </Text>
            <CategorySelector
              categories={mockTestCategories}
              selectedId={formData.categoryId}
              onSelect={(id) => setFormData({ ...formData, categoryId: id })}
            />
          </View>

          {/* Seção de Ordem */}
          <View className="mt-4">
            <Text className="text-sm font-medium mb-2" style={{ color: COLORS.text }}>
              Ordem de Exibição *
            </Text>
            <TextInput
              className="p-4 rounded-xl"
              style={{ 
                backgroundColor: COLORS.surface,
                color: COLORS.text,
                borderColor: COLORS.border,
                borderWidth: 1
              }}
              value={formData.order}
              onChangeText={(text) => setFormData({ ...formData, order: text })}
              placeholder="Número para ordenação (ex: 1, 2, 3...)"
              placeholderTextColor={COLORS.textLight}
              keyboardType="numeric"
            />
          </View>

          {/* Seção de Pontuação */}
          <View className="mt-4">
            <Text className="text-sm font-medium mb-2" style={{ color: COLORS.text }}>
              Pontuação Mínima para Aprovação (%)
            </Text>
            <TextInput
              className="p-4 rounded-xl"
              style={{ 
                backgroundColor: COLORS.surface,
                color: COLORS.text,
                borderColor: COLORS.border,
                borderWidth: 1
              }}
              value={formData.passingScore}
              onChangeText={(text) => setFormData({ ...formData, passingScore: text })}
              placeholder="70"
              placeholderTextColor={COLORS.textLight}
              keyboardType="numeric"
            />
          </View>

          {/* Seção de Descrição */}
          <View className="mt-4 mb-6">
            <Text className="text-sm font-medium mb-2" style={{ color: COLORS.text }}>
              Descrição
            </Text>
            <TextInput
              className="p-4 rounded-xl min-h-[120px] text-justify"
              style={{ 
                backgroundColor: COLORS.surface,
                color: COLORS.text,
                borderColor: COLORS.border,
                borderWidth: 1,
                textAlignVertical: 'top'
              }}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Descreva o objetivo do teste..."
              placeholderTextColor={COLORS.textLight}
              multiline
            />
          </View>

        {/* Botão de Salvar - agora dentro do KeyboardAvoidingView */}
        <View className="p-4 border-t" style={{ 
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border
        }}>
          <TouchableOpacity
            className="flex-row justify-center items-center py-4 rounded-xl"
            style={{ 
              backgroundColor: COLORS.primary,
              opacity: (!formData.title || !formData.categoryId || !formData.order) ? 0.6 : 1
            }}
            onPress={handleSubmit}
            disabled={isLoading || !formData.title || !formData.categoryId || !formData.order}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <AntDesign name="pluscircleo" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">Criar e Adicionar Questões</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
           </ScrollView>
      </KeyboardAvoidingView>
   
    
  );
};

export default AddTestScreen;