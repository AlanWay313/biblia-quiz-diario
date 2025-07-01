
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBibleChallenge } from '@/hooks/useBibleChallenge';
import { Book, Calendar, Check, HelpCircle } from 'lucide-react';

const Dashboard = () => {
  const { participants, currentParticipant, getParticipantRanking, getCurrentReading } = useBibleChallenge();
  const ranking = getParticipantRanking();
  const currentReading = getCurrentReading();

  return (
    <div className="space-y-6">
      {/* Today's Reading Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Calendar className="h-5 w-5" />
            Leitura de Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentReading ? (
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-blue-900">
                  {currentReading.book.name} {currentReading.chapter}
                </h3>
                <p className="text-blue-600">{currentReading.date.toLocaleDateString('pt-BR')}</p>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Capítulo do Dia
              </Badge>
            </div>
          ) : (
            <div className="text-center text-gray-600">
              <p>Nenhum cronograma de leitura ativo</p>
              <p className="text-sm">Aguarde o administrador definir o próximo livro</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Book className="h-4 w-4" />
              Total de Participantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{participants.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Check className="h-4 w-4" />
              Capítulos Concluídos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {participants.reduce((sum, p) => sum + p.chaptersCompleted, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Pontuação Média
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {participants.length > 0 
                ? Math.round(participants.reduce((sum, p) => sum + p.totalScore, 0) / participants.length)
                : 0
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Participant Progress */}
      {currentParticipant && (
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-900">Seu Progresso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Participante:</span>
                <span className="text-blue-900 font-bold">{currentParticipant.name}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Capítulos Concluídos:</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {currentParticipant.chaptersCompleted}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Pontuação Total:</span>
                <span className="text-2xl font-bold text-purple-600">{currentParticipant.totalScore}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Posição no Ranking:</span>
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  #{ranking.findIndex(p => p.id === currentParticipant.id) + 1}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-blue-900">Ranking dos Participantes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ranking.slice(0, 5).map((participant, index) => (
              <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-amber-600' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{participant.name}</p>
                    <p className="text-sm text-gray-600">{participant.chaptersCompleted} capítulos</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-purple-600">{participant.totalScore} pts</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
