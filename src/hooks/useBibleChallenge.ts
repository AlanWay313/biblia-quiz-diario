
import { useState, useEffect } from 'react';
import { Participant, BibleBook, QuizResult, ChapterReading, QuizQuestion, ReadingSchedule } from '@/types/bible';
import { bibleBooks } from '@/data/bibleBooks';
import { sampleQuizzes } from '@/data/sampleQuizzes';

export const useBibleChallenge = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentParticipant, setCurrentParticipant] = useState<Participant | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [readings, setReadings] = useState<ChapterReading[]>([]);
  const [customQuizzes, setCustomQuizzes] = useState<QuizQuestion[]>([]);
  const [activeSchedule, setActiveSchedule] = useState<ReadingSchedule | null>(null);

  useEffect(() => {
    // Load initial data (would come from backend in real app)
    const sampleParticipants: Participant[] = [
      {
        id: '1',
        name: 'Pastor João',
        email: 'pastor@igreja.com',
        totalScore: 850,
        chaptersCompleted: 15,
        currentBook: 'genesis',
        currentChapter: 16,
        joinDate: new Date('2024-01-01'),
        lastActivity: new Date(),
        isAdmin: true
      },
      {
        id: '2',
        name: 'Maria Silva',
        email: 'maria@email.com',
        totalScore: 720,
        chaptersCompleted: 12,
        currentBook: 'genesis',
        currentChapter: 13,
        joinDate: new Date('2024-01-02'),
        lastActivity: new Date(),
        isAdmin: false
      },
      {
        id: '3',
        name: 'Ana Costa',
        email: 'ana@email.com',
        totalScore: 950,
        chaptersCompleted: 18,
        currentBook: 'genesis',
        currentChapter: 19,
        joinDate: new Date('2024-01-01'),
        lastActivity: new Date(),
        isAdmin: false
      }
    ];
    
    setParticipants(sampleParticipants);
    setCurrentParticipant(sampleParticipants[0]); // Admin by default

    // Set initial active schedule
    setActiveSchedule({
      id: '1',
      bookId: 'genesis',
      startDate: new Date(),
      isActive: true,
      createdBy: '1',
      createdAt: new Date()
    });
  }, []);

  const addParticipant = (name: string, email: string) => {
    const newParticipant: Participant = {
      id: Date.now().toString(),
      name,
      email,
      totalScore: 0,
      chaptersCompleted: 0,
      currentBook: activeSchedule?.bookId || 'genesis',
      currentChapter: 1,
      joinDate: new Date(),
      lastActivity: new Date(),
      isAdmin: false
    };
    
    setParticipants(prev => [...prev, newParticipant]);
    return newParticipant;
  };

  const setActiveBook = (bookId: string) => {
    if (!currentParticipant?.isAdmin) return;

    const newSchedule: ReadingSchedule = {
      id: Date.now().toString(),
      bookId,
      startDate: new Date(),
      isActive: true,
      createdBy: currentParticipant.id,
      createdAt: new Date()
    };

    setActiveSchedule(newSchedule);

    // Update all participants to start the new book
    setParticipants(prev => prev.map(p => ({
      ...p,
      currentBook: bookId,
      currentChapter: 1
    })));
  };

  const createQuiz = (quizData: {
    bookId: string;
    chapter: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
    createdBy: string;
  }) => {
    if (!currentParticipant?.isAdmin) return;

    const newQuiz: QuizQuestion = {
      id: Date.now().toString(),
      ...quizData,
      createdAt: new Date()
    };

    setCustomQuizzes(prev => [...prev, newQuiz]);
  };

  const completeQuiz = (participantId: string, bookId: string, chapter: number, answers: number[], score: number) => {
    const allQuizzes = [...sampleQuizzes, ...customQuizzes];
    const questions = allQuizzes.filter(q => q.bookId === bookId && q.chapter === chapter);
    
    const result: QuizResult = {
      id: Date.now().toString(),
      participantId,
      bookId,
      chapter,
      questions,
      answers,
      score,
      completedAt: new Date()
    };

    setQuizResults(prev => [...prev, result]);
    
    // Update participant stats
    setParticipants(prev => prev.map(p => {
      if (p.id === participantId) {
        return {
          ...p,
          totalScore: p.totalScore + score,
          chaptersCompleted: p.chaptersCompleted + 1,
          currentChapter: p.currentChapter + 1,
          lastActivity: new Date()
        };
      }
      return p;
    }));
  };

  const getQuizForChapter = (bookId: string, chapter: number) => {
    const allQuizzes = [...sampleQuizzes, ...customQuizzes];
    return allQuizzes.filter(q => q.bookId === bookId && q.chapter === chapter);
  };

  const getParticipantRanking = () => {
    return [...participants].sort((a, b) => b.totalScore - a.totalScore);
  };

  const getCurrentReading = () => {
    if (!activeSchedule) return null;
    
    const book = bibleBooks.find(b => b.id === activeSchedule.bookId);
    if (!book) return null;

    // Calculate current chapter based on days since start
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
    readings,
    bibleBooks,
    customQuizzes,
    activeSchedule,
    addParticipant,
    setActiveBook,
    createQuiz,
    completeQuiz,
    getQuizForChapter,
    getParticipantRanking,
    getCurrentReading
  };
};
