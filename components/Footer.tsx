
import React from 'react';
import { Link } from 'react-router-dom';
import { COMPANY_NAME } from '../constants';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useCourses } from '../context/CoursesContext';
import ControlPanelIcon from './icons/ControlPanelIcon';
import { Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { settings } = useSettings();
  const { courses } = useCourses();

  const courseChunks = React.useMemo(() => {
    const half = Math.ceil(courses.length / 2);
    return [courses.slice(0, half), courses.slice(half)];
  }, [courses]);

  const SocialLink: React.FC<{ href: string; 'aria-label': string; children: React.ReactNode }> = ({ href, children, ...props }) => (
    href ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    ) : null
  );

  return (
    <footer className="bg-[#333fa4] text-white pt-16 pb-6 rounded-t-[3rem] mt-12 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-t-[8px] border-[#4452b9]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">

          {/* Brand Column - Logo e Redes Sociais */}
          <div className="md:col-span-3">
            {settings.footerLogoUrl ? (
              <img src={settings.footerLogoUrl} alt={`${COMPANY_NAME} Logo`} className="max-w-[140px] h-auto mb-4" />
            ) : (
              <>
                <h3 className="text-2xl font-bold text-white mb-2">{COMPANY_NAME}</h3>
                <p className="text-sm text-white/70 mb-1">Capacitação Profissional</p>
              </>
            )}
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Transformando carreiras através de capacitação de qualidade.
            </p>
            <div className="flex items-center gap-3">
              <SocialLink href={settings.instagramUrl} aria-label="Siga-nos no Instagram">
                <div className="p-2.5 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <Instagram size={22} className="text-white" />
                </div>
              </SocialLink>
              <SocialLink href={settings.linkedinUrl} aria-label="Conecte-se no LinkedIn">
                <div className="p-2.5 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <Linkedin size={22} className="text-white" />
                </div>
              </SocialLink>
            </div>
          </div>

          {/* Courses Sitemap Column - Catálogo de Cursos */}
          <div className="md:col-span-6">
            <h4 className="font-bold text-lg mb-4 text-white border-b border-white/20 pb-2">Catálogo de Cursos</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
              {courseChunks.map((chunk, chunkIndex) => (
                <ul key={chunkIndex} className="space-y-2">
                  {chunk.map(course => (
                    <li key={course.id} className="flex items-start group">
                      <span className="text-[#bab709] mr-2 mt-0.5 group-hover:text-white transition-colors">•</span>
                      <Link
                        to={`/curso/${course.id}`}
                        className="text-gray-300 text-sm hover:text-white hover:translate-x-1 transition-all duration-200"
                      >
                        {course.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>

          {/* Institutional Links Column - Links Institucionais */}
          <div className="md:col-span-3">
            <h4 className="font-bold text-lg mb-4 text-white border-b border-white/20 pb-2">Institucional</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/institucional"
                  className="text-gray-300 text-sm hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center gap-2"
                >
                  <span className="text-[#bab709]">›</span> Quem Somos
                </Link>
              </li>
              <li>
                <Link
                  to="/cursos"
                  className="text-gray-300 text-sm hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center gap-2"
                >
                  <span className="text-[#bab709]">›</span> Nossos Cursos
                </Link>
              </li>
              <li>
                <Link
                  to="/contato"
                  className="text-gray-300 text-sm hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center gap-2"
                >
                  <span className="text-[#bab709]">›</span> Contato
                </Link>
              </li>
              <li>
                <Link
                  to="/termos-de-inscricao"
                  className="text-gray-300 text-sm hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center gap-2"
                >
                  <span className="text-[#bab709]">›</span> Termos de Inscrição
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/20">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-sm text-gray-400 text-center sm:text-left">
              &copy; {new Date().getFullYear()} {COMPANY_NAME}. Todos os direitos reservados.
            </span>

            <div className="flex items-center gap-6">
              {isAuthenticated && isAdmin ? (
                <Link
                  to="/admin"
                  className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <ControlPanelIcon size={18} />
                  Painel Administrativo
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Área Restrita
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
