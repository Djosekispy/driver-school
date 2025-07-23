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
  Image
} from 'react-native';
import { Feather, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { COLORS } from '@/hooks/useColors';
import { useRouter } from 'expo-router';
import CategorySelector from '../ui/CategorySelector';
import { Category } from '../types/admin';
import { mockCategories } from '../data/categories.mock';
import * as ImagePicker from 'expo-image-picker';

const AddTrafficSignScreen = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    description: '',
    meaning: '',
    rules: [''],
    commonMistakes: [''],
    imageUrl: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const addListItem = (field: 'rules' | 'commonMistakes') => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };

  const updateListItem = (field: 'rules' | 'commonMistakes', index: number, value: string) => {
    const updatedList = [...formData[field]];
    updatedList[index] = value;
    setFormData({
      ...formData,
      [field]: updatedList
    });
  };

  const removeListItem = (field: 'rules' | 'commonMistakes', index: number) => {
    Alert.alert(
      'Confirmar remoção',
      'Deseja remover este item?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Remover', 
          style: 'destructive',
          onPress: () => {
            const updatedList = formData[field].filter((_, i) => i !== index);
            setFormData({
              ...formData,
              [field]: updatedList
            });
          }
        }
      ]
    );
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.categoryId) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos marcados com *');
      return;
    }

    setIsLoading(true);

    try {
      // Simulação de upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert('Sucesso', 'Sinal de trânsito adicionado com sucesso!');
      router.back();
    } catch (error) {
      console.error('Erro ao adicionar sinal:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o sinal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
      style={{ backgroundColor: COLORS.background }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
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
          Novo Sinal de Trânsito
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView 
        className="px-4"
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Campo: Nome */}
        <View className="mt-4">
          <Text className="text-sm font-medium mb-2" style={{ color: COLORS.text }}>
            Nome do Sinal *
          </Text>
          <TextInput
            className="p-4 rounded-xl"
            style={{ 
              backgroundColor: COLORS.surface,
              color: COLORS.text,
              borderColor: COLORS.border,
              borderWidth: 1
            }}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Ex: Pare"
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        {/* Campo: Categoria */}
        <View className="mt-4">
          <Text className="text-sm font-medium mb-2" style={{ color: COLORS.text }}>
            Categoria *
          </Text>
          <CategorySelector
            categories={mockCategories}
            selectedId={formData.categoryId}
            onSelect={(id) => setFormData({ ...formData, categoryId: id })}
          />
        </View>

        {/* Campo: Imagem */}
        <View className="mt-4">
          <Text className="text-sm font-medium mb-2" style={{ color: COLORS.text }}>
            Imagem do Sinal
          </Text>
          <TouchableOpacity
            className="p-6 rounded-xl items-center justify-center border-2 border-dashed"
            style={{ 
              backgroundColor: COLORS.surface,
              borderColor: image ? COLORS.primary : COLORS.border
            }}
            onPress={pickImage}
          >
            {image ? (
              <>
                <Image 
                  source={{ uri: image }} 
                  className="w-full h-40 rounded-lg mb-2"
                  resizeMode="contain"
                />
                <Text className="text-sm" style={{ color: COLORS.primary }}>
                  Imagem selecionada
                </Text>
              </>
            ) : (
              <>
                <Feather name="upload" size={32} color={COLORS.primary} />
                <Text className="mt-2 text-sm" style={{ color: COLORS.primary }}>
                  Selecionar Imagem
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Campo: Descrição */}
        <View className="mt-4">
          <Text className="text-sm font-medium mb-2" style={{ color: COLORS.text }}>
            Descrição
          </Text>
          <TextInput
            className="p-4 rounded-xl min-h-[100px] text-justify"
            style={{ 
              backgroundColor: COLORS.surface,
              color: COLORS.text,
              borderColor: COLORS.border,
              borderWidth: 1,
              textAlignVertical: 'top'
            }}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Descrição do sinal..."
            placeholderTextColor={COLORS.textLight}
            multiline
          />
        </View>

        {/* Campo: Significado */}
        <View className="mt-4">
          <Text className="text-sm font-medium mb-2" style={{ color: COLORS.text }}>
            Significado
          </Text>
          <TextInput
            className="p-4 rounded-xl min-h-[100px] text-justify"
            style={{ 
              backgroundColor: COLORS.surface,
              color: COLORS.text,
              borderColor: COLORS.border,
              borderWidth: 1,
              textAlignVertical: 'top'
            }}
            value={formData.meaning}
            onChangeText={(text) => setFormData({ ...formData, meaning: text })}
            placeholder="O que este sinal significa?"
            placeholderTextColor={COLORS.textLight}
            multiline
          />
        </View>

        {/* Regras Relacionadas */}
        <View className="mt-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm font-medium" style={{ color: COLORS.text }}>
              Regras Relacionadas
            </Text>
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => addListItem('rules')}
            >
              <Feather name="plus-circle" size={18} color={COLORS.primary} />
              <Text className="ml-1 text-sm" style={{ color: COLORS.primary }}>
                Adicionar
              </Text>
            </TouchableOpacity>
          </View>
          
          {formData.rules.map((rule, index) => (
            <View key={`rule-${index}`} className="flex-row items-center mb-2">
              <TextInput
                className="flex-1 p-4 rounded-xl mr-2"
                style={{ 
                  backgroundColor: COLORS.surface,
                  color: COLORS.text,
                  borderColor: COLORS.border,
                  borderWidth: 1
                }}
                value={rule}
                onChangeText={(text) => updateListItem('rules', index, text)}
                placeholder={`Regra ${index + 1}`}
                placeholderTextColor={COLORS.textLight}
              />
              <TouchableOpacity
                onPress={() => removeListItem('rules', index)}
                className="p-2"
              >
                <Feather name="trash-2" size={20} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Erros Comuns */}
        <View className="mt-4 mb-8">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm font-medium" style={{ color: COLORS.text }}>
              Erros Comuns
            </Text>
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => addListItem('commonMistakes')}
            >
              <Feather name="plus-circle" size={18} color={COLORS.primary} />
              <Text className="ml-1 text-sm" style={{ color: COLORS.primary }}>
                Adicionar
              </Text>
            </TouchableOpacity>
          </View>
          
          {formData.commonMistakes.map((mistake, index) => (
            <View key={`mistake-${index}`} className="flex-row items-center mb-2">
              <TextInput
                className="flex-1 p-4 rounded-xl mr-2"
                style={{ 
                  backgroundColor: COLORS.surface,
                  color: COLORS.text,
                  borderColor: COLORS.border,
                  borderWidth: 1
                }}
                value={mistake}
                onChangeText={(text) => updateListItem('commonMistakes', index, text)}
                placeholder={`Erro comum ${index + 1}`}
                placeholderTextColor={COLORS.textLight}
              />
              <TouchableOpacity
                onPress={() => removeListItem('commonMistakes', index)}
                className="p-2"
              >
                <Feather name="trash-2" size={20} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Botão de Salvar */}
      <View className="absolute bottom-0 left-0 right-0 p-4 border-t" style={{ 
        backgroundColor: COLORS.surface,
        borderTopColor: COLORS.border
      }}>
        <TouchableOpacity
          className="flex-row justify-center items-center py-4 rounded-xl"
          style={{ 
            backgroundColor: COLORS.primary,
            opacity: (!formData.name || !formData.categoryId) ? 0.6 : 1
          }}
          onPress={handleSubmit}
          disabled={isLoading || !formData.name || !formData.categoryId}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <AntDesign name="save" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Salvar Sinal</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddTrafficSignScreen;