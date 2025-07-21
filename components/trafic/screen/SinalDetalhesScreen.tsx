import { View, Text, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { ArrowLeft, Bookmark, Share2, AlertCircle, Video, Info, ChevronRight } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS } from '@/constants/Colors';


interface propsId{
    id : string
}

export default function SinalDetalhesScreen({id}: propsId) {
  const router = useRouter();
  
  const sinal = {
    id: '1',
    nome: 'Paragem Obrigatória',
    imagem: 'https://randomuser.me/api/portraits/men/13.jpg',
    descricao: 'Exige paragem completa do veículo antes da linha de paragem.',
    multa: '15.000 AOA',
    importancia: 'Alta prioridade',
    videos: ['https://youtube.com/exemplo']
  };

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.background.light }}>
      {/* Header */}
      <View 
        className="flex-row items-center px-6 py-4"
        style={{ backgroundColor: COLORS.blue.darken3 }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={COLORS.text.light} />
        </TouchableOpacity>
        
        <Text 
          className="text-xl font-bold ml-4 flex-1" 
          style={{ color: COLORS.text.light }}
        >
          {sinal.nome}
        </Text>
        
        <TouchableOpacity className="ml-3">
          <Bookmark size={22} color={COLORS.blue.lighten2} />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* Imagem Principal */}
        <View className="items-center p-6">
          <View 
            className="p-2 rounded-xl shadow-lg"
            style={{ 
              backgroundColor: 'white',
              shadowColor: COLORS.blue.darken4,
              elevation: 6
            }}
          >
            <Image
              source={{ uri: sinal.imagem }}
              className="w-64 h-64"
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Seção de Informações */}
        <View className="px-6 pb-8">
          {/* Descrição */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Info size={20} color={COLORS.blue.darken3} />
              <Text 
                className="text-lg font-bold ml-2"
                style={{ color: COLORS.blue.darken4 }}
              >
                Descrição Oficial
              </Text>
            </View>
            <Text 
              className="text-base leading-6"
              style={{ color: COLORS.text.primary }}
            >
              {sinal.descricao}
            </Text>
          </View>

          {/* Destaques */}
          <View 
            className="p-4 rounded-xl mb-6"
            style={{ backgroundColor: COLORS.blue.lighten5 }}
          >
            <View className="flex-row items-start mb-3">
              <AlertCircle size={20} color={COLORS.status.warning} />
              <Text 
                className="text-lg font-bold ml-2"
                style={{ color: COLORS.blue.darken4 }}
              >
                Informações Importantes
              </Text>
            </View>
            
            <View className="space-y-3">
              <View className="flex-row">
                <Text 
                  className="font-medium"
                  style={{ color: COLORS.blue.darken3 }}
                >
                  Multa:
                </Text>
                <Text 
                  className="ml-2"
                  style={{ color: COLORS.status.error }}
                >
                  {sinal.multa}
                </Text>
              </View>
              
              <View className="flex-row">
                <Text 
                  className="font-medium"
                  style={{ color: COLORS.blue.darken3 }}
                >
                  Prioridade:
                </Text>
                <Text 
                  className="ml-2"
                  style={{ color: COLORS.blue.darken4 }}
                >
                  {sinal.importancia}
                </Text>
              </View>
            </View>
          </View>

          {/* Vídeo Explicativo */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Video size={20} color={COLORS.blue.darken3} />
              <Text 
                className="text-lg font-bold ml-2"
                style={{ color: COLORS.blue.darken4 }}
              >
                Vídeo Explicativo
              </Text>
            </View>
            
            <TouchableOpacity
              className="flex-row items-center p-3 rounded-lg"
              style={{ backgroundColor: COLORS.blue.lighten4 }}
              onPress={() => Linking.openURL(sinal.videos[0])}
            >
              <View 
                className="w-12 h-12 items-center justify-center rounded-lg mr-3"
                style={{ backgroundColor: COLORS.blue.darken2 }}
              >
                <Video size={24} color="white" />
              </View>
              <Text 
                className="flex-1"
                style={{ color: COLORS.blue.darken4 }}
              >
                Como identificar e agir com este sinal
              </Text>
              <ChevronRight size={20} color={COLORS.blue.darken3} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Botão Flutuante de Compartilhamento */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 p-4 rounded-full shadow-lg"
        style={{ 
          backgroundColor: COLORS.blue.accent3,
          shadowColor: COLORS.blue.darken4,
          elevation: 6
        }}
      >
        <Share2 size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}