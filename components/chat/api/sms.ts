import axios, { AxiosResponse, isAxiosError } from 'axios';


const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
// 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


const apiKey = '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';


// Tipos e interfaces
type Role = 'system' | 'user' | 'assistant';

interface Message {
  role: Role;
  content: string;
}

interface ChatResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Configurações do Assistente de Condução
const INSTRUCTOR_CONFIG = {
  apiKey: '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', // Substitua pela sua chave
  apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
  model: 'deepseek/deepseek-chat:free',
  systemPrompt: `
    Você é um instrutor especializado em aulas de condução automóvel. 
    Sua função é responder exclusivamente sobre:
    - Técnicas de direção segura
    - Legislação de trânsito
    - Procedimentos em autoescolas
    - Manutenção básica de veículos
    - Preparação para exames de direção

    Regras estritas:
    1. Só responda sobre temas de condução veicular
    2. Se perguntarem sobre outros assuntos, diga: "Só posso ajudar com dúvidas sobre aulas de condução"
    3. Use linguagem clara e didática
    4. Baseie suas respostas na legislação atual de trânsito
  `
};

export class InstrutorConducao {
  private conversationHistory: Message[] = [];

  constructor() {
    this.inicializarConversa();
  }

  private inicializarConversa(): void {
    this.conversationHistory = [
      {
        role: 'system',
        content: INSTRUCTOR_CONFIG.systemPrompt
      }
    ];
  }

  public async enviarPergunta(pergunta: string): Promise<ChatResponse> {
    // Adiciona a pergunta do usuário ao histórico
    this.conversationHistory.push({
      role: 'user',
      content: pergunta
    });

    try {
      const response: AxiosResponse = await axios.post(
        INSTRUCTOR_CONFIG.apiUrl,
        {
          model: INSTRUCTOR_CONFIG.model,
          messages: this.conversationHistory,
          temperature: 0.5, 
          max_tokens: 500  
        },
        {
          headers: {
            'Authorization': `Bearer ${INSTRUCTOR_CONFIG.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const resposta = response.data.choices[0].message.content;

      // Atualiza histórico com a resposta
      this.conversationHistory.push({
        role: 'assistant',
        content: resposta
      });

      return {
        success: true,
        message: resposta
      };

    } catch (error) {
      let errorMessage = 'Erro ao consultar o instrutor virtual';
      
      if (isAxiosError(error)) {
        errorMessage = error.response?.data?.error?.message || error.message;
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  public reiniciarConversa(): void {
    this.inicializarConversa();
  }
}

// Exemplo de uso:
// const instrutor = new InstrutorConducao();
// const resposta = await instrutor.enviarPergunta("Como regular os espelhos retrovisores corretamente?");
// Exemplo de uso:
export  const instrutor = new InstrutorConducao();
