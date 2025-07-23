import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Feather, MaterialIcons, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { mockProgressDetails, mockPerformanceData, mockRecentActivities } from '../data/progress.mock';
import { COLORS } from '@/hooks/useColors';
import { useRouter } from 'expo-router';

const ProgressDetailScreen = () => {
      const router = useRouter()
  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.background }}>
      {/* Header */}
      <View className="flex-row justify-between items-center p-5 bg-white">
        <View className="flex-row items-center">
          <TouchableOpacity className="mr-4"
          onPress={()=>router.back()}
          >
            <Feather name="arrow-left" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text className="text-xl font-bold" style={{ color: COLORS.text }}>Meu Progresso</Text>
        </View>
        <TouchableOpacity>
          <Feather name="share-2" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Resumo do Progresso */}
        <View className="mb-6 p-5 rounded-xl" style={{ backgroundColor: COLORS.surface }}>
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold" style={{ color: COLORS.text }}>Visão Geral</Text>
            <Text className="text-sm" style={{ color: COLORS.primary }}>Últimos 30 dias</Text>
          </View>

          <View className="flex-row justify-between mb-6">
            <View className="items-center">
              <Text className="text-3xl font-bold" style={{ color: COLORS.primary }}>{mockProgressDetails.percentage}%</Text>
              <Text className="text-sm" style={{ color: COLORS.textLight }}>Progresso total</Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl font-bold" style={{ color: COLORS.success }}>{mockProgressDetails.completed}</Text>
              <Text className="text-sm" style={{ color: COLORS.textLight }}>Aulas concluídas</Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl font-bold" style={{ color: COLORS.info }}>{mockProgressDetails.hours}</Text>
              <Text className="text-sm" style={{ color: COLORS.textLight }}>Horas estudadas</Text>
            </View>
          </View>

          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-sm mb-1" style={{ color: COLORS.textLight }}>Próximo objetivo</Text>
              <Text className="font-medium" style={{ color: COLORS.text }}>{mockProgressDetails.nextGoal}</Text>
            </View>
            <TouchableOpacity className="px-4 py-2 rounded-full" style={{ backgroundColor: COLORS.yellowLighten5 }}>
              <Text className="font-medium" style={{ color: COLORS.primary }}>Ver metas</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Desempenho por Categoria */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold" style={{ color: COLORS.text }}>Desempenho por Categoria</Text>
            <TouchableOpacity>
              <Text className="text-sm" style={{ color: COLORS.primary }}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-white rounded-xl p-4">
            {mockPerformanceData.map((category, index) => (
              <View key={category.id} className={`${index !== mockPerformanceData.length - 1 ? 'border-b border-gray-100 pb-4 mb-4' : ''}`}>
                <View className="flex-row justify-between items-center mb-2">
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-full justify-center items-center mr-3" 
                      style={{ backgroundColor: COLORS.yellowLighten5 }}>
                      <MaterialIcons name={category.icon} size={16} color={COLORS.primary} />
                    </View>
                    <Text style={{ color: COLORS.text }}>{category.name}</Text>
                  </View>
                  <Text style={{ color: category.score >= 70 ? COLORS.success : COLORS.error }}>
                    {category.score}%
                  </Text>
                </View>
                <View className="h-2 rounded-full bg-gray-100">
                  <View 
                    className="h-2 rounded-full" 
                    style={{ 
                      width: `${category.score}%`,
                      backgroundColor: category.score >= 70 ? COLORS.success : COLORS.error
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Estatísticas de Aprendizado */}
        <View className="mb-6 p-5 rounded-xl" style={{ backgroundColor: COLORS.surface }}>
          <Text className="text-lg font-semibold mb-4" style={{ color: COLORS.text }}>Estatísticas de Aprendizado</Text>
          
          <View className="flex-row justify-between mb-6">
            <View className="items-center">
              <View className="w-16 h-16 rounded-full justify-center items-center mb-2" 
                style={{ backgroundColor: COLORS.yellowLighten5 }}>
                <AntDesign name="clockcircleo" size={20} color={COLORS.primary} />
              </View>
              <Text className="text-xl font-bold" style={{ color: COLORS.text }}>{mockProgressDetails.avgTime}</Text>
              <Text className="text-xs text-center" style={{ color: COLORS.textLight }}>Tempo médio por aula</Text>
            </View>
            
            <View className="items-center">
              <View className="w-16 h-16 rounded-full justify-center items-center mb-2" 
                style={{ backgroundColor: COLORS.yellowLighten5 }}>
                <FontAwesome5 name="redo" size={20} color={COLORS.primary} />
              </View>
              <Text className="text-xl font-bold" style={{ color: COLORS.text }}>{mockProgressDetails.reviewCount}</Text>
              <Text className="text-xs text-center" style={{ color: COLORS.textLight }}>Revisões feitas</Text>
            </View>
            
            <View className="items-center">
              <View className="w-16 h-16 rounded-full justify-center items-center mb-2" 
                style={{ backgroundColor: COLORS.yellowLighten5 }}>
                <Feather name="award" size={20} color={COLORS.primary} />
              </View>
              <Text className="text-xl font-bold" style={{ color: COLORS.text }}>{mockProgressDetails.streak}</Text>
              <Text className="text-xs text-center" style={{ color: COLORS.textLight }}>Dias consecutivos</Text>
            </View>
          </View>
        </View>

        {/* Atividades Recentes */}
        <View className="mb-8">
          <Text className="text-lg font-semibold mb-4" style={{ color: COLORS.text }}>Atividades Recentes</Text>
          
          {mockRecentActivities.map((activity) => (
            <View key={activity.id} className="flex-row items-start mb-4">
              <View className="w-10 h-10 rounded-full justify-center items-center mr-3 mt-1" 
                style={{ backgroundColor: COLORS.yellowLighten5 }}>
                <Feather name={activity.icon} size={16} color={COLORS.primary} />
              </View>
              <View className="flex-1">
                <Text className="font-medium" style={{ color: COLORS.text }}>{activity.title}</Text>
                <Text className="text-sm mb-1" style={{ color: COLORS.textLight }}>{activity.description}</Text>
                <Text className="text-xs" style={{ color: COLORS.textLight }}>{activity.time}</Text>
              </View>
              {activity.completed && (
                <Feather name="check-circle" size={20} color={COLORS.success} />
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default ProgressDetailScreen;