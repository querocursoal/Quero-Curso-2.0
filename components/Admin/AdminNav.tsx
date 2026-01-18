
import React, { useState } from 'react';
import { LayoutDashboard, BookOpen, Settings, BarChart3, Users, Trophy, Award } from 'lucide-react';

type AdminView = 'dashboard' | 'courses' | 'settings' | 'ranking' | 'students' | 'missions' | 'points';

interface AdminNavProps {
  activeView: AdminView;
  setActiveView: (view: AdminView) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  const activeClasses = 'border-b-2 border-[#333fa4] text-[#333fa4]';
  const inactiveClasses = 'text-gray-500 hover:text-gray-800';

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}
    >
      {icon}
      {label}
    </button>
  );
};

const AdminNav: React.FC<AdminNavProps> = ({ activeView, setActiveView }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="container mx-auto px-6 border-b border-gray-200">
      <div className="flex items-center overflow-x-auto">
        <NavItem
          label="Dashboard"
          icon={<LayoutDashboard size={18} />}
          isActive={activeView === 'dashboard'}
          onClick={() => setActiveView('dashboard')}
        />
        <NavItem
          label="Alunos"
          icon={<Users size={18} />}
          isActive={activeView === 'students'}
          onClick={() => setActiveView('students')}
        />
        <NavItem
          label="Cursos"
          icon={<BookOpen size={18} />}
          isActive={activeView === 'courses'}
          onClick={() => setActiveView('courses')}
        />
        <NavItem
          label="Missões"
          icon={<Trophy size={18} />}
          isActive={activeView === 'missions'}
          onClick={() => setActiveView('missions')}
        />
        <NavItem
          label="Pontuação"
          icon={<Award size={18} />}
          isActive={activeView === 'points'}
          onClick={() => setActiveView('points')}
        />
        <NavItem
          label="Análise"
          icon={<BarChart3 size={18} />}
          isActive={activeView === 'ranking'}
          onClick={() => setActiveView('ranking')}
        />
        <NavItem
          label="Configurações"
          icon={<Settings size={18} />}
          isActive={activeView === 'settings'}
          onClick={() => setActiveView('settings')}
        />
      </div>
    </nav>
  );
};

export default AdminNav;
