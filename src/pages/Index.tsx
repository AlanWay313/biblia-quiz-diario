
import { useState } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import ParticipantsList from '@/components/ParticipantsList';
import QuizComponent from '@/components/QuizComponent';
import BooksOverview from '@/components/BooksOverview';
import AdminPanel from '@/components/AdminPanel';
import { useBibleChallenge } from '@/hooks/useBibleChallenge';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const { currentParticipant, completeQuiz, getCurrentReading } = useBibleChallenge();
  const { toast } = useToast();
  const currentReading = getCurrentReading();

  const handleQuizComplete = (score: number) => {
    if (currentParticipant && currentReading) {
      completeQuiz(currentParticipant.id, currentReading.book.id, currentReading.chapter, [], score);
      toast({
        title: "Quiz Concluído!",
        description: `Você conquistou ${score} pontos. Continue assim!`,
      });
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'participants':
        return <ParticipantsList />;
      case 'quiz':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-2">Quiz Diário</h2>
              <p className="text-gray-600">Teste seus conhecimentos sobre o capítulo de hoje</p>
            </div>
            {currentReading ? (
              <QuizComponent 
                bookId={currentReading.book.id}
                chapter={currentReading.chapter}
                onComplete={handleQuizComplete}
              />
            ) : (
              <div className="text-center text-gray-600 py-12">
                <p>Nenhum cronograma de leitura ativo</p>
                <p className="text-sm">Aguarde o administrador definir o próximo livro</p>
              </div>
            )}
          </div>
        );
      case 'books':
        return <BooksOverview />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="container mx-auto px-4 py-8">
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default Index;
