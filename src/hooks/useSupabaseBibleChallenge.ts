
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Participant, BibleBook, QuizResult, QuizQuestion, ReadingSchedule } from '@/types/bible';
import { bibleBooks } from '@/data/bibleBooks';
import { useToast } from '@/hooks/use-toast';

export const useSupabaseBibleChallenge = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentParticipant, setCurrentParticipant] = useState<Participant | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [customQuizzes, setCustomQuizzes] = useState<QuizQuestion[]>([]);
  const [activeSchedule, setActiveSchedule] = useState<ReadingSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Carregar participantes
      const { data: participantsData, error: participantsError } = await supabase
        .from('participants')
        .select('*')
        .order('total_score', { ascending: false });

      if (participantsError) throw participantsError;

      const formattedParticipants: Participant[] = participantsData.map(p => ({
        id: p.id,
        name: p.name,
        email: p.email,
        avatar: p.avatar,
        totalScore: p.total_score,
        chaptersCompleted: p.chapters_completed,
        currentBook: p.current_book || 'genesis',
        currentChapter: p.current_chapter,
        joinDate: new Date(p.join_date),
        lastActivity: new Date(p.last_activity),
        isAdmin: p.is_admin
      }));

      setParticipants(formattedParticipants);
      
      // Definir participante atual (primeiro admin encontrado)
      const adminParticipant = formattedParticipants.find(p => p.isAdmin);
      if (adminParticipant) {
        setCurrentParticipant(adminParticipant);
      }

      // Carregar cronograma ativo
      const { data: scheduleData, error: scheduleError } = await supabase
        .from('reading_schedules')
        .select('*')
        .eq('is_active', true)
        .single();

      if (scheduleData && !scheduleError) {
        const schedule: ReadingSchedule = {
          id: scheduleData.id,
          bookId: scheduleData.book_id,
          startDate: new Date(scheduleData.start_date),
          isActive: scheduleData.is_active,
          createdBy: scheduleData.created_by,
          createdAt: new Date(scheduleData.created_at)
        };
        setActiveSchedule(schedule);
      }

      // Carregar perguntas customizadas
      const { data: questionsData, error: questionsError } = await supabase
        .from('quiz_questions')
        .select('*');

      if (questionsData && !questionsError) {
        const questions: QuizQuestion[] = questionsData.map(q => ({
          id: q.id,
          bookId: q.book_id,
          chapter: q.chapter,
          question: q.question,
          options: q.options as string[],
          correctAnswer: q.correct_answer,
          explanation: q.explanation,
          createdBy: q.created_by,
          createdAt: new Date(q.created_at)
        }));
        setCustomQuizzes(questions);
      }

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do banco",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addParticipant = async (name: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('participants')
        .insert({
          name,
          email,
          current_book: activeSchedule?.bookId || 'genesis'
        })
        .select()
        .single();

      if (error) throw error;

      const newParticipant: Participant = {
        id: data.id,
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        totalScore: data.total_score,
        chaptersCompleted: data.chapters_completed,
        currentBook: data.current_book || 'genesis',
        currentChapter: data.current_chapter,
        joinDate: new Date(data.join_date),
        lastActivity: new Date(data.last_activity),
        isAdmin: data.is_admin
      };

      setParticipants(prev => [...prev, newParticipant]);
      
      toast({
        title: "Sucesso!",
        description: "Participante adicionado com sucesso",
      });

      return newParticipant;
    } catch (error) {
      console.error('Erro ao adicionar participante:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar participante",
        variant: "destructive"
      });
      return null;
    }
  };

  const setActiveBook = async (bookId: string) => {
    if (!currentParticipant?.isAdmin) return;

    try {
      // Desativar cronograma atual
      await supabase
        .from('reading_schedules')
        .update({ is_active: false })
        .eq('is_active', true);

      // Criar novo cronograma
      const { data, error } = await supabase
        .from('reading_schedules')
        .insert({
          book_id: bookId,
          is_active: true,
          created_by: currentParticipant.id
        })
        .select()
        .single();

      if (error) throw error;

      const newSchedule: ReadingSchedule = {
        id: data.id,
        bookId: data.book_id,
        startDate: new Date(data.start_date),
        isActive: data.is_active,
        createdBy: data.created_by,
        createdAt: new Date(data.created_at)
      };

      setActiveSchedule(newSchedule);

      // Atualizar todos os participantes para o novo livro
      await supabase
        .from('participants')
        .update({
          current_book: bookId,
          current_chapter: 1
        })
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Atualizar todos

      // Recarregar participantes
      loadInitialData();

      toast({
        title: "Sucesso!",
        description: "Livro definido como atual",
      });

    } catch (error) {
      console.error('Erro ao definir livro ativo:', error);
      toast({
        title: "Erro",
        description: "Erro ao definir livro ativo",
        variant: "destructive"
      });
    }
  };

  const createQuiz = async (quizData: {
    bookId: string;
    chapter: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  }) => {
    if (!currentParticipant?.isAdmin) return;

    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .insert({
          book_id: quizData.bookId,
          chapter: quizData.chapter,
          question: quizData.question,
          options: quizData.options,
          correct_answer: quizData.correctAnswer,
          explanation: quizData.explanation,
          created_by: currentParticipant.id
        })
        .select()
        .single();

      if (error) throw error;

      const newQuiz: QuizQuestion = {
        id: data.id,
        bookId: data.book_id,
        chapter: data.chapter,
        question: data.question,
        options: data.options as string[],
        correctAnswer: data.correct_answer,
        explanation: data.explanation,
        createdBy: data.created_by,
        createdAt: new Date(data.created_at)
      };

      setCustomQuizzes(prev => [...prev, newQuiz]);

      toast({
        title: "Sucesso!",
        description: "Pergunta criada com sucesso",
      });

    } catch (error) {
      console.error('Erro ao criar quiz:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar pergunta",
        variant: "destructive"
      });
    }
  };

  const completeQuiz = async (participantId: string, bookId: string, chapter: number, answers: number[], score: number) => {
    try {
      const questions = getQuizForChapter(bookId, chapter);
      
      const { error } = await supabase
        .from('quiz_results')
        .insert({
          participant_id: participantId,
          book_id: bookId,
          chapter,
          questions: questions,
          answers,
          score
        });

      if (error) throw error;

      // Atualizar estatísticas do participante
      const { error: updateError } = await supabase
        .from('participants')
        .update({
          total_score: participants.find(p => p.id === participantId)!.totalScore + score,
          chapters_completed: participants.find(p => p.id === participantId)!.chaptersCompleted + 1,
          current_chapter: participants.find(p => p.id === participantId)!.currentChapter + 1,
          last_activity: new Date().toISOString()
        })
        .eq('id', participantId);

      if (updateError) throw updateError;

      // Recarregar dados
      loadInitialData();

    } catch (error) {
      console.error('Erro ao completar quiz:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar resultado do quiz",
        variant: "destructive"
      });
    }
  };

  const getQuizForChapter = (bookId: string, chapter: number) => {
    return customQuizzes.filter(q => q.bookId === bookId && q.chapter === chapter);
  };

  const getParticipantRanking = () => {
    return [...participants].sort((a, b) => b.totalScore - a.totalScore);
  };

  const getCurrentReading = () => {
    if (!activeSchedule) return null;
    
    const book = bibleBooks.find(b => b.id === activeSchedule.bookId);
    if (!book) return null;

    const daysSinceStart = Math.floor((Date.now() - activeSchedule.startDate.getTime()) / (1000 * 60 * 60 * 24));
    const currentChapter = Math.min(daysSinceStart + 1, book.chapters);

    return {
      book,
      chapter: currentChapter,
      date: new Date()
    };
  };

  return {
    participants,
    currentParticipant,
    setCurrentParticipant,
    quizResults,
    readings: [],
    bibleBooks,
    customQuizzes,
    activeSchedule,
    loading,
    addParticipant,
    setActiveBook,
    createQuiz,
    completeQuiz,
    getQuizForChapter,
    getParticipantRanking,
    getCurrentReading
  };
};
