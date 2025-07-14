import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';


type SocialButtonProps = {
  icon: React.ReactNode;
  text: string;
  onPress: () => void;
};

export const SocialButton: React.FC<SocialButtonProps> = ({
  icon,
  text,
  onPress,
}) => {
  return (
    <TouchableOpacity
      className={'flex-row items-center justify-center border border-gray-300 rounded-lg py-3 px-4 mb-4'}
      onPress={onPress}
    >
      {icon}
      <Text className={'ml-2 text-gray-700'}>{text}</Text>
    </TouchableOpacity>
  );
};