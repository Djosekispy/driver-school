import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type ImagePreviewModalProps = {
  imageUri: string;
  onClose: () => void;
};

const ImagePreviewModal = ({ imageUri, onClose }: ImagePreviewModalProps) => {
  return (
    <View className="absolute inset-0 bg-black bg-opacity-90 justify-center items-center">
      <TouchableOpacity 
        className="absolute top-10 right-6 z-10"
        onPress={onClose}
      >
        <MaterialIcons name="close" size={30} color="white" />
      </TouchableOpacity>
      
      <Image 
        source={{ uri: imageUri }} 
        className="w-full h-2/3"
        resizeMode="contain"
      />
      
      <Text className="text-white mt-4 text-center px-6">
        Toque na tela para fechar ou envie esta imagem para análise
      </Text>
    </View>
  );
};

export default ImagePreviewModal;