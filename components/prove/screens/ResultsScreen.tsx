import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS } from '../constants/colors';
import { TestResult } from '../types';
import { Feather, AntDesign } from '@expo/vector-icons';

export default function ResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const result = JSON.parse(params.result as string) as TestResult;

  return (
    <View style={styles.container}>
      <View style={styles.resultCard}>
        <Text style={styles.resultTitle}>
          {result.passed ? "Parabéns!" : "Quase lá!"}
        </Text>
        
        <View style={styles.resultScore}>
          <Text style={styles.resultScoreText}>{result.score}</Text>
          <Text style={styles.resultScoreLabel}>pontos</Text>
        </View>
        
        <View style={styles.resultStats}>
          <View style={styles.statItem}>
            <Feather name="check" size={20} color={COLORS.status.success} />
            <Text style={styles.statText}>
              {result.correctAnswers} corretas
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Feather name="x" size={20} color={COLORS.status.error} />
            <Text style={styles.statText}>
              {result.totalQuestions - result.correctAnswers} erradas
            </Text>
          </View>
          
          {result.timeSpent > 0 && (
            <View style={styles.statItem}>
              <Feather name="clock" size={20} color={COLORS.blue.darken2} />
              <Text style={styles.statText}>
                {Math.floor(result.timeSpent / 60)}m {result.timeSpent % 60}s
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.resultFeedback}>
          <Image
            source={
              result.passed
                ? require("../assets/success.png")
                : require("../assets/try-again.png")
            }
            style={styles.resultImage}
          />
          <Text style={styles.feedbackText}>
            {result.passed
              ? "Você está pronto para a estrada!"
              : "Estude mais um pouco e tente novamente!"}
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/test")}
        >
          <Text style={styles.actionButtonText}>
            {result.passed ? "Fazer Novo Teste" : "Tentar Novamente"}
          </Text>
          <AntDesign name="arrowright" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

