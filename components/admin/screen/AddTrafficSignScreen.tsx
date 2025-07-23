// screens/AddTrafficSignScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '@/hooks/useColors';
import { addDoc, collection } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import CategorySelector from '../ui/CategorySelector';
import { useRouter } from 'expo-router';
import { Category } from '../types/admin';
import { mockCategories } from '../data/categories.mock';


const AddTrafficSignScreen = () => {
  const router = useRouter()
 const navigation = useRouter()
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
  const [image, setImage] = useState<ImagePicker.ImagePickerSuccessResult | string>('');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image) return null;

    const storage = getStorage();
    const response = await fetch(image);
    const blob = await response.blob();
    const storageRef = ref(storage, `traffic-signs/${Date.now()}`);
    
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
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
    const updatedList = formData[field].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [field]: updatedList
    });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.categoryId) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl : string | null = '';
      if (image) {
        imageUrl = await uploadImage();
      }

 

      Alert.alert('Sucesso', 'Sinal de trânsito adicionado com sucesso!');
      navigation.back();
    } catch (error) {
      console.error('Erro ao adicionar sinal:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o sinal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 p-4" style={{ backgroundColor: COLORS.background }}>

          <View className="p-5  flex-row  gap-9 items-center ">
            <TouchableOpacity onPress={()=> router.back()}>
              <Feather name="arrow-left" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity
            onPress={()=> router.push('/(admin)')}
            >
            <Text className="text-xl font-bold" style={{ color: COLORS.text }}>   Adicionar Novo Sinal</Text>
            </TouchableOpacity>
            
          </View>

      {/* Campo: Nome */}
      <Text className="mb-1" style={{ color: COLORS.text }}>Nome do Sinal *</Text>
      <TextInput
        className="bg-white p-3 rounded-lg mb-4"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
        placeholder="Ex: Pare"
      />

      <Text className="mb-1" style={{ color: COLORS.text }}>Categoria *</Text>
      <CategorySelector
        categories={mockCategories}
        selectedId={formData.categoryId}
        onSelect={(id) => setFormData({ ...formData, categoryId: id })}
      />
      <Text className="mb-1 mt-4" style={{ color: COLORS.text }}>Imagem do Sinal</Text>
      <TouchableOpacity
        className="bg-white p-4 rounded-lg mb-4 items-center"
        onPress={pickImage}
      >
        {image ? (
          <Text className="text-green-500">Imagem selecionada</Text>
        ) : (
          <>
            <Feather name="upload" size={24} color={COLORS.primary} />
            <Text className="mt-2" style={{ color: COLORS.primary }}>
              Selecionar Imagem
            </Text>
          </>
        )}
      </TouchableOpacity>
      <Text className="mb-1" style={{ color: COLORS.text }}>Descrição</Text>
      <TextInput
        className="bg-white p-3 rounded-lg mb-4"
        value={formData.description}
        onChangeText={(text) => setFormData({ ...formData, description: text })}
        placeholder="Descrição do sinal"
        multiline
      />

      <Text className="mb-1" style={{ color: COLORS.text }}>Significado</Text>
      <TextInput
        className="bg-white p-3 rounded-lg mb-4"
        value={formData.meaning}
        onChangeText={(text) => setFormData({ ...formData, meaning: text })}
        placeholder="O que este sinal significa?"
        multiline
      />

      <Text className="mb-1" style={{ color: COLORS.text }}>Regras Relacionadas</Text>
      {formData.rules.map((rule, index) => (
        <View key={`rule-${index}`} className="flex-row items-center mb-2">
          <TextInput
            className="flex-1 bg-white p-3 rounded-lg mr-2"
            value={rule}
            onChangeText={(text) => updateListItem('rules', index, text)}
            placeholder={`Regra ${index + 1}`}
          />
          <TouchableOpacity
            onPress={() => removeListItem('rules', index)}
            className="p-2"
          >
            <Feather name="trash-2" size={20} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity
        className="flex-row items-center mb-6"
        onPress={() => addListItem('rules')}
      >
        <Feather name="plus-circle" size={20} color={COLORS.primary} />
        <Text className="ml-2" style={{ color: COLORS.primary }}>
          Adicionar Regra
        </Text>
      </TouchableOpacity>

      <Text className="mb-1" style={{ color: COLORS.text }}>Erros Comuns</Text>
      {formData.commonMistakes.map((mistake, index) => (
        <View key={`mistake-${index}`} className="flex-row items-center mb-2">
          <TextInput
            className="flex-1 bg-white p-3 rounded-lg mr-2"
            value={mistake}
            onChangeText={(text) => updateListItem('commonMistakes', index, text)}
            placeholder={`Erro comum ${index + 1}`}
          />
          <TouchableOpacity
            onPress={() => removeListItem('commonMistakes', index)}
            className="p-2"
          >
            <Feather name="trash-2" size={20} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity
        className="flex-row items-center mb-8"
        onPress={() => addListItem('commonMistakes')}
      >
        <Feather name="plus-circle" size={20} color={COLORS.primary} />
        <Text className="ml-2" style={{ color: COLORS.primary }}>
          Adicionar Erro Comum
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="py-3 rounded-lg mb-8 items-center"
        style={{ backgroundColor: COLORS.primary }}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-bold">Salvar Sinal de Trânsito</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddTrafficSignScreen;