import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useFirebase } from '@/context/FirebaseContext';
import { COLORS } from '@/hooks/useColors';
import { useRouter } from 'expo-router';
import { QuizTest } from '@/types/TestQuiz';
import { auth } from '@/firebase/firebase';

const QuizScreen = () => {
  const router = useRouter();
  const { quizTests, quizQuestions, quizResults, loadQuizQuestionsByTestId, submitResult, loadUserResults, loadQuiz } = useFirebase();
  const [selectedTest, setSelectedTest] = useState<QuizTest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const userId = auth.currentUser?.uid || '';

  useEffect(() => {
    if (userId) {
      loadUserResults(userId);
      loadQuiz();
    }
  }, [userId, loadUserResults, loadQuiz]);

  const categories = ['todos', ...new Set(quizTests.map(test => test.category))];
  
  const filteredTests = quizTests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         test.discription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || test.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const startQuiz = async (test: QuizTest) => {
    setSelectedTest(test);
    await loadQuizQuestionsByTestId(test.id);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizStarted(true);
    setQuizFinished(false);
    setSelectedAnswer(null);
  };

  const checkAnswer = () => {
    if (selectedAnswer === null) return;
    
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswerIndex;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    setShowExplanation(false);
    setSelectedAnswer(null);
    
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setQuizFinished(true);
    
    if (selectedTest) {
      const result = {
        userId,
        quizDate: new Date(),
        score: (score / quizQuestions.length) * 100,
        totalQuestions: quizQuestions.length,
        correctAnswers: score,
        quizTestId: selectedTest.id,
        wrongAnswers: quizQuestions.length - score,
        answers: quizQuestions.map((q, index) => ({
          questionId: q.id,
          selectedIndex: selectedAnswer || 0,
          isCorrect: selectedAnswer === q.correctAnswerIndex
        }))
      };
      
      await submitResult(result);
      await loadUserResults(userId);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizFinished(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const renderTestItem = ({ item }: { item: QuizTest }) => {
    const userResults = quizResults.filter(r => r.userId === userId && r.quizTestId === item.id);
    const totalQuestions = quizQuestions.filter(q => q.quizTestId === item.id).length;
    const completedQuestions = userResults.reduce((acc, r) => acc + r.answers.length, 0);
    const progress = totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0;

    return (
      <TouchableOpacity
        className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100 active:scale-95 transition-transform"
        onPress={() => startQuiz(item)}
      >
        <View className="flex-row justify-between items-start mb-2">
          <Text className="text-lg font-semibold flex-1" style={{ color: COLORS.text }}>{item.title}</Text>
          <View className="rounded-full px-2 py-1" style={{ backgroundColor: COLORS.yellowLighten5 }}>
            <Text className="text-xs" style={{ color: COLORS.primary }}>{item.category}</Text>
          </View>
        </View>
        
        <Text className="text-sm mb-3" style={{ color: COLORS.textLight }} numberOfLines={2}>{item.discription}</Text>
        
        <View className="mb-3">
          <View className="h-1.5 rounded-full mb-1" style={{ backgroundColor: COLORS.yellowLighten5 }}>
            <View 
              className="h-full rounded-full" 
              style={{ width: `${(totalQuestions/completedQuestions) * 100}%`, backgroundColor: COLORS.primary }}
            />
          </View>
          <Text className="text-xs text-right" style={{ color: COLORS.textLight }}>
            {completedQuestions}/{totalQuestions} questões
          </Text>
        </View>
        
        <TouchableOpacity 
          className="rounded-lg py-2 items-center"
          style={{ backgroundColor: COLORS.primary }}
          onPress={() => startQuiz(item)}
        >
          <Text className="font-semibold text-sm" style={{ color: COLORS.surface }}>
            {progress > 0 ? 'Continuar' : 'Iniciar'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (!quizStarted) {
    return (
      <View className="flex-1" style={{ backgroundColor: COLORS.background }}>
        {/* Header */}
        <View className="p-4 border-b" style={{ 
          backgroundColor: COLORS.surface, 
          borderBottomColor: COLORS.border 
        }}>
          <Text className="text-2xl font-bold" style={{ color: COLORS.text }}>Testes de Conhecimento</Text>
          <Text className="text-sm mt-1" style={{ color: COLORS.textLight }}>Pratique seus conhecimentos sobre trânsito</Text>
        </View>

        {/* Search Bar */}
        <View className="p-4" style={{ backgroundColor: COLORS.surface }}>
          <View className="flex-row items-center rounded-lg px-3 py-2" style={{ backgroundColor: COLORS.background }}>
            <Feather name="search" size={20} style={{ color: COLORS.textLight, marginRight: 8 }} />
            <TextInput
              placeholder="Buscar testes..."
              placeholderTextColor={COLORS.textLight}
              className="flex-1 text-base"
              style={{ color: COLORS.text }}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
           <ScrollView 
  horizontal 
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={{ 
    paddingVertical: 8, 
    height: 40,
    paddingBottom: 0,
  }}
  className="px-4"
  style={{ 
    backgroundColor: COLORS.surface,
  }}
>
  {categories.map(category => (
    <TouchableOpacity
      key={category}
      className="h-8 rounded-full px-3 mr-2 justify-center" 
      style={{ 
        backgroundColor: selectedCategory === category ? COLORS.primary : COLORS.background 
      }}
      onPress={() => setSelectedCategory(category)}
    >
      <Text className="text-sm" style={{ 
        color: selectedCategory === category ? COLORS.surface : COLORS.text 
      }}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Text>
    </TouchableOpacity>
  ))}
</ScrollView>
        </View>

        {/* Category Filter
      
 */}
        {/* Tests List */}
        {filteredTests.length > 0 ? (
          <FlatList
            data={filteredTests}
            keyExtractor={item => item.id}
            renderItem={renderTestItem}
            contentContainerStyle={{ padding: 16 }}
          />
        ) : (
          <View className="flex-1 justify-center items-center p-8">
            <Feather name="alert-circle" size={48} style={{ color: COLORS.textLight, marginBottom: 16 }} />
            <Text className="text-lg font-medium" style={{ color: COLORS.text }}>Nenhum teste encontrado</Text>
            <Text className="text-sm mt-1" style={{ color: COLORS.textLight }}>Tente ajustar sua busca ou filtro</Text>
          </View>
        )}
      </View>
    );
  }

  if (selectedTest && quizQuestions.length > 0 && !quizFinished) {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;

    return (
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        className="flex-1 p-4 pb-6"
        style={{ backgroundColor: COLORS.background }}
      >
        {/* Progress Bar */}
        <View className="mb-6">
          <Text className="text-sm mb-1" style={{ color: COLORS.textLight }}>
            Questão {currentQuestionIndex + 1} de {quizQuestions.length}
          </Text>
          <View className="h-1.5 rounded-full" style={{ backgroundColor: COLORS.yellowLighten5 }}>
            <View 
              className="h-full rounded-full"
              style={{ 
                width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`,
                backgroundColor: COLORS.primary
              }}
            />
          </View>
        </View>

        {/* Question */}
        <View className="bg-surface rounded-xl p-4 mb-6 shadow-sm" style={{ 
          shadowColor: COLORS.text,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
          backgroundColor: COLORS.surface
        }}>
          <Text className="text-lg leading-6" style={{ color: COLORS.text }}>{currentQuestion.question}</Text>
        </View>

        {/* Options */}
        <View className="mb-6">
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              className={`border rounded-lg p-4 mb-3 ${selectedAnswer === index ? 'border-primary' : 'border-border'}`}
              style={[
                { backgroundColor: COLORS.surface },
                selectedAnswer === index && { backgroundColor: COLORS.yellowLighten5 },
                showExplanation && index === currentQuestion.correctAnswerIndex && { 
                  borderColor: COLORS.success,
                  backgroundColor: 'rgba(46, 204, 113, 0.1)'
                },
                showExplanation && selectedAnswer === index && selectedAnswer !== currentQuestion.correctAnswerIndex && { 
                  borderColor: COLORS.error,
                  backgroundColor: 'rgba(231, 76, 60, 0.1)'
                }
              ]}
              onPress={() => !showExplanation && setSelectedAnswer(index)}
              disabled={showExplanation}
            >
              <Text className="text-base" style={[
                { color: COLORS.text },
                selectedAnswer === index && { color: COLORS.primary, fontWeight: '500' },
                showExplanation && index === currentQuestion.correctAnswerIndex && { color: COLORS.success, fontWeight: '500' },
                showExplanation && selectedAnswer === index && selectedAnswer !== currentQuestion.correctAnswerIndex && { color: COLORS.error, fontWeight: '500' }
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Explanation */}
        {showExplanation && currentQuestion.explanation && (
          <View className="rounded-lg p-4 mb-6" style={{ backgroundColor: COLORS.yellowLighten5 }}>
            <Text className="text-base font-semibold mb-2" style={{ color: COLORS.primary }}>Explicação:</Text>
            <Text className="text-sm" style={{ color: COLORS.text }}>{currentQuestion.explanation}</Text>
          </View>
        )}

        {/* Actions */}
        <View className="mt-auto mb-6">
          {!showExplanation ? (
            <TouchableOpacity
              className={`rounded-lg p-4 items-center ${selectedAnswer === null ? 'opacity-50' : ''}`}
              style={{ backgroundColor: COLORS.primary }}
              onPress={checkAnswer}
              disabled={selectedAnswer === null}
            >
              <Text className="text-base font-semibold" style={{ color: COLORS.surface }}>Verificar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="rounded-lg p-4 items-center"
              style={{ backgroundColor: COLORS.primary }}
              onPress={nextQuestion}
            >
              <Text className="text-base font-semibold" style={{ color: COLORS.surface }}>
                {isLastQuestion ? 'Finalizar' : 'Próxima'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    );
  }

  if (quizFinished && selectedTest) {
    const percentage = (score / quizQuestions.length) * 100;
    const passed = percentage >= selectedTest.pointToAprove;

    return (
      <View className="flex-1 justify-center p-8" style={{ backgroundColor: COLORS.background }}>
        <View className="bg-surface rounded-xl p-6 items-center shadow-md" style={{
          shadowColor: COLORS.text,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
          backgroundColor: COLORS.surface
        }}>
          <View className="w-20 h-20 rounded-full justify-center items-center mb-4" style={{ 
            backgroundColor: passed ? COLORS.success : COLORS.error 
          }}>
            {passed ? (
              <Feather name="check" size={32} style={{ color: COLORS.surface }} />
            ) : (
              <Feather name="x" size={32} style={{ color: COLORS.surface }} />
            )}
          </View>
          
          <Text className="text-2xl font-bold mb-2 text-center" style={{ color: COLORS.text }}>
            {passed ? 'Parabéns!' : 'Tente novamente!'}
          </Text>
          
          <Text className="text-3xl font-bold mb-4" style={{ color: COLORS.primary }}>
            {score}/{quizQuestions.length} ({percentage.toFixed(0)}%)
          </Text>
          
          <Text className="text-base text-center mb-6" style={{ color: COLORS.textLight }}>
            {passed 
              ? 'Você atingiu a pontuação mínima necessária!'
              : `Você precisa de ${selectedTest.pointToAprove}% para aprovação`}
          </Text>
          
          <View className="w-full">
            <TouchableOpacity
              className="border rounded-lg p-4 items-center mb-3"
              style={{ borderColor: COLORS.border }}
              onPress={() => {
                setQuizStarted(false);
                setSelectedTest(null);
              }}
            >
              <Text className="text-base font-semibold" style={{ color: COLORS.text }}>Voltar aos testes</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="rounded-lg p-4 items-center"
              style={{ backgroundColor: COLORS.primary }}
              onPress={restartQuiz}
            >
              <Text className="text-base font-semibold" style={{ color: COLORS.surface }}>
                Refazer teste
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  surface: {
    backgroundColor: COLORS.surface
  },
  background: {
    backgroundColor: COLORS.background
  },
  text: {
    color: COLORS.text
  },
  textLight: {
    color: COLORS.textLight
  },
  primary: {
    backgroundColor: COLORS.primary
  },
  yellowLighten5: {
    backgroundColor: COLORS.yellowLighten5
  },
  border: {
    borderColor: COLORS.border
  },
  success: {
    backgroundColor: COLORS.success
  },
  error: {
    backgroundColor: COLORS.error
  }
});

export default QuizScreen;