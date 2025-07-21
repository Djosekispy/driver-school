// ChatScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, KeyboardAvoidingView, Platform, View, Text } from 'react-native';
import ChatHeader from '../ui/ChatHeader';
import MessageList from '../ui/MessageList';
import MessageInput from '../ui/MessageInput';
import AnalysisOptions from '../ui/AnalysisOptions';
import ImagePreviewModal from '../ui/ImagePreviewModal';
import { COLORS } from '@/constants/Colors';
import { initializeDatabase, inserirDados, obterTodasAsMensagens } from '../api/database';
import { instrutor } from '../api/sms';

export type ChatMessage = {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'system';
  timestamp: Date;
  imageUri?: string;
  isAnalysis?: boolean;
};

const ChatScreen = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showAnalysisOptions, setShowAnalysisOptions] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messageListRef = useRef(null);
  const [isLoading, setIsloading ] = useState(false)

 useEffect(() => {
  const loadMessages = async () => {
    try {
      const db = await initializeDatabase();
      const rows = await obterTodasAsMensagens();
      
      const formattedMessages = rows.map(row => ({
        id: String(row.id),
        text: row.text || row.input, 
        sender: row.text ? 'ai' : 'user' as 'ai' | 'user', 
        timestamp: new Date(row.time),
        input: row.input 
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  loadMessages();
}, []);

const handleSendMessage = async (text: string) => {
  setIsloading(true)

  const userMessage: ChatMessage = {
    id: Date.now().toString(),
    text,
    sender: 'user',
    timestamp: new Date(),
  };
  
  setMessages(prev => [...prev, userMessage]);

  try {
    const resposta = await instrutor.enviarPergunta(text);
    if (!resposta.success || !resposta.message) return;
    
    const time = new Date().toISOString();
    await inserirDados({ input: text, text: resposta.message, time });
    
    const aiMessage: ChatMessage = {
      id: Date.now().toString(),
      text: resposta.message,
      sender: 'ai',
      timestamp: new Date(time),
    };
    
    setMessages(prev => [...prev, aiMessage]);
  } catch (e) {
    console.error('Erro ao enviar mensagem', e);
  }finally{
    setIsloading(false)
  }
};

  const handleImageSelect = (uri: string) => {
    setSelectedImage(uri);
    setShowAnalysisOptions(true);
  };

  const analyzeImage = (analysisType: 'sign' | 'situation' | 'infraction') => {
    setShowAnalysisOptions(false);
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: `Analisar imagem (${analysisType})`,
      sender: 'user',
      timestamp: new Date(),
      imageUri: selectedImage || undefined,
    };
    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: `Resultado da análise: ${analysisType}`,
        sender: 'ai',
        timestamp: new Date(),
        isAnalysis: true,
      }]);
      setSelectedImage(null);
    }, 1500);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background.light }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ChatHeader />
        <MessageList messages={messages} ref={messageListRef} />
       {isLoading && (
        <View className="flex flex-row items-center justify-center p-4 bg-blue-50 rounded-lg my-2">
          <View className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-3"></View>
          <Text className="text-blue-700 font-medium">Processando sua pergunta...</Text>
        </View>
      )}
        <MessageInput onSend={handleSendMessage} onImageSelect={handleImageSelect} />
        {showAnalysisOptions && selectedImage && (
          <AnalysisOptions onClose={() => setShowAnalysisOptions(false)} onAnalyze={analyzeImage} />
        )}
        {selectedImage && !showAnalysisOptions && (
          <ImagePreviewModal imageUri={selectedImage} onClose={() => setSelectedImage(null)} />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
