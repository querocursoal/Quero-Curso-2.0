
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import RegistrationForm from '../components/RegistrationForm';
import { useCourses } from '../context/CoursesContext';
import { BookOpen } from 'lucide-react';

const RegistrationPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { courses, loading } = useCourses();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [courseId]);

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

  return (
    <div className="bg-gray-50">
      <Header />
      <main className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-lg shadow-lg">
            <div className="text-center mb-8">
              <span className="bg-[#333fa4]/10 text-[#333fa4] px-3 py-1 rounded-full text-sm font-semibold mb-4 inline-block">FORMULÁRIO DE INSCRIÇÃO</span>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
                <BookOpen className="text-[#333fa4]"/>
                {course.name}
              </h1>
              <p className="text-gray-600">Preencha os dados abaixo para garantir sua vaga.</p>
            </div>
            <RegistrationForm courseName={course.name} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RegistrationPage;
