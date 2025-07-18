import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import DashboardHeader from '../ui/DashboardHeader';
import ProgressCard from '../ui/ProgressCard';
import SectionHeader from '../ui/SectionHeader';
import RecentTests from '../ui/RecentTests';
import LearningModules from '../ui/LearningModules';
import DailyTip from '../ui/DailyTip';
import TrafficSigns from '../ui/TrafficSigns';
import { COLORS } from '@/constants/Colors';

const DashboardScreen = () => {
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: COLORS.blue.lighten5 }}>
      <ScrollView className="px-4 py-2">
        {/* Cabeçalho */}
        <DashboardHeader userName="João" />
        
        {/* Cartão de Progresso */}
        <ProgressCard progress={72} testsCompleted={15} signsLearned={42} hoursPracticed={8.5} />
        
        {/* Seção de Testes Recentes */}
        <SectionHeader title="Testes Recentes" actionText="Ver todos" />
        <RecentTests />
        
        {/* Módulos de Aprendizado */}
        <SectionHeader title="Continue Aprendendo" />
        <LearningModules />
        
        {/* Dica do Dia */}
        <DailyTip />
        
        {/* Sinais de Trânsito */}
        <SectionHeader title="Sinais de Trânsito" actionText="Ver todos" />
        <TrafficSigns />
        
        {/* Espaço no final para scroll */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;