import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Feather, FontAwesome6 } from '@expo/vector-icons';
import { COLORS } from '@/hooks/useColors';
import { Logs } from '@/types/logs';
import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';

interface AdminRecentActivityProps {
  activities: Logs[];
}

const AdminRecentActivity: React.FC<AdminRecentActivityProps> = ({ activities }) => {
  const [selectedItem, setSelectedItem] = useState<Logs | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
function formatFirestoreDateToRelativeTime(timestamp: any): string {
  const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  return formatDistanceToNow(date, { addSuffix: true, locale: pt });
}

  const handleItemPress = (item: Logs) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  return (
    <View className="mb-6">
      <Text className="text-lg font-bold mb-3" style={{ color: COLORS.text }}>
        Atividades Recentes
      </Text>

      {activities.length === 0 ? (
        <View className="bg-white p-4 rounded-lg items-center">
          <Feather name="clock" size={24} color={COLORS.textLight} />
          <Text className="mt-2" style={{ color: COLORS.textLight }}>
            Nenhuma atividade recente
          </Text>
        </View>
      ) : (
        <FlatList
          data={activities}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleItemPress(item)}
              className="bg-white p-4 rounded-lg mb-2 flex-row justify-between items-center"
            >
              <View
                className="w-10 h-10 rounded-full justify-center items-center mr-3"
                style={{
                  backgroundColor:
                    item.type === 'user'
                      ? `${COLORS.primary}20`
                      : item.type === 'video'
                      ? `${COLORS.primary}20`
                      : item.type === 'signal'
                      ? `${COLORS.warning}20`
                      : item.type === 'test'
                      ? `${COLORS.success}20`
                      : '#ccc',
                }}
              >
                {item.type === 'user' && (
                  <Feather name="user" size={16} color={COLORS.primary} />
                )}
                {item.type === 'video' && (
                  <Feather name="video" size={16} color={COLORS.primary} />
                )}
                {item.type === 'signal' && (
                  <FontAwesome6
                    name="traffic-light"
                    size={16}
                    color={COLORS.warning}
                  />
                )}
                {item.type === 'test' && (
                  <Feather
                    name="file-text"
                    size={16}
                    color={COLORS.success}
                  />
                )}
              </View>

              <View className="">
                <Text className="font-medium" style={{ color: COLORS.text }}>
                  {item.title.substring(0,20)}
                </Text>
                <Text className="text-sm" style={{ color: COLORS.textLight }}>
                  {item.discription}
                </Text>
              </View>
              <Text className="text-xs" style={{ color: COLORS.textLight }}>
                {formatFirestoreDateToRelativeTime(item.createdAt)}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Modal de detalhes */}
    <Modal
  visible={modalVisible}
  transparent
  animationType="slide"
  onRequestClose={() => setModalVisible(false)}
>
  <View className="flex-1 justify-center items-center bg-black/30 px-6">
    <View
      className="rounded-2xl p-6 w-full shadow-lg"
      style={{
        backgroundColor: COLORS.surface,
        borderColor: COLORS.border,
        borderWidth: 1,
      }}
    >
      <View className="flex-row items-center mb-4">
        <Feather name="info" size={20} color={COLORS.primary} />
        <Text className="text-lg font-bold ml-2" style={{ color: COLORS.primary }}>
          Detalhes da Atividade
        </Text>
      </View>

      {selectedItem && (
        <View style={{ borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 12 }}>
          <Text style={{ color: COLORS.textLight, marginBottom: 4 }}>
            <Text style={{ color: COLORS.text, fontWeight: 'bold' }}>Título:</Text> {selectedItem.title}
          </Text>
          <Text style={{ color: COLORS.textLight, marginBottom: 4 }}>
            <Text style={{ color: COLORS.text, fontWeight: 'bold' }}>Descrição:</Text> {selectedItem.discription}
          </Text>
          <Text style={{ color: COLORS.textLight, marginBottom: 4 }}>
            <Text style={{ color: COLORS.text, fontWeight: 'bold' }}>Tipo:</Text> {selectedItem.type}
          </Text>
          <Text style={{ color: COLORS.textLight }}>
            <Text style={{ color: COLORS.text, fontWeight: 'bold' }}>Criado:</Text>{' '}
             {formatFirestoreDateToRelativeTime(selectedItem.createdAt)}
          </Text>
        </View>
      )}

      <Pressable
        onPress={() => setModalVisible(false)}
        className="mt-6 py-3 rounded-md items-center"
        style={{
          backgroundColor: COLORS.primary,
        }}
      >
        <Text className="text-white font-semibold">Fechar</Text>
      </Pressable>
    </View>
  </View>
</Modal>

    </View>
  );
};

export default AdminRecentActivity;
