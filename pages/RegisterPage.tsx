
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { COMPANY_NAME } from '../constants';
import Button from '../components/Button';
import { Lock, Mail, User, Eye, ArrowLeft } from 'lucide-react';

const RegisterPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            setLoading(false);
            return;
        }

        const { error: regError } = await register(email, password);

        if (regError) {
            setError(regError.message);
        } else {
            // Success - Supabase by default sends a confirmation email if configured
            // For now, we'll redirect to a "success" or login page
            alert('Conta criada com sucesso! Verifique seu e-mail para confirmar (se habilitado).');
            navigate('/login');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3a8a] via-[#3b82f6] to-[#1e40af] relative overflow-hidden font-['Outfit',sans-serif] px-4">
            {/* Decorative Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] border-[50px] border-white/5 rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-20%] left-[-5%] w-[400px] h-[400px] bg-yellow-400/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 w-full max-w-[480px]">
                {/* Back Link */}
                <Link to="/login" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold uppercase tracking-widest">Voltar para Login</span>
                </Link>

                <div className="bg-white/95 backdrop-blur-3xl p-8 md:p-12 rounded-[2.5rem] shadow-[0_45px_100px_rgba(0,0,0,0.3)] border border-white/60">
                    <div className="mb-8 text-center">
                        <div className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-4 bg-blue-50 text-blue-800 shadow-sm border border-blue-100">
                            Novo Aluno
                        </div>
                        <h1 className="text-3xl font-black text-[#002366] leading-tight mb-2 uppercase tracking-tighter">
                            CRIAR CONTA
                        </h1>
                        <p className="text-gray-400 font-bold text-xs tracking-wide">COMECE SUA JORNADA HOJE</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="name" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                Nome Completo
                            </label>
                            <div className="relative group">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                    <User size={18} />
                                </span>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-gray-50/80 border-2 border-transparent py-4 pl-12 pr-4 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-500/30 transition-all shadow-sm font-medium"
                                    placeholder="Seu nome"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                Seu E-mail
                            </label>
                            <div className="relative group">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                    <Mail size={18} />
                                </span>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-50/80 border-2 border-transparent py-4 pl-12 pr-4 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-500/30 transition-all shadow-sm font-medium"
                                    placeholder="exemplo@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                Crie uma Senha
                            </label>
                            <div className="relative group">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                    <Lock size={18} />
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-50/80 border-2 border-transparent py-4 pl-12 pr-12 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-500/30 transition-all shadow-sm font-medium"
                                    placeholder="Min. 6 caracteres"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600"
                                >
                                    <Eye size={18} />
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                Confirme a Senha
                            </label>
                            <div className="relative group">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                    <Lock size={18} />
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-gray-50/80 border-2 border-transparent py-4 pl-12 pr-4 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-500/30 transition-all shadow-sm font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-2xl transform animate-head-shake">
                                <p className="text-red-700 text-xs font-black uppercase tracking-tight">{error}</p>
                            </div>
                        )}

                        <div className="pt-4">
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full py-5 rounded-2xl shadow-xl shadow-blue-200 hover:shadow-400 transform hover:-translate-y-1 transition-all duration-300 text-sm font-black tracking-widest flex items-center justify-center gap-2 uppercase bg-[#0072ff] text-white"
                                disabled={loading}
                            >
                                {loading ? 'Criando Conta...' : 'Começar Agora'}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-500 font-bold">
                            Já tem uma conta?{' '}
                            <Link to="/login" className="text-blue-600 hover:underline">
                                Faça Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
