import { db } from '@/firebase/firebase';
import { QuizQuestion } from '@/types/QuizQuestion';
import { QuizResult } from '@/types/QuizResult';
import { QuizTest } from '@/types/TestQuiz';
import { collection, getDocs, query, where } from 'firebase/firestore';

interface UserStats {
  overall: {
    totalTestsTaken: number;
    totalQuestionsAnswered: number;
    correctAnswers: number;
    wrongAnswers: number;
    averageScore: number;
    bestCategory: string;
    worstCategory: string;
  };
  byCategory: {
    [category: string]: {
      testsTaken: number;
      correctAnswers: number;
      wrongAnswers: number;
      averageScore: number;
      bestTest: {
        testId: string;
        testTitle: string;
        score: number;
      };
    };
  };
  recentActivity: {
    date: Date;
    testTitle: string;
    score: number;
    dateFormatted?: string; 
  }[];
  progressOverTime: {
    date: Date;
    score: number;
  }[];
}

const getUserStats = async (userId: string): Promise<UserStats> => {
  // Buscar todos os dados necessários em paralelo
  const [results, tests, questions] = await Promise.all([
    getDocs(query(collection(db, 'quizResults'), where('userId', '==', userId))),
    getDocs(collection(db, 'quizTests')),
    getDocs(collection(db, 'quizQuestions'))
  ]);

  const resultsData = results.docs.map(doc => ({ id: doc.id, ...doc.data() })) as QuizResult[];
  const testsData = tests.docs.map(doc => ({ id: doc.id, ...doc.data() })) as QuizTest[];
  const questionsData = questions.docs.map(doc => ({ id: doc.id, ...doc.data() })) as QuizQuestion[];

  // Inicializar estrutura de dados
  const stats: UserStats = {
    overall: {
      totalTestsTaken: 0,
      totalQuestionsAnswered: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      averageScore: 0,
      bestCategory: '',
      worstCategory: ''
    },
    byCategory: {},
    recentActivity: [],
    progressOverTime: []
  };

  // Processar cada categoria
  const categories = [...new Set(testsData.map(test => test.category))];
  
  categories.forEach(category => {
    stats.byCategory[category] = {
      testsTaken: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      averageScore: 0,
      bestTest: {
        testId: '',
        testTitle: '',
        score: 0
      }
    };
  });

  // Processar resultados
  resultsData.forEach(result => {
    const test = testsData.find(t => t.id === result.quizTestId);
    if (!test) return;

    // Atualizar estatísticas gerais
    stats.overall.totalTestsTaken++;
    stats.overall.correctAnswers += result.correctAnswers;
    stats.overall.wrongAnswers += result.wrongAnswers;
    stats.overall.totalQuestionsAnswered += result.totalQuestions;

    // Atualizar estatísticas por categoria
    const categoryStats = stats.byCategory[test.category];
    categoryStats.testsTaken++;
    categoryStats.correctAnswers += result.correctAnswers;
    categoryStats.wrongAnswers += result.wrongAnswers;

    // Atualizar melhor teste da categoria
    const scorePercentage = (result.correctAnswers / result.totalQuestions) * 100;
    if (scorePercentage > categoryStats.bestTest.score) {
      categoryStats.bestTest = {
        testId: test.id,
        testTitle: test.title,
        score: scorePercentage
      };
    }
    // Adicionar atividade recente
    stats.recentActivity.push({
      date: result.quizDate instanceof Date ? result.quizDate : new Date(result.quizDate),
      testTitle: test.title,
      score: scorePercentage,
        dateFormatted: String(result.quizDate)
    });
  });
 
  // Calcular médias e determinar melhores/piores categorias
  stats.overall.averageScore = stats.overall.totalTestsTaken > 0 
    ? (stats.overall.correctAnswers / stats.overall.totalQuestionsAnswered) * 100 
    : 0;

  // Calcular médias por categoria e determinar melhores/piores categorias
  let bestCategory = '';
  let bestCategoryAvg = 0;
  let worstCategory = '';
  let worstCategoryAvg = 100;

  Object.entries(stats.byCategory).forEach(([category, data]) => {
    data.averageScore = data.testsTaken > 0 
      ? (data.correctAnswers / (data.correctAnswers + data.wrongAnswers)) * 100 
      : 0;

    if (data.averageScore > bestCategoryAvg) {
      bestCategoryAvg = data.averageScore;
      bestCategory = category;
    }

    if (data.averageScore < worstCategoryAvg) {
      worstCategoryAvg = data.averageScore;
      worstCategory = category;
    }
  });

  stats.overall.bestCategory = bestCategory;
  stats.overall.worstCategory = worstCategory;

  // Ordenar atividade recente (mais recente primeiro)
  stats.recentActivity.sort((a, b) => b.date.getTime() - a.date.getTime());

  // Preparar progresso ao tempo (últimos 10 testes)
  stats.progressOverTime = stats.recentActivity
    .slice(0, 10)
    .map(activity => ({
      date: activity.date,
      score: activity.score
    }));

  return stats;
};


export {
    getUserStats,
    UserStats
}

