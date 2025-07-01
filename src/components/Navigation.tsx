
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Book, Calendar, HelpCircle, Book as BookIcon, Settings, Menu, X } from 'lucide-react';
import { useBibleChallenge } from '@/hooks/useBibleChallenge';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Navigation = ({ currentView, onViewChange }: NavigationProps) => {
  const { currentParticipant } = useBibleChallenge();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Calendar, color: 'from-blue-500 to-blue-600' },
    { id: 'participants', label: 'Participantes', icon: BookIcon, color: 'from-green-500 to-green-600' },
    { id: 'quiz', label: 'Quiz Diário', icon: HelpCircle, color: 'from-purple-500 to-purple-600' },
    { id: 'books', label: 'Livros', icon: Book, color: 'from-orange-500 to-orange-600' }
  ];

  if (currentParticipant?.isAdmin) {
    navItems.push({ 
      id: 'admin', 
      label: 'Administração', 
      icon: Settings, 
      color: 'from-red-500 to-red-600' 
    });
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Mobile menu button */}
        <div className="md:hidden flex justify-between items-center py-4">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex space-x-2 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => onViewChange(item.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-105` 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Mobile navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => {
                    onViewChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive 
                      ? `bg-gradient-to-r ${item.color} text-white` 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
