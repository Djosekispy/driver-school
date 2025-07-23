// components/admin/AdminTestBuilder.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  FlatList 
} from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/hooks/useColors';
import CategorySelector from './CategorySelector';
import QuestionEditor from './QuestionEditor';
import { AdminTestBuilderProps, Question, Test } from '../types/admin';


const AdminTestBuilder: React.FC<AdminTestBuilderProps> = ({ 
  test, 
  categories, 
  onSave 
}) => {
  // Estado do teste sendo editado
  const [currentTest, setCurrentTest] = useState<Test>(
    test || {
      title: '',
      description: '',
      categoryId: '',
      passingScore: 70,
      timeLimit: 30,
      difficulty: 'medium',
      shuffleQuestions: true,
      shuffleOptions: false
    }
  );

  // Estado das perguntas
  const [questions, setQuestions] = useState<Question[]>(test?.questions || []);

  // Estado da pergunta sendo editada
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  // Estado do modal de pergunta
  const [isQuestionModalVisible, setIsQuestionModalVisible] = useState(false);

  // Manipulador para salvar o teste completo
  const handleSaveTest = () => {
    // Validações básicas
    if (!currentTest.title.trim()) {
      alert('Por favor, insira um título para o teste');
      return;
    }

    if (!currentTest.categoryId) {
      alert('Por favor, selecione uma categoria');
      return;
    }

    if (questions.length === 0) {
      alert('Por favor, adicione pelo menos uma pergunta');
      return;
    }

    const completeTest: Test = {
      ...currentTest,
      // questionsCount: questions.length,
      questions
    };

    onSave(completeTest);
  };

  // Manipulador para adicionar nova pergunta
  const handleAddQuestion = () => {
    setCurrentQuestion({
      id: `temp-${Date.now()}`,
      text: '',
      options: [
        { id: '1', text: '', isCorrect: false },
        { id: '2', text: '', isCorrect: false },
        { id: '3', text: '', isCorrect: false },
        { id: '4', text: '', isCorrect: false }
      ],
      explanation: '',
      difficulty: 'medium',
      categoryId: currentTest.categoryId
    });
    setIsQuestionModalVisible(true);
  };

  // Manipulador para salvar pergunta editada/criada
  const handleSaveQuestion = (question: Question) => {
    if (questions.some(q => q.id === question.id)) {
      // Atualiza pergunta existente
      setQuestions(questions.map(q => 
        q.id === question.id ? question : q
      ));
    } else {
      // Adiciona nova pergunta
      setQuestions([...questions, question]);
    }
    setIsQuestionModalVisible(false);
  };

  return (
    <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
      {/* Seção: Informações Básicas do Teste */}
      <View className="mb-6">
        <Text className="text-lg font-bold mb-4" style={{ color: COLORS.text }}>
          Informações do Teste
        </Text>
        
        <Text className="mb-1" style={{ color: COLORS.text }}>
          Título do Teste *
        </Text>
        <TextInput
          className="bg-gray-100 p-3 rounded-lg mb-4"
          value={currentTest.title}
          onChangeText={(title) => setCurrentTest({...currentTest, title})}
          placeholder="Ex: Teste de Legislação Básica"
          maxLength={100}
        />

        <Text className="mb-1" style={{ color: COLORS.text }}>
          Descrição
        </Text>
        <TextInput
          className="bg-gray-100 p-3 rounded-lg mb-4"
          value={currentTest.description}
          onChangeText={(description) => setCurrentTest({...currentTest, description})}
          placeholder="Descrição do teste"
          multiline
          maxLength={500}
        />

        <CategorySelector
          categories={categories}
          selectedId={currentTest.categoryId}
          onSelect={(categoryId) => setCurrentTest({...currentTest, categoryId})}
          label="Categoria *"
          required
        />

        <View className="flex-row justify-between mt-4">
          <View className="w-1/2 pr-2">
            <Text className="mb-1" style={{ color: COLORS.text }}>
              Pontuação Mínima (%) *
            </Text>
            <TextInput
              className="bg-gray-100 p-3 rounded-lg"
              value={currentTest.passingScore.toString()}
              onChangeText={(text) => {
                const passingScore = parseInt(text) || 0;
                setCurrentTest({
                  ...currentTest, 
                  passingScore: Math.min(Math.max(passingScore, 0), 100)
                });
              }}
              keyboardType="numeric"
            />
          </View>
          <View className="w-1/2 pl-2">
            <Text className="mb-1" style={{ color: COLORS.text }}>
              Tempo Limite (min)
            </Text>
            <TextInput
              className="bg-gray-100 p-3 rounded-lg"
              value={currentTest.timeLimit?.toString() || ''}
              onChangeText={(text) => {
                const timeLimit = parseInt(text);
                setCurrentTest({
                  ...currentTest, 
                  timeLimit: isNaN(timeLimit) ? undefined : timeLimit
                });
              }}
              keyboardType="numeric"
              placeholder="Opcional"
            />
          </View>
        </View>
      </View>

      {/* Seção: Configurações do Teste */}
      <View className="mb-6">
        <Text className="text-lg font-bold mb-4" style={{ color: COLORS.text }}>
          Configurações
        </Text>
        
        <View className="flex-row items-center justify-between mb-3">
          <Text style={{ color: COLORS.text }}>Dificuldade</Text>
          <View className="flex-row">
            {(['easy', 'medium', 'hard'] as const).map(difficulty => (
              <TouchableOpacity
                key={difficulty}
                className={`px-3 py-1 rounded-full mx-1 ${
                  currentTest.difficulty === difficulty ? 'bg-blue-100' : 'bg-gray-100'
                }`}
                onPress={() => setCurrentTest({...currentTest, difficulty})}
              >
                <Text style={{ 
                  color: currentTest.difficulty === difficulty 
                    ? COLORS.primary 
                    : COLORS.text,
                  textTransform: 'capitalize'
                }}>
                  {difficulty === 'easy' ? 'Fácil' : 
                   difficulty === 'medium' ? 'Médio' : 'Difícil'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="flex-row items-center justify-between mb-3">
          <Text style={{ color: COLORS.text }}>Embaralhar perguntas</Text>
          <TouchableOpacity
            onPress={() => setCurrentTest({
              ...currentTest, 
              shuffleQuestions: !currentTest.shuffleQuestions
            })}
          >
            <Feather 
              name={currentTest.shuffleQuestions ? "toggle-right" : "toggle-left"} 
              size={24} 
              color={currentTest.shuffleQuestions ? COLORS.primary : COLORS.textLight} 
            />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center justify-between">
          <Text style={{ color: COLORS.text }}>Embaralhar opções</Text>
          <TouchableOpacity
            onPress={() => setCurrentTest({
              ...currentTest, 
              shuffleOptions: !currentTest.shuffleOptions
            })}
          >
            <Feather 
              name={currentTest.shuffleOptions ? "toggle-right" : "toggle-left"} 
              size={24} 
              color={currentTest.shuffleOptions ? COLORS.primary : COLORS.textLight} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Seção: Gerenciamento de Perguntas */}
      <View className="mb-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold" style={{ color: COLORS.text }}>
            Perguntas ({questions.length}) *
          </Text>
          <TouchableOpacity 
            className="flex-row items-center px-3 py-2 rounded-lg"
            style={{ backgroundColor: COLORS.primary }}
            onPress={handleAddQuestion}
            disabled={!currentTest.categoryId}
          >
            <Feather name="plus" size={16} color="white" />
            <Text className="ml-2 text-white">Adicionar Pergunta</Text>
          </TouchableOpacity>
        </View>

        {questions.length === 0 ? (
          <View className="items-center py-8">
            <MaterialIcons name="help-outline" size={48} color={COLORS.textLight} />
            <Text className="mt-2 text-center" style={{ color: COLORS.textLight }}>
              Nenhuma pergunta adicionada ainda
            </Text>
          </View>
        ) : (
          <FlatList
            data={questions}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item, index }) => (
              <TouchableOpacity 
                className="bg-white p-4 rounded-lg mb-3"
                onPress={() => {
                  setCurrentQuestion(item);
                  setIsQuestionModalVisible(true);
                }}
              >
                <Text className="font-medium" style={{ color: COLORS.text }}>
                  {index + 1}. {item.text.substring(0, 50)}{item.text.length > 50 ? '...' : ''}
                </Text>
                <Text className="text-xs mt-1" style={{ color: COLORS.textLight }}>
                  Dificuldade: {item.difficulty === 'easy' ? 'Fácil' : 
                               item.difficulty === 'medium' ? 'Médio' : 'Difícil'} • 
                  Opções corretas: {item.options.filter(o => o.isCorrect).length}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* Botão de Salvar */}
      <TouchableOpacity 
        className="py-3 rounded-lg mb-8 items-center"
        style={{ backgroundColor: COLORS.primary }}
        onPress={handleSaveTest}
      >
        <Text className="text-white font-bold">
          {test ? 'Atualizar Teste' : 'Criar Teste'}
        </Text>
      </TouchableOpacity>

      {/* Modal de Edição de Pergunta */}
      {
        currentQuestion &&  <QuestionEditor
        visible={isQuestionModalVisible}
        question={currentQuestion}
        categories={categories}
        onSave={handleSaveQuestion}
        onClose={() => setIsQuestionModalVisible(false)}
      />
      }
     
    </ScrollView>
  );
};

export default AdminTestBuilder;