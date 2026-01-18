
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { LogOut } from 'lucide-react';
import ControlPanelIcon from '../components/icons/ControlPanelIcon';
import Dashboard from '../components/Admin/Dashboard';
import CourseManagement from '../components/Admin/CourseManagement';
import Settings from '../components/Admin/Settings';
import AdminNav from '../components/Admin/AdminNav';
import CourseRanking from '../components/Admin/CourseRanking';
import StudentManagement from '../components/Admin/StudentManagement';
import MissionManagement from '../components/Admin/MissionManagement';
import PointRulesConfig from '../components/Admin/PointRulesConfig';

type AdminView = 'dashboard' | 'courses' | 'settings' | 'ranking' | 'students' | 'missions' | 'points';

const AdminPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<AdminView>('dashboard');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard setActiveView={setActiveView} />;
      case 'students':
        return <StudentManagement />;
      case 'courses':
        return <CourseManagement />;
      case 'missions':
        return <MissionManagement />;
      case 'points':
        return <PointRulesConfig />;
      case 'settings':
        return <Settings />;
      case 'ranking':
        return <CourseRanking />;
      default:
        return <Dashboard setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white text-gray-800 shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[#333fa4] p-2 rounded-lg">
              <ControlPanelIcon size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#333fa4]">
              Painel de Controle
            </h1>
          </div>
          <Button onClick={handleLogout} variant="primary" className="py-2 px-4 text-sm">
            <LogOut size={16} />
            Sair
          </Button>
        </div>
        <AdminNav activeView={activeView} setActiveView={setActiveView} />
      </header>

      <main className="container mx-auto px-6 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminPage;
