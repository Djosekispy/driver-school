import React, { useState } from 'react';
import { TextInput, View, Text, Pressable } from 'react-native';
import { Controller, Control, FieldError } from 'react-hook-form';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prev => !prev);
  };

  return (
    <View style={{ marginBottom: 16, position: 'relative' }}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry={secureTextEntry && !isPasswordVisible}
            autoCapitalize="none"
            style={{
              borderWidth: 1,
              borderColor: error ? 'red' : '#ccc',
              borderRadius: 8,
              paddingHorizontal: 40,
              paddingVertical: 12,
            }}
          />
        )}
      />

      {secureTextEntry && (
        <Pressable
          onPress={togglePasswordVisibility}
          style={{
            position: 'absolute',
            right: 12,
            top: 12,
            padding: 4,
          }}
        >
          <MaterialCommunityIcons
            name={isPasswordVisible ? 'eye-off' : 'eye'}
            size={24}
            color="#888"
          />
        </Pressable>
      )}

      {error && (
        <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
          {error.message}
        </Text>
      )}
    </View>
  );
};
