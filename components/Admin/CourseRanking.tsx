import React, { useState, useMemo } from 'react';
import { useCourses } from '../../context/CoursesContext';
import { Course } from '../../types';
import {
  calculateFillRate,
  getPrediction,
  isAlmostFull,
  isClosingSoon,
  isPast,
  isSoldOut,
  parseDate,
} from '../../utils/courseUtils';
import { useSettings } from '../../context/SettingsContext';
import {
  BarChart,
  ChevronDown,
  ChevronUp,
  Info,
  Star,
} from 'lucide-react';

type SortKey = 'occupancy' | 'signups' | 'fillRate' | 'default';

const CourseRanking: React.FC = () => {
  const { courses } = useCourses();
  const { settings } = useSettings();
  const [sortBy, setSortBy] = useState<SortKey>('default');

  const processedCourses = useMemo(() => {
    return courses
      .filter(c => !isPast(c)); // Show only active or upcoming courses
  }, [courses]);

  const sortedCourses = useMemo(() => {
    const sorted = [...processedCourses];
    switch (sortBy) {
      case 'occupancy':
        return sorted.sort((a, b) => b.occupancy - a.occupancy);
      case 'signups':
        return sorted.sort((a, b) => b.signups - a.signups);
      case 'fillRate':
        return sorted.sort((a, b) => b.fillRate - a.fillRate);
      default:
        // Default sort remains by VIP/Almost Full status
        return sorted.sort((a, b) => {
          const score = (c: Course) => (c.isVip ? 2 : 0) + (isAlmostFull(c, settings.lowStockThreshold) ? 1 : 0);
          return score(b) - score(a);
        });
    }
  }, [processedCourses, sortBy, settings.lowStockThreshold]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Cursos Ativos</h2>
      </div>

      <div className="space-y-4">
        {sortedCourses.length > 0 ? (
          sortedCourses.map((course, index) => (
            <RankingItem
              key={course.id}
              course={course}
              rank={index + 1}
              settings={settings}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 py-8 bg-white rounded-lg shadow-md">
            Nenhum curso ativo para exibir no ranking.
          </p>
        )}
      </div>
    </div>
  );
};


// --- Sub-components ---

const SortButton: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${active ? 'bg-[#333fa4] text-white shadow' : 'text-gray-600 hover:bg-gray-100'
      }`}
  >
    {label}
  </button>
);


const RankingItem: React.FC<{
  course: any;
  rank: number;
  settings: any;
}> = ({ course, rank, settings }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const prediction = getPrediction(course);

  const getRankColor = () => {
    if (rank === 1) return 'border-yellow-400 bg-yellow-50';
    if (rank === 2) return 'border-gray-300 bg-gray-50';
    if (rank === 3) return 'border-amber-500 bg-amber-50';
    return 'border-transparent bg-white';
  };

  const getStatusTag = () => {
    if (isSoldOut(course)) return <Tag color="bg-red-100 text-red-800" text="Esgotado" />;
    if (isClosingSoon(course)) return <Tag color="bg-yellow-100 text-yellow-800" text="Encerrando" />;
    if (isAlmostFull(course, settings.lowStockThreshold)) return <Tag color="bg-orange-100 text-orange-800" text="Poucas Vagas" />;
    return <Tag color="bg-green-100 text-green-800" text="Normal" />;
  };

  return (
    <div className={`rounded-xl shadow-md transition-all duration-300 border-l-4 ${getRankColor()}`}>
      <div className="p-4 flex items-center gap-4">
        <div className="flex-none w-8 text-center">
          <span className="text-2xl font-bold text-gray-500">{rank}</span>
        </div>
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            {course.isVip && <Star size={16} className="text-yellow-500" />}
            <h4 className="font-bold text-lg text-[#333fa4]">{course.name}</h4>
            {getStatusTag()}
          </div>
          <div className="text-sm text-gray-500">
            {course.city} | {course.date}
          </div>
        </div>
      </div>
    </div>
  );
};

const Metric: React.FC<{ title: string; value: string | number, icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div>
    <div className="flex items-center justify-center gap-1 text-gray-500 text-sm">
      {icon}
      <span>{title}</span>
    </div>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
);

const Tag: React.FC<{ color: string; text: string }> = ({ color, text }) => (
  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${color}`}>
    {text}
  </span>
);

const PredictionItem: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div className="flex items-start gap-2">
    <span className="font-semibold text-gray-600 w-1/2">{label}:</span>
    <span className="font-bold text-gray-800">{value}</span>
  </div>
);


export default CourseRanking;
