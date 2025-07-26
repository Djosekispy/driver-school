import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { COLORS } from '@/hooks/useColors';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AntDesign, Feather } from '@expo/vector-icons';
import { QuizTest } from '@/types/TestQuiz';
import { useFirebase } from '@/context/FirebaseContext';

const TestFormScreen = () => {
  const { id } = useLocalSearchParams();
  const { 
    quizTests, 
    createTest,
    updateTest
  } = useFirebase();
  const router = useRouter();
  
  const [formData, setFormData] = useState<Omit<QuizTest, 'id'>>({
    title: '',
    discription: '',
    category: 'Regulamentação',
    pointToAprove: 70,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Regulamentação',
    'Advertência',
    'Indicação',
    'Educativo',
    'Serviço'
  ];

  useEffect(() => {
    if (id) {
      const loadTestData = async () => {
        setIsLoading(true);
        const test = quizTests.find(t => t.id === id);
        if (test) {
          setFormData({
            title: test.title,
            discription: test.discription,
            category: test.category,
            pointToAprove: test.pointToAprove,
          });
        }
        setIsLoading(false);
      };
      loadTestData();
    }
  }, [id]);

  const handleSubmit = async () => {
    if (!formData.title || !formData.discription) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios');
      return;
    }

    setIsSubmitting(true);
    try {
      if (id) {
        await updateTest(id as string, formData);
        Alert.alert('Sucesso', 'Teste atualizado com sucesso');
      } else {
        await createTest(formData);
        Alert.alert('Sucesso', 'Teste criado com sucesso');
      }
      router.back();
    } catch (error) {
      console.error('Erro ao salvar teste:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o teste');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 p-4"
      style={{ backgroundColor: COLORS.background }}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <Text className="text-2xl font-bold mb-6" style={{ color: COLORS.text }}>
        {id ? 'Editar Teste' : 'Criar Novo Teste'}
      </Text>

      {/* Formulário */}
      <View className="mb-6">
        <Text className="text-sm font-medium mb-1" style={{ color: COLORS.text }}>
          Título do Teste *
        </Text>
        <TextInput
          className="p-3 rounded-lg mb-4"
          style={{ backgroundColor: COLORS.surface, color: COLORS.text }}
          placeholder="Digite o título do teste"
          placeholderTextColor={COLORS.textLight}
          value={formData.title}
          onChangeText={(text) => setFormData({...formData, title: text})}
        />

        <Text className="text-sm font-medium mb-1" style={{ color: COLORS.text }}>
          Descrição *
        </Text>
        <TextInput
          className="p-3 rounded-lg mb-4 h-24"
          style={{ backgroundColor: COLORS.surface, color: COLORS.text }}
          placeholder="Descreva o propósito do teste"
          placeholderTextColor={COLORS.textLight}
          multiline
          value={formData.discription}
          onChangeText={(text) => setFormData({...formData, discription: text})}
        />

        <Text className="text-sm font-medium mb-1" style={{ color: COLORS.text }}>
          Categoria *
        </Text>
        <View className="flex-row flex-wrap mb-4">
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              className={`px-4 py-2 rounded-full mr-2 mb-2 ${formData.category === category ? 'opacity-100' : 'opacity-70'}`}
              style={{ 
                backgroundColor: 
                  category === 'Regulamentação' ? COLORS.error :
                  category === 'Advertência' ? COLORS.warning :
                  category === 'Indicação' ? COLORS.info :
                  category === 'Educativo' ? COLORS.success :
                  COLORS.primary
              }}
              onPress={() => setFormData({...formData, category})}
            >
              <Text className="text-xs text-white">
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-sm font-medium mb-1" style={{ color: COLORS.text }}>
          Pontuação Mínima para Aprovação *
        </Text>
        <View className="flex-row items-center mb-6">
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: COLORS.surface }}
            onPress={() => {
              if (formData.pointToAprove > 0) {
                setFormData({...formData, pointToAprove: formData.pointToAprove - 5});
              }
            }}
          >
            <AntDesign name="minus" size={16} color={COLORS.text} />
          </TouchableOpacity>
          
          <TextInput
            className="flex-1 mx-4 text-center p-3 rounded-lg"
            style={{ backgroundColor: COLORS.surface, color: COLORS.text }}
            keyboardType="numeric"
            value={String(formData.pointToAprove)}
            onChangeText={(text) => {
              const value = parseInt(text) || 0;
              if (value >= 0 && value <= 100) {
                setFormData({...formData, pointToAprove: value});
              }
            }}
          />
          
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: COLORS.surface }}
            onPress={() => {
              if (formData.pointToAprove < 100) {
                setFormData({...formData, pointToAprove: formData.pointToAprove + 5});
              }
            }}
          >
            <AntDesign name="plus" size={16} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Botão de salvar */}
      <TouchableOpacity
        className="p-4 rounded-lg items-center"
        style={{ backgroundColor: COLORS.primary }}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-medium">
            {id ? 'Atualizar Teste' : 'Criar Teste'}
          </Text>
        )}
      </TouchableOpacity>

      {id && (
        <TouchableOpacity
          className="p-4 rounded-lg items-center mt-4"
          style={{ backgroundColor: COLORS.surface }}
          onPress={() => router.push({
            pathname: '/(test)/QuestionManagerScreen',
            params: { testId: id as string }
          })}
        >
          <Text className="font-medium" style={{ color: COLORS.primary }}>
            Gerenciar Perguntas
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default TestFormScreen;