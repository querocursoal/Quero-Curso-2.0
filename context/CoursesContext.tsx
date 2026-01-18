
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Course } from '../types';
import { INITIAL_COURSES } from '../constants';
import { supabase } from '../lib/supabaseClient';

interface CoursesContextType {
  courses: Course[];
  addCourse: (course: Omit<Course, 'id'>) => Promise<void>;
  updateCourse: (updatedCourse: Course) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  loading: boolean;
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

// Helper to map DB row (lowercase) to Course type (camelCase)
const mapDbToCourse = (row: any): Course => ({
  id: row.id,
  name: row.name,
  presentation: row.presentation,
  thumbnail: row.thumbnail,
  professors: Array.isArray(row.professors) ? row.professors : [],
  city: row.city,
  date: row.date,
  totalVacancies: row.totalvacancies || 0,
  remainingVacancies: row.remainingvacancies || 0,
  isVip: row.isvip || false,
  registrationFee: row.registrationfee || 0,
  registrationDeadline: row.registrationdeadline,
  workload: row.workload,
  classPeriod: row.classperiod,
  targetAudience: row.targetaudience,
  objectives: row.objectives,
  programContent: Array.isArray(row.programcontent) ? row.programcontent : [],
  priceCash: row.pricecash || 0,
  fullPrice: row.fullprice || 0,
  installmentsText: row.installmentstext,
  thumbnailAlignmentPercent: row.thumbnailalignmentpercent || 50,
});

// Helper to map Course type (camelCase) to DB row (lowercase)
const mapCourseToDb = (course: Partial<Course>) => ({
  id: course.id,
  name: course.name,
  presentation: course.presentation,
  thumbnail: course.thumbnail,
  professors: course.professors,
  city: course.city,
  date: course.date,
  totalvacancies: course.totalVacancies,
  remainingvacancies: course.remainingVacancies,
  isvip: course.isVip,
  registrationfee: course.registrationFee,
  registrationdeadline: course.registrationDeadline,
  workload: course.workload,
  classperiod: course.classPeriod,
  targetaudience: course.targetAudience,
  objectives: course.objectives,
  programcontent: course.programContent,
  pricecash: course.priceCash,
  fullprice: course.fullPrice,
  installmentstext: course.installmentsText,
  thumbnailalignmentpercent: course.thumbnailAlignmentPercent || 50,
});

export const CoursesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('courses').select('*');

      if (error) {
        console.error("Error fetching courses:", error.message);
        // On error properly clear/set empty if not cached, or keep previous?
        // For now, if we fail to fetch, we don't want to show potentially stale data forever if it was critical, 
        // but showing INITIAL_COURSES as fallback is safer than crashing.
        if (courses.length === 0) setCourses(INITIAL_COURSES);
      } else if (data && data.length > 0) {
        setCourses(data.map(mapDbToCourse));
      } else {
        // Seed if empty
        if (courses.length === 0) {
          // only seed if we really have no courses (and no error)
          // Or we could rely on the fact that courses is empty state.
          // Let's seed for demo purposes as per original logic.
          console.log("No courses found in DB, seeding with initial data...");
          const dbInitialCourses = INITIAL_COURSES.map(c => mapCourseToDb(c));
          const { error: seedError } = await supabase.from('courses').insert(dbInitialCourses);
          if (seedError) {
            console.error("Error seeding courses:", seedError.message);
          }
          setCourses(INITIAL_COURSES);
        }
      }
    } catch (err) {
      console.error("Unexpected error in fetchCourses:", err);
      if (courses.length === 0) setCourses(INITIAL_COURSES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const addCourse = async (course: Omit<Course, 'id'>) => {
    const id = `c_${Date.now()}`;
    const dbCourse = mapCourseToDb({ ...course, id });
    const { data, error } = await supabase.from('courses').insert(dbCourse).select();
    if (error) {
      console.error("Error adding course:", error);
      throw new Error(error.message);
    } else if (data) {
      setCourses(prevCourses => [...prevCourses, mapDbToCourse(data[0])]);
    }
  };

  const updateCourse = async (updatedCourse: Course) => {
    const dbCourse = mapCourseToDb(updatedCourse);
    const { data, error } = await supabase.from('courses').update(dbCourse).eq('id', updatedCourse.id).select();
    if (error) {
      console.error("Error updating course:", error);
      throw new Error(error.message);
    } else if (data) {
      setCourses(prevCourses => prevCourses.map(c => c.id === updatedCourse.id ? mapDbToCourse(data[0]) : c));
    }
  };

  const deleteCourse = async (id: string) => {
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) {
      console.error("Error deleting course:", error);
      throw new Error(error.message);
    } else {
      setCourses(prevCourses => prevCourses.filter(c => c.id !== id));
    }
  };

  return (
    <CoursesContext.Provider value={{ courses, addCourse, updateCourse, deleteCourse, loading }}>
      {children}
    </CoursesContext.Provider>
  );
};

export const useCourses = () => {
  const context = useContext(CoursesContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CoursesProvider');
  }
  return context;
};
