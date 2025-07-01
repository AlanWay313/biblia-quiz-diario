
import { Book, Users, Calendar } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white shadow-2xl">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-3 rounded-xl shadow-lg">
              <Book className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                Desafio Bíblico
              </h1>
              <p className="text-purple-200 text-lg">Transforme sua vida através da Palavra</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <Users className="h-5 w-5 text-yellow-300" />
              <span className="text-sm font-medium">Comunidade de Fé</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <Calendar className="h-5 w-5 text-yellow-300" />
              <span className="text-sm font-medium">Leitura Diária</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
