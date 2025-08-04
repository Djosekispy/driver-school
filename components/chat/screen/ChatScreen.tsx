import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, View, Text, SafeAreaView, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import ChatHeader from '../ui/ChatHeader';
import MessageList from '../ui/MessageList';
import MessageInput from '../ui/MessageInput';
import AnalysisOptions from '../ui/AnalysisOptions';
import ImagePreviewModal from '../ui/ImagePreviewModal';
import { initializeDatabase, inserirDados, obterTodasAsMensagens, criarTabelasAdicionais, getDatabase, Message } from '../api/database';
import { instrutor } from '../api/sms';
import { COLORS } from '@/hooks/useColors';
import { v4 as uuidv4 } from 'uuid';
import { Feather } from 'lucide-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export type ChatMessage = {
  id: string;
  text?: string;
  input?: string;
  sender: 'user' | 'ai' | 'system';
  timestamp: Date;
  imageUri?: string;
  isAnalysis?: boolean;
  conversationId: string;
  userId?: string;
};

type ConversationTab = {
  id: string;
  title: string;
  createdAt: Date;
  userId?: string;
};

const ChatScreen = ({ currentUserId }: { currentUserId: string }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showAnalysisOptions, setShowAnalysisOptions] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<ConversationTab[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const messageListRef = useRef(null);

  // Initialize database and load conversations
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const db = await initializeDatabase();
        await criarTabelasAdicionais();
        
        // Load user's conversations
        const userConversations = await loadUserConversations(currentUserId);
        setConversations(userConversations);
        
        // Set the first conversation as active if none is selected
        if (userConversations.length > 0 && !activeConversation) {
          setActiveConversation(userConversations[0].id);
          await loadMessagesForConversation(userConversations[0].id);
        } else if (userConversations.length === 0) {
          // Create a default conversation if none exists
          await createNewConversation();
        }
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    initializeChat();
  }, [currentUserId]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      loadMessagesForConversation(activeConversation);
    }
  }, [activeConversation]);

  const loadUserConversations = async (userId: string): Promise<ConversationTab[]> => {
    try {
      const db = getDatabase();
      const rows = await db.getAllAsync<{ id: string; title: string; created_at: string; user_id: string }>(
        'SELECT * FROM conversations WHERE user_id = ? ORDER BY created_at DESC', 
        [userId]
      );
      
      return rows.map(row => ({
        id: row.id,
        title: row.title,
        createdAt: new Date(row.created_at),
        userId: row.user_id
      }));
    } catch (error) {
      console.error('Error loading conversations:', error);
      return [];
    }
  };

  const loadMessagesForConversation = async (conversationId: string) => {
    try {
      const db = getDatabase();
      const rows = await db.getAllAsync<Message>(
        'SELECT * FROM messages WHERE conversation_id = ? ORDER BY time ASC',
        [conversationId]
      );
      
      const formattedMessages = rows.map(row => ({
        id: String(row.id),
        text: row.text || row.input,
        input: row.input,
        sender: row.text ? 'ai' : 'user' as 'ai' | 'user',
        timestamp: new Date(row.time),
        conversationId: row.conversation_id,
        userId: row.user_id
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const createNewConversation = async () => {
    try {
      const newConversationId = uuidv4();
      const defaultTitle = `Conversa ${conversations.length + 1}`;
      const now = new Date().toISOString();
      
      const db = getDatabase();
      await db.runAsync(
        'INSERT INTO conversations (id, title, created_at, user_id) VALUES (?, ?, ?, ?)',
        [newConversationId, defaultTitle, now, currentUserId]
      );
      
      const newConversation: ConversationTab = {
        id: newConversationId,
        title: defaultTitle,
        createdAt: new Date(now),
        userId: currentUserId
      };
      
      setConversations(prev => [newConversation, ...prev]);
      setActiveConversation(newConversationId);
      setMessages([]);
      
      return newConversationId;
    } catch (error) {
      console.error('Error creating new conversation:', error);
      return null;
    }
  };

const deleteConversation = async (conversationId: string) => {
  try {
    const db = getDatabase();
    
    // Delete conversation and its messages in separate statements
    await db.execAsync(`
      BEGIN;
      DELETE FROM messages WHERE conversation_id = '${conversationId}';
      DELETE FROM conversations WHERE id = '${conversationId}';
      COMMIT;
    `);
    
    // Update state
    setConversations(prev => prev.filter(c => c.id !== conversationId));
    
    // If we deleted the active conversation, switch to another one or create new
    if (activeConversation === conversationId) {
      if (conversations.length > 1) {
        const remainingConversations = conversations.filter(c => c.id !== conversationId);
        setActiveConversation(remainingConversations[0].id);
      } else {
        createNewConversation();
      }
    }
  } catch (error) {
    console.error('Error deleting conversation:', error);
  }
};

  const updateConversationTitle = async (conversationId: string, newTitle: string) => {
    try {
      const db = getDatabase();
      await db.runAsync(
        'UPDATE conversations SET title = ? WHERE id = ?',
        [newTitle, conversationId]
      );
      
      setConversations(prev => prev.map(c => 
        c.id === conversationId ? { ...c, title: newTitle } : c
      ));
    } catch (error) {
      console.error('Error updating conversation title:', error);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!activeConversation) return;
    
    setIsLoading(true);

    const userMessage: ChatMessage = {
      id: uuidv4(),
      input: text,
      sender: 'user',
      timestamp: new Date(),
      conversationId: activeConversation,
      userId: currentUserId
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      const resposta = await instrutor.enviarPergunta(text);

      if (!resposta.success || !resposta.message) throw resposta;
      
      const time = new Date().toISOString();
      
      // Save to database
      const db = getDatabase();
      await db.runAsync(
        'INSERT INTO messages (id, input, text, time, conversation_id, user_id) VALUES (?, ?, ?, ?, ?, ?)',
        [uuidv4(), text, resposta.message, time, activeConversation, currentUserId]
      );
      
      const aiMessage: ChatMessage = {
        id: uuidv4(),
        text: resposta.message,
        sender: 'ai',
        timestamp: new Date(time),
        conversationId: activeConversation,
        userId: currentUserId
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Update conversation title if it's the first message
      if (messages.length === 0) {
        const firstFewWords = text.split(' ').slice(0, 5).join(' ');
        await updateConversationTitle(activeConversation, firstFewWords);
      }
    } catch (e) {
      console.error('Error sending message', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (uri: string) => {
    setSelectedImage(uri);
    setShowAnalysisOptions(true);
  };

const analyzeImage = (analysisType: 'sign' | 'situation' | 'infraction') => {
  if (!activeConversation) return;
  
  setShowAnalysisOptions(false);
  const userMsg: ChatMessage = {
    id: uuidv4(),
    text: `Analisar imagem (${analysisType})`,
    sender: 'user',
    timestamp: new Date(),
    imageUri: selectedImage || undefined,
    conversationId: activeConversation,
    userId: currentUserId
  };
  setMessages(prev => [...prev, userMsg]);

  setTimeout(async () => { // Made this async
    const aiMsg: ChatMessage = {
      id: uuidv4(),
      text: `Resultado da análise: ${analysisType}`,
      sender: 'ai',
      timestamp: new Date(),
      isAnalysis: true,
      conversationId: activeConversation,
      userId: currentUserId
    };
    setMessages(prev => [...prev, aiMsg]);
    setSelectedImage(null);
    
    // Save to database
    try {
      const db = getDatabase();
      await db.runAsync(
        'INSERT INTO messages (id, input, text, time, conversation_id, user_id) VALUES (?, ?, ?, ?, ?, ?)',
        [
          userMsg.id,
          userMsg.text || '', // Provide empty string as fallback
          aiMsg.text as string,
          userMsg.timestamp.toISOString(),
          activeConversation,
          currentUserId
        ]
      );
    } catch (error) {
      console.error('Error saving analysis message:', error);
    }
  }, 1500);
};

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Conversation tabs bar */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {conversations.map(conv => (
            <TouchableOpacity
              key={conv.id}
              style={[
                styles.tab,
                activeConversation === conv.id && styles.activeTab
              ]}
              onPress={() => setActiveConversation(conv.id)}
              onLongPress={() => {
                // Show confirmation dialog for deletion
                Alert.alert(
                  'Deletar conversa',
                  `Tem certeza que deseja deletar "${conv.title}"?`,
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Deletar', onPress: () => deleteConversation(conv.id) }
                  ]
                );
              }}
            >
              <Text 
                style={[
                  styles.tabText,
                  activeConversation === conv.id && styles.activeTabText
                ]}
                numberOfLines={1}
              >
                {conv.title}
              </Text>
              {activeConversation === conv.id && (
                <View style={styles.activeTabIndicator} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity
          style={styles.newTabButton}
          onPress={createNewConversation}
        >
          <MaterialCommunityIcons name="plus" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Main chat area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 60}
        style={{ flex: 1 }}
      >
        {/* Message list */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageList key={item.id} messages={[item]} />
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
            </>
          }
        />
        
        {/* Message input */}
        <View style={{ backgroundColor: COLORS.background }}>
          <MessageInput
            onSend={handleSendMessage}
            onImageSelect={handleImageSelect}
          />
        </View>

        {/* Modals */}
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

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: COLORS.textLight,
    maxWidth: 150,
  },
  activeTab: {
    backgroundColor: COLORS.secondary,
  },
  tabText: {
    color: COLORS.text,
    fontSize: 14,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: -9,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.primary,
  },
  newTabButton: {
    padding: 8,
    marginLeft: 4,
  },
});

export default ChatScreen;