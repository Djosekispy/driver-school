import React, { forwardRef, useEffect } from 'react';
import { View, ScrollView, Text, Image } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { ChatMessage } from '../screen/ChatScreen';

type MessageListProps = {
  messages: ChatMessage[];
};

const MessageList = forwardRef<ScrollView, MessageListProps>(({ messages }, ref) => {
  useEffect(() => {
    if (ref && 'current' in ref && ref.current) {
      ref.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <ScrollView 
      ref={ref}
      className="flex-1 p-4"
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      {messages.map((message) => (
        <View key={message.id} className={`mb-4 ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
          {message.imageUri && (
            <Image 
              source={{ uri: message.imageUri }} 
              className="w-48 h-48 rounded-lg mb-2"
              resizeMode="cover"
            />
          )}
          <View
            className={`rounded-xl p-3 ${message.sender === 'user' 
              ? 'rounded-tr-none bg-blue-100' 
              : message.isAnalysis 
                ? 'rounded-tl-none bg-white border border-blue-200'
                : 'rounded-tl-none bg-white'}`}
            style={message.isAnalysis ? { maxWidth: '90%', borderWidth: 1 } : { maxWidth: '80%' }}
          >
            <Text style={{ color: message.sender === 'user' ? COLORS.text.primary : COLORS.text.primary }}>
              {message.text}
            </Text>
            <Text className="text-xs mt-1" style={{ color: COLORS.text.secondary }}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
});

export default MessageList;