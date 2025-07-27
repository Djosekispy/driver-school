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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import {  QuizTest } from '@/types/TestQuiz';
import { useFirebase } from '@/context/FirebaseContext';
import { QuizQuestion } from '@/types/QuizQuestion';

const QuestionManagerScreen = () => {
  const { testId } = useLocalSearchParams();
  const { 
    quizTests,
    quizQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    loadQuizQuestionsByTestId
  } = useFirebase();
  
  const router = useRouter();
  const [selectedQuestion, setSelectedQuestion] = useState<QuizQuestion | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [test, setTest] = useState<QuizTest | null>(null);
  const [formData, setFormData] = useState<Omit<QuizQuestion, 'id'>>({
    question: '',
    options: ['', '', '', ''],
    correctAnswerIndex: 0,
    explanation: '',
    category: '',
    quizTestId: testId as string,
  });
  //console.log(JSON.stringify(quizQuestions));
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      loadQuizQuestionsByTestId(testId as string);
      const currentTest = quizTests.find(t => t.id === testId);
      if (currentTest) {
        setTest(currentTest);
        setFormData(prev => ({
          ...prev,
          category: currentTest.category
        }));
      }
      
      setIsLoading(false);
    };
    loadData();
  }, [testId]);

  const handleDeleteQuestion = async (id: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta pergunta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteQuestion(id);
              Alert.alert('Sucesso', 'Pergunta excluída com sucesso');
              setModalVisible(false);
            } catch (error) {
              console.error('Erro ao excluir pergunta:', error);
              Alert.alert('Erro', 'Falha ao excluir pergunta');
            }
          },
        },
      ]
    );
  };

  const handleSubmitQuestion = async () => {
    if (!formData.question || formData.options.some(opt => !opt) || !formData.explanation) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios');
      return;
    }

    try {
      if (selectedQuestion) {
        await updateQuestion(selectedQuestion.id, formData);
        Alert.alert('Sucesso', 'Pergunta atualizada com sucesso');
      } else {
        await createQuestion(formData);
        Alert.alert('Sucesso', 'Pergunta criada com sucesso');
      }
      setModalVisible(false);
      setSelectedQuestion(null);
      setFormData({
        question: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
        explanation: '',
        category: test?.category || '',
        quizTestId: testId as string,
      });
    } catch (error) {
      console.error('Erro ao salvar pergunta:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar a pergunta');
    }
  };

  const filteredQuestions = quizQuestions.filter(q => q.quizTestId === testId);

  const renderItem = ({ item }: { item: QuizQuestion }) => {
    return (
      <TouchableOpacity 
        className="flex-row items-center p-4 mb-3 rounded-lg"
        style={{ backgroundColor: COLORS.surface }}
        activeOpacity={0.8}
        onPress={() => {
          setSelectedQuestion(item);
          setFormData({
            question: item.question,
            options: [...item.options],
            correctAnswerIndex: item.correctAnswerIndex,
            explanation: item.explanation || '',
            category: item.category || '',
            quizTestId: item.quizTestId,
          });
          setModalVisible(true);
        }}
      >
        {/* Ícone da pergunta */}
        <View className="w-12 h-12 rounded-lg mr-3 items-center justify-center"
          style={{ backgroundColor: COLORS.primary }}>
          <MaterialIcons name="quiz" size={24} color="white" />
        </View>

        {/* Texto da pergunta */}
        <View className="flex-1">
          <Text className="text-base font-semibold mb-1" numberOfLines={2}
            style={{ color: COLORS.text }}>
            {item.question}
          </Text>
          <Text className="text-xs" style={{ color: COLORS.textLight }}>
            {item.options[item.correctAnswerIndex]} (Resposta correta)
          </Text>
        </View>

        {/* Ícone de ação */}
        <Feather name="chevron-right" size={18} color={COLORS.textLight} />
      </TouchableOpacity>
    );
  };

  if (isLoading || !test) {
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
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="arrowleft" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text className="text-xl font-bold ml-4" style={{ color: COLORS.text }}>
            Perguntas: {test.title}
          </Text>
        </View>
        
        <View className="flex-row items-center">
          <View className="px-3 py-1 rounded-full mr-3"
            style={{ backgroundColor: COLORS.primary }}>
            <Text className="text-xs text-white">
              {filteredQuestions.length} perguntas
            </Text>
          </View>
          <Text className="text-xs" style={{ color: COLORS.textLight }}>
            Pontuação para aprovar: {test.pointToAprove}%
          </Text>
        </View>
      </View>

      {/* Lista de perguntas */}
      <FlatList
        data={filteredQuestions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        className="px-4 pt-3"
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-12 px-4 rounded-lg mx-4 mt-4"
            style={{ backgroundColor: COLORS.yellowLighten5 }}>
            <MaterialIcons 
              name="quiz" 
              size={48} 
              color={COLORS.yellowDarken2} 
            />
            <Text className="text-lg mt-4 text-center"
              style={{ color: COLORS.textLight }}>
              Nenhuma pergunta encontrada
            </Text>
            <Text className="text-sm mt-1 text-center"
              style={{ color: COLORS.textLight }}>
              Adicione perguntas ao seu teste
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
        onPress={() => {
          setSelectedQuestion(null);
          setFormData({
            question: '',
            options: ['', '', '', ''],
            correctAnswerIndex: 0,
            explanation: '',
            category: test.category,
            quizTestId: testId as string,
          });
          setModalVisible(true);
        }}
      >
        <Feather name="plus" size={24} color="white" />
      </TouchableOpacity>

      {/* Modal de edição/criação de pergunta */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setModalVisible(false);
          setSelectedQuestion(null);
        }}
      >
        <View className="flex-1 justify-center bg-black/90 p-4"
          style={Platform.OS === 'ios' ? { paddingTop: 60 } : {}}>
          <ScrollView 
            className="bg-white rounded-2xl max-h-[90%]"
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <View className="p-5">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold" style={{ color: COLORS.text }}>
                  {selectedQuestion ? 'Editar Pergunta' : 'Nova Pergunta'}
                </Text>
                <TouchableOpacity onPress={() => {
                  setModalVisible(false);
                  setSelectedQuestion(null);
                }}>
                  <AntDesign name="close" size={24} color={COLORS.textLight} />
                </TouchableOpacity>
              </View>

              <Text className="text-sm font-medium mb-1" style={{ color: COLORS.text }}>
                Pergunta *
              </Text>
              <TextInput
                className="p-3 rounded-lg mb-4"
                style={{ backgroundColor: COLORS.surface, color: COLORS.text }}
                placeholder="Digite a pergunta"
                placeholderTextColor={COLORS.textLight}
                value={formData.question}
                onChangeText={(text) => setFormData({...formData, question: text})}
                multiline
              />

              <Text className="text-sm font-medium mb-1" style={{ color: COLORS.text }}>
                Opções de Resposta *
              </Text>
              {formData.options.map((option, index) => (
                <View key={`option-${index}`} className="flex-row items-center mb-2">
                  <TouchableOpacity
                    className="w-6 h-6 rounded-full border-2 mr-3 items-center justify-center"
                    style={{ 
                      borderColor: formData.correctAnswerIndex === index 
                        ? COLORS.success 
                        : COLORS.border 
                    }}
                    onPress={() => setFormData({...formData, correctAnswerIndex: index})}
                  >
                    {formData.correctAnswerIndex === index && (
                      <View className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS.success }} />
                    )}
                  </TouchableOpacity>
                  <TextInput
                    className="flex-1 p-3 rounded-lg"
                    style={{ backgroundColor: COLORS.surface, color: COLORS.text }}
                    placeholder={`Opção ${index + 1}`}
                    placeholderTextColor={COLORS.textLight}
                    value={option}
                    onChangeText={(text) => {
                      const newOptions = [...formData.options];
                      newOptions[index] = text;
                      setFormData({...formData, options: newOptions});
                    }}
                  />
                </View>
              ))}

              <Text className="text-sm font-medium mb-1 mt-4" style={{ color: COLORS.text }}>
                Explicação da Resposta Correta *
              </Text>
              <TextInput
                className="p-3 rounded-lg h-24 mb-4"
                style={{ backgroundColor: COLORS.surface, color: COLORS.text }}
                placeholder="Explique por que esta é a resposta correta"
                placeholderTextColor={COLORS.textLight}
                value={formData.explanation}
                onChangeText={(text) => setFormData({...formData, explanation: text})}
                multiline
              />

              <Text className="text-sm font-medium mb-1" style={{ color: COLORS.text }}>
                Categoria
              </Text>
              <TextInput
                className="p-3 rounded-lg mb-6"
                style={{ backgroundColor: COLORS.surface, color: COLORS.text }}
                placeholder="Categoria"
                placeholderTextColor={COLORS.textLight}
                value={formData.category}
                onChangeText={(text) => setFormData({...formData, category: text})}
              />

              <View className="flex-row">
                <TouchableOpacity
                  className="flex-1 p-4 rounded-lg items-center mr-2"
                  style={{ backgroundColor: COLORS.primary }}
                  onPress={handleSubmitQuestion}
                >
                  <Text className="text-white font-medium">
                    {selectedQuestion ? 'Atualizar' : 'Adicionar'}
                  </Text>
                </TouchableOpacity>

                {selectedQuestion && (
                  <TouchableOpacity
                    className="p-4 rounded-lg items-center ml-2"
                    style={{ backgroundColor: COLORS.errorLight }}
                    onPress={() => handleDeleteQuestion(selectedQuestion.id)}
                  >
                    <Text className="font-medium" style={{ color: COLORS.error }}>
                      Excluir
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default QuestionManagerScreen;