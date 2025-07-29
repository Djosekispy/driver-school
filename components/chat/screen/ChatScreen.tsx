import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, View, Text, SafeAreaView, FlatList } from 'react-native';
import ChatHeader from '../ui/ChatHeader';
import MessageList from '../ui/MessageList';
import MessageInput from '../ui/MessageInput';
import AnalysisOptions from '../ui/AnalysisOptions';
import ImagePreviewModal from '../ui/ImagePreviewModal';
import { initializeDatabase, inserirDados, obterTodasAsMensagens } from '../api/database';
import { instrutor } from '../api/sms';
import { COLORS } from '@/hooks/useColors';

export type ChatMessage = {
  id: string;
  text: string;
  input?: string; 
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
  const [isLoading, setIsloading] = useState(false);

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
    setIsloading(true);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      const resposta = await instrutor.enviarPergunta(text);

      if (!resposta.success || !resposta.message) throw resposta;
      
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
    } finally {
      setIsloading(false);
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
  <View style={{ flex: 1, backgroundColor: COLORS.background }}>
    {/* Header fixo no topo */}

    {/* Área principal de mensagens */}
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      style={{ flex: 1 }}
    >
      {/* Lista de mensagens com scroll */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageList messages={[item]} />
        )}
        contentContainerStyle={{ 
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 16
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ref={messageListRef}
        ListFooterComponent={
          <>
            {/* Loader */}
            {isLoading && (
              <View
                className="flex flex-row items-center justify-center p-4 rounded-lg my-2"
                style={{ backgroundColor: COLORS.yellowLighten5 }}
              >
                <View
                  className="animate-spin rounded-full h-6 w-6 border-b-2 mr-3"
                  style={{ borderColor: COLORS.primary }}
                />
                <Text className="font-medium" style={{ color: COLORS.yellowDarken4 }}>
                  Processando sua pergunta...
                </Text>
              </View>
            )}
            {/* Espaço extra para o input */}
            <View style={{ height: 80 }} />
          </>
        }

      />
      
    {/* Input flutuante acima do teclado */}
    <View style={{ 
      backgroundColor: COLORS.background
    }}>
      <MessageInput
        onSend={handleSendMessage}
        onImageSelect={handleImageSelect}
      />
    </View>

    {/* Modais */}
    {showAnalysisOptions && selectedImage && (
      <AnalysisOptions
        onClose={() => setShowAnalysisOptions(false)}
        onAnalyze={analyzeImage}
      />
    )}

    {selectedImage && !showAnalysisOptions && (
      <ImagePreviewModal
        imageUri={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    )}
    </KeyboardAvoidingView>

  </View>
);

};

export default ChatScreen;