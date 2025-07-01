
import { Book } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-2 rounded-lg">
              <Book className="h-8 w-8 text-slate-900" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Desafio Bíblico</h1>
              <p className="text-blue-200 text-sm">Leitura diária com conhecimento</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-200">Transforme sua vida através da Palavra</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
