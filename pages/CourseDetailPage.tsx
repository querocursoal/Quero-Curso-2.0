
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useCourses } from '../context/CoursesContext';
import { useSettings } from '../context/SettingsContext';
import { supabase } from '../lib/supabaseClient';
import {
  MapPin, Calendar, Clock, Users, UserCheck, BookUser, DollarSign,
  Info, CheckCircle, Send, Award, Briefcase, FileText, Tag, CreditCard
} from 'lucide-react';
import { WHATSAPP_COURSE_MESSAGE } from '../constants';

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { courses, loading } = useCourses();
  const { settings } = useSettings();
  const { user } = useAuth();
  const [enrolled, setEnrolled] = useState(false);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (user && courseId) {
      checkEnrollment();
    }
  }, [courseId, user]);

  const checkEnrollment = async () => {
    const { data } = await supabase
      .from('enrollments')
      .select('id')
      .eq('student_id', user?.id)
      .eq('course_id', courseId)
      .single();

    if (data) setEnrolled(true);
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setEnrollmentLoading(true);
    const { error } = await supabase
      .from('enrollments')
      .insert({
        student_id: user.id,
        course_id: courseId,
        status: 'inscrito'
      });

    if (error) {
      alert('Erro ao realizar inscrição. Tente novamente.');
    } else {
      setEnrolled(true);
      alert('Inscrição realizada com sucesso! Bem-vindo ao curso.');
    }
    setEnrollmentLoading(false);
  };

  const course = courses.find(c => c.id === courseId);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        Carregando informações do curso...
      </div>
    );
  }

  if (!course) {
    return (
      <>
        <Header />
        <div className="flex flex-col items-center justify-center text-center py-40 bg-gray-50">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Curso não encontrado</h2>
          <p className="text-lg text-gray-700 mb-8">O curso que você está procurando não existe ou foi removido.</p>
          <Button onClick={() => navigate('/cursos')} variant="secondary">Ver todos os cursos</Button>
        </div>
        <Footer />
      </>
    );
  }

  const whatsappHref = WHATSAPP_COURSE_MESSAGE(course.name, settings.whatsappNumber);

  // -- Sub-components for this page --
  const HeroInfoItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
    <div className="flex items-center gap-3 text-white bg-white/10 p-3 rounded-lg">
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <strong className="block text-sm opacity-80">{label}</strong>
        <span className="font-semibold">{value}</span>
      </div>
    </div>
  );

  const StickyInfoItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number | React.ReactNode }> = ({ icon, label, value }) => (
    <div className="flex items-start gap-3 text-sm text-gray-800">
      <div className="flex-shrink-0 text-[#333fa4] mt-1">{icon}</div>
      <div>
        <strong className="block">{label}</strong>
        <span className="text-gray-600">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-[#333fa4] text-white pt-16 pb-12">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Thumbnail Thumbnail Vertical */}
              <div className="w-full max-w-[300px] aspect-[0.8] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 flex-shrink-0">
                <img
                  src={course.thumbnail}
                  alt={course.name}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: `center ${course.thumbnailAlignmentPercent ?? 50}%` }}
                />
              </div>

              <div className="text-center lg:text-left flex-grow">
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4 inline-block">CURSO</span>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-shadow-md leading-tight uppercase tracking-tight">{course.name}</h1>
                <p className="text-xl flex items-center justify-center lg:justify-start gap-2 mb-8 opacity-90">
                  <MapPin size={22} className="text-yellow-400" />
                  {course.city}
                </p>
                <div className="flex flex-col lg:flex-row items-center gap-4">
                  {enrolled ? (
                    <Button onClick={() => navigate('/student-dashboard')} className="text-lg px-8 py-4 bg-green-500 border-none shadow-xl shadow-green-900/40" variant="primary">
                      <CheckCircle size={22} />
                      Já estou Inscrito
                    </Button>
                  ) : (
                    <Button
                      onClick={handleEnroll}
                      className="text-lg px-8 py-4 shadow-xl shadow-blue-900/40"
                      variant="primary"
                      disabled={enrollmentLoading}
                    >
                      {enrollmentLoading ? 'Processando...' : (
                        <>
                          <BookUser size={22} />
                          Quero me Inscrever agora
                        </>
                      )}
                    </Button>
                  )}
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="text-white opacity-80 hover:opacity-100 hover:underline text-sm font-medium">
                    Falar com consultor via WhatsApp
                  </a>
                </div>
              </div>
            </div>
            {/* Essential Info Bar */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <HeroInfoItem icon={<Calendar size={28} />} label="Início Previsto" value={course.date} />
              <HeroInfoItem icon={<Clock size={28} />} label="Carga Horária" value={course.workload} />
              <HeroInfoItem icon={<Briefcase size={28} />} label="Público-Alvo" value={course.targetAudience} />
              <HeroInfoItem icon={<BookUser size={28} />} label="Docente(s)" value={course.professors.join(', ')} />
              <HeroInfoItem icon={<Award size={28} />} label="Certificação" value="Inclusa" />
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-12">

              {/* Left Sidebar (Sticky) */}
              <aside className="lg:w-1/3 lg:sticky lg:top-28 self-start">
                <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-[#333fa4] space-y-6">
                  {/* Investment Block */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-[#333fa4]/20">
                    <h3 className="text-xl font-bold text-[#333fa4] text-center mb-4">INVESTIMENTO</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2 font-semibold text-gray-700"><Tag size={18} className="text-green-600" />À vista</span>
                        <span className="text-2xl font-bold text-green-600">R$ {course.priceCash.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2 font-semibold text-gray-700"><CreditCard size={18} className="text-blue-600" />No Cartão</span>
                        <span className="font-bold text-lg text-blue-800">R$ {course.fullPrice.toFixed(2)}</span>
                      </div>
                      <p className="text-sm text-gray-600 text-center pt-1">ou em até <span className="font-bold">{course.installmentsText}</span></p>
                    </div>
                  </div>
                  {/* Other Info */}
                  <div className="space-y-4 pt-4 border-t">
                    <StickyInfoItem icon={<DollarSign size={20} />} label="TAXA DE INSCRIÇÃO" value={`R$ ${course.registrationFee.toFixed(2)}`} />
                    <StickyInfoItem icon={<MapPin size={20} />} label="LOCAL" value={course.city} />
                    <StickyInfoItem icon={<UserCheck size={20} />} label="PÚBLICO-ALVO" value={course.targetAudience} />
                  </div>
                  <div className="pt-4 border-t space-y-3">
                    {enrolled ? (
                      <Button onClick={() => navigate('/student-dashboard')} className="w-full text-lg bg-green-500 border-none" variant="primary">
                        Estou Inscrito
                      </Button>
                    ) : (
                      <Button onClick={handleEnroll} className="w-full text-lg" variant="secondary" disabled={enrollmentLoading}>
                        {enrollmentLoading ? 'Processando...' : 'Garantir minha vaga'}
                      </Button>
                    )}
                    <div className="text-center">
                      <Link to="/termos-de-inscricao" className="text-xs text-gray-400 hover:text-[#333fa4] hover:underline transition-colors flex items-center justify-center gap-1.5 font-medium">
                        <FileText size={12} />
                        Termo de Inscrição
                      </Link>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Right Content */}
              <div className="lg:w-2/3 space-y-12">
                {/* Presentation Section */}
                <div id="apresentacao" className="bg-white p-8 rounded-lg shadow-lg scroll-mt-24">
                  <h3 className="text-2xl font-bold text-[#333fa4] mb-4 flex items-center gap-2"><Info size={24} />Apresentação</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{course.presentation}</p>
                </div>

                {/* Objectives Section */}
                <div id="objetivos" className="bg-white p-8 rounded-lg shadow-lg scroll-mt-24">
                  <h3 className="text-2xl font-bold text-[#333fa4] mb-4 flex items-center gap-2"><CheckCircle size={24} />Objetivos</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{course.objectives}</p>
                </div>

                {/* Program Content Section */}
                <div id="conteudo" className="bg-white p-8 rounded-lg shadow-lg scroll-mt-24">
                  <h3 className="text-2xl font-bold text-[#333fa4] mb-6 flex items-center gap-2"><FileText size={24} />Conteúdo Programático</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {course.programContent.map((section, sectionIndex) => (
                      <div key={sectionIndex}>
                        <h4 className="font-bold text-lg text-gray-800 mb-3">{section.title}</h4>
                        <ul className="space-y-2">
                          {section.topics.map((item, topicIndex) => (
                            <li key={topicIndex} className="flex items-start">
                              <CheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" size={16} />
                              <span className="text-gray-700 text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CourseDetailPage;
