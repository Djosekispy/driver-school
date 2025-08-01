import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { AntDesign, MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/hooks/useColors';
import { useNavigation } from '@react-navigation/native';

const TrafficTipsScreen = () => {
  const navigation = useNavigation();

  const categories = [
    {
      title: "Sinais de Trânsito",
      icon: <MaterialIcons name="traffic" size={28} color={COLORS.primary} />,
      tips: [
        {
          title: "Placas de Regulamentação",
          content: "As placas redondas com borda vermelha indicam PROIBIÇÃO. Exemplos: 'Proibido Estacionar', 'Velocidade Máxima Permitida'. Desobedecê-las constitui infração grave.",
          image: require('@/assets/images/regulatory-signs.jpg')
        },
        {
          title: "Placas de Advertência",
          content: "Triangulares com fundo amarelo alertam sobre perigos à frente como curvas, cruzamentos ou animais na pista. Reduza a velocidade e fique atento!",
          image: require('@/assets/images/warning-signs.jpg')
        }
      ]
    },
    {
      title: "Direção Defensiva",
      icon: <FontAwesome name="shield" size={24} color={COLORS.primary} />,
      tips: [
        {
          title: "Regra dos 3 Segundos",
          content: "Mantenha pelo menos 3 segundos de distância do veículo à frente. Em condições ruins, aumente para 5-6 segundos. Conte '1001, 1002, 1003' quando o carro da frente passar por um ponto fixo.",
          image: require('@/assets/images/following-distance.jpg')
        },
        {
          title: "Ponto Cego",
          content: "Sempre verifique os pontos cebos girando a cabeça antes de mudar de faixa. Mesmo com espelhos ajustados corretamente, áreas inteiras ficam ocultas. Motociclistas são especialmente vulneráveis.",
          image: require('@/assets/images/blind-spot.jpg')
        }
      ]
    },
    {
      title: "Legislação",
      icon: <Ionicons name="document-text" size={24} color={COLORS.primary} />,
      tips: [
        {
          title: "Ultrapassagem Segura",
          content: "Só ultrapasse pela esquerda e em locais permitidos. A manobra deve ser concluída em até 5 segundos. Nunca ultrapasse em curvas, lombadas ou quando houver faixa contínua.",
          image: require('@/assets/images/overtaking.png')
        },
        {
          title: "Alcoolemia",
          content: "O limite legal é 0.3g/L de álcool no sangue (≈1 dose). Acima disso: infração gravíssima (7 pontos) + multa 10x maior. Acima de 0.6g/L: crime de trânsito com detenção.",
          image: require('@/assets/images/alcohol-test.jpg')
        }
      ]
    }
  ];

  const specialTips = [
    {
      title: "Chuva Forte",
      content: "Reduza a velocidade em 20-30%. Acione o ar-condicionado no frio para desembaçar vidros. Se a visibilidade zerar, pare em local seguro com pisca-alerta.",
      icon: <FontAwesome name="umbrella" size={20} color={COLORS.primary} />
    },
    {
      title: "Neblina",
      content: "Use farol baixo (nunca alto) e luz de neblina traseira. Mantenha 10m de distância do veículo à frente (use as faixas da pista como referência).",
      icon: <MaterialIcons name="cloud" size={20} color={COLORS.primary} />
    },
    {
      title: "Freio Falhando",
      content: "Bombeie o pedal para recuperar pressão. Use o freio motor reduzindo marchas gradualmente. Como último recurso, esfregue o pneu no meio-fio para parar.",
      icon: <MaterialIcons name="warning" size={20} color={COLORS.primary} />
    }
  ];

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.background }}>
      {/* Cabeçalho */}
      <View className="flex-row items-center px-4 py-3 border-b" style={{ borderColor: COLORS.border }}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="p-2 mr-2"
        >
          <AntDesign name="arrowleft" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text className="text-xl font-bold flex-1 text-center" style={{ color: COLORS.primary }}>
          Dicas de Trânsito
        </Text>
        <View className="w-8" />
      </View>

      {/* Conteúdo principal */}
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Introdução */}
        <View className="my-5 p-4 rounded-lg" style={{ backgroundColor: COLORS.yellowLighten5 }}>
          <Text className="text-base italic" style={{ color: COLORS.text }}>
            "Dirigir com segurança é uma habilidade que se constrói com conhecimento e prática. Estas dicas podem salvar vidas - sua e dos outros."
          </Text>
        </View>

        {/* Categorias */}
        {categories.map((category, catIndex) => (
          <View key={catIndex} className="mb-8">
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 rounded-full justify-center items-center mr-3" 
                style={{ backgroundColor: COLORS.yellowLighten5 }}>
                {category.icon}
              </View>
              <Text className="text-xl font-bold" style={{ color: COLORS.primary }}>
                {category.title}
              </Text>
            </View>

            {category.tips.map((tip, tipIndex) => (
              <View key={tipIndex} className="mb-6 border rounded-lg p-4" 
                style={{ borderColor: COLORS.border, backgroundColor: COLORS.surface }}>
                <Text className="text-lg font-semibold mb-2" style={{ color: COLORS.primary }}>
                  {tip.title}
                </Text>
                <Image 
                  source={tip.image} 
                  className="w-full h-48 rounded-md mb-3"
                  resizeMode="cover"
                />
                <Text className="text-base leading-6" style={{ color: COLORS.text }}>
                  {tip.content}
                </Text>
              </View>
            ))}
          </View>
        ))}

        {/* Dicas rápidas */}
        <View className="mb-8">
          <Text className="text-xl font-bold mb-4" style={{ color: COLORS.primary }}>
            Dicas Rápidas para Emergências
          </Text>
          
          {specialTips.map((tip, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-start p-3 mb-3 rounded-lg border"
              style={{ borderColor: COLORS.border, backgroundColor: COLORS.surface }}
            >
              <View className="w-8 h-8 rounded-full justify-center items-center mr-3 mt-1" 
                style={{ backgroundColor: COLORS.yellowLighten5 }}>
                {tip.icon}
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold" style={{ color: COLORS.primary }}>
                  {tip.title}
                </Text>
                <Text className="text-sm mt-1" style={{ color: COLORS.text }}>
                  {tip.content}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Rodapé educativo */}
        <View className="p-4 rounded-lg" style={{ backgroundColor: COLORS.primary }}>
          <Text className="text-white text-center font-bold mb-2">
            VOCÊ SABIA?
          </Text>
          <Text className="text-white text-center text-sm">
            Segundo a OMS, 90% dos acidentes são causados por falha humana. Aprender e aplicar essas dicas reduz em 60% seu risco de acidente.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default TrafficTipsScreen;