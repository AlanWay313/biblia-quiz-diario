
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useBibleChallenge } from '@/hooks/useBibleChallenge';
import { Book, Calendar, Check } from 'lucide-react';

const ParticipantsList = () => {
  const { participants, addParticipant, getParticipantRanking } = useBibleChallenge();
  const [newParticipantName, setNewParticipantName] = useState('');
  const [newParticipantEmail, setNewParticipantEmail] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const ranking = getParticipantRanking();

  const handleAddParticipant = () => {
    if (newParticipantName.trim() && newParticipantEmail.trim()) {
      addParticipant(newParticipantName.trim(), newParticipantEmail.trim());
      setNewParticipantName('');
      setNewParticipantEmail('');
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-900">Participantes do Desafio</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Adicionar Participante
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Participante</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nome completo</label>
                <Input
                  value={newParticipantName}
                  onChange={(e) => setNewParticipantName(e.target.value)}
                  placeholder="Digite o nome do participante"
                />
              </div>
              <div>
                <label className="text-sm font-medium">E-mail</label>
                <Input
                  type="email"
                  value={newParticipantEmail}
                  onChange={(e) => setNewParticipantEmail(e.target.value)}
                  placeholder="Digite o e-mail do participante"
                />
              </div>
              <Button 
                onClick={handleAddParticipant}
                className="w-full"
                disabled={!newParticipantName.trim() || !newParticipantEmail.trim()}
              >
                Adicionar ao Desafio
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ranking.map((participant, index) => (
          <Card key={participant.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{participant.name}</CardTitle>
                <Badge className={`${
                  index === 0 ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                  index === 1 ? 'bg-gray-100 text-gray-800 border-gray-200' :
                  index === 2 ? 'bg-amber-100 text-amber-800 border-amber-200' :
                  'bg-blue-100 text-blue-800 border-blue-200'
                }`}>
                  #{index + 1}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{participant.email}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Capítulos</span>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {participant.chaptersCompleted}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Book className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Livro Atual</span>
                </div>
                <span className="text-sm font-medium">{participant.currentBook}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">Pontuação</span>
                </div>
                <span className="text-lg font-bold text-purple-600">{participant.totalScore}</span>
              </div>

              <div className="pt-2 border-t">
                <p className="text-xs text-gray-500">
                  Última atividade: {participant.lastActivity.toLocaleDateString('pt-BR')}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {participants.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Book className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum participante ainda</h3>
            <p className="text-gray-500 mb-4">Adicione o primeiro participante para começar o desafio!</p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              Adicionar Primeiro Participante
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ParticipantsList;
