
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TermsPage: React.FC = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      <Header />
      <main className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-lg shadow-lg">
            <h1 className="text-2xl md:text-3xl font-black text-center text-[#333fa4] mb-10 leading-tight uppercase">
              CONTRATO DE ADESÃO E PRESTAÇÃO DE SERVIÇOS EDUCACIONAIS
            </h1>

            <div className="prose max-w-none text-gray-700 leading-relaxed text-sm md:text-base space-y-8">
              <section>
                <h2 className="text-xl font-bold text-[#333fa4] border-b pb-2 mb-4">1. DO OBJETO</h2>
                <p>
                  1.1. O presente contrato tem como objeto a prestação de serviços de ensino presencial em cursos de capacitação livre,
                  conforme o curso específico selecionado pelo CONTRATANTE no ato da inscrição.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#333fa4] border-b pb-2 mb-4">2. DA INSCRIÇÃO E CONFIRMAÇÃO</h2>
                <p className="mb-4">
                  2.1. A inscrição é pessoal e intransferível. A garantia da vaga ocorre apenas mediante o pagamento da
                  Taxa de Inscrição/Reserva ou do valor integral do curso.
                </p>
                <p>
                  2.2. O CONTRATANTE é responsável pela veracidade dos dados fornecidos e por garantir que possui a
                  formação técnica necessária para a prática do conteúdo ensinado, respeitando as normas de seu respectivo Conselho de Classe.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#333fa4] border-b pb-2 mb-4">3. DO CANCELAMENTO E REEMBOLSO (PRESENCIAL)</h2>
                <p className="mb-4 text-xs uppercase font-bold text-gray-500 italic">Baseado no equilíbrio contratual (Art. 412, Código Civil).</p>

                <div className="space-y-4">
                  <h3 className="font-bold text-gray-800 uppercase text-sm tracking-wide">3.1. Por iniciativa do Aluno:</h3>
                  <ul className="list-disc pl-5 space-y-3">
                    <li>
                      <span className="font-bold">Até 15 dias antes do início:</span> Devolução do valor pago, com retenção de 20% do valor total
                      do curso a título de taxa administrativa e reserva de vaga.
                    </li>
                    <li>
                      <span className="font-bold">Entre 14 e 8 dias antes do início:</span> O aluno perderá o valor referente à Taxa de Inscrição/Reserva,
                      destinada a cobrir os custos de materiais personalizados e logística já contratada.
                    </li>
                    <li>
                      <span className="font-bold">Menos de 7 dias ou ausência (No-show):</span> Não haverá devolução de valores ou concessão de créditos,
                      visto que a vaga deixou de ser ocupada por outro interessado e os custos fixos foram integralmente mantidos.
                    </li>
                  </ul>

                  <h3 className="font-bold text-gray-800 uppercase text-sm tracking-wide mt-6">3.2. Por iniciativa da Organizadora:</h3>
                  <p>
                    A CONTRATADA reserva-se o direito de adiar ou cancelar o evento caso não atinja o quórum mínimo ou por motivos de força maior.
                    Nestes casos, o aluno poderá optar pelo reembolso integral (100%) em até 30 dias ou pela transferência para uma turma futura.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#333fa4] border-b pb-2 mb-4">4. DAS REGRAS DE CONDUTA E APRENDIZADO</h2>
                <div className="space-y-4">
                  <p>
                    <span className="font-bold">4.1. Assiduidade:</span> O certificado de conclusão será emitido apenas aos alunos que cumprirem a
                    frequência mínima estabelecida para o curso (padrão de 75% das horas-aula).
                  </p>
                  <p>
                    <span className="font-bold">4.2. Direitos de Imagem:</span> O aluno autoriza o uso gratuito de sua imagem e voz para fins de
                    divulgação e publicidade do Quero Curso, em fotos e vídeos captados durante o evento.
                  </p>
                  <p>
                    <span className="font-bold">4.3. Material Didático:</span> É vedada a reprodução, compartilhamento ou venda do material
                    didático fornecido, sendo este protegido pela Lei de Direitos Autorais (Lei nº 9.610/98).
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#333fa4] border-b pb-2 mb-4">5. DO PAGAMENTO</h2>
                <div className="space-y-4">
                  <p>
                    <span className="font-bold">5.1.</span> O não comparecimento do aluno às aulas não o exime do pagamento das parcelas vincendas,
                    uma vez que o serviço foi colocado à sua disposição conforme contratado.
                  </p>
                  <p>
                    <span className="font-bold">5.2.</span> Em caso de atraso no pagamento de parcelas, incidirá multa de 2% e juros de mora de 1% ao mês.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#333fa4] border-b pb-2 mb-4">6. DO FORO</h2>
                <p>
                  6.1. As partes elegem o Foro da Comarca de Arapiraca/AL para dirimir quaisquer controvérsias oriundas deste contrato.
                </p>
              </section>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col items-center gap-4 text-center">
              <div className="p-4 bg-gray-50 rounded-xl max-w-lg">
                <p className="text-xs text-gray-500 italic">
                  Este contrato é automático para todos os cursos oferecidos pela plataforma Quero Curso.
                  Ao realizar sua inscrição e pagamento, você concorda com todos os termos acima.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage;
