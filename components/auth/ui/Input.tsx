import React from 'react';
import { TextInput, View, Text } from 'react-native';
import { Controller, Control, FieldError } from 'react-hook-form';

type InputProps = {
  control: Control<any>;
  name: string;
  placeholder: string;
  error?: FieldError;
  secureTextEntry?: boolean;
};

export const Input: React.FC<InputProps> = ({
  control,
  name,
  placeholder,
  error,
  secureTextEntry = false,
}) => {
  return (
    <View className='mb-4'>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
          className={`border rounded-lg px-4 py-3 ${error ? 'border-red-500' : 'border-gray-300'}`}
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry={secureTextEntry}
            autoCapitalize="none"
          />
        )}
        name={name}
      />
      {error && (
        <Text className='text-red-500 text-xs mt-1'>
          {error.message}
        </Text>
      )}
    </View>
  );
};