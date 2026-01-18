
import React, { useState } from 'react';
import { useCourses } from '../../context/CoursesContext';
import { Course } from '../../types';
import CourseForm from './CourseForm';
import CourseList from './CourseList';
import Button from '../Button';
import { PlusCircle } from 'lucide-react';

const CourseManagement: React.FC = () => {
  const { courses } = useCourses();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setIsFormVisible(true);
  };

  const handleAddNewCourse = () => {
    setEditingCourse(null);
    setIsFormVisible(true);
  };
  
  const handleCloseForm = () => {
    setIsFormVisible(false);
    setEditingCourse(null);
  };

  return (
    <div>
      {isFormVisible ? (
        <CourseForm
          courseToEdit={editingCourse}
          onClose={handleCloseForm}
        />
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Gerenciar Cursos</h2>
            <Button onClick={handleAddNewCourse} variant="secondary">
              <PlusCircle size={20} />
              Criar Novo Curso
            </Button>
          </div>
          <CourseList courses={courses} onEdit={handleEditCourse} />
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
