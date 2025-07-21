import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Modal,
  StyleSheet,
  Animated,
} from 'react-native';
import { Clock, Award, BookOpen, ChevronRight, BarChart2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { TestConfig } from '../types/types';
import { COLORS } from '@/constants/Colors';

const testConfigs: TestConfig[] = [
  {
    title: "Teste Rápido (10 Questões)",
    description: "Um quiz rápido para testar seus conhecimentos básicos.",
    totalQuestions: 10,
    categories: ["Regulamentação", "Perigo"],
    isTimed: false,
  },
  {
    title: "Desafio Cronometrado (5 Minutos)",
    description: "Responda o máximo de perguntas em 5 minutos!",
    totalQuestions: 20,
    categories: ["Todos"],
    isTimed: true,
    totalTime: 300, // 5 minutos
  },
  {
    title: "Sinais de Prioridade",
    description: "Focado em sinais de regulamentação de prioridade.",
    totalQuestions: 15,
    categories: ["Regulamentação"],
    isTimed: false,
  },
];

export default function TestScreen() {
  const router = useRouter();
  const [selectedTest, setSelectedTest] = useState<TestConfig | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleStartTest = (test: TestConfig) => {
    setSelectedTest(test);
    // Navegar para a página do teste com os parâmetros
    router.push({
      pathname: "/test/quiz",
      params: {
        config: JSON.stringify(test),
      },
    });
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Header */}


      {/* Cards de Testes */}
      <ScrollView contentContainerStyle={styles.testContainer}>
        {testConfigs.map((test, index) => (
          <TouchableOpacity
            key={index}
            style={styles.testCard}
            onPress={() => handleStartTest(test)}
            activeOpacity={0.7}
          >
            <View style={styles.testIcon}>
              {test.isTimed ? (
                <Clock size={24} color={COLORS.blue.darken3} />
              ) : (
                <BookOpen size={24} color={COLORS.blue.darken3} />
              )}
            </View>
            <View style={styles.testInfo}>
              <Text style={styles.testTitle}>{test.title}</Text>
              <Text style={styles.testDescription}>{test.description}</Text>
              <View style={styles.testMeta}>
                <Text style={styles.testMetaText}>
                  {test.totalQuestions} questões
                </Text>
                {test.isTimed && (
                  <Text style={styles.testMetaText}>
                    {test.totalTime! / 60} minutos
                  </Text>
                )}
              </View>
            </View>
            <ChevronRight size={20} color={COLORS.text.secondary} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Rodapé com estatísticas */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.statsButton}
          onPress={() => router.push("/test/results")}
        >
          <BarChart2 size={20} color={COLORS.text.light} />
          <Text style={styles.statsButtonText}>Ver Meus Resultados</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  header: {
    padding: 20,
    backgroundColor: COLORS.blue.darken3,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text.light,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.blue.lighten4,
    marginTop: 4,
  },
  testContainer: {
    padding: 16,
  },
  testCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  testIcon: {
    backgroundColor: COLORS.blue.lighten5,
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  testInfo: {
    flex: 1,
  },
  testTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  testDescription: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  testMeta: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
  },
  testMetaText: {
    fontSize: 12,
    color: COLORS.blue.darken2,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.blue.lighten3,
  },
  statsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.blue.darken2,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  statsButtonText: {
    color: COLORS.text.light,
    fontWeight: '500',
  },
});