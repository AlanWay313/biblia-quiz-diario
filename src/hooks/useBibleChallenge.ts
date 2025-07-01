
import { useState, useEffect } from 'react';
import { Participant, BibleBook, QuizResult, ChapterReading } from '@/types/bible';
import { bibleBooks } from '@/data/bibleBooks';
import { sampleQuizzes } from '@/data/sampleQuizzes';

export const useBibleChallenge = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentParticipant, setCurrentParticipant] = useState<Participant | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [readings, setReadings] = useState<ChapterReading[]>([]);

  useEffect(() => {
    // Load initial data (would come from backend in real app)
    const sampleParticipants: Participant[] = [
      {
        id: '1',
        name: 'Maria Silva',
        email: 'maria@email.com',
        totalScore: 850,
        chaptersCompleted: 15,
        currentBook: 'genesis',
        currentChapter: 16,
        joinDate: new Date('2024-01-01'),
        lastActivity: new Date()
      },
      {
        id: '2',
        name: 'João Santos',
        email: 'joao@email.com',
        totalScore: 720,
        chaptersCompleted: 12,
        currentBook: 'genesis',
        currentChapter: 13,
        joinDate: new Date('2024-01-02'),
        lastActivity: new Date()
      },
      {
        id: '3',
        name: 'Ana Costa',
        email: 'ana@email.com',
        totalScore: 950,
        chaptersCompleted: 18,
        currentBook: 'exodus',
        currentChapter: 2,
        joinDate: new Date('2024-01-01'),
        lastActivity: new Date()
      }
    ];
    
    setParticipants(sampleParticipants);
    setCurrentParticipant(sampleParticipants[0]);
  }, []);

  const addParticipant = (name: string, email: string) => {
    const newParticipant: Participant = {
      id: Date.now().toString(),
      name,
      email,
      totalScore: 0,
      chaptersCompleted: 0,
      currentBook: 'genesis',
      currentChapter: 1,
      joinDate: new Date(),
      lastActivity: new Date()
    };
    
    setParticipants(prev => [...prev, newParticipant]);
    return newParticipant;
  };

  const completeQuiz = (participantId: string, bookId: string, chapter: number, answers: number[], score: number) => {
    const questions = sampleQuizzes.filter(q => q.bookId === bookId && q.chapter === chapter);
    
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
    return sampleQuizzes.filter(q => q.bookId === bookId && q.chapter === chapter);
  };

  const getParticipantRanking = () => {
    return [...participants].sort((a, b) => b.totalScore - a.totalScore);
  };

  return {
    participants,
    currentParticipant,
    setCurrentParticipant,
    quizResults,
    readings,
    bibleBooks,
    addParticipant,
    completeQuiz,
    getQuizForChapter,
    getParticipantRanking
  };
};
