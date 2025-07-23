import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { COLORS } from '@/hooks/useColors';

interface AdminAddButtonProps {
  type: 'signs' | 'videos' | 'tests';
  onPress: () => void;
}

const AdminAddButton: React.FC<AdminAddButtonProps> = ({ type, onPress }) => {
  const labels = {
    signs: 'Sinal',
    videos: 'Vídeo',
    tests: 'Teste'
  };

  return (
    <TouchableOpacity 
      className="mb-4 flex-row items-center justify-center py-3 rounded-lg"
      style={{ backgroundColor: COLORS.yellowLighten5 }}
      onPress={onPress}
    >
      <AntDesign name="pluscircleo" size={18} color={COLORS.primary} />
      <Text className="ml-2 font-medium" style={{ color: COLORS.primary }}>
        Adicionar {labels[type]}
      </Text>
    </TouchableOpacity>
  );
};

export default AdminAddButton;