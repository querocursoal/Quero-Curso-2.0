
import React, { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CourseCarousel from '../components/CourseCarousel';
import { useCourses } from '../context/CoursesContext';
import { useSettings } from '../context/SettingsContext';
import { sortCourses } from '../utils/courseUtils';
import HeroCarousel from '../components/HeroCarousel';
import FeaturesSection from '../components/FeaturesSection';

const HomePage: React.FC = () => {
  const { courses, loading: coursesLoading } = useCourses();
  const { settings, loading: settingsLoading } = useSettings();
  const location = useLocation();

  const sortedCourses = useMemo(() => {
    if (coursesLoading || settingsLoading) return [];
    return sortCourses(courses, settings.lowStockThreshold);
  }, [courses, settings, coursesLoading, settingsLoading]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // Use a timeout to ensure the element is painted before scrolling
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e0f2fe]/30 min-h-screen text-[#0f172a] font-sans selection:bg-blue-100">
      <Header />
      <main className="space-y-12">
        {/* Hero Section */}
        <HeroCarousel />

        {/* Features Section - Transparent to show blobs */}
        <section className="relative">
          <FeaturesSection />
        </section>

        {/* Courses Carousel Section */}
        <section id="cursos" className="pt-10 pb-20 container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-800 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100 cursor-default">
              Nossas Formações
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#002366] mb-6 tracking-tight">
              Conheça Nossos Cursos
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
              Qualificação profissional com quem entende do mercado.
            </p>
          </div>

          {(coursesLoading || settingsLoading) ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <CourseCarousel courses={sortedCourses} />
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
