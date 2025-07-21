import * as SQLite from 'expo-sqlite';

// Variável para armazenar a instância do banco de dados
let dbInstance: SQLite.SQLiteDatabase | null = null;

// Função para inicializar o banco de dados (deve ser chamada uma vez no início do app)
async function initializeDatabase() {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync('driverdb.db');
    
    await dbInstance.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS mensagens (
        id INTEGER PRIMARY KEY NOT NULL,
        input TEXT NOT NULL,
        text TEXT NOT NULL,
        time TEXT NOT NULL
      );
    `);
  }
  return dbInstance;
}

// Função para obter a instância do banco de dados
function getDatabase(): SQLite.SQLiteDatabase {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return dbInstance;
}

type DataProps = { input: string; text: string; time: string };
type Message = { id: number; input: string; text: string; time: string };

// Operações do banco de dados
async function inserirDados({ input, text, time }: DataProps) {
  const db = getDatabase();
  const result = await db.runAsync(
    'INSERT INTO mensagens (input, text, time) VALUES (?, ?, ?)',
    input, text, time
  );
  return result;
}

async function atualizarTempo(id: number, newTime: string) {
  const db = getDatabase();
  await db.runAsync(
    'UPDATE mensagens SET time = ? WHERE id = ?',
    [newTime, id]
  );
}

async function obterPrimeiraMensagem(): Promise<Message | null> {
  const db = getDatabase();
  return db.getFirstAsync<Message>(
    'SELECT * FROM mensagens ORDER BY id ASC LIMIT 1'
  );
}

async function obterTodasAsMensagens(): Promise<Message[]> {
  const db = getDatabase();
  return db.getAllAsync<Message>('SELECT * FROM mensagens');
}

async function iterarMensagens(callback: (row: Message) => void) {
  const db = getDatabase();
  for await (const row of db.getEachAsync<Message>('SELECT * FROM mensagens')) {
    callback(row);
  }
}

// Exportação das funções
export {
  initializeDatabase,
  inserirDados,
  atualizarTempo,
  obterPrimeiraMensagem,
  obterTodasAsMensagens,
  iterarMensagens
};