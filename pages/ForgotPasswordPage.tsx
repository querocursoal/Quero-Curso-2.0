
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { COMPANY_NAME } from '../constants';
import Button from '../components/Button';
import { Mail, ArrowLeft, Send } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { resetPassword } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        const { error: resetError } = await resetPassword(email);

        if (resetError) {
            setError(resetError.message);
        } else {
            setMessage('E-mail de recuperação enviado com sucesso! Verifique sua caixa de entrada.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3a8a] via-[#3b82f6] to-[#1e40af] relative overflow-hidden font-['Outfit',sans-serif] px-4">
            {/* Decorative Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 w-full max-w-[440px]">
                <Link to="/login" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold uppercase tracking-widest">Voltar para Login</span>
                </Link>

                <div className="bg-white/95 backdrop-blur-3xl p-8 md:p-12 rounded-[2.5rem] shadow-[0_45px_100px_rgba(0,0,0,0.3)] border border-white/60">
                    <div className="mb-8 text-center">
                        <div className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-4 bg-yellow-50 text-yellow-800 shadow-sm border border-yellow-100">
                            Recuperação
                        </div>
                        <h1 className="text-3xl font-black text-[#002366] leading-tight mb-2 uppercase tracking-tighter">
                            ESQUECI SENHA
                        </h1>
                        <p className="text-gray-400 font-bold text-xs tracking-wide">ENVIAREMOS UM LINK DE ACESSO</p>
                    </div>

                    {!message ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                    Seu E-mail de Cadastro
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

                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-2xl transform animate-head-shake">
                                    <p className="text-red-700 text-xs font-black uppercase tracking-tight">{error}</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full py-5 rounded-2xl shadow-xl shadow-blue-200 hover:shadow-400 transform hover:-translate-y-1 transition-all duration-300 text-sm font-black tracking-widest flex items-center justify-center gap-3 uppercase bg-[#0072ff] text-white"
                                disabled={loading}
                            >
                                {loading ? 'Enviando...' : (
                                    <>
                                        <Send size={18} strokeWidth={3} />
                                        Enviar Link
                                    </>
                                )}
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Send size={28} />
                            </div>
                            <p className="text-gray-600 font-bold mb-8">{message}</p>
                            <Link to="/login" className="inline-block w-full py-5 rounded-2xl bg-gray-100 text-gray-800 font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all">
                                Ir para Login
                            </Link>
                        </div>
                    )}

                    <div className="mt-8 text-center">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                            {COMPANY_NAME}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
