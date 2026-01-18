
import React from 'react';
import { GraduationCap, LifeBuoy, Award } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-r from-[#00c6ff] to-[#0072ff] py-6 relative overflow-hidden my-6 rounded-[2rem] mx-auto container shadow-[0_15px_35px_rgba(0,114,255,0.2)]">
      {/* Decorative Subtle Elements */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-50%] left-[-10%] w-[400px] h-[400px] border-[30px] border-white/20 rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-5%] w-[300px] h-[300px] border-[20px] border-white/20 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4 text-white">

          {/* Item 1 */}
          <div className="flex items-center gap-4 group w-full md:w-auto">
            <div className="flex-shrink-0 bg-white/15 p-3 rounded-2xl backdrop-blur-sm border border-white/30 shadow-sm group-hover:scale-110 transition-transform">
              <GraduationCap size={28} className="text-white" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm md:text-base font-black uppercase tracking-tight leading-none mb-1">Especialistas</h3>
              <p className="text-[10px] md:text-xs font-semibold opacity-90 leading-tight md:max-w-[180px]">Ministrantes com vasta experiência prática.</p>
            </div>
          </div>

          {/* Divider (Desktop Only) */}
          <div className="hidden md:block h-8 w-px bg-white/20"></div>

          {/* Item 2 */}
          <div className="flex items-center gap-4 group w-full md:w-auto">
            <div className="flex-shrink-0 bg-white/15 p-3 rounded-2xl backdrop-blur-sm border border-white/30 shadow-sm group-hover:scale-110 transition-transform">
              <LifeBuoy size={28} className="text-white" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm md:text-base font-black uppercase tracking-tight leading-none mb-1">Suporte Pós</h3>
              <p className="text-[10px] md:text-xs font-semibold opacity-90 leading-tight md:max-w-[180px]">Tire suas dúvidas após a conclusão.</p>
            </div>
          </div>

          {/* Divider (Desktop Only) */}
          <div className="hidden md:block h-8 w-px bg-white/20"></div>

          {/* Item 3 */}
          <div className="flex items-center gap-4 group w-full md:w-auto">
            <div className="flex-shrink-0 bg-white/15 p-3 rounded-2xl backdrop-blur-sm border border-white/30 shadow-sm group-hover:scale-110 transition-transform">
              <Award size={28} className="text-white" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm md:text-base font-black uppercase tracking-tight leading-none mb-1">Certificação</h3>
              <p className="text-[10px] md:text-xs font-semibold opacity-90 leading-tight md:max-w-[180px]">Certificado reconhecido pelo mercado.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;