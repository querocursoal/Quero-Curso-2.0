
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { COMPANY_NAME } from '../constants';
import Button from '../components/Button';
import { Lock, Mail, Eye } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: loginError } = await login(email, password);

    if (loginError) {
      setError('Credenciais inválidas. Verifique seu acesso.');
      setPassword('');
      setLoading(false);
    } else {
      if (data?.user) {
        // Check if user is admin
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', data.user.id)
          .single();

        if (adminData) {
          navigate('/admin', { replace: true });
        } else {
          navigate('/student-dashboard', { replace: true });
        }
      } else {
        // Fallback if no user data but no error (unlikely)
        navigate('/student-dashboard', { replace: true });
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#00c6ff] via-[#0072ff] to-[#333fa4] relative overflow-hidden font-['Outfit',sans-serif] px-4">
      {/* Decorative Geometric Elements (FTD Style) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] border-[40px] border-white/5 shadow-[0_0_100px_rgba(255,255,255,0.05)] rounded-full animate-pulse [animation-duration:12s]"></div>
        <div className="absolute bottom-[-15%] right-[-5%] w-[400px] h-[400px] border-[30px] border-white/5 shadow-[0_0_80px_rgba(255,255,255,0.05)] rounded-full animate-pulse [animation-duration:18s]"></div>
        <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        <div className="bg-white/95 backdrop-blur-3xl p-8 md:p-12 rounded-[2.5rem] shadow-[0_45px_100px_rgba(0,0,0,0.25)] border border-white/60">
          <div className="mb-10 text-center">
            <div className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-4 bg-blue-50 text-blue-800 shadow-sm border border-blue-100">
              Acesso Restrito
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-[#002366] leading-tight mb-2 uppercase tracking-tighter">
              {COMPANY_NAME}
            </h1>
            <p className="text-gray-400 font-bold text-sm tracking-wide">ÁREA DO ALUNO</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                Seu E-mail de Aluno
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
                  placeholder="aluno@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label htmlFor="password" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Sua Senha
                </label>
                <Link to="/forgot-password" size={18} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
                  Esqueci minha senha
                </Link>
              </div>
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
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Eye size={18} />
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50/80 border-l-4 border-red-500 p-4 rounded-r-2xl transform animate-head-shake">
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
                {loading ? 'Validando...' : 'Entrar na Área do Aluno'}
              </Button>
            </div>
          </form>

          <div className="mt-12 text-center border-t border-gray-100 pt-8">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">Novo por aqui?</p>
            <div className="flex flex-col gap-3 items-center">
              <Link
                to="/register"
                className="w-full py-4 border-2 border-blue-600 text-blue-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm"
              >
                Criar Minha Conta
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
