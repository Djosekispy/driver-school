import { COLORS } from '@/hooks/useColors';
import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, TextInput } from 'react-native';


interface AdminEditModalProps {
  visible: boolean;
  onClose: () => void;
  item: any;
  type: 'signs' | 'videos' | 'tests';
}

const AdminEditModal: React.FC<AdminEditModalProps> = ({ visible, onClose, item, type }) => {
  const isEdit = !!item;
  const title = `${isEdit ? 'Editar' : 'Adicionar'} ${
    type === 'signs' ? 'Sinal' : 
    type === 'videos' ? 'Vídeo' : 'Teste'
  }`;

  const renderFormFields = () => {
    switch (type) {
      case 'signs':
        return (
          <>
            <Text className="mb-1" style={{ color: COLORS.text }}>Nome do Sinal</Text>
            <TextInput
              className="bg-gray-100 p-3 rounded-lg mb-4"
              placeholder="Ex: Pare"
              defaultValue={item?.name}
            />

            <Text className="mb-1" style={{ color: COLORS.text }}>Categoria</Text>
            <TextInput
              className="bg-gray-100 p-3 rounded-lg mb-4"
              placeholder="Ex: Regulamentação"
              defaultValue={item?.category}
            />

            <Text className="mb-1" style={{ color: COLORS.text }}>URL da Imagem</Text>
            <TextInput
              className="bg-gray-100 p-3 rounded-lg mb-4"
              placeholder="https://exemplo.com/sinal.jpg"
              defaultValue={item?.image}
            />
          </>
        );
      case 'videos':
        return (
          <>
            <Text className="mb-1" style={{ color: COLORS.text }}>Título do Vídeo</Text>
            <TextInput
              className="bg-gray-100 p-3 rounded-lg mb-4"
              placeholder="Ex: Introdução à Legislação"
              defaultValue={item?.title}
            />

            <Text className="mb-1" style={{ color: COLORS.text }}>Duração (mm:ss)</Text>
            <TextInput
              className="bg-gray-100 p-3 rounded-lg mb-4"
              placeholder="Ex: 15:32"
              defaultValue={item?.duration}
            />

            <Text className="mb-1" style={{ color: COLORS.text }}>URL do Vídeo</Text>
            <TextInput
              className="bg-gray-100 p-3 rounded-lg mb-4"
              placeholder="https://exemplo.com/video.mp4"
              defaultValue={item?.url}
            />
          </>
        );
      case 'tests':
        return (
          <>
            <Text className="mb-1" style={{ color: COLORS.text }}>Título do Teste</Text>
            <TextInput
              className="bg-gray-100 p-3 rounded-lg mb-4"
              placeholder="Ex: Simulado Inicial"
              defaultValue={item?.title}
            />

            <Text className="mb-1" style={{ color: COLORS.text }}>Número de Questões</Text>
            <TextInput
              className="bg-gray-100 p-3 rounded-lg mb-4"
              placeholder="Ex: 20"
              keyboardType="numeric"
              defaultValue={item?.questions?.toString()}
            />

            <Text className="mb-1" style={{ color: COLORS.text }}>Dificuldade</Text>
            <TextInput
              className="bg-gray-100 p-3 rounded-lg mb-4"
              placeholder="Ex: Fácil, Médio, Difícil"
              defaultValue={item?.difficulty}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black bg-opacity-50">
        <View className="bg-white rounded-t-3xl p-5 max-h-3/4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold" style={{ color: COLORS.text }}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: COLORS.text }}>X</Text>
            </TouchableOpacity>
          </View>

          <ScrollView>
            {renderFormFields()}

            <View className="flex-row justify-between mt-4">
              <TouchableOpacity 
                className="py-3 px-6 rounded-lg"
                style={{ backgroundColor: COLORS.yellowLighten5 }}
                onPress={onClose}
              >
                <Text style={{ color: COLORS.primary }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="py-3 px-6 rounded-lg"
                style={{ backgroundColor: COLORS.primary }}
              >
                <Text className="text-white">{isEdit ? 'Salvar' : 'Adicionar'}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AdminEditModal;