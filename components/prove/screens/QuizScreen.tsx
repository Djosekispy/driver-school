import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Question, TestConfig, TestResult } from '../types/types';
import { COLORS } from '@/constants/Colors';

const mockQuestions: Question[] = [
  {
    id: '1',
    question: "O que indica este sinal?",
    image: "https://exemplo.com/sinal-paragem.jpg",
    options: [
      "Paragem obrigatória",
      "Cedência de passagem",
      "Via reservada a autocarros",
    ],
    correctAnswer: 0,
    category: "Regulamentação",
    points: 10,
    timeLimit: 30,
  },
];

export default function QuizScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const testConfig = JSON.parse(params.config as string) as TestConfig;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(testConfig.isTimed ? testConfig.totalTime! : 0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const currentQuestion = mockQuestions[currentQuestionIndex];

  useEffect(() => {
    if (!testConfig.isTimed) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentQuestionIndex + 1) / testConfig.totalQuestions,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [currentQuestionIndex]);

  const handleAnswer = (optionIndex: number) => {
    if (isAnswered) return;

    setSelectedOption(optionIndex);
    setIsAnswered(true);

    const isCorrect = optionIndex === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + currentQuestion.points);
    }

    setTimeout(() => {
      goToNextQuestion();
    }, 1500);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < testConfig.totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      finishTest();
    }
  };

  const handleTimeUp = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    Alert.alert(
      "Tempo esgotado!",
      "O tempo acabou. Vamos ver seus resultados.",
      [{ text: "OK", onPress: finishTest }]
    );
  };

  const finishTest = () => {
    const result: TestResult = {
      score,
      correctAnswers: Math.round(score / 10),
      totalQuestions: testConfig.totalQuestions,
      timeSpent: testConfig.isTimed ? testConfig.totalTime! - timeLeft : 0,
      passed: score >= testConfig.totalQuestions * 7,
    };

    router.push({
      pathname: "/test/results",
      params: {
        result: JSON.stringify(result),
      },
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View className="flex-1 bg-white">
      {/* Barra de Progresso */}
      <View className="w-full h-2 bg-gray-200">
        <Animated.View
          className="h-full"
          style={{
            backgroundColor: COLORS.blue.default,
            width: progressAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          }}
        />
      </View>

      {/* Header com tempo e pontuação */}
      <View className="flex-row justify-between px-4 py-3 border-b border-gray-200">
        <View className="items-center">
          <Text className="text-xs" style={{ color: COLORS.text.secondary }}>
            Questão
          </Text>
          <Text className="font-bold" style={{ color: COLORS.text.primary }}>
            {currentQuestionIndex + 1}/{testConfig.totalQuestions}
          </Text>
        </View>
        
        <View className="items-center">
          <Text className="text-xs" style={{ color: COLORS.text.secondary }}>
            Pontos
          </Text>
          <Text className="font-bold" style={{ color: COLORS.text.primary }}>
            {score}
          </Text>
        </View>
        
        {testConfig.isTimed && (
          <View className="items-center">
            <Text className="text-xs" style={{ color: COLORS.text.secondary }}>
              Tempo
            </Text>
            <Text className="font-bold" style={{ color: COLORS.text.primary }}>
              {formatTime(timeLeft)}
            </Text>
          </View>
        )}
      </View>

      {/* Questão atual */}
      <View className="p-4">
        <View 
          className="self-start px-2 py-1 rounded-full mb-3"
          style={{ backgroundColor: COLORS.blue.lighten5 }}
        >
          <Text className="text-xs" style={{ color: COLORS.blue.darken3 }}>
            {currentQuestion.category}
          </Text>
        </View>
        
        <Text className="text-lg font-bold mb-3" style={{ color: COLORS.text.primary }}>
          {currentQuestion.question}
        </Text>
        
        {currentQuestion.image && (
          <Image
            source={{ uri: currentQuestion.image }}
            className="w-full h-40 mb-4 rounded-lg"
            resizeMode="contain"
          />
        )}
      </View>

      {/* Opções de resposta */}
      <View className="px-4">
        {currentQuestion.options.map((option, index) => {
          const isCorrect = index === currentQuestion.correctAnswer;
          const isSelected = selectedOption === index;
          
          let optionClasses = "bg-white border border-gray-300";
          let textClasses = "text-gray-800";
          
          if (isAnswered) {
            if (isCorrect) {
              optionClasses = "bg-green-100 border-green-500";
              textClasses = "text-green-800";
            } else if (isSelected && !isCorrect) {
              optionClasses = "bg-red-100 border-red-500";
              textClasses = "text-red-800";
            }
          } else if (isSelected) {
            optionClasses = "bg-blue-100 border-blue-500";
          }

          return (
            <TouchableOpacity
              key={index}
              className={`p-4 mb-3 rounded-lg ${optionClasses}`}
              style={{
                borderWidth: 1,
                borderColor: isAnswered
                  ? isCorrect
                    ? COLORS.status.success
                    : isSelected
                    ? COLORS.status.error
                    : '#d1d5db'
                  : isSelected
                  ? COLORS.blue.default
                  : '#d1d5db',
                backgroundColor: isAnswered
                  ? isCorrect
                    ? COLORS.status.success + '20'
                    : isSelected
                    ? COLORS.status.error + '20'
                    : 'white'
                  : isSelected
                  ? COLORS.blue.lighten5
                  : 'white',
              }}
              onPress={() => handleAnswer(index)}
              disabled={isAnswered}
            >
              <Text className={textClasses}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}