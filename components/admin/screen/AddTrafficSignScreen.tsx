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
import { useFirebase } from '@/context/FirebaseContext';
import { TrafficSignCategory } from '@/types/TrafficSign';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage';
import { storage } from '@/firebase/firebase';


const trafficSignCategories = [
  { id: 'regulamentação', name: 'Regulamentação' },
  { id: 'advertência', name: 'Advertência' },
  { id: 'indicação', name: 'Indicação' },
  { id: 'educativo', name: 'Educativo' },
  { id: 'serviço', name: 'Serviço' }
];

const AddTrafficSignScreen = () => {
   const router = useRouter();
  const { createSign } = useFirebase();

  const [formData, setFormData] = useState({
    name: '',
    category: 'regulamentação' as TrafficSignCategory,
    description: '',
    meaning: '',
    rules: [''],
    commonMistakes: [''],
    imageUrl: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [localImage, setLocalImage] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos acessar sua galeria para selecionar uma imagem');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      console.log('Imagem selecionada:', imageUri);
      setLocalImage(imageUri);
      await uploadImageToFirebase(imageUri);
    }
  };

  const uploadImageToFirebase = async (uri: string) => {
    try {
      if (!uri) throw new Error('Imagem inválida ou não selecionada.');

      setIsUploading(true);
      const response = await fetch(uri);
      const blob = await response.blob();
      const timestamp = Date.now();
      const storageRef = ref(storage, `traffic-signs/sign_${timestamp}.jpg`);

      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      setFormData(prev => ({
        ...prev,
        imageUrl: downloadURL
      }));
    } catch (error: any) {
      console.error('Erro no upload:', error);
      Alert.alert('Erro no upload', error.message || 'Falha ao enviar a imagem para o Firebase');
      throw error;
    } finally {
      setIsUploading(false);
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
    if (formData[field].length <= 1) {
      Alert.alert('Aviso', 'Você deve manter pelo menos um item');
      return;
    }

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
    if (!formData.name) {
      Alert.alert('Campo obrigatório', 'O nome do sinal é obrigatório');
      return;
    }

    setIsLoading(true);

    try {
      if (localImage && !formData.imageUrl) {
        await uploadImageToFirebase(localImage);
      }

      if (!formData.imageUrl) {
        Alert.alert('Erro', 'Não foi possível obter a URL da imagem.');
        return;
      }

      await createSign({
        name: formData.name,
        category: formData.category,
        description: formData.description,
        meaning: formData.meaning,
        rules: formData.rules.filter(rule => rule.trim() !== ''),
        commonMistakes: formData.commonMistakes.filter(mistake => mistake.trim() !== ''),
        imageUrl: formData.imageUrl
      });

      Alert.alert('Sucesso', 'Sinal de trânsito criado com sucesso!', [
        { text: 'OK', onPress: () => router.back() }
      ]);

    } catch (error: any) {
      console.error('Erro ao criar sinal:', error);
      Alert.alert('Erro', error.message || 'Não foi possível criar o sinal');
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
          borderBottomColor: COLORS.border,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 2
        }}>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="p-2 rounded-full"
          style={{ backgroundColor: COLORS.yellowLighten4 }}
        >
          <Feather name="arrow-left" size={20} color={COLORS.yellowDarken4} />
        </TouchableOpacity>
        <Text className="text-lg font-bold" style={{ color: COLORS.text }}>
          Novo Sinal de Trânsito
        </Text>
        <View className="w-8" />
      </View>

      <ScrollView 
        className="px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Campo: Nome */}
        <View className="mb-4">
          <Text className="text-sm font-medium mb-1" style={{ color: COLORS.text }}>
            Nome do Sinal *
          </Text>
          <TextInput
            className="p-4 rounded-xl"
            style={{ 
              backgroundColor: COLORS.surface,
              color: COLORS.text,
              borderColor: formData.name ? COLORS.border : COLORS.error,
              borderWidth: 1
            }}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Ex: Pare"
            placeholderTextColor={COLORS.textLight}
          />
          {!formData.name && (
            <Text className="text-xs mt-1" style={{ color: COLORS.error }}>
              Este campo é obrigatório
            </Text>
          )}
        </View>

        {/* Campo: Categoria */}
        <View className="mb-4">
          <Text className="text-sm font-medium mb-1" style={{ color: COLORS.text }}>
            Categoria *
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 8 }}
          >
            {trafficSignCategories.map(category => (
              <TouchableOpacity
                key={category.id}
                className={`px-4 py-2 rounded-full mr-2 ${formData.category === category.id ? 'opacity-100' : 'opacity-70'}`}
                style={{ 
                  backgroundColor: 
                    category.id === 'regulamentação' ? COLORS.error :
                    category.id === 'advertência' ? COLORS.warning :
                    category.id === 'indicação' ? COLORS.info :
                    category.id === 'educativo' ? COLORS.success :
                    COLORS.primary
                }}
                onPress={() => setFormData({ ...formData, category: category.id as TrafficSignCategory })}
              >
                <Text className="text-xs font-medium text-white">
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Campo: Imagem */}
         <View className="mb-4">
          <Text className="text-sm font-medium mb-1" style={{ color: COLORS.text }}>
            Imagem do Sinal
          </Text>
          <TouchableOpacity
            className="p-6 rounded-xl items-center justify-center border-2 border-dashed"
            style={{ 
              backgroundColor: COLORS.surface,
              borderColor: localImage ? COLORS.primary : COLORS.border
            }}
            onPress={pickImage}
            disabled={isUploading}
          >
            {isUploading ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : localImage ? (
              <>
                <Image 
                  source={{ uri: localImage }} 
                  className="w-full h-40 rounded-lg mb-2"
                  resizeMode="contain"
                />
                <Text className="text-sm" style={{ color: COLORS.primary }}>
                  {formData.imageUrl ? 'Imagem carregada' : 'Carregando imagem...'}
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
        <View className="mb-4">
          <Text className="text-sm font-medium mb-1" style={{ color: COLORS.text }}>
            Descrição
          </Text>
          <TextInput
            className="p-4 rounded-xl min-h-[100px]"
            style={{ 
              backgroundColor: COLORS.surface,
              color: COLORS.text,
              borderColor: COLORS.border,
              borderWidth: 1,
              textAlignVertical: 'top'
            }}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Descrição detalhada do sinal..."
            placeholderTextColor={COLORS.textLight}
            multiline
          />
        </View>

        {/* Campo: Significado */}
        <View className="mb-4">
          <Text className="text-sm font-medium mb-1" style={{ color: COLORS.text }}>
            Significado
          </Text>
          <TextInput
            className="p-4 rounded-xl min-h-[100px]"
            style={{ 
              backgroundColor: COLORS.surface,
              color: COLORS.text,
              borderColor: COLORS.border,
              borderWidth: 1,
              textAlignVertical: 'top'
            }}
            value={formData.meaning}
            onChangeText={(text) => setFormData({ ...formData, meaning: text })}
            placeholder="O que este sinal significa na prática?"
            placeholderTextColor={COLORS.textLight}
            multiline
          />
        </View>

        {/* Regras Relacionadas */}
        <View className="mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm font-medium" style={{ color: COLORS.text }}>
              Regras Relacionadas
            </Text>
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => addListItem('rules')}
              disabled={isLoading}
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
                disabled={isLoading}
              >
                <Feather name="trash-2" size={20} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Erros Comuns */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm font-medium" style={{ color: COLORS.text }}>
              Erros Comuns
            </Text>
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => addListItem('commonMistakes')}
              disabled={isLoading}
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
                disabled={isLoading}
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
        borderTopColor: COLORS.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5
      }}>
        <TouchableOpacity
          className="flex-row justify-center items-center py-4 rounded-xl"
          style={{ 
            backgroundColor: COLORS.primary,
            opacity: (!formData.name || isLoading) ? 0.6 : 1
          }}
          onPress={handleSubmit}
          disabled={!formData.name || isLoading}
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