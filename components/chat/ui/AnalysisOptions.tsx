import { COLORS } from '@/constants/Colors';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';

type AnalysisOptionsProps = {
  onClose: () => void;
  onAnalyze: (type: 'sign' | 'situation' | 'infraction') => void;
};

const AnalysisOptions = ({ onClose, onAnalyze }: AnalysisOptionsProps) => {
  return (
    <Modal transparent animationType="slide">
      <View className="flex-1 justify-end bg-black bg-opacity-50">
        <View className="bg-white rounded-t-3xl p-6">
          <Text className="text-lg font-bold mb-4 text-center" style={{ color: COLORS.text.primary }}>
            O que você gostaria de analisar?
          </Text>
          
          <AnalysisButton 
            icon="traffic-light"
            title="Sinal de Trânsito"
            description="Identificar e explicar sinais"
            onPress={() => onAnalyze('sign')}
            color={COLORS.blue.accent2}
          />
          
          <AnalysisButton 
            icon="car"
            title="Situação de Trânsito"
            description="Analisar cenário e dar recomendações"
            onPress={() => onAnalyze('situation')}
            color={COLORS.blue.accent3}
          />
          
          <AnalysisButton 
            icon="warning"
            title="Possível Infração"
            description="Verificar violações de trânsito"
            onPress={() => onAnalyze('infraction')}
            color={COLORS.blue.accent4}
          />
          
          <TouchableOpacity 
            className="mt-4 py-3 rounded-lg border border-gray-300"
            onPress={onClose}
          >
            <Text className="text-center font-medium" style={{ color: COLORS.text.primary }}>
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const AnalysisButton = ({ icon, title, description, onPress, color }: any) => (
  <TouchableOpacity 
    className="flex-row items-center p-3 mb-3 rounded-lg border border-gray-200"
    onPress={onPress}
    style={{ borderLeftWidth: 4, borderLeftColor: color }}
  >
    <View className="mr-3">
      <MaterialCommunityIcons name={icon} size={24} color={color} />
    </View>
    <View className="flex-1">
      <Text className="font-bold" style={{ color: COLORS.text.primary }}>{title}</Text>
      <Text className="text-sm" style={{ color: COLORS.text.secondary }}>{description}</Text>
    </View>
    <MaterialIcons name="chevron-right" size={24} color={COLORS.text.secondary} />
  </TouchableOpacity>
);

export default AnalysisOptions;