import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Users, Search, Filter, Eye, UserPlus, CheckCircle, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Student {
    id: string;
    full_name: string;
    email: string;
    points: number;
    level: number;
    xp: number;
    created_at: string;
    enrollments?: {
        total: number;
        completed: number;
    };
}

const StudentManagement: React.FC = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState<Student[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'points' | 'level' | 'date'>('points');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        filterAndSortStudents();
    }, [students, searchTerm, sortBy, sortOrder]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            // Fetch all students with their enrollment counts
            const { data: profilesData, error: profilesError } = await supabase
                .from('student_profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (profilesError) throw profilesError;

            // Fetch enrollment counts for each student
            const studentsWithEnrollments = await Promise.all(
                (profilesData || []).map(async (student) => {
                    const { data: enrollments } = await supabase
                        .from('enrollments')
                        .select('status')
                        .eq('student_id', student.id);

                    const total = enrollments?.length || 0;
                    const completed = enrollments?.filter(e => e.status === 'concluido').length || 0;

                    return {
                        ...student,
                        enrollments: { total, completed }
                    };
                })
            );

            setStudents(studentsWithEnrollments);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortStudents = () => {
        let filtered = [...students];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(student =>
                student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'name':
                    comparison = (a.full_name || '').localeCompare(b.full_name || '');
                    break;
                case 'points':
                    comparison = (a.points || 0) - (b.points || 0);
                    break;
                case 'level':
                    comparison = (a.level || 0) - (b.level || 0);
                    break;
                case 'date':
                    comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                    break;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        setFilteredStudents(filtered);
    };

    const handleSort = (field: typeof sortBy) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                        <Users size={24} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-[#002366] uppercase tracking-tight">
                            Gestão de Alunos
                        </h2>
                        <p className="text-sm text-gray-500 font-medium">
                            {filteredStudents.length} {filteredStudents.length === 1 ? 'aluno' : 'alunos'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => {
                        const headers = ['Nome,Email,Pontos,Nível,XP,Cursos Totais,Cursos Concluídos,Data Cadastro'];
                        const rows = filteredStudents.map(s =>
                            `"${s.full_name}","${s.email}",${s.points},${s.level},${s.xp},${s.enrollments?.total || 0},${s.enrollments?.completed || 0},"${new Date(s.created_at).toLocaleDateString()}"`
                        );
                        const csvContent = [headers, ...rows].join('\n');
                        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.setAttribute('href', url);
                        link.setAttribute('download', `alunos_export_${new Date().toISOString().split('T')[0]}.csv`);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-colors"
                >
                    <Download size={18} />
                    Exportar CSV
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Sort Options */}
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => handleSort('points')}
                            className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${sortBy === 'points'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Pontos {sortBy === 'points' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </button>
                        <button
                            onClick={() => handleSort('level')}
                            className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${sortBy === 'level'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Nível {sortBy === 'level' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </button>
                        <button
                            onClick={() => handleSort('name')}
                            className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${sortBy === 'name'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Nome {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Students Table/Cards */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">
                                    Aluno
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">
                                    Pontos
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">
                                    Nível
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">
                                    Cursos
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredStudents.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-bold text-[#002366]">{student.full_name}</p>
                                            <p className="text-xs text-gray-500">{student.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-yellow-100 text-yellow-800">
                                            {student.points || 0} pts
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-800">
                                            Nível {student.level || 1}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            <span className="font-bold text-gray-700">
                                                {student.enrollments?.completed || 0}/{student.enrollments?.total || 0}
                                            </span>
                                            <span className="text-gray-500 ml-1">concluídos</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => navigate(`/admin/student/${student.id}`)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase hover:bg-blue-700 transition-colors"
                                        >
                                            <Eye size={14} />
                                            Ver Detalhes
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-gray-100">
                    {filteredStudents.map((student) => (
                        <div key={student.id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <p className="font-black text-[#002366] text-sm">{student.full_name}</p>
                                    <p className="text-xs text-gray-500">{student.email}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 mb-3">
                                <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-black bg-yellow-100 text-yellow-800">
                                    {student.points || 0} pts
                                </span>
                                <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-black bg-blue-100 text-blue-800">
                                    Nível {student.level || 1}
                                </span>
                                <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-700">
                                    {student.enrollments?.completed || 0}/{student.enrollments?.total || 0} cursos
                                </span>
                            </div>
                            <button
                                onClick={() => navigate(`/admin/student/${student.id}`)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase hover:bg-blue-700 transition-colors"
                            >
                                <Eye size={14} />
                                Ver Detalhes
                            </button>
                        </div>
                    ))}
                </div>

                {filteredStudents.length === 0 && (
                    <div className="text-center py-12">
                        <Users size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">
                            {searchTerm ? 'Nenhum aluno encontrado com esse termo de busca.' : 'Nenhum aluno cadastrado ainda.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentManagement;
