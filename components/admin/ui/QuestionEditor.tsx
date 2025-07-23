// components/admin/QuestionEditor.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '@/hooks/useColors';
import CategorySelector from './CategorySelector';
import { DifficultyLevel, Question, QuestionEditorProps } from '../types/admin';



const QuestionEditor: React.FC<QuestionEditorProps> = ({ 
  visible, 
  question, 
  categories, 
  onSave, 
  onClose 
}) => {
  // Estado da pergunta sendo editada
  const [currentQuestion, setCurrentQuestion] = useState<Question>(
    question || {
      text: '',
      options: [
        { id: '1', text: '', isCorrect: false },
        { id: '2', text: '', isCorrect: false },
        { id: '3', text: '', isCorrect: false },
        { id: '4', text: '', isCorrect: false }
      ],
      explanation: '',
      difficulty: 'medium',
      categoryId: ''
    }
  );

  // Manipula mudanças no texto das opções
  const handleOptionChange = (id: string, text: string) => {
    setCurrentQuestion({
      ...currentQuestion,
      options: currentQuestion.options.map(opt => 
        opt.id === id ? { ...opt, text } : opt
      )
    });
  };

  // Alterna a opção correta
  const toggleCorrectOption = (id: string) => {
    setCurrentQuestion({
      ...currentQuestion,
      options: currentQuestion.options.map(opt => 
        opt.id === id ? { ...opt, isCorrect: !opt.isCorrect } : opt
      )
    });
  };

  // Valida e salva a pergunta
  const handleSave = () => {
    // Validação do texto da pergunta
    if (!currentQuestion.text.trim()) {
      Alert.alert('Campo obrigatório', 'Por favor, insira o texto da pergunta');
      return;
    }

    // Validação de opções corretas
    if (currentQuestion.options.filter(o => o.isCorrect).length === 0) {
      Alert.alert('Opção obrigatória', 'Por favor, selecione pelo menos uma opção correta');
      return;
    }

    // Validação do texto das opções
    if (currentQuestion.options.some(o => !o.text.trim())) {
      Alert.alert('Campo obrigatório', 'Por favor, preencha todas as opções');
      return;
    }

    // Validação da categoria
    if (!currentQuestion.categoryId) {
      Alert.alert('Seleção obrigatória', 'Por favor, selecione uma categoria');
      return;
    }

    // Chama a função onSave com a pergunta completa
    onSave({
      ...currentQuestion,
      id: question?.id || `q-${Date.now()}`
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black bg-opacity-50">
        <View className="bg-white rounded-t-3xl p-5 max-h-3/4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold" style={{ color: COLORS.text }}>
              {question ? 'Editar Pergunta' : 'Nova Pergunta'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Campo de texto da pergunta */}
            <Text className="mb-1" style={{ color: COLORS.text }}>
              Texto da Pergunta *
            </Text>
            <TextInput
              className="bg-gray-100 p-3 rounded-lg mb-4"
              value={currentQuestion.text}
              onChangeText={(text) => setCurrentQuestion({
                ...currentQuestion, 
                text
              })}
              placeholder="Digite a pergunta"
              multiline
              maxLength={500}
            />

            {/* Seletor de categoria */}
            <CategorySelector
              categories={categories}
              selectedId={currentQuestion.categoryId}
              onSelect={(id) => setCurrentQuestion({
                ...currentQuestion, 
                categoryId: id
              })}
              label="Categoria *"
              required
            />

            {/* Seletor de dificuldade */}
            <Text className="mb-1 mt-4" style={{ color: COLORS.text }}>
              Dificuldade
            </Text>
            <View className="flex-row mb-4">
              {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map(difficulty => (
                <TouchableOpacity
                  key={difficulty}
                  className={`flex-1 items-center py-2 mx-1 rounded-lg ${
                    currentQuestion.difficulty === difficulty 
                      ? 'bg-blue-100' 
                      : 'bg-gray-100'
                  }`}
                  onPress={() => setCurrentQuestion({
                    ...currentQuestion, 
                    difficulty
                  })}
                >
                  <Text style={{ 
                    color: currentQuestion.difficulty === difficulty 
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

            {/* Opções de resposta */}
            <Text className="mb-2" style={{ color: COLORS.text }}>
              Opções de Resposta *
            </Text>
            {currentQuestion.options.map((option, index) => (
              <View key={option.id} className="flex-row items-center mb-3">
                <TouchableOpacity
                  className="w-8 h-8 rounded-full items-center justify-center mr-2"
                  style={{ 
                    backgroundColor: option.isCorrect 
                      ? COLORS.success 
                      : COLORS.yellowLighten5 
                  }}
                  onPress={() => toggleCorrectOption(option.id)}
                >
                  <MaterialCommunityIcons 
                    name={option.isCorrect ? "check-bold" : "circle-outline"} 
                    size={20} 
                    color={option.isCorrect ? 'white' : COLORS.textLight} 
                  />
                </TouchableOpacity>
                <TextInput
                  className="flex-1 bg-gray-100 p-3 rounded-lg"
                  value={option.text}
                  onChangeText={(text) => handleOptionChange(option.id, text)}
                  placeholder={`Opção ${index + 1}`}
                  maxLength={200}
                />
              </View>
            ))}

            {/* Explicação (opcional) */}
            <Text className="mb-1 mt-4" style={{ color: COLORS.text }}>
              Explicação (Opcional)
            </Text>
            <TextInput
              className="bg-gray-100 p-3 rounded-lg mb-4"
              value={currentQuestion.explanation}
              onChangeText={(explanation) => setCurrentQuestion({
                ...currentQuestion, 
                explanation
              })}
              placeholder="Explicação para a resposta correta"
              multiline
              maxLength={500}
            />

            {/* Botões de ação */}
            <View className="flex-row justify-between mt-4 mb-2">
              <TouchableOpacity 
                className="py-3 px-6 rounded-lg"
                style={{ backgroundColor: COLORS.yellowLighten5 }}
                onPress={onClose}
              >
                <Text style={{ color: COLORS.primary }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="py-3 px-6 rounded-lg"
                style={{ backgroundColor: COLORS.primary }}
                onPress={handleSave}
              >
                <Text className="text-white font-medium">
                  {question ? 'Atualizar' : 'Salvar'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default QuestionEditor;