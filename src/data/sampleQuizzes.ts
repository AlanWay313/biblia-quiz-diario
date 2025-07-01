
import { QuizQuestion } from '@/types/bible';

export const sampleQuizzes: QuizQuestion[] = [
  {
    id: '1',
    bookId: 'genesis',
    chapter: 1,
    question: 'Quantos dias Deus levou para criar o mundo?',
    options: ['5 dias', '6 dias', '7 dias', '8 dias'],
    correctAnswer: 1,
    explanation: 'Deus criou o mundo em 6 dias e descansou no sétimo dia.'
  },
  {
    id: '2',
    bookId: 'genesis',
    chapter: 1,
    question: 'O que Deus criou no primeiro dia?',
    options: ['Os animais', 'A luz', 'As plantas', 'O homem'],
    correctAnswer: 1,
    explanation: 'No primeiro dia, Deus disse: "Haja luz", e houve luz.'
  },
  {
    id: '3',
    bookId: 'genesis',
    chapter: 1,
    question: 'Em que dia Deus criou o homem?',
    options: ['Quinto dia', 'Sexto dia', 'Sétimo dia', 'Primeiro dia'],
    correctAnswer: 1,
    explanation: 'Deus criou o homem no sexto dia, à sua imagem e semelhança.'
  },
  {
    id: '4',
    bookId: 'matthew',
    chapter: 1,
    question: 'Qual é o significado do nome Jesus?',
    options: ['Rei dos reis', 'Filho de Deus', 'O Salvador', 'O Messias'],
    correctAnswer: 2,
    explanation: 'Jesus significa "O Salvador", pois ele salvará seu povo dos seus pecados.'
  },
  {
    id: '5',
    bookId: 'matthew',
    chapter: 1,
    question: 'Como Jesus foi concebido?',
    options: ['Naturalmente', 'Por milagre', 'Pelo Espírito Santo', 'Por adoção'],
    correctAnswer: 2,
    explanation: 'Jesus foi concebido pelo Espírito Santo no ventre de Maria.'
  }
];
