
import React, { useMemo } from 'react';
import { useCourses } from '../../context/CoursesContext';
import { useSettings } from '../../context/SettingsContext';
import { isAlmostFull, isSoldOut, isClosingSoon, isPast } from '../../utils/courseUtils';
import { mockSignups } from '../../mockData';
import { Course, MockSignup } from '../../types';
import {
  Book, Star, Users, BarChart2, Bell, Zap, PlusCircle, Settings, Eye,
  TrendingUp, TrendingDown, Clock, UserCheck, CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

// --- SUB-COMPONENTS ---

const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: number | string;
  // FIX: Changed type from string to React.ReactNode to allow JSX elements
  comparison?: React.ReactNode;
  color: string;
}> = ({ icon, title, value, comparison, color }) => (
  <div className={`bg-white p-6 rounded-xl shadow-md flex flex-col justify-between border-l-4 ${color}`}>
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-4">
        {icon}
        <p className="text-md text-gray-600 font-medium">{title}</p>
      </div>
    </div>
    <div className="mt-2">
      <p className="text-4xl font-bold text-gray-800">{value}</p>
      {comparison && <p className="text-sm text-gray-500 flex items-center gap-1">{comparison}</p>}
    </div>
  </div>
);

const CourseStatusItem: React.FC<{ course: Course }> = ({ course }) => {
  let status: { text: string; color: string; } = { text: 'Ativo', color: 'bg-green-500' };
  if (isPast(course)) status = { text: 'Encerrado', color: 'bg-gray-400' };
  else if (isClosingSoon(course)) status = { text: 'Encerrando', color: 'bg-yellow-500' };

  return (
    <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          {course.isVip && <Star size={16} className="text-[#bab709]" />}
          <p className="font-bold text-[#333fa4]">{course.name}</p>
        </div>
        <div className={`text-xs font-semibold px-2 py-1 rounded-full text-white ${status.color}`}>
          {status.text}
        </div>
      </div>
      <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
        <span>{course.city}</span>
        <span>{course.date}</span>
      </div>
    </div>
  );
};

const QuickActions: React.FC<{ setActiveView: (view: 'courses' | 'settings') => void }> = ({ setActiveView }) => (
  <div className="bg-white p-6 rounded-xl shadow-md h-full flex flex-col justify-between">
    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Zap size={20} />Ações Rápidas</h3>
    <div className="space-y-3">
      <button onClick={() => setActiveView('courses')} className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-3 font-semibold text-[#333fa4]">
        <PlusCircle size={18} /> Adicionar Novo Curso
      </button>
      <button onClick={() => setActiveView('settings')} className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center gap-3 font-semibold text-gray-700">
        <Settings size={18} /> Ajustar Regras de Escassez
      </button>
    </div>
  </div>
);

const AlertItem: React.FC<{ course: Course, message: string }> = ({ course, message }) => (
  <div className="bg-yellow-50 border-l-4 border-[#bab709] p-4 rounded-r-lg flex justify-between items-center">
    <div>
      <p className="font-bold text-yellow-800">{message}</p>
      <p className="text-sm text-yellow-700">{course.name}</p>
    </div>
    <Link to={`/curso/${course.id}`} className="py-1 px-3 text-sm bg-white rounded-full shadow-sm hover:bg-gray-100 font-semibold text-[#333fa4]">Ver curso</Link>
  </div>
);

// --- MAIN DASHBOARD COMPONENT ---

const Dashboard: React.FC<{ setActiveView: (view: 'dashboard' | 'courses' | 'settings') => void; }> = ({ setActiveView }) => {
  const { courses, loading: coursesLoading } = useCourses();
  const { settings, loading: settingsLoading } = useSettings();

  // Memoized calculations for performance
  const { stats, alerts, metrics, recentSignups } = useMemo(() => {
    // FIX: Provide a default structure for stats during loading to prevent type errors.
    if (coursesLoading || settingsLoading) return {
      stats: { totalCourses: 0, vips: 0, totalRemaining: 0, signupsToday: 0 },
      alerts: [],
      metrics: {},
      recentSignups: []
    };

    const activeCourses = courses.filter(c => !isPast(c));

    const calculatedStats = {
      totalCourses: activeCourses.length,
      vips: activeCourses.filter(c => c.isVip).length,
      signupsToday: mockSignups.filter(s => new Date(s.signupDate).toDateString() === new Date().toDateString()).length
    };

    const calculatedAlerts = activeCourses
      .filter(c => isClosingSoon(c, 2))
      .map(c => ({ course: c, message: `Inscrições encerram em 2 dias` }));

    return { stats: calculatedStats, alerts: calculatedAlerts, recentSignups: mockSignups.slice(0, 5) };
  }, [courses, settings, coursesLoading, settingsLoading]);


  return (
    <div className="space-y-8">
      {/* 1. Overview Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Book size={28} className="text-[#333fa4]" />} title="Cursos Ativos" value={stats.totalCourses || 0} color="border-[#333fa4]" />
        <StatCard icon={<UserCheck size={28} className="text-green-500" />} title="Inscrições Hoje" value={stats.signupsToday || 0} comparison={<><TrendingUp size={14} className="text-green-500" />+2 vs ontem</>} color="border-green-500" />
        <StatCard icon={<Star size={28} className="text-[#bab709]" />} title="Cursos VIP Ativos" value={stats.vips || 0} color="border-[#bab709]" />
        <StatCard icon={<Zap size={28} className="text-gray-400" />} title="Leads Captados" value="---" color="border-gray-300" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Alerts Section */}
          {alerts.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Bell size={20} className="text-yellow-500" />Alertas Importantes</h3>
              <div className="space-y-3">
                {alerts.map(({ course, message }) => <AlertItem key={course.id} course={course} message={message} />)}
              </div>
            </div>
          )}

          {/* Course Status Section */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><BarChart2 size={20} />Situação dos Cursos</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {courses.length > 0 ? courses.map(course => <CourseStatusItem key={course.id} course={course} />) : <p className="text-gray-500 text-center py-4">Nenhum curso cadastrado.</p>}
            </div>
          </div>
        </div>

        {/* 3. Sidebar Area */}
        <div className="space-y-8">
          <QuickActions setActiveView={setActiveView} />

          {/* Recent Signups Section */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Clock size={20} />Inscrições Recentes</h3>
            <div className="space-y-4">
              {recentSignups.map((signup: MockSignup, index: number) => (
                <div key={signup.id} className={`flex items-start gap-3 ${index === 0 ? 'animate-pulse' : ''}`}>
                  <CheckCircle size={18} className="text-green-500 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">{signup.studentName}</p>
                    <p className="text-sm text-gray-500">{signup.courseName}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
