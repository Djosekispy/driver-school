import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { UserData } from '../types';

interface UserHeaderProps {
  user: UserData;
}

const UserHeader: React.FC<UserHeaderProps> = ({ user }) => {
  return (
    <View className="px-5 pt-8 pb-4 bg-white shadow-sm">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Image
            source={{ uri: user.avatar }}
            className="w-14 h-14 rounded-full mr-4 border-2 border-blue-200"
          />
          <View>
            <Text className="text-xl font-bold text-gray-900">Olá, {user.name}</Text>
            <View className="flex-row items-center mt-1">
              <View className={`${
                user.level === 'Iniciante' ? 'bg-blue-100 text-blue-800' :
                user.level === 'Intermediário' ? 'bg-purple-100 text-purple-800' :
                'bg-green-100 text-green-800'
              } px-2 py-1 rounded-full`}>
                <Text className={`${
                  user.level === 'Iniciante' ? 'text-blue-800' :
                  user.level === 'Intermediário' ? 'text-purple-800' :
                  'text-green-800'
                } text-xs font-medium`}>
                  {user.level}
                </Text>
              </View>
              <MaterialIcons name="verified" size={16} color={
                user.level === 'Iniciante' ? '#2563eb' :
                user.level === 'Intermediário' ? '#7c3aed' :
                '#10b981'
              } className="ml-1" />
            </View>
          </View>
        </View>
        <TouchableOpacity>
          <MaterialIcons name="notifications-none" size={28} color="#4b5563" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserHeader;