
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useBibleChallenge } from '@/hooks/useBibleChallenge';
import { Book, BookOpen } from 'lucide-react';

const BooksOverview = () => {
  const { bibleBooks, participants } = useBibleChallenge();

  const oldTestamentBooks = bibleBooks.filter(book => book.testament === 'Antigo');
  const newTestamentBooks = bibleBooks.filter(book => book.testament === 'Novo');

  const getBookProgress = (bookId: string) => {
    // Simple mock progress calculation
    const participantReading = participants.find(p => p.currentBook === bookId);
    if (!participantReading) return 0;
    
    const book = bibleBooks.find(b => b.id === bookId);
    if (!book) return 0;
    
    return Math.round((participantReading.currentChapter / book.chapters) * 100);
  };

  const BooksList = ({ books, testament }: { books: typeof bibleBooks, testament: string }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Book className="h-5 w-5" />
          {testament} Testamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {books.map((book) => {
            const progress = getBookProgress(book.id);
            const isActive = participants.some(p => p.currentBook === book.id);
            
            return (
              <div
                key={book.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  <h3 className="font-semibold text-sm">{book.name}</h3>
                  {isActive && (
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                      Atual
                    </Badge>
                  )}
                </div>
                
                <p className="text-xs text-gray-600 mb-3">{book.chapters} capítulos</p>
                
                {progress > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Progresso</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-blue-900 mb-2">Livros da Bíblia</h2>
        <p className="text-gray-600">Acompanhe o progresso de leitura em cada livro bíblico</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-3 rounded-full">
                <Book className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-amber-700">Antigo Testamento</p>
                <p className="text-2xl font-bold text-amber-800">{oldTestamentBooks.length} livros</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-700">Novo Testamento</p>
                <p className="text-2xl font-bold text-blue-800">{newTestamentBooks.length} livros</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <BooksList books={oldTestamentBooks} testament="Antigo" />
        <BooksList books={newTestamentBooks} testament="Novo" />
      </div>
    </div>
  );
};

export default BooksOverview;
