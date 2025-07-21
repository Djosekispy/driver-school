import { trafficSigns } from '@/components/chat/data/mockData';
import { COLORS } from '@/constants/Colors';
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';



const TrafficSigns = () => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
      {trafficSigns.map((sign) => (
        <TouchableOpacity key={sign.id} className="mr-3">
          <View className="w-24 h-24 rounded-lg mb-2" style={{ backgroundColor: COLORS.blue.lighten4 }} />
          <Text className="text-xs text-center" style={{ color: COLORS.text.primary }}>
            {sign.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default TrafficSigns;