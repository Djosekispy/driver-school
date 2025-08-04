import * as SQLite from 'expo-sqlite';
import { v4 as uuidv4 } from 'uuid';

// Variável para armazenar a instância do banco de dados
let dbInstance: SQLite.SQLiteDatabase | null = null;

// Função para inicializar o banco de dados
async function initializeDatabase() {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync('driverdb.db');
    await criarTabelasAdicionais();
  }
  return dbInstance;
}

// Função para criar tabelas adicionais
async function criarTabelasAdicionais() {
  const db = getDatabase();
  
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      created_at TEXT NOT NULL,
      user_id TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY NOT NULL,
      input TEXT,
      text TEXT,
      time TEXT NOT NULL,
      conversation_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
    CREATE INDEX IF NOT EXISTS idx_messages_user ON messages(user_id);
  `);
}

// Função para obter a instância do banco de dados
function getDatabase(): SQLite.SQLiteDatabase {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return dbInstance;
}

type DataProps = { 
  id?: string;
  input: string; 
  text: string; 
  time: string;
  conversationId: string;
  userId: string;
};

type Message = { 
  id: string; 
  input: string; 
  text: string; 
  time: string;
  conversation_id: string;
  user_id: string;
};

type Conversation = {
  id: string;
  title: string;
  created_at: string;
  user_id: string;
};

// Operações do banco de dados
async function inserirDados({ id, input, text, time, conversationId, userId }: DataProps) {
  const db = getDatabase();
  const messageId = id || uuidv4();
  const result = await db.runAsync(
    'INSERT INTO messages (id, input, text, time, conversation_id, user_id) VALUES (?, ?, ?, ?, ?, ?)',
    messageId, input, text, time, conversationId, userId
  );
  return result;
}

async function atualizarTempo(id: string, newTime: string) {
  const db = getDatabase();
  await db.runAsync(
    'UPDATE messages SET time = ? WHERE id = ?',
    [newTime, id]
  );
}

async function obterPrimeiraMensagem(conversationId: string): Promise<Message | null> {
  const db = getDatabase();
  return db.getFirstAsync<Message>(
    'SELECT * FROM messages WHERE conversation_id = ? ORDER BY time ASC LIMIT 1',
    [conversationId]
  );
}

async function obterTodasAsMensagens(conversationId: string): Promise<Message[]> {
  const db = getDatabase();
  return db.getAllAsync<Message>(
    'SELECT * FROM messages WHERE conversation_id = ? ORDER BY time ASC',
    [conversationId]
  );
}

async function obterConversasDoUsuario(userId: string): Promise<Conversation[]> {
  const db = getDatabase();
  return db.getAllAsync<Conversation>(
    'SELECT * FROM conversations WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
}

async function criarNovaConversacao({ id, title, userId }: { id?: string, title: string, userId: string }): Promise<string> {
  const db = getDatabase();
  const conversationId = id || uuidv4();
  const now = new Date().toISOString();
  
  await db.runAsync(
    'INSERT INTO conversations (id, title, created_at, user_id) VALUES (?, ?, ?, ?)',
    [conversationId, title, now, userId]
  );
  
  return conversationId;
}

async function deletarConversacao(conversationId: string) {
  const db = getDatabase();
  await db.runAsync('DELETE FROM conversations WHERE id = ?', [conversationId]);
}

async function atualizarTituloConversacao(conversationId: string, newTitle: string) {
  const db = getDatabase();
  await db.runAsync(
    'UPDATE conversations SET title = ? WHERE id = ?',
    [newTitle, conversationId]
  );
}

// Exportação das funções
export {
  initializeDatabase,
  criarTabelasAdicionais,
  inserirDados,
  atualizarTempo,
  obterPrimeiraMensagem,
  obterTodasAsMensagens,
  obterConversasDoUsuario,
  criarNovaConversacao,
  deletarConversacao,
  atualizarTituloConversacao,
  getDatabase,
  DataProps,
  Message,
  Conversation
};