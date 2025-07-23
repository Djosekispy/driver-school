import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  ActivityIndicator, 
  FlatList 
} from 'react-native';
import { Feather, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { COLORS } from '@/hooks/useColors';
import { useRouter } from 'expo-router';
import { mockTests } from '../data/tests.mock';

interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
  points: string;
}

interface QuestionProps {
  testId: string;
}

const AddQuestionScreen = ({ testId }: QuestionProps) => {
  const router = useRouter();
  const [currentTest, setCurrentTest] = useState(null);
  const [questionText, setQuestionText] = useState('');
  const [answerOptions, setAnswerOptions] = useState<AnswerOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newOptionText, setNewOptionText] = useState('');
  const [showExisting, setShowExisting] = useState(false);

  useEffect(() => {
    const test = mockTests.find(t => t.id === testId);
    setCurrentTest(test);
  }, [testId]);

  const addAnswerOption = () => {
    if (!newOptionText.trim()) {
      Alert.alert('Campo obrigatório', 'Digite o texto da alternativa');
      return;
    }

    const newOption: AnswerOption = {
      id: Date.now().toString(),
      text: newOptionText,
      isCorrect: false,
      points: '1'
    };

    setAnswerOptions([...answerOptions, newOption]);
    setNewOptionText('');
  };

  const toggleCorrectOption = (id: string) => {
    setAnswerOptions(answerOptions.map(option => ({
      ...option,
      isCorrect: option.id === id
    })));
  };

  const updateOptionPoints = (id: string, points: string) => {
    if (isNaN(parseInt(points))) return;
    setAnswerOptions(answerOptions.map(option => 
      option.id === id ? { ...option, points } : option
    ));
  };

  const removeOption = (id: string) => {
    Alert.alert(
      'Remover alternativa',
      'Tem certeza que deseja remover esta alternativa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Remover', 
          style: 'destructive',
          onPress: () => setAnswerOptions(answerOptions.filter(option => option.id !== id))
        }
      ]
    );
  };

  const saveQuestion = async () => {
    if (!questionText.trim()) {
      Alert.alert('Campo obrigatório', 'Digite o texto da questão');
      return;
    }

    if (answerOptions.length < 2) {
      Alert.alert('Alternativas insuficientes', 'Adicione pelo menos 2 alternativas');
      return;
    }

    if (!answerOptions.some(option => option.isCorrect)) {
      Alert.alert('Alternativa correta', 'Selecione a alternativa correta');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Sucesso', 'Questão adicionada com sucesso!');
      setQuestionText('');
      setAnswerOptions([]);
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao salvar a questão');
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentTest) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
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
          Adicionar Questão
        </Text>
        <View className="w-10" />
      </View>

      {/* Test Info */}
      <View className="mx-4 my-4 p-4 rounded-xl shadow-sm" style={{ 
        backgroundColor: COLORS.surface,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}>
        <Text className="text-base font-semibold" style={{ color: COLORS.text }} numberOfLines={1}>
          {currentTest.title}
        </Text>
        <Text className="text-xs mt-1" style={{ color: COLORS.textLight }}>
          {currentTest.questions?.length || 0} questões existentes
        </Text>
      </View>

      <ScrollView className="px-4 pb-20" keyboardShouldPersistTaps="handled">
        {/* Question Input */}
        <Text className="text-sm font-medium mb-2" style={{ color: COLORS.text }}>
          Texto da Questão *
        </Text>
        <TextInput
          className="p-4 rounded-xl mb-4 min-h-[100px] text-justify"
          style={{ 
            backgroundColor: COLORS.surface,
            color: COLORS.text,
            borderColor: COLORS.border,
            borderWidth: 1,
            textAlignVertical: 'top'
          }}
          value={questionText}
          onChangeText={setQuestionText}
          placeholder="Digite a pergunta..."
          placeholderTextColor={COLORS.textLight}
          multiline
        />

        {/* Answer Options Section */}
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-sm font-medium" style={{ color: COLORS.text }}>
            Alternativas *
          </Text>
          <Text className="text-xs" style={{ color: COLORS.textLight }}>
            {answerOptions.length} adicionadas
          </Text>
        </View>

        {/* Answer Options List */}
        {answerOptions.length > 0 && (
          <FlatList
            data={answerOptions}
            scrollEnabled={false}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View className="p-4 rounded-xl mb-2 border" style={{ 
                backgroundColor: COLORS.surface,
                borderColor: item.isCorrect ? COLORS.primary : COLORS.border
              }}>
                <View className="flex-row justify-between mb-3">
                  <Text 
                    className="flex-1 text-sm mr-2" 
                    style={{ color: COLORS.text }}
                    numberOfLines={2}
                  >
                    {item.text}
                  </Text>
                  <TouchableOpacity 
                    onPress={() => removeOption(item.id)}
                    className="p-1"
                  >
                    <Feather name="trash-2" size={18} color={COLORS.error} />
                  </TouchableOpacity>
                </View>
                
                <View className="flex-row justify-between items-center">
                  <TouchableOpacity
                    className="flex-row items-center"
                    onPress={() => toggleCorrectOption(item.id)}
                  >
                    <MaterialIcons 
                      name={item.isCorrect ? "radio-button-checked" : "radio-button-unchecked"} 
                      size={20} 
                      color={item.isCorrect ? COLORS.primary : COLORS.textLight} 
                    />
                    <Text className="text-sm ml-2" style={{ 
                      color: item.isCorrect ? COLORS.primary : COLORS.text 
                    }}>
                      Correta
                    </Text>
                  </TouchableOpacity>
                  
                  <View className="flex-row items-center">
                    <Text className="text-sm mr-2" style={{ color: COLORS.text }}>
                      Pontos:
                    </Text>
                    <TextInput
                      className="w-12 p-1 rounded text-center"
                      style={{ 
                        backgroundColor: COLORS.background,
                        color: COLORS.text
                      }}
                      value={item.points}
                      onChangeText={(text) => updateOptionPoints(item.id, text)}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>
            )}
          />
        )}

        {/* Add New Option */}
        <View className="flex-row mt-2 mb-4">
          <TextInput
            className="flex-1 p-4 rounded-xl mr-2 border"
            style={{ 
              backgroundColor: COLORS.surface,
              color: COLORS.text,
              borderColor: COLORS.border
            }}
            value={newOptionText}
            onChangeText={setNewOptionText}
            placeholder="Digite uma nova alternativa..."
            placeholderTextColor={COLORS.textLight}
          />
          <TouchableOpacity
            className="w-12 rounded-xl justify-center items-center"
            style={{ backgroundColor: COLORS.primary }}
            onPress={addAnswerOption}
            disabled={!newOptionText.trim()}
          >
            <Feather name="plus" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Existing Questions Section */}
        {currentTest.questions?.length > 0 && (
          <>
            <TouchableOpacity
              className="flex-row justify-center items-center py-3"
              onPress={() => setShowExisting(!showExisting)}
            >
              <Text className="text-sm font-medium mr-2" style={{ color: COLORS.primary }}>
                {showExisting ? 'Ocultar' : 'Mostrar'} questões existentes ({currentTest.questions.length})
              </Text>
              <Feather 
                name={showExisting ? "chevron-up" : "chevron-down"} 
                size={20} 
                color={COLORS.primary} 
              />
            </TouchableOpacity>

            {showExisting && (
              <View className="mb-4">
                {currentTest.questions.map((q, index) => (
                  <View 
                    key={q.id} 
                    className="p-4 rounded-xl mb-2"
                    style={{ backgroundColor: COLORS.surface }}
                  >
                    <Text className="text-sm" style={{ color: COLORS.text }}>
                      <Text className="font-bold">{index + 1}.</Text> {q.text}
                    </Text>
                    <Text className="text-xs mt-1" style={{ color: COLORS.textLight }}>
                      {q.options.filter(o => o.isCorrect).length} alternativa(s) correta(s)
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Save Button */}
      <View className="absolute bottom-0 left-0 right-0 p-4 border-t" style={{ 
        backgroundColor: COLORS.surface,
        borderTopColor: COLORS.border
      }}>
        <TouchableOpacity
          className="flex-row justify-center items-center py-4 rounded-xl"
          style={{ 
            backgroundColor: COLORS.primary,
            opacity: (questionText.trim() && answerOptions.length >= 2 && answerOptions.some(o => o.isCorrect)) ? 1 : 0.6
          }}
          onPress={saveQuestion}
          disabled={isLoading || !questionText.trim() || answerOptions.length < 2 || !answerOptions.some(o => o.isCorrect)}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Feather name="save" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Salvar Questão</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddQuestionScreen;