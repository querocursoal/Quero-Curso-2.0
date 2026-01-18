
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import {
    User,
    BookOpen,
    Award,
    Trophy,
    Download,
    Clock,
    ChevronRight,
    LayoutDashboard,
    LogOut,
    CheckCircle,
    Activity,
    History,
    AlertCircle
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ProfileEditor from '../../components/Student/ProfileEditor';

interface StudentProfile {
    full_name: string;
    email: string;
    points: number;
    level: number;
    xp: number;
}

interface Enrollment {
    id: string;
    course_id: string;
    progress_percent: number;
    status: string;
    courses: {
        name: string;
        thumbnail: string;
    };
}

interface Certificate {
    id: string;
    issue_date: string;
    certificate_url: string;
    expires_at: string;
    courses: {
        name: string;
    };
}

interface PointLog {
    id: string;
    action_key: string;
    points_awarded: number;
    created_at: string;
    metadata: {
        course_name?: string;
    };
}

interface StudentMission {
    id: string;
    current_progress: number;
    status: string;
    missions: {
        title: string;
        requirement_value: number;
        reward_description: string;
    };
}

const StudentDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<StudentProfile | null>(null);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [pointLogs, setPointLogs] = useState<PointLog[]>([]);
    const [missions, setMissions] = useState<StudentMission[]>([]);
    const [loading, setLoading] = useState(true);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (location.state && (location.state as any).alert) {
            alert((location.state as any).alert);
            // Clear state to avoid showing it again on refresh (though standard refresh clears state, internal nav might not)
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            setLoading(true);

            // 1. Fetch Profile
            const { data: profileData } = await supabase
                .from('student_profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileData) setProfile(profileData);

            // 2. Fetch Enrollments with Course Details
            const { data: enrollData } = await supabase
                .from('enrollments')
                .select(`
                    id,
                    course_id,
                    progress_percent,
                    status,
                    courses (name, thumbnail)
                `)
                .eq('student_id', user.id);

            if (enrollData) setEnrollments(enrollData as any);

            // 3. Fetch Certificates
            const { data: certData, error: certError } = await supabase
                .from('certificates')
                .select(`
                    id,
                    issue_date,
                    expires_at,
                    certificate_url,
                    courses (name)
                `)
                .eq('student_id', user.id)
                .order('issue_date', { ascending: false })
                .limit(3);

            if (certData) setCertificates(certData as any);
            if (certError) console.error('Error fetching certificates:', certError);

            // 4. Fetch Point Logs
            const { data: logData } = await supabase
                .from('point_logs')
                .select('*')
                .eq('student_id', user.id)
                .order('created_at', { ascending: false })
                .limit(5);

            if (logData) setPointLogs(logData);

            // 5. Fetch Missions
            const { data: missionData } = await supabase
                .from('student_missions')
                .select(`
                    id,
                    current_progress,
                    status,
                    missions (title, requirement_value, reward_description)
                `)
                .eq('student_id', user.id)
                .order('updated_at', { ascending: false })
                .limit(3);

            if (missionData) setMissions(missionData as any);

            setLoading(false);
        };

        fetchData();
    }, [user, navigate]);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            navigate('/login', { replace: true });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-['Outfit',sans-serif]">
            {/* Top Navigation */}
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                                <LayoutDashboard size={24} />
                            </div>
                            <h1 className="text-xl font-black text-[#002366] uppercase tracking-tighter">Área do Aluno</h1>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-sm font-black text-gray-800">{profile?.full_name || 'Usuário'}</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user?.email}</span>
                            </div>
                            <button
                                onClick={() => setIsProfileModalOpen(true)}
                                className="w-10 h-10 rounded-full overflow-hidden bg-blue-50 border-2 border-white shadow-sm hover:border-blue-600 transition-all cursor-pointer"
                            >
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Ava" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-blue-600 font-black text-xs">
                                        {profile?.full_name?.charAt(0) || 'U'}
                                    </div>
                                )}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                                title="Sair"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Welcome & Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    <div className="lg:col-span-2 bg-gradient-to-br from-[#0072ff] to-[#00c6ff] rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
                        <div className="relative z-10 flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-4xl font-black mb-2 uppercase tracking-tighter">Olá, {profile?.full_name?.split(' ')[0]}!</h2>
                                <p className="text-white/80 font-medium text-lg uppercase tracking-widest text-sm">Bem-vindo de volta à sua jornada de aprendizado.</p>
                            </div>
                            <div className="hidden md:block w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 overflow-hidden shadow-2xl">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/50">
                                        <User size={48} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="relative z-10 flex flex-wrap gap-6">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 flex items-center gap-4 border border-white/20">
                                <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center text-[#002366] shadow-lg shadow-yellow-400/20">
                                    <Trophy size={24} strokeWidth={3} />
                                </div>
                                <div>
                                    <span className="block text-[10px] font-black uppercase tracking-widest text-white/60">Pontos</span>
                                    <span className="text-2xl font-black">{profile?.points}</span>
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 flex items-center gap-4 border border-white/20">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-lg">
                                    <Award size={24} strokeWidth={3} />
                                </div>
                                <div>
                                    <span className="block text-[10px] font-black uppercase tracking-widest text-white/60">Nível</span>
                                    <span className="text-2xl font-black">{profile?.level}</span>
                                </div>
                            </div>
                        </div>
                        {/* Decal */}
                        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col justify-center items-center text-center">
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-6 border-4 border-white shadow-inner overflow-hidden">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User size={48} />
                            )}
                        </div>
                        <h3 className="text-xl font-black text-[#002366] uppercase tracking-tight mb-1">{profile?.full_name}</h3>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-6">{user?.email}</p>
                        <button
                            onClick={() => setIsProfileModalOpen(true)}
                            className="w-full py-4 bg-gray-50 text-[#002366] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100"
                        >
                            Editar Perfil
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Active Courses */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                                <BookOpen className="text-blue-600" size={24} />
                                <h3 className="text-xl font-black text-[#002366] uppercase tracking-tighter">Meus Cursos</h3>
                            </div>
                            <Link to="/cursos" className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">Ver catálogo</Link>
                        </div>

                        {enrollments.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {enrollments.map((enroll) => (
                                    <div key={enroll.id} className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-lg shadow-gray-200/40 group hover:-translate-y-1 transition-all duration-300">
                                        <div className="aspect-video rounded-2xl mb-5 overflow-hidden bg-gray-100">
                                            <img
                                                src={enroll.courses.thumbnail}
                                                alt={enroll.courses.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <h4 className="font-black text-[#002366] text-lg mb-4 line-clamp-1 uppercase tracking-tight">{enroll.courses.name}</h4>

                                        <div className="mb-6">
                                            <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                                <span>Status: {enroll.status}</span>
                                                {enroll.status === 'concluido' && (
                                                    <span className="text-green-600 flex items-center gap-1">
                                                        <CheckCircle size={10} /> Concluído
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                <Clock size={14} className="text-blue-600" />
                                                <span className="uppercase tracking-tight font-bold text-[10px]">Curso Presencial</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => navigate(`/curso/${enroll.course_id}`)}
                                            className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${enroll.status === 'concluido'
                                                ? 'bg-green-100 text-green-700 shadow-green-100 border border-green-200'
                                                : 'bg-white text-[#002366] border-2 border-[#002366] hover:bg-[#002366] hover:text-white shadow-blue-100'
                                                }`}
                                        >
                                            {enroll.status === 'concluido' ? (
                                                <>
                                                    <CheckCircle size={14} />
                                                    Certificado Disponível
                                                </>
                                            ) : (
                                                <>
                                                    Ver Detalhes
                                                    <ChevronRight size={14} />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-[2rem] p-12 border-2 border-dashed border-gray-200 text-center">
                                <p className="text-gray-400 font-bold mb-6 italic">Você ainda não está matriculado em nenhum curso.</p>
                                <Link to="/cursos" className="inline-block px-10 py-5 bg-[#002366] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl shadow-blue-200">
                                    Explorar Cursos
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Certificates & Rewards */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-blue-900/10 border border-gray-100 flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-lg font-black uppercase tracking-tighter flex items-center gap-3 text-[#002366]">
                                    <Award size={20} className="text-blue-600" />
                                    Certificados
                                </h4>
                                <Link to="/meus-certificados" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline transition-all flex items-center gap-1">
                                    Ver Todos <ChevronRight size={10} />
                                </Link>
                            </div>

                            {certificates.length > 0 && (
                                <div className="mb-6 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
                                    <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                                    <p className="text-[10px] font-bold text-amber-800 leading-relaxed uppercase tracking-tight">
                                        Importante: Seus certificados ficam disponíveis por 6 meses após a emissão.
                                        Faça o download para guardá-los permanentemente!
                                    </p>
                                </div>
                            )}

                            {certificates.length > 0 ? (
                                <div className="space-y-4 flex-1">
                                    {certificates.slice(0, 3).map((cert) => (
                                        <div key={cert.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-3xl hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100 group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                                                    <Award size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-[#002366] uppercase tracking-tight line-clamp-1">{cert.courses.name}</p>
                                                    <div className="flex flex-col gap-0.5">
                                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                                            <Clock size={8} />
                                                            Emitido: {new Date(cert.issue_date).toLocaleDateString()}
                                                        </p>
                                                        {cert.expires_at && (
                                                            <p className="text-[9px] font-bold text-amber-600 uppercase tracking-widest flex items-center gap-1">
                                                                <Clock size={8} />
                                                                Expira: {new Date(cert.expires_at).toLocaleDateString()}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <a
                                                href={cert.certificate_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                                title="Baixar Certificado"
                                            >
                                                <Download size={18} />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-4">
                                        <Award size={32} />
                                    </div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-loose">
                                        Conclua um curso para<br />liberar seus certificados
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Missions Preview */}
                        <div className="bg-[#002366] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
                            <h4 className="text-lg font-black uppercase mb-6 tracking-tighter flex items-center gap-3">
                                <Trophy size={20} className="text-yellow-400" />
                                Missões Próximas
                            </h4>
                            <div className="space-y-6 relative z-10">
                                {missions.length > 0 ? (
                                    missions.map((m) => {
                                        const progress = Math.min(100, Math.round((m.current_progress / m.missions.requirement_value) * 100));
                                        return (
                                            <div key={m.id}>
                                                <div className="flex justify-between text-[10px] font-black text-white/60 uppercase tracking-widest mb-2">
                                                    <span className="line-clamp-1">{m.missions.title}</span>
                                                    <span>{progress}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full transition-all duration-1000 ${m.status === 'completado' ? 'bg-green-400' : 'bg-blue-400'}`}
                                                        style={{ width: `${progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest italic text-center py-4">
                                        Nenhuma missão em andamento
                                    </p>
                                )}
                            </div>
                            {/* Pattern Decor */}
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-10 translate-y-10"></div>
                        </div>
                        {/* Activity History */}
                        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                            <div className="flex items-center gap-3 mb-6">
                                <Activity className="text-blue-600" size={24} />
                                <h3 className="text-xl font-black text-[#002366] uppercase tracking-tighter">Histórico</h3>
                            </div>

                            {pointLogs.length > 0 ? (
                                <div className="space-y-6">
                                    {pointLogs.map((log) => (
                                        <div key={log.id} className="flex gap-4 relative">
                                            <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                                <Trophy size={18} />
                                            </div>
                                            <div className="flex-grow border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <p className="text-xs font-black text-[#002366] uppercase tracking-tight">
                                                        {log.action_key === 'course_concluido'
                                                            ? `Concluiu ${log.metadata.course_name}`
                                                            : 'Ação realizada'}
                                                    </p>
                                                    <span className="text-green-600 font-black text-[10px]">+{log.points_awarded} PONTOS</span>
                                                </div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                                    <Clock size={10} />
                                                    {new Date(log.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-4">
                                        <History size={32} />
                                    </div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-loose">
                                        Suas conquistas aparecerão aqui
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Profile Editor Modal */}
            {isProfileModalOpen && (
                <ProfileEditor onClose={() => setIsProfileModalOpen(false)} />
            )}
        </div>
    );
};

export default StudentDashboard;
