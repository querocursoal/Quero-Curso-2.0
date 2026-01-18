
import React, { useMemo, useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';
import { useCourses } from '../context/CoursesContext';
import { useSettings } from '../context/SettingsContext';
import { sortCourses } from '../utils/courseUtils';

const CoursesPage: React.FC = () => {
  const { courses, loading: coursesLoading } = useCourses();
  const { settings, loading: settingsLoading } = useSettings();
  const [pricesVisible, setPricesVisible] = useState(false);

  useEffect(() => {
    // Logic to reveal prices after engagement
    const showPrices = () => {
      setPricesVisible(true);
      window.removeEventListener('scroll', handleScroll);
    };

    const timer = setTimeout(showPrices, 7000);

    const handleScroll = () => {
      // Reveal if user scrolled 25% of the page
      if (window.scrollY > (document.body.scrollHeight / 4)) {
        clearTimeout(timer);
        showPrices();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const sortedCourses = useMemo(() => {
    if (coursesLoading || settingsLoading) return [];
    return sortCourses(courses, settings.lowStockThreshold);
  }, [courses, settings, coursesLoading, settingsLoading]);

  return (
    <div className="bg-gray-50 text-gray-800">
      <Header />
      <main className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-[#333fa4] mb-12">Todos os Nossos Cursos</h2>
          {(coursesLoading || settingsLoading) ? (
            <p className="text-center">Carregando cursos...</p>
          ) : sortedCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {sortedCourses.map(course => (
                  <CourseCard 
                    key={course.id}
                    course={course} 
                    displayMode="full" 
                    pricesVisible={pricesVisible} 
                  />
              ))}
            </div>
          ) : (
             <p className="text-center text-gray-600">Nenhum curso disponível no momento.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CoursesPage;
