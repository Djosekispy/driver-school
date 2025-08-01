import React from 'react';
import { View, Text, ScrollView, Image, Linking, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome, Ionicons, Feather, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { COLORS } from '@/hooks/useColors';
import { useRouter } from 'expo-router';


const AboutScreen = () => {

    const navigation = useRouter()
  const features = [
    {
      icon: <MaterialIcons name="traffic" size={28} color={COLORS.primary} />,
      title: "Sinais de Trânsito",
      description: "Aprenda todos os sinais de trânsito com imagens e explicações detalhadas"
    },
    {
      icon: <FontAwesome name="youtube-play" size={28} color={COLORS.primary} />,
      title: "Videoaulas",
      description: "Aulas completas com instrutores especializados"
    },
    {
      icon: <Ionicons name="chatbubbles" size={28} color={COLORS.primary} />,
      title: "Chat Inteligente",
      description: "Tire suas dúvidas em tempo real com nosso assistente virtual"
    },
    {
      icon: <MaterialCommunityIcons name="progress-check" size={28} color={COLORS.primary} />,
      title: "Acompanhamento",
      description: "Monitore seu progresso e identifique pontos de melhoria"
    }
  ];

  const openWebsite = () => {
    Linking.openURL('https://osvaldodev.vercel.app/');
  };

  const contactSupport = () => {
    Linking.openURL('mailto:victordev8080@gmail.com');
  };

  return (
   <View className="flex-1">
      {/* Cabeçalho */}
          <View 
        className="flex-row items-center px-4 py-3 border-b"
        style={{ backgroundColor: COLORS.surface, borderColor: COLORS.border }}
      >
        <TouchableOpacity 
          onPress={() => navigation.back()}
          className="p-2 mr-2"
        >
          <AntDesign name="arrowleft" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text 
          className="text-xl font-bold flex-1 text-center"
          style={{ color: COLORS.primary }}
        >
          Sobre o App
        </Text>
        <View className="w-8" /> {/* Espaço para alinhamento */}
      </View>
  <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
      <View 
        className="items-center px-8 py-12 border-b"
        style={{ backgroundColor: COLORS.surface, borderColor: COLORS.border }}
      >
        <Image 
          source={require('@/assets/images/icon.png')}
          className="w-24 h-24 mb-4"
        />
        <Text 
          className="text-3xl font-bold mb-2"
          style={{ color: COLORS.primary }}
        >
          DriveLearn
        </Text>
        <Text 
          className="text-base text-center"
          style={{ color: COLORS.textLight }}
        >
          Sua jornada para se tornar um motorista exemplar
        </Text>
      </View>

      {/* Sobre o app */}
      <View className="px-6 py-8 border-b" style={{ borderColor: COLORS.border }}>
        <Text 
          className="text-sm font-semibold tracking-wider mb-4 uppercase"
          style={{ color: COLORS.primary }}
        >
          Sobre o Aplicativo
        </Text>
        <Text 
          className="text-base leading-6"
          style={{ color: COLORS.text }}
        >
          O DriveLearn é a plataforma mais completa para quem está aprendendo a dirigir. 
          Desenvolvido por especialistas em educação no trânsito, nosso aplicativo combina 
          tecnologia e pedagogia para oferecer a melhor experiência de aprendizado.
        </Text>
      </View>

      {/* Recursos */}
      <View className="px-6 py-8 border-b" style={{ borderColor: COLORS.border }}>
        <Text 
          className="text-sm font-semibold tracking-wider mb-4 uppercase"
          style={{ color: COLORS.primary }}
        >
          Recursos Principais
        </Text>
        
        {features.map((feature, index) => (
          <View key={index} className="flex-row items-start mb-6">
            <View 
              className="w-12 h-12 rounded-full justify-center items-center mr-4"
              style={{ backgroundColor: COLORS.yellowLighten5 }}
            >
              {feature.icon}
            </View>
            <View className="flex-1">
              <Text 
                className="text-lg font-semibold mb-1"
                style={{ color: COLORS.text }}
              >
                {feature.title}
              </Text>
              <Text 
                className="text-sm leading-5"
                style={{ color: COLORS.textLight }}
              >
                {feature.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Contato */}
      <View className="px-6 py-8 border-b" style={{ borderColor: COLORS.border }}>
        <Text 
          className="text-sm font-semibold tracking-wider mb-4 uppercase"
          style={{ color: COLORS.primary }}
        >
          Contacto
        </Text>
        
        <TouchableOpacity 
          className="flex-row items-center p-4 rounded-lg mb-3"
          style={{ backgroundColor: COLORS.primary }}
          onPress={openWebsite}
        >
          <Feather name="globe" size={20} color={COLORS.surface} />
          <Text 
            className="text-base font-medium ml-3"
            style={{ color: COLORS.surface }}
          >
            www.drivelearn.ao
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="flex-row items-center p-4 rounded-lg"
          style={{ backgroundColor: COLORS.primary }}
          onPress={contactSupport}
        >
          <MaterialIcons name="email" size={20} color={COLORS.surface} />
          <Text 
            className="text-base font-medium ml-3"
            style={{ color: COLORS.surface }}
          >
            support@drivelearn.ao
          </Text>
        </TouchableOpacity>
      </View>

      {/* Rodapé */}
      <View className="px-6 py-6">
        <Text 
          className="text-xs text-center mb-1"
          style={{ color: COLORS.textLight }}
        >
          Versão 2.3.4
        </Text>
        <Text 
          className="text-xs text-center"
          style={{ color: COLORS.textLight }}
        >
          © {new Date().getFullYear()} DriveLearn. Todos os direitos reservados.
        </Text>
      </View>
    </ScrollView>
    </View>
  );
};

export default AboutScreen;