import React, { forwardRef, useEffect } from 'react';
import { View, ScrollView, Text, Image } from 'react-native';
import { ChatMessage } from '../screen/ChatScreen';
import { COLORS } from '@/hooks/useColors';

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
      contentContainerStyle={{ 
        paddingBottom: 20,
        backgroundColor: COLORS.background 
      }}
    >
      {messages.map((message, index) => (
        <>
          {/* Mensagem do usuário (input) - Alinhada à direita */}
          {message.input && (
            <View key={index} className="mb-4 items-end">
              <View
                className="rounded-xl p-3 rounded-tr-none"
                style={{
                  maxWidth: '80%',
                  backgroundColor: COLORS.primary,
                  borderColor: COLORS.yellowDarken2,
                  borderWidth: 1,
                  shadowColor: COLORS.textLight,
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                  elevation: 2
                }}
              >
                <Text style={{ color: COLORS.surface }}>
                  {message.input}
                </Text>
                <Text className="text-xs mt-1" style={{ color: COLORS.yellowLighten4 }}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
          )}

          {/* Mensagem da IA (text) - Alinhada à esquerda */}
          {message.text && (
            <View key={message.id + '_text'} className="mb-4 items-start">
              {message.imageUri && (
                <Image 
                  source={{ uri: message.imageUri }} 
                  className="w-48 h-48 rounded-lg mb-2"
                  resizeMode="cover"
                  style={{
                    borderWidth: 1,
                    borderColor: COLORS.border
                  }}
                />
              )}
              <View
                className={`rounded-xl p-3 rounded-tl-none ${message.isAnalysis ? 'border' : ''}`}
                style={{
                  maxWidth: message.isAnalysis ? '90%' : '80%',
                  backgroundColor: COLORS.surface,
                  borderColor: message.isAnalysis ? COLORS.yellowLighten2 : COLORS.border,
                  borderWidth: 1,
                  shadowColor: COLORS.textLight,
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                  elevation: 2
                }}
              >
                <Text style={{ color: COLORS.text }}>
                  {message.text}
                </Text>
                <Text className="text-xs mt-1" style={{ color: COLORS.textLight }}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
          )}
        </>
      ))}
    </ScrollView>
  );
});

export default MessageList;
