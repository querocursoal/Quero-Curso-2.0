
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { WHATSAPP_LINK, WHATSAPP_BUTTON_TEXTS } from '../constants';
import { MessageCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const ContactPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="bg-gray-50 text-gray-800 flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-[#bab709]">
        <div className="container mx-auto px-6 text-center py-20">
            <h2 className="text-4xl md:text-5xl font-bold text-[#333fa4] mb-4">Pronto para dar o próximo passo?</h2>
            <p className="text-xl text-[#000000] mb-8 max-w-2xl mx-auto">Nossa equipe está pronta para tirar todas as suas dúvidas. Clique no botão abaixo e fale conosco diretamente no WhatsApp!</p>
            <Button href={WHATSAPP_LINK(settings.whatsappNumber)} variant="secondary" className="text-xl">
              <MessageCircle size={24} />
              {WHATSAPP_BUTTON_TEXTS.INQUIRY}
            </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;