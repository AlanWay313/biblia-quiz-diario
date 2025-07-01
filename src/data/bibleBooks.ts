
import { BibleBook } from '@/types/bible';

export const bibleBooks: BibleBook[] = [
  // Antigo Testamento
  { id: 'genesis', name: 'Gênesis', chapters: 50, testament: 'Antigo' },
  { id: 'exodus', name: 'Êxodo', chapters: 40, testament: 'Antigo' },
  { id: 'leviticus', name: 'Levítico', chapters: 27, testament: 'Antigo' },
  { id: 'numbers', name: 'Números', chapters: 36, testament: 'Antigo' },
  { id: 'deuteronomy', name: 'Deuteronômio', chapters: 34, testament: 'Antigo' },
  { id: 'joshua', name: 'Josué', chapters: 24, testament: 'Antigo' },
  { id: 'judges', name: 'Juízes', chapters: 21, testament: 'Antigo' },
  { id: 'ruth', name: 'Rute', chapters: 4, testament: 'Antigo' },
  { id: '1samuel', name: '1 Samuel', chapters: 31, testament: 'Antigo' },
  { id: '2samuel', name: '2 Samuel', chapters: 24, testament: 'Antigo' },
  
  // Novo Testamento
  { id: 'matthew', name: 'Mateus', chapters: 28, testament: 'Novo' },
  { id: 'mark', name: 'Marcos', chapters: 16, testament: 'Novo' },
  { id: 'luke', name: 'Lucas', chapters: 24, testament: 'Novo' },
  { id: 'john', name: 'João', chapters: 21, testament: 'Novo' },
  { id: 'acts', name: 'Atos', chapters: 28, testament: 'Novo' },
  { id: 'romans', name: 'Romanos', chapters: 16, testament: 'Novo' },
  { id: '1corinthians', name: '1 Coríntios', chapters: 16, testament: 'Novo' },
  { id: '2corinthians', name: '2 Coríntios', chapters: 13, testament: 'Novo' },
  { id: 'galatians', name: 'Gálatas', chapters: 6, testament: 'Novo' },
  { id: 'ephesians', name: 'Efésios', chapters: 6, testament: 'Novo' },
];
