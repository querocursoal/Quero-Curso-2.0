
import React from 'react';
import { Course } from '../../types';
import { useCourses } from '../../context/CoursesContext';
import { Edit, Trash2 } from 'lucide-react';

interface CourseListProps {
  courses: Course[];
  onEdit: (course: Course) => void;
}

const CourseList: React.FC<CourseListProps> = ({ courses, onEdit }) => {
  const { deleteCourse } = useCourses();

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o curso "${name}"?`)) {
      deleteCourse(id);
    }
  };

  if (courses.length === 0) {
    return <p className="text-center text-gray-500 py-8">Nenhum curso cadastrado ainda.</p>;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
      <table className="w-full table-auto">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Curso</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Local/Data</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {courses.map(course => {

            return (
              <tr key={course.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full object-cover" src={course.thumbnail} alt={course.name} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{course.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{course.city}</div>
                  <div className="text-sm text-gray-500">{course.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1 items-start">
                    {course.isVip && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        VIP
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => onEdit(course)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(course.id, course.name)} className="text-red-600 hover:text-red-900">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CourseList;
