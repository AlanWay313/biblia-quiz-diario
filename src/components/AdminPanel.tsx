
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useBibleChallenge } from '@/hooks/useBibleChallenge';
import { Settings, Plus, BookOpen, Calendar, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminPanel = () => {
  const { bibleBooks, currentParticipant, setActiveBook, createQuiz, activeSchedule } = useBibleChallenge();
  const { toast } = useToast();
  
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);

  if (!currentParticipant?.isAdmin) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Settings className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Acesso Restrito</h3>
          <p className="text-gray-500">Apenas administradores podem acessar esta área.</p>
        </CardContent>
      </Card>
    );
  }

  const handleBookSelection = () => {
    if (selectedBook) {
      setActiveBook(selectedBook);
      toast({
        title: "Livro Selecionado!",
        description: `${bibleBooks.find(b => b.id === selectedBook)?.name} foi definido como livro atual.`,
      });
      setIsScheduleDialogOpen(false);
    }
  };

  const handleCreateQuiz = () => {
    if (selectedBook && selectedChapter && question && options.every(opt => opt.trim())) {
      createQuiz({
        bookId: selectedBook,
        chapter: parseInt(selectedChapter),
        question,
        options,
        correctAnswer,
        explanation,
        createdBy: currentParticipant.id
      });
      
      toast({
        title: "Quiz Criado!",
        description: "Nova pergunta adicionada com sucesso.",
      });
      
      // Reset form
      setQuestion('');
      setOptions(['', '', '', '']);
      setCorrectAnswer(0);
      setExplanation('');
      setIsQuizDialogOpen(false);
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const currentBook = bibleBooks.find(b => b.id === activeSchedule?.bookId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-blue-900 mb-2">Painel Administrativo</h2>
        <p className="text-gray-600">Gerencie o cronograma de leitura e crie quizzes</p>
      </div>

      {/* Current Schedule */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Calendar className="h-5 w-5" />
            Cronograma Atual
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeSchedule && currentBook ? (
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-blue-900">{currentBook.name}</h3>
                <p className="text-blue-600">{currentBook.chapters} capítulos • {currentBook.testament} Testamento</p>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Ativo
              </Badge>
            </div>
          ) : (
            <div className="text-center text-gray-600">
              <p>Nenhum livro selecionado para leitura</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900">Definir Livro para Leitura</h3>
                    <p className="text-sm text-gray-600">Escolha o próximo livro do desafio</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Selecionar Livro para Leitura</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Selecione o Livro</Label>
                <Select value={selectedBook} onValueChange={setSelectedBook}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha um livro da Bíblia" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {bibleBooks.map((book) => (
                      <SelectItem key={book.id} value={book.id}>
                        {book.name} ({book.chapters} cap.) - {book.testament} Testamento
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleBookSelection} className="w-full" disabled={!selectedBook}>
                Definir como Livro Atual
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isQuizDialogOpen} onOpenChange={setIsQuizDialogOpen}>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <HelpCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900">Criar Quiz</h3>
                    <p className="text-sm text-gray-600">Adicione perguntas para os capítulos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Nova Pergunta do Quiz</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Livro</Label>
                  <Select value={selectedBook} onValueChange={setSelectedBook}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o livro" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {bibleBooks.map((book) => (
                        <SelectItem key={book.id} value={book.id}>
                          {book.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Capítulo</Label>
                  <Input
                    type="number"
                    min="1"
                    value={selectedChapter}
                    onChange={(e) => setSelectedChapter(e.target.value)}
                    placeholder="Número do capítulo"
                  />
                </div>
              </div>

              <div>
                <Label>Pergunta</Label>
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Digite a pergunta do quiz"
                />
              </div>

              <div>
                <Label>Opções de Resposta</Label>
                <div className="space-y-2">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer ${
                        correctAnswer === index ? 'border-green-500 bg-green-500' : 'border-gray-300'
                      }`} onClick={() => setCorrectAnswer(index)}>
                        {correctAnswer === index && <div className="w-3 h-3 rounded-full bg-white" />}
                      </div>
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Opção ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2">Clique no círculo para marcar a resposta correta</p>
              </div>

              <div>
                <Label>Explicação (Opcional)</Label>
                <Input
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Explicação da resposta correta"
                />
              </div>

              <Button 
                onClick={handleCreateQuiz} 
                className="w-full"
                disabled={!selectedBook || !selectedChapter || !question || !options.every(opt => opt.trim())}
              >
                Criar Pergunta
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminPanel;
