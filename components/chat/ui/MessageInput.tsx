import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/hooks/useColors';


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
    <View 
      className="flex-row items-center p-3 border-t"
      style={{
        backgroundColor: COLORS.surface,
        borderColor: COLORS.border
      }}
    >
      <TouchableOpacity 
        className="p-2 mr-2" 
        onPress={handleImagePick}
      >
        <Ionicons 
          name="camera" 
          size={24} 
          color={COLORS.primary} 
        />
      </TouchableOpacity>
      
      <TextInput
        className="flex-1 border rounded-full py-2 px-4 mr-2"
        style={{
          borderColor: COLORS.border,
          backgroundColor: COLORS.yellowLighten5,
          color: COLORS.text,
        }}
        placeholder="Digite sua mensagem..."
        value={message}
        onChangeText={setMessage}
        onSubmitEditing={handleSend}
        placeholderTextColor={COLORS.textLight}
      />
      
      <TouchableOpacity 
        className="p-2 rounded-full"
        onPress={handleSend}
        disabled={!message.trim()}
      >
        <MaterialIcons 
          name="send" 
          size={24} 
          color={message.trim() ? COLORS.surface : COLORS.textLight} 
        />
      </TouchableOpacity>
    </View>
  );
};

export default MessageInput;