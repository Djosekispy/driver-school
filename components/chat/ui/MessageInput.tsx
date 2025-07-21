import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/Colors';


type MessageInputProps = {
  onSend: (text: string) => void;
  onImageSelect: (uri: string) => void;
};

const MessageInput = ({ onSend, onImageSelect }: MessageInputProps) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
      Keyboard.dismiss();
    }
  };

  const handleImagePick = async () => {
    // Simulação de seleção de imagem
    const fakeImageUri = 'https://via.placeholder.com/300x200/bbdefb/2196f3?text=Exemplo+Tr%C3%A2nsito';
    onImageSelect(fakeImageUri);
  };

  return (
    <View className="flex-row items-center p-3 border-t border-gray-200 bg-white">
      <TouchableOpacity className="p-2 mr-2" onPress={handleImagePick}>
        <Ionicons name="camera" size={24} color={COLORS.blue.default} />
      </TouchableOpacity>
      <TextInput
        className="flex-1 border border-gray-300 rounded-full py-2 px-4 mr-2"
        placeholder="Digite sua mensagem..."
        value={message}
        onChangeText={setMessage}
        onSubmitEditing={handleSend}
        placeholderTextColor={COLORS.text.secondary}
      />
      <TouchableOpacity 
        className="p-2 bg-blue-500 rounded-full"
        onPress={handleSend}
        disabled={!message.trim()}
      >
        <MaterialIcons 
          name="send" 
          size={24} 
          color={message.trim() ? COLORS.text.light : COLORS.text.secondary} 
        />
      </TouchableOpacity>
    </View>
  );
};

export default MessageInput;