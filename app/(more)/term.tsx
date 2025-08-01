import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/hooks/useColors';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

const TermsConditionsScreen = () => {
  const navigation = useRouter();

  const sections = [
    {
      title: "1. Aceitação dos Termos",
      content: "Ao utilizar o aplicativo DriveLearn, você concorda automaticamente com estes Termos e Condições. Se não concordar, por favor, não utilize nosso serviço."
    },
    {
      title: "2. Uso do Aplicativo",
      content: "O DriveLearn é destinado exclusivamente para fins educacionais de aprendizagem de direção. Proíbe-se qualquer uso comercial ou não autorizado."
    },
    {
      title: "3. Conta do Usuário",
      content: "Você é responsável por manter a confidencialidade de sua conta e senha. Todas as atividades realizadas com sua conta são de sua responsabilidade."
    },
    {
      title: "4. Conteúdo Educacional",
      content: "Todo o material fornecido pelo DriveLearn é para fins educacionais e não substitui a formação em autoescola credenciada."
    },
    {
      title: "5. Pagamentos e Assinaturas",
      content: "Os planos premium são cobrados conforme selecionado. Não oferecemos reembolsos por serviços já utilizados."
    },
    {
      title: "6. Privacidade de Dados",
      content: "Nós coletamos apenas dados necessários para o funcionamento do aplicativo. Consulte nossa Política de Privacidade para mais detalhes."
    },
    {
      title: "7. Modificações",
      content: "Podemos alterar estes Termos a qualquer momento. Alterações significativas serão comunicadas aos usuários."
    },
    {
      title: "8. Limitação de Responsabilidade",
      content: "O DriveLearn não se responsabiliza por decisões de trânsito tomadas pelo usuário com base no conteúdo do aplicativo."
    }
  ];

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.background }}>
      {/* Cabeçalho */}
      <View className="flex-row items-center px-4 py-3 border-b" style={{ borderColor: COLORS.border }}>
        <TouchableOpacity 
          onPress={() => navigation.back()}
          className="p-2 mr-2"
        >
          <AntDesign name="arrowleft" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text className="text-xl font-bold flex-1 text-center" style={{ color: COLORS.primary }}>
          Termos e Condições
        </Text>
        <View className="w-8" />
      </View>

      {/* Conteúdo principal */}
      <ScrollView className="flex-1 px-5 py-4" contentContainerStyle={{ paddingBottom: 30 }}>
        <View className="mb-6">
          <Text className="text-2xl font-bold mb-1" style={{ color: COLORS.primary }}>
            Termos de Uso
          </Text>
          <Text className="text-sm" style={{ color: COLORS.textLight }}>
            Última atualização: {new Date().toLocaleDateString('pt-AO')}
          </Text>
        </View>

        <View className="mb-6 p-4 rounded-lg" style={{ backgroundColor: COLORS.yellowLighten5 }}>
          <Text className="text-sm italic" style={{ color: COLORS.text }}>
            "Por favor, leia atentamente estes Termos e Condições antes de utilizar o aplicativo DriveLearn. Seu acesso e uso estão condicionados à aceitação destes termos."
          </Text>
        </View>

        {/* Seções dos termos */}
        {sections.map((section, index) => (
          <View key={index} className="mb-5">
            <Text className="text-lg font-semibold mb-2" style={{ color: COLORS.primary }}>
              {section.title}
            </Text>
            <Text className="text-base leading-6" style={{ color: COLORS.text }}>
              {section.content}
            </Text>
          </View>
        ))}

        {/* Aceitação */}
        <View className="mt-6 p-5 rounded-lg border" style={{ borderColor: COLORS.border }}>
          <View className="flex-row items-start mb-3">
            <MaterialIcons name="warning" size={20} color={COLORS.yellowDarken4} />
            <Text className="text-sm flex-1 ml-2" style={{ color: COLORS.text }}>
              Ao continuar usando o DriveLearn, você confirma que leu, compreendeu e concordou com estes Termos e Condições.
            </Text>
          </View>
          
          <TouchableOpacity
            className="py-3 px-5 rounded-lg items-center mt-2"
            style={{ backgroundColor: COLORS.primary }}
            onPress={() => navigation.back()}
          >
            <Text className="text-base font-medium" style={{ color: COLORS.surface }}>
              Eu Concordo
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default TermsConditionsScreen;