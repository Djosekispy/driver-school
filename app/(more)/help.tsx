import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { MaterialIcons, AntDesign, Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/hooks/useColors';
import { useRouter } from 'expo-router';

const HelpSupportScreen = () => {
  const navigation = useRouter();

  const supportTopics = [
    {
      icon: <MaterialIcons name="help-outline" size={24} color={COLORS.primary} />,
      title: "Perguntas Frequentes",
      description: "Encontre respostas para as dúvidas mais comuns",
     action: () => Alert.alert(
    'Estamos Quase!',
    'Funcionalidade ainda não implementada',
    [
      {
        text: 'Cancelar',
        style: 'cancel'
      },
      {
        text: 'OK'
      }
    ]
  )

    },
    {
      icon: <Feather name="mail" size={24} color={COLORS.primary} />,
      title: "Contato por E-mail",
      description: "Envie suas dúvidas diretamente para nossa equipe",
      action: () => Linking.openURL('mailto:victordev8080@gmail.com')
    },
    {
      icon: <FontAwesome name="whatsapp" size={24} color={COLORS.primary} />,
      title: "Chat Online",
      description: "Converse em tempo real com nosso suporte",
      action: () => Linking.openURL('https://wa.me/244927023710')
    },
    {
      icon: <Ionicons name="document-text-outline" size={24} color={COLORS.primary} />,
      title: "Termos de Uso",
      description: "Consulte nossos termos e condições",
    action: () => navigation.push('/(more)/term')

    }
  ];

  const videoTutorials = [
    {
      title: "Como usar o chat de dúvidas",
      duration: "2:45"
    },
    {
      title: "Realizando testes práticos",
      duration: "4:20"
    },
    {
      title: "Acompanhando seu progresso",
      duration: "3:15"
    }
  ];

  return (
    <View className="flex-1 bg-white">
      {/* Cabeçalho com botão de voltar */}
      <View className="flex-row items-center px-4 py-3 border-b" style={{ borderColor: COLORS.border }}>
        <TouchableOpacity 
          onPress={() => navigation.back()}
          className="p-2 mr-2"
        >
          <AntDesign name="arrowleft" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text className="text-xl font-bold flex-1 text-center" style={{ color: COLORS.primary }}>
          Ajuda & Suporte
        </Text>
        <View className="w-8" />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Seção de tópicos de ajuda */}
        <View className="px-5 py-6">
          <Text className="text-lg font-bold mb-4" style={{ color: COLORS.text }}>
            Como podemos ajudar?
          </Text>
          
          {supportTopics.map((topic, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center p-4 mb-3 rounded-lg border"
              style={{ 
                borderColor: COLORS.border,
                backgroundColor: COLORS.surface
              }}
              onPress={topic.action}
            >
              <View className="w-10 h-10 rounded-full justify-center items-center mr-3" 
                style={{ backgroundColor: COLORS.yellowLighten5 }}>
                {topic.icon}
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold" style={{ color: COLORS.text }}>
                  {topic.title}
                </Text>
                <Text className="text-sm mt-1" style={{ color: COLORS.textLight }}>
                  {topic.description}
                </Text>
              </View>
              <AntDesign name="right" size={16} color={COLORS.textLight} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Seção de tutoriais em vídeo */}
        <View className="px-5 py-4 border-t" style={{ borderColor: COLORS.border }}>
          <Text className="text-lg font-bold mb-4" style={{ color: COLORS.text }}>
            Tutoriais em Vídeo
          </Text>
          
          {videoTutorials.map((video, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center p-3 mb-2 rounded-lg"
              style={{ backgroundColor: COLORS.surface }}
            >
              <View className="w-12 h-12 rounded-md justify-center items-center mr-3" 
                style={{ backgroundColor: COLORS.yellowLighten5 }}>
                <FontAwesome name="play-circle" size={24} color={COLORS.primary} />
              </View>
              <View className="flex-1">
                <Text className="text-base" style={{ color: COLORS.text }}>
                  {video.title}
                </Text>
              </View>
              <Text className="text-sm" style={{ color: COLORS.textLight }}>
                {video.duration}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Seção de contato emergencial */}
        <View className="px-5 py-6 mt-2 border-t" style={{ borderColor: COLORS.border }}>
          <Text className="text-lg font-bold mb-4" style={{ color: COLORS.text }}>
            Suporte Emergencial
          </Text>
          <View className="p-4 rounded-lg" style={{ backgroundColor: COLORS.yellowLighten5 }}>
            <Text className="text-sm mb-3" style={{ color: COLORS.text }}>
              Para problemas urgentes com sua conta ou pagamentos:
            </Text>
            <TouchableOpacity
              className="flex-row items-center py-2 px-3 rounded-md self-start"
              style={{ backgroundColor: COLORS.primary }}
              onPress={() => Linking.openURL('tel:+244927023710')}
            >
              <MaterialIcons name="phone" size={18} color="white" />
              <Text className="text-white ml-2 font-medium">
                Ligar para suporte
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HelpSupportScreen;