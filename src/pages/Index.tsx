
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
        title: "🎉 Quiz Concluído!",
        description: `Parabéns! Você conquistou ${score} pontos. Continue assim!`,
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
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Quiz Diário
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Teste seus conhecimentos sobre o capítulo de hoje e fortaleça sua compreensão da Palavra de Deus
              </p>
            </div>
            {currentReading ? (
              <div className="max-w-4xl mx-auto">
                <QuizComponent 
                  bookId={currentReading.book.id}
                  chapter={currentReading.chapter}
                  onComplete={handleQuizComplete}
                />
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-12 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    📖
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Aguardando Cronograma</h3>
                  <p className="text-gray-600">Nenhum cronograma de leitura ativo no momento</p>
                  <p className="text-sm text-gray-500 mt-2">Aguarde o administrador definir o próximo livro</p>
                </div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <Header />
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          {renderCurrentView()}
        </div>
      </main>
    </div>
  );
};

export default Index;
