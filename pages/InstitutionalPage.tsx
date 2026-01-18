
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Award, Target, Building, Heart, Eye } from 'lucide-react';

const InstitutionalPage: React.FC = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      <Header />
      <main className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-[#333fa4] mb-12">Quem Somos</h2>
          <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-lg shadow-lg">
            <div className="text-center mb-10">
              <Building size={48} className="mx-auto text-[#bab709] mb-4" />
              <p className="text-lg leading-relaxed">
                A Quero Curso nasceu do desejo de conectar pessoas ao conhecimento prático e transformador. Acreditamos que a capacitação profissional é a chave para o desenvolvimento pessoal e o sucesso no mercado de trabalho. Nossa jornada é dedicada a oferecer cursos presenciais de alta qualidade, ministrados por especialistas apaixonados pelo que fazem.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-10 text-center mb-10">
              <div>
                <Heart size={36} className="mx-auto text-[#333fa4] mb-3" />
                <h4 className="text-xl font-bold mb-2 text-[#333fa4]">Missão</h4>
                <p>Capacitar profissionais com excelência, oferecendo conhecimento aplicável que gere resultados reais em suas carreiras.</p>
              </div>
              <div>
                <Eye size={36} className="mx-auto text-[#333fa4] mb-3" />
                <h4 className="text-xl font-bold mb-2 text-[#333fa4]">Visão</h4>
                <p>Ser a principal referência em capacitação profissional presencial, reconhecida pela qualidade e impacto na vida dos alunos.</p>
              </div>
              <div>
                <Award size={36} className="mx-auto text-[#333fa4] mb-3" />
                <h4 className="text-xl font-bold mb-2 text-[#333fa4]">Valores</h4>
                <p>Compromisso com o aluno, excelência no ensino, ética, inovação e paixão por educar.</p>
              </div>
            </div>
            <div className="text-center border-t pt-10">
              <Target size={36} className="mx-auto text-[#333fa4] mb-3" />
              <h4 className="text-xl font-bold mb-2 text-[#333fa4]">Nosso Objetivo</h4>
              <p>Nosso objetivo é simples: impulsionar sua carreira. Criamos um ambiente de aprendizado dinâmico e interativo para que você possa adquirir novas habilidades, expandir seu networking e alcançar seus objetivos profissionais com confiança e preparo.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InstitutionalPage;
