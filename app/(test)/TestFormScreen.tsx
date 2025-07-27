import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { COLORS } from '@/hooks/useColors';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
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
    { name: 'Regulamentação', icon: 'traffic-cone' },
    { name: 'Advertência', icon: 'alert-circle' },
    { name: 'Indicação', icon: 'sign-direction' },
    { name: 'Educativo', icon: 'school' },
    { name: 'Serviço', icon: 'tools' }
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
  }, [id, quizTests]);

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

  const getCategoryColor = (categoryName: string) => {
    switch (categoryName) {
      case 'Regulamentação': return COLORS.error;
      case 'Advertência': return COLORS.warning;
      case 'Indicação': return COLORS.info;
      case 'Educativo': return COLORS.success;
      case 'Serviço': return COLORS.primary;
      default: return COLORS.secondary;
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
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 48 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header com botão de voltar */}
        <View className="flex-row items-center px-5 pt-6 pb-4">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="p-2 mr-4"
          >
            <AntDesign name="arrowleft" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text className="text-2xl font-bold flex-1" style={{ color: COLORS.text }}>
            {id ? 'Editar Teste' : 'Novo Teste'}
          </Text>
        </View>

        {/* Formulário */}
        <View className="px-5">
          {/* Campo Título */}
          <View className="mb-6">
            <Text className="text-sm font-medium mb-2" style={{ color: COLORS.text }}>
              Título do Teste *
            </Text>
            <TextInput
              className="p-4 rounded-xl text-base"
              style={{ 
                backgroundColor: COLORS.surface, 
                color: COLORS.text,
                borderWidth: 1,
                borderColor: COLORS.border
              }}
              placeholder="Ex: Teste de Sinalização Básica"
              placeholderTextColor={COLORS.textLight}
              value={formData.title}
              onChangeText={(text) => setFormData({...formData, title: text})}
            />
          </View>

          {/* Campo Descrição */}
          <View className="mb-6">
            <Text className="text-sm font-medium mb-2" style={{ color: COLORS.text }}>
              Descrição *
            </Text>
            <TextInput
              className="p-4 rounded-xl text-base h-32"
              style={{ 
                backgroundColor: COLORS.surface, 
                color: COLORS.text,
                borderWidth: 1,
                borderColor: COLORS.border,
                textAlignVertical: 'top'
              }}
              placeholder="Descreva o objetivo deste teste..."
              placeholderTextColor={COLORS.textLight}
              multiline
              value={formData.discription}
              onChangeText={(text) => setFormData({...formData, discription: text})}
            />
          </View>

          {/* Seletor de Categoria */}
          <View className="mb-6">
            <Text className="text-sm font-medium mb-3" style={{ color: COLORS.text }}>
              Categoria *
            </Text>
            
            <View className="flex-row flex-wrap">
              {categories.map((category) => {
                const isSelected = formData.category === category.name;
                const bgColor = getCategoryColor(category.name);
                
                return (
                  <TouchableOpacity
                    key={category.name}
                    className={`flex-row items-center px-4 py-3 rounded-xl mb-3 mr-3 ${isSelected ? 'border-2' : 'opacity-90'}`}
                    style={{ 
                      backgroundColor: isSelected ? `${bgColor}20` : COLORS.surface,
                      borderColor: bgColor,
                      minWidth: '45%'
                    }}
                    onPress={() => setFormData({...formData, category: category.name})}
                  >
                    <View className="w-8 h-8 rounded-full items-center justify-center mr-2"
                      style={{ backgroundColor: isSelected ? bgColor : `${bgColor}20` }}>
                      <MaterialIcons 
                        name={category.icon as any} 
                        size={18} 
                        color={isSelected ? 'white' : bgColor} 
                      />
                    </View>
                    <Text 
                      className="text-sm font-medium"
                      style={{ color: isSelected ? COLORS.text : COLORS.text }}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Pontuação Mínima */}
          <View className="mb-8">
            <Text className="text-sm font-medium mb-3" style={{ color: COLORS.text }}>
              Pontuação Mínima para Aprovação *
            </Text>
            
            <View className="flex-row items-center justify-between bg-white rounded-xl p-1"
              style={{ backgroundColor: COLORS.surface }}>
              <TouchableOpacity
                className="w-12 h-12 items-center justify-center rounded-lg"
                style={{ backgroundColor: COLORS.background }}
                onPress={() => {
                  if (formData.pointToAprove > 0) {
                    setFormData({...formData, pointToAprove: formData.pointToAprove - 5});
                  }
                }}
              >
                <AntDesign name="minus" size={18} color={COLORS.text} />
              </TouchableOpacity>
              
              <View className="flex-1 items-center mx-2">
                <Text className="text-3xl font-bold" style={{ color: COLORS.primary }}>
                  {formData.pointToAprove}%
                </Text>
                <Text className="text-xs" style={{ color: COLORS.textLight }}>
                  Pontuação mínima
                </Text>
              </View>
              
              <TouchableOpacity
                className="w-12 h-12 items-center justify-center rounded-lg"
                style={{ backgroundColor: COLORS.background }}
                onPress={() => {
                  if (formData.pointToAprove < 100) {
                    setFormData({...formData, pointToAprove: formData.pointToAprove + 5});
                  }
                }}
              >
                <AntDesign name="plus" size={18} color={COLORS.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Botão de ação principal */}
          <TouchableOpacity
            className="flex-row items-center justify-center p-5 rounded-xl mb-4"
            style={{ backgroundColor: COLORS.primary }}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Feather name={id ? 'save' : 'plus'} size={20} color="white" />
                <Text className="text-white font-medium ml-2">
                  {id ? 'Salvar Alterações' : 'Criar Teste'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Botão secundário (se for edição) */}
          {id && (
            <TouchableOpacity
              className="flex-row items-center justify-center p-5 rounded-xl border mt-2"
              style={{ borderColor: COLORS.primary }}
              onPress={() => router.push({
                pathname: '/(test)/QuestionManagerScreen',
                params: { testId: id as string }
              })}
            >
              <MaterialIcons name="quiz" size={20} color={COLORS.primary} />
              <Text className="font-medium ml-2" style={{ color: COLORS.primary }}>
                Gerenciar Perguntas
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default TestFormScreen;