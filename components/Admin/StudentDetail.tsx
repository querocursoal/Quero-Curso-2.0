import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import {
    ArrowLeft,
    User,
    Trophy,
    Award,
    BookOpen,
    Clock,
    Download,
    UserPlus,
    CheckCircle,
    Plus,
    Minus,
    Edit,
    Save,
    X,
    KeyRound
} from 'lucide-react';

interface StudentProfile {
    id: string;
    full_name: string;
    email: string;
    points: number;
    level: number;
    xp: number;
    created_at: string;
}

interface Enrollment {
    id: string;
    status: string;
    progress_percent: number;
    enrolled_at: string;
    courses: {
        id: string;
        name: string;
        thumbnail: string;
    };
}

interface Certificate {
    id: string;
    issue_date: string;
    expires_at: string;
    certificate_url: string;
    courses: {
        name: string;
    };
}

interface PointLog {
    id: string;
    action_key: string;
    points_awarded: number;
    created_at: string;
    metadata: any;
}

interface Mission {
    id: string;
    current_progress: number;
    status: string;
    missions: {
        title: string;
        requirement_value: number;
    };
}

const StudentDetail: React.FC = () => {
    const { studentId } = useParams<{ studentId: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<StudentProfile | null>(null);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [pointLogs, setPointLogs] = useState<PointLog[]>([]);
    const [missions, setMissions] = useState<Mission[]>([]);
    const [availableCourses, setAvailableCourses] = useState<any[]>([]);
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [showPointsModal, setShowPointsModal] = useState(false);
    const [pointsAdjustment, setPointsAdjustment] = useState(0);
    const [pointsReason, setPointsReason] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ full_name: '', email: '' });

    useEffect(() => {
        if (studentId) {
            fetchStudentData();
        }
    }, [studentId]);

    const fetchStudentData = async () => {
        setLoading(true);
        try {
            // Fetch profile
            const { data: profileData } = await supabase
                .from('student_profiles')
                .select('*')
                .eq('id', studentId)
                .single();

            setProfile(profileData);
            if (profileData) {
                setEditForm({ full_name: profileData.full_name, email: profileData.email });
            }

            // Fetch enrollments
            const { data: enrollData } = await supabase
                .from('enrollments')
                .select('*, courses(id, name, thumbnail)')
                .eq('student_id', studentId)
                .order('enrolled_at', { ascending: false });

            setEnrollments(enrollData || []);

            // Fetch certificates
            const { data: certData } = await supabase
                .from('certificates')
                .select('*, courses(name)')
                .eq('student_id', studentId)
                .order('issue_date', { ascending: false });

            setCertificates(certData || []);

            // Fetch point logs
            const { data: logsData } = await supabase
                .from('point_logs')
                .select('*')
                .eq('student_id', studentId)
                .order('created_at', { ascending: false })
                .limit(10);

            setPointLogs(logsData || []);

            // Fetch missions
            const { data: missionsData } = await supabase
                .from('student_missions')
                .select('*, missions(title, requirement_value)')
                .eq('student_id', studentId);

            setMissions(missionsData || []);

            // Fetch available courses for enrollment
            const { data: coursesData } = await supabase
                .from('courses')
                .select('id, name, thumbnail');

            setAvailableCourses(coursesData || []);
        } catch (error) {
            console.error('Error fetching student data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!editForm.full_name || !editForm.email) {
            alert('Nome e Email são obrigatórios');
            return;
        }
        try {
            const { error } = await supabase
                .from('student_profiles')
                .update({ full_name: editForm.full_name, email: editForm.email })
                .eq('id', studentId);

            if (error) throw error;

            setProfile(prev => prev ? { ...prev, ...editForm } : null);
            setIsEditing(false);
            alert('Perfil atualizado com sucesso!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Erro ao atualizar perfil');
        }
    };

    const handleResetPassword = async () => {
        if (!profile?.email) return;
        if (!confirm(`Enviar email de redefinição de senha para ${profile.email}?`)) return;

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(profile.email, {
                redirectTo: `${window.location.origin}/#/forgot-password`,
            });
            if (error) throw error;
            alert('Email de redefinição enviado com sucesso!');
        } catch (error) {
            console.error('Error sending reset email:', error);
            alert('Erro ao enviar email de redefinição');
        }
    };

    const handleEnrollCourse = async (courseId: string) => {
        try {
            const { error } = await supabase
                .from('enrollments')
                .insert({
                    student_id: studentId,
                    course_id: courseId,
                    status: 'inscrito',
                    progress_percent: 0
                });

            if (error) throw error;

            setShowEnrollModal(false);
            fetchStudentData();
        } catch (error) {
            console.error('Error enrolling student:', error);
            alert('Erro ao matricular aluno');
        }
    };

    const handleMarkCompleted = async (enrollmentId: string) => {
        if (!confirm('Tem certeza que deseja marcar este curso como concluído? Isso irá gerar o certificado automaticamente.')) {
            return;
        }

        try {
            const { error } = await supabase
                .from('enrollments')
                .update({ status: 'concluido', progress_percent: 100 })
                .eq('id', enrollmentId);

            if (error) throw error;

            alert('Curso marcado como concluído! O certificado será gerado em breve.');
            fetchStudentData();
        } catch (error) {
            console.error('Error marking course as completed:', error);
            alert('Erro ao marcar curso como concluído');
        }
    };

    const handleAdjustPoints = async () => {
        if (!pointsAdjustment || !pointsReason.trim()) {
            alert('Por favor, preencha o valor e o motivo do ajuste.');
            return;
        }

        try {
            // Insert point log
            await supabase.from('point_logs').insert({
                student_id: studentId,
                action_key: 'manual_adjustment',
                points_awarded: pointsAdjustment,
                metadata: { reason: pointsReason }
            });

            // Update profile points
            const newPoints = (profile?.points || 0) + pointsAdjustment;
            await supabase
                .from('student_profiles')
                .update({ points: newPoints })
                .eq('id', studentId);

            setShowPointsModal(false);
            setPointsAdjustment(0);
            setPointsReason('');
            fetchStudentData();
        } catch (error) {
            console.error('Error adjusting points:', error);
            alert('Erro ao ajustar pontos');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-500">Aluno não encontrado</p>
                <button
                    onClick={() => navigate('/admin')}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold"
                >
                    Voltar
                </button>
            </div>
        );
    }

    const enrolledCourseIds = enrollments.map(e => e.courses.id);
    const unenrolledCourses = availableCourses.filter(c => !enrolledCourseIds.includes(c.id));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/admin')}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div className="flex-1">
                    <h2 className="text-2xl font-black text-[#002366] uppercase tracking-tight">
                        Detalhes do Aluno
                    </h2>
                    <p className="text-sm text-gray-500 font-medium">{profile.email}</p>
                </div>
            </div>

            {/* Profile Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <User size={40} />
                    </div>
                    <div className="flex-1 w-full">
                        {isEditing ? (
                            <div className="space-y-3 mb-4 max-w-md">
                                <input
                                    type="text"
                                    value={editForm.full_name}
                                    onChange={e => setEditForm({ ...editForm, full_name: e.target.value })}
                                    className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white font-bold placeholder-white/50 focus:outline-none focus:bg-white/20"
                                    placeholder="Nome Completo"
                                />
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                    className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:bg-white/20"
                                    placeholder="Email"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSaveProfile}
                                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-bold transition-colors"
                                    >
                                        <Save size={14} /> Salvar
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditForm({ full_name: profile.full_name, email: profile.email });
                                        }}
                                        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg text-sm font-bold transition-colors"
                                    >
                                        <X size={14} /> Cancelar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-3xl font-black">{profile.full_name}</h3>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white/80 hover:text-white"
                                        title="Editar Perfil"
                                    >
                                        <Edit size={16} />
                                    </button>
                                </div>
                                <p className="text-white/80 mb-4">{profile.email}</p>
                            </>
                        )}
                        <div className="flex flex-wrap gap-4">
                            <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20">
                                <p className="text-xs font-bold text-white/60 uppercase">Pontos</p>
                                <p className="text-2xl font-black">{profile.points || 0}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20">
                                <p className="text-xs font-bold text-white/60 uppercase">Nível</p>
                                <p className="text-2xl font-black">{profile.level || 1}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20">
                                <p className="text-xs font-bold text-white/60 uppercase">XP</p>
                                <p className="text-2xl font-black">{profile.xp || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => setShowEnrollModal(true)}
                            className="px-6 py-3 bg-white text-blue-600 rounded-xl font-black text-sm uppercase hover:bg-blue-50 transition-colors flex items-center gap-2"
                        >
                            <UserPlus size={16} />
                            Matricular em Curso
                        </button>
                        <button
                            onClick={() => setShowPointsModal(true)}
                            className="px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-xl font-black text-sm uppercase hover:bg-white/20 transition-colors border border-white/20 flex items-center gap-2"
                        >
                            <Trophy size={16} />
                            Ajustar Pontos
                        </button>
                        <button
                            onClick={handleResetPassword}
                            className="px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-xl font-black text-sm uppercase hover:bg-white/20 transition-colors border border-white/20 flex items-center gap-2"
                        >
                            <KeyRound size={16} />
                            Reset de Senha
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Enrollments & Certificates */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Enrollments */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-lg font-black text-[#002366] uppercase flex items-center gap-2">
                                <BookOpen size={20} />
                                Cursos Matriculados
                            </h4>
                            <span className="text-sm font-bold text-gray-500">
                                {enrollments.length} {enrollments.length === 1 ? 'curso' : 'cursos'}
                            </span>
                        </div>
                        <div className="space-y-4">
                            {enrollments.map((enrollment) => (
                                <div key={enrollment.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                    <img
                                        src={enrollment.courses.thumbnail}
                                        alt={enrollment.courses.name}
                                        className="w-16 h-16 rounded-lg object-cover"
                                    />
                                    <div className="flex-1">
                                        <p className="font-bold text-[#002366] text-sm">{enrollment.courses.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${enrollment.status === 'concluido'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {enrollment.status === 'concluido' ? 'Concluído' : 'Em Andamento'}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {enrollment.progress_percent}%
                                            </span>
                                        </div>
                                    </div>
                                    {enrollment.status !== 'concluido' && (
                                        <button
                                            onClick={() => handleMarkCompleted(enrollment.id)}
                                            className="px-4 py-2 bg-green-600 text-white rounded-xl font-bold text-xs uppercase hover:bg-green-700 transition-colors flex items-center gap-2"
                                        >
                                            <CheckCircle size={14} />
                                            Marcar Concluído
                                        </button>
                                    )}
                                </div>
                            ))}
                            {enrollments.length === 0 && (
                                <p className="text-center text-gray-500 py-8">Nenhum curso matriculado</p>
                            )}
                        </div>
                    </div>

                    {/* Certificates */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-lg font-black text-[#002366] uppercase flex items-center gap-2">
                                <Award size={20} />
                                Certificados
                            </h4>
                        </div>
                        <div className="space-y-3">
                            {certificates.map((cert) => (
                                <div key={cert.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        <p className="font-bold text-[#002366] text-sm">{cert.courses.name}</p>
                                        <p className="text-xs text-gray-500">
                                            Emitido: {new Date(cert.issue_date).toLocaleDateString()}
                                        </p>
                                        {cert.expires_at && (
                                            <p className="text-xs text-amber-600 font-bold">
                                                Expira: {new Date(cert.expires_at).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                    <a
                                        href={cert.certificate_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Download size={18} />
                                    </a>
                                </div>
                            ))}
                            {certificates.length === 0 && (
                                <p className="text-center text-gray-500 py-8">Nenhum certificado emitido</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Point Logs & Missions */}
                <div className="space-y-6">
                    {/* Point Logs */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <h4 className="text-lg font-black text-[#002366] uppercase flex items-center gap-2 mb-6">
                            <Trophy size={20} />
                            Histórico de Pontos
                        </h4>
                        <div className="space-y-3">
                            {pointLogs.map((log) => (
                                <div key={log.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-xl">
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-[#002366]">
                                            {log.action_key === 'course_concluido' && `Concluiu ${log.metadata?.course_name}`}
                                            {log.action_key === 'manual_adjustment' && `Ajuste Manual: ${log.metadata?.reason}`}
                                            {!['course_concluido', 'manual_adjustment'].includes(log.action_key) && 'Ação realizada'}
                                        </p>
                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                            <Clock size={10} />
                                            {new Date(log.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`text-xs font-black ${log.points_awarded >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {log.points_awarded >= 0 ? '+' : ''}{log.points_awarded}
                                    </span>
                                </div>
                            ))}
                            {pointLogs.length === 0 && (
                                <p className="text-center text-gray-500 py-8 text-xs">Nenhuma atividade registrada</p>
                            )}
                        </div>
                    </div>

                    {/* Missions */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <h4 className="text-lg font-black text-[#002366] uppercase flex items-center gap-2 mb-6">
                            <Trophy size={20} className="text-yellow-500" />
                            Missões
                        </h4>
                        <div className="space-y-4">
                            {missions.map((mission) => {
                                const progress = Math.min(100, (mission.current_progress / mission.missions.requirement_value) * 100);
                                return (
                                    <div key={mission.id}>
                                        <div className="flex justify-between text-xs font-bold mb-2">
                                            <span className="text-[#002366]">{mission.missions.title}</span>
                                            <span className="text-gray-500">{Math.round(progress)}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all ${mission.status === 'completado' ? 'bg-green-500' : 'bg-blue-500'}`}
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                            {missions.length === 0 && (
                                <p className="text-center text-gray-500 py-8 text-xs">Nenhuma missão em andamento</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Enroll Modal */}
            {showEnrollModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <h3 className="text-xl font-black text-[#002366] mb-4">Matricular em Curso</h3>
                        <div className="space-y-3">
                            {unenrolledCourses.map((course) => (
                                <div key={course.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <img src={course.thumbnail} alt={course.name} className="w-16 h-16 rounded-lg object-cover" />
                                    <p className="flex-1 font-bold text-[#002366]">{course.name}</p>
                                    <button
                                        onClick={() => handleEnrollCourse(course.id)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase hover:bg-blue-700 transition-colors"
                                    >
                                        Matricular
                                    </button>
                                </div>
                            ))}
                            {unenrolledCourses.length === 0 && (
                                <p className="text-center text-gray-500 py-8">Aluno já está matriculado em todos os cursos disponíveis</p>
                            )}
                        </div>
                        <button
                            onClick={() => setShowEnrollModal(false)}
                            className="mt-6 w-full py-3 bg-gray-200 text-gray-700 rounded-xl font-bold uppercase hover:bg-gray-300 transition-colors"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}

            {/* Points Adjustment Modal */}
            {showPointsModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-black text-[#002366] mb-4">Ajustar Pontos</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Valor do Ajuste</label>
                                <input
                                    type="number"
                                    value={pointsAdjustment}
                                    onChange={(e) => setPointsAdjustment(parseInt(e.target.value) || 0)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ex: 100 ou -50"
                                />
                                <p className="text-xs text-gray-500 mt-1">Use valores negativos para subtrair pontos</p>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Motivo</label>
                                <textarea
                                    value={pointsReason}
                                    onChange={(e) => setPointsReason(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    placeholder="Descreva o motivo do ajuste..."
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleAdjustPoints}
                                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold uppercase hover:bg-blue-700 transition-colors"
                                >
                                    Confirmar
                                </button>
                                <button
                                    onClick={() => {
                                        setShowPointsModal(false);
                                        setPointsAdjustment(0);
                                        setPointsReason('');
                                    }}
                                    className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold uppercase hover:bg-gray-300 transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDetail;
