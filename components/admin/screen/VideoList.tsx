import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { COLORS } from '@/hooks/useColors';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useNavigation } from 'expo-router';
import { AntDesign, Feather } from '@expo/vector-icons';
import { db } from '@/firebase/firebase';

type Video = {
  id: string;
  title: string;
  description: string;
  url: string;
};

export default function VideoList() {
  const [videos, setVideos] = useState<Video[]>([]);
  const navigation = useNavigation();

  const fetchVideos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'video_lessons'));
      const videoData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Video, 'id'>),
      }));
      setVideos(videoData);
    } catch (error) {
      console.error('Erro ao buscar vídeos:', error);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Confirmar',
      'Deseja mesmo deletar esta vídeo-aula?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'video_lessons', id));
              fetchVideos();
            } catch (error) {
              console.error('Erro ao deletar vídeo:', error);
            }
          },
        },
      ]
    );
  };

  const handleEdit = (video: Video) => {
    navigation.navigate('/(auth)/edit-video', { video });
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const renderItem = ({ item }: { item: Video }) => (
    <View className="bg-white p-4 mb-4 rounded-xl shadow" style={{ backgroundColor: COLORS.card }}>
      <Text className="text-lg font-bold text-black">{item.title}</Text>
      <Text className="text-gray-500 mt-1">{item.description}</Text>
      <Text className="text-blue-500 mt-2" numberOfLines={1}>
        {item.url}
      </Text>

      <View className="flex-row mt-4 space-x-4">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => handleEdit(item)}
        >
          <Feather name="edit" size={20} color={COLORS.primary} />
          <Text className="ml-1 text-[16px] text-blue-600">Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => handleDelete(item.id)}
        >
          <AntDesign name="delete" size={20} color="red" />
          <Text className="ml-1 text-[16px] text-red-600">Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 px-4 pt-8" style={{ backgroundColor: COLORS.background }}>
      <Text className="text-2xl font-bold text-black mb-4">Vídeo Aulas</Text>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}
