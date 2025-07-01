
export interface Participant {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  totalScore: number;
  chaptersCompleted: number;
  currentBook: string;
  currentChapter: number;
  joinDate: Date;
  lastActivity: Date;
}

export interface BibleBook {
  id: string;
  name: string;
  chapters: number;
  testament: 'Antigo' | 'Novo';
}

export interface ChapterReading {
  bookId: string;
  bookName: string;
  chapter: number;
  date: Date;
  isCompleted: boolean;
  participantId: string;
}

export interface QuizQuestion {
  id: string;
  bookId: string;
  chapter: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface QuizResult {
  id: string;
  participantId: string;
  bookId: string;
  chapter: number;
  questions: QuizQuestion[];
  answers: number[];
  score: number;
  completedAt: Date;
}
