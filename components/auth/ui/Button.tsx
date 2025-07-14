import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
};

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
}) => {
  const bgColor = variant === 'primary' ? 'bg-blue-600' : 'bg-transparent';
  const textColor = variant === 'primary' ? 'text-white' : 'text-blue-600';

  return (
    <TouchableOpacity
      className={`${bgColor} py-3 rounded-lg items-center mb-4`}
      onPress={onPress}
    >
      <Text className={`${textColor} font-semibold`}>{title}</Text>
    </TouchableOpacity>
  );
};