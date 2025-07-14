import React from 'react';
import { View, Text, Image } from 'react-native';

type AuthLayoutProps = {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
};

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <View className={'flex-1 bg-white px-6 justify-center'}>
      {title && (
        <Text className={'text-2xl font-bold text-gray-800 mb-2'}>
          {title}
        </Text>
      )}
      {subtitle && (
        <Text className={'text-gray-500 mb-8'}>{subtitle}</Text>
      )}
      {children}
    </View>
  );
};