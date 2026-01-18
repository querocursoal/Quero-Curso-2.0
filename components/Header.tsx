
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { COMPANY_NAME } from '../constants';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { settings } = useSettings();
  const { isAuthenticated, profile, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Início', to: '/' },
    { name: 'Cursos', to: '/cursos' },
    { name: 'Institucional', to: '/institucional' },
    { name: 'Contato', to: '/contato' },
  ];

  const activeLinkStyle = {
    color: '#333fa4',
    fontWeight: 'bold',
  };

  const handleLogout = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      setUserMenuOpen(false);
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-[#333fa4] flex items-center">
          {settings.siteLogoUrl ? (
            <img src={settings.siteLogoUrl} alt={`${COMPANY_NAME} Logo`} className="h-12 w-auto" />
          ) : (
            COMPANY_NAME
          )}
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-8 items-center">
          {navLinks.map(link => (
            <NavLink
              key={link.name}
              to={link.to}
              className="text-black font-semibold hover:text-[#333fa4] transition-colors duration-300"
              style={({ isActive }) => (isActive ? activeLinkStyle : {})}
            >
              {link.name}
            </NavLink>
          ))}

          {/* User Menu or Login Button */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-[#333fa4] text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <User size={18} />
                Olá, {profile?.full_name?.split(' ')[0] || 'Usuário'}
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100">
                  <button
                    onClick={() => { navigate('/student-dashboard'); setUserMenuOpen(false); }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                  >
                    <LayoutDashboard size={16} />
                    Meu Painel
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleLogout(e)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600"
                  >
                    <LogOut size={16} />
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-[#333fa4] font-semibold hover:text-blue-700 transition-colors"
              >
                Entrar
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-[#333fa4] text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Cadastre-se
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-[#333fa4] focus:outline-none">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <nav className="flex flex-col items-center space-y-4 py-4">
            {navLinks.map(link => (
              <NavLink
                key={link.name}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="text-black text-lg font-semibold hover:text-[#333fa4] transition-colors duration-300"
                style={({ isActive }) => (isActive ? activeLinkStyle : {})}
              >
                {link.name}
              </NavLink>
            ))}

            {isAuthenticated ? (
              <>
                <button
                  onClick={() => { navigate('/student-dashboard'); setIsOpen(false); }}
                  className="text-black text-lg font-semibold hover:text-[#333fa4] transition-colors duration-300 flex items-center gap-2"
                >
                  <LayoutDashboard size={18} />
                  Meu Painel
                </button>
                <button
                  type="button"
                  onClick={(e) => { handleLogout(e); setIsOpen(false); }}
                  className="text-red-600 text-lg font-semibold hover:text-red-700 transition-colors duration-300 flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-black text-lg font-semibold hover:text-[#333fa4] transition-colors duration-300"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 bg-[#333fa4] text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Cadastre-se
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
