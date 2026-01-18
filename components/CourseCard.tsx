
import React from 'react';
import { Course } from '../types';
import { Tag, Users, Calendar, MapPin, ArrowRight, Eye, Star, AlertTriangle } from 'lucide-react';
import Button from './Button';
import { useSettings } from '../context/SettingsContext';
import { isAlmostFull, isSoldOut } from '../utils/courseUtils';

interface CourseCardProps {
  course: Course;
  displayMode: 'summary' | 'full';
}

const CourseCard: React.FC<CourseCardProps> = ({ course, displayMode }) => {
  const { settings } = useSettings();
  const detailsUrl = `/curso/${course.id}`;

  const almostFull = isAlmostFull(course, settings.lowStockThreshold);
  const soldOut = isSoldOut(course);

  // Layout Summary (Sempre Vertical agora, conforme solicitado)
  if (displayMode === 'summary') {
    return (
      <div className={`bg-white rounded-[2rem] shadow-[0_4px_25px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col h-full border border-gray-100 group transition-all duration-500 hover:shadow-[0_25px_50px_rgba(0,0,0,0.12)] hover:-translate-y-2`}>
        {/* Imagem no Topo */}
        <div className="relative aspect-[0.8] overflow-hidden bg-gray-100">
          <img
            src={course.thumbnail}
            alt={course.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
            style={{ objectPosition: `center ${course.thumbnailAlignmentPercent ?? 50}%` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#002366]/60 to-transparent opacity-60"></div>

          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <div className="flex flex-col gap-2">
              {course.isVip && (
                <div className="bg-[#00D1FF] text-white font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[10px] shadow-lg uppercase">
                  <Star size={12} fill="white" /> Curso VIP
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 items-end">
              {soldOut ? (
                <div className="bg-gray-900/90 text-white font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[10px] shadow-lg uppercase">
                  Esgotado
                </div>
              ) : almostFull ? (
                <div className="bg-[#FF4B4B] text-white font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[10px] shadow-lg uppercase">
                  <AlertTriangle size={12} fill="white" /> Últimas Vagas
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Conteúdo Abaixo */}
        <div className="p-7 flex flex-col flex-grow">
          <h3 className="text-xl font-black text-[#002366] mb-5 leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight">
            {course.name}
          </h3>

          <div className="space-y-4 mb-8 flex-grow">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shadow-sm"><Users size={18} /></div>
              <div>
                <p className="text-[9px] uppercase font-black text-gray-400 tracking-widest leading-none mb-1">Docente(s)</p>
                <p className="text-xs font-bold text-gray-700 truncate max-w-[180px]">{course.professors.join(', ')}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shadow-sm"><MapPin size={18} /></div>
              <div>
                <p className="text-[9px] uppercase font-black text-gray-400 tracking-widest leading-none mb-1">Local</p>
                <p className="text-xs font-bold text-gray-700 text-ellipsis overflow-hidden whitespace-nowrap">{course.city}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shadow-sm"><Calendar size={18} /></div>
              <div>
                <p className="text-[9px] uppercase font-black text-gray-400 tracking-widest leading-none mb-1">Data</p>
                <p className="text-xs font-bold text-gray-700">{course.date}</p>
              </div>
            </div>
          </div>

          <Button
            to={detailsUrl}
            className="w-full py-4 rounded-full shadow-lg shadow-blue-900/10 text-xs font-black tracking-widest flex items-center justify-center gap-2 whitespace-nowrap transition-all hover:scale-[1.02]"
            variant="primary"
          >
            <Eye size={16} />
            <span>VER DETALHES DO CURSO</span>
          </Button>
        </div>
      </div>
    );
  }

  // Layout Full (Grade de Materiais/Cursos)
  return (
    <div id={course.id} className={`bg-white rounded-[2rem] shadow-[0_4px_25px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col h-full border border-gray-100 group transition-all duration-500 hover:shadow-[0_25px_50px_rgba(0,0,0,0.12)] hover:-translate-y-2 scroll-mt-24`}>
      <div className="relative aspect-[0.8] overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
          style={{ objectPosition: `center ${course.thumbnailAlignmentPercent ?? 50}%` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#002366]/80 to-transparent"></div>

        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="flex flex-col gap-2">
            {course.isVip && (
              <div className="bg-[#00D1FF] text-white font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[10px] shadow-lg uppercase">
                <Star size={12} fill="white" /> VIP
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 items-end">
            {soldOut ? (
              <div className="bg-gray-900/90 text-white font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[10px] shadow-lg uppercase">
                Esgotado
              </div>
            ) : almostFull ? (
              <div className="bg-[#FF4B4B] text-white font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[10px] shadow-lg uppercase">
                <AlertTriangle size={12} fill="white" /> Últimas Vagas
              </div>
            ) : null}
          </div>
        </div>

        <div className="absolute bottom-5 left-6 right-6">
          <h3 className="text-xl font-black text-white leading-tight uppercase tracking-tight drop-shadow-lg">
            {course.name}
          </h3>
        </div>
      </div>

      <div className="p-7 flex flex-col flex-grow">
        <div className="space-y-4 mb-8 flex-grow">
          <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl border border-gray-100">
            <span className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest"><Calendar size={14} className="text-blue-500" /> Data</span>
            <span className="font-bold text-gray-800 text-sm">{course.date}</span>
          </div>
          <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl border border-gray-100">
            <span className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest shrink-0"><Users size={14} className="text-blue-500" /> Docente</span>
            <span className="font-bold text-gray-800 text-xs text-right truncate ml-4">{course.professors[0]}</span>
          </div>
        </div>

        <Button
          to={detailsUrl}
          className="w-full py-4 rounded-full shadow-md text-xs font-black tracking-widest flex items-center justify-center gap-2 whitespace-nowrap"
          variant="primary"
        >
          <span>VER DETALHES DO CURSO</span>
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default CourseCard;
