import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useSettings } from '../../context/SettingsContext';
import Button from '../Button';
import { Save, PlusCircle, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { HeroSlide } from '../../types';
import PrecisionDragPreview from './PrecisionDragPreview';

const Settings: React.FC = () => {
  const { settings, saveSettings, loading } = useSettings();
  const [formState, setFormState] = useState(settings);
  const [saved, setSaved] = useState(false);
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);

  const handleSlideChange = (index: number, field: keyof HeroSlide, value: string | number) => {
    setFormState(prev => {
      const newSlides = [...prev.heroSlides];
      newSlides[index] = { ...newSlides[index], [field]: value };
      return { ...prev, heroSlides: newSlides };
    });
  };

  useEffect(() => {
    if (!loading) {
      setFormState({
        ...settings,
        heroSlides: Array.isArray(settings.heroSlides) ? settings.heroSlides : [],
      });
    }
  }, [settings, loading]);

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: name === 'lowStockThreshold' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSlideImageChange = async (index: number, type: 'desktop' | 'mobile' | 'overlay', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoadingLocal(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `hero/${fileName}`;

        const { data, error } = await supabase.storage
          .from('site-assets')
          .upload(filePath, file, { upsert: true });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('site-assets')
          .getPublicUrl(filePath);

        let field: keyof HeroSlide = 'imageUrl';
        if (type === 'mobile') field = 'mobileImageUrl';
        if (type === 'overlay') field = 'overlayImageUrl';

        handleSlideChange(index, field, publicUrl);
        // Default alignment for new images only if it's a desktop image and doesn't have one
        if (type === 'desktop') {
          handleSlideChange(index, 'desktopAlignmentPercent', 50);
        }

        setSaved(false);
      } catch (error: any) {
        console.error("Upload error:", error);
        alert(`Erro ao enviar imagem: ${error.message || 'Erro desconhecido'}. Tente uma imagem menor ou outro formato.`);
      } finally {
        setIsLoadingLocal(false);
      }
    }
  };

  const handleLogoImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoadingLocal(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `logo_${Date.now()}.${fileExt}`;
        const filePath = `brand/${fileName}`;

        const { data, error } = await supabase.storage
          .from('site-assets')
          .upload(filePath, file, { upsert: true });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('site-assets')
          .getPublicUrl(filePath);

        setFormState(prev => ({ ...prev, siteLogoUrl: publicUrl }));
        setSaved(false);
      } catch (error: any) {
        console.error("Logo upload error:", error);
        alert(`Erro na logo: ${error.message}`);
      } finally {
        setIsLoadingLocal(false);
      }
    }
  };

  const handleFooterLogoImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoadingLocal(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `footer_logo_${Date.now()}.${fileExt}`;
        const filePath = `brand/${fileName}`;

        const { data, error } = await supabase.storage
          .from('site-assets')
          .upload(filePath, file, { upsert: true });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('site-assets')
          .getPublicUrl(filePath);

        setFormState(prev => ({ ...prev, footerLogoUrl: publicUrl }));
        setSaved(false);
      } catch (error: any) {
        console.error("Footer logo upload error:", error);
        alert(`Erro na logo do rodapé: ${error.message}`);
      } finally {
        setIsLoadingLocal(false);
      }
    }
  };

  const addSlide = () => {
    const newSlide: HeroSlide = {
      id: Date.now().toString(),
      imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80',
      linkUrl: '',
      mobileImageUrl: '',
      desktopAlignment: 'center',
      desktopAlignmentPercent: 50,
      type: 'image',
      title: '',
      description: '',
      bgColor: '#002366',
      textColor: '#ffffff',
      buttonColor: '#FACC15',
      buttonTextColor: '#000000',
      subtitle: '',
      subtitleColor: '#ffffff',
      subtitleBgColor: 'rgba(255, 255, 255, 0.2)',
      ctaText: 'QUERO ME CANDIDATAR'
    };

    setFormState(prev => ({
      ...prev,
      heroSlides: [...prev.heroSlides, newSlide]
    }));
  };

  const removeSlide = (index: number) => {
    if (window.confirm('Tem certeza que deseja remover este banner?')) {
      const newSlides = formState.heroSlides.filter((_, i) => i !== index);
      setFormState(prev => ({ ...prev, heroSlides: newSlides }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await saveSettings(formState);

    if (result.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      alert(`Erro ao salvar configurações: ${result.error}\n\nVerifique sua conexão e tente novamente.`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#333fa4]"></div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-10 sticky top-0 bg-gray-50/90 backdrop-blur py-4 z-10 border-b">
          <div>
            <h2 className="text-3xl font-black text-[#002366] uppercase tracking-tighter">Painel de Controle</h2>
            <p className="text-gray-500 text-sm">Gerencie a identidade visual e banners do site</p>
          </div>
          <div className="flex items-center gap-4">
            {saved && (
              <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 animate-bounce">
                <Save size={16} /> Sucesso!
              </div>
            )}
            <Button type="submit" variant="secondary" className="px-8 py-3 rounded-xl shadow-lg shadow-blue-200">
              <Save size={20} />
              Salvar Alterações
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Identity Column */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
              <h3 className="text-xl font-black text-[#002366] mb-6 flex items-center gap-3"><ImageIcon className="text-blue-500" /> Identidade</h3>

              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">Logo Cabeçalho</label>
                  <div className="flex flex-col gap-4">
                    <div className="h-24 w-full bg-blue-50/50 rounded-2xl flex items-center justify-center p-6 border-2 border-dashed border-blue-100">
                      {formState.siteLogoUrl ? (
                        <img src={formState.siteLogoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                      ) : (
                        <ImageIcon className="text-blue-200" size={32} />
                      )}
                    </div>
                    <label className="cursor-pointer bg-white w-full py-4 border-2 border-blue-500/20 rounded-2xl shadow-sm text-sm font-black text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-3 transition-all">
                      <Upload size={18} />
                      ESCOLHER LOGO
                      <input type="file" className="sr-only" onChange={handleLogoImageChange} accept="image/*" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">Logo Rodapé</label>
                  <div className="flex flex-col gap-4">
                    <div className="h-24 w-full bg-blue-50/50 rounded-2xl flex items-center justify-center p-6 border-2 border-dashed border-blue-100">
                      {formState.footerLogoUrl ? (
                        <img src={formState.footerLogoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                      ) : (
                        <ImageIcon className="text-blue-200" size={32} />
                      )}
                    </div>
                    <label className="cursor-pointer bg-white w-full py-4 border-2 border-blue-500/20 rounded-2xl shadow-sm text-sm font-black text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-3 transition-all">
                      <Upload size={18} />
                      ESCOLHER LOGO
                      <input type="file" className="sr-only" onChange={handleFooterLogoImageChange} accept="image/*" />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
              <h3 className="text-xl font-black text-[#002366] mb-6">Contato e Social</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">WhatsApp</label>
                  <input type="text" name="whatsappNumber" value={formState.whatsappNumber} onChange={handleGeneralChange} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold" placeholder="5511999998888" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Instagram URL</label>
                  <input type="url" name="instagramUrl" value={formState.instagramUrl || ''} onChange={handleGeneralChange} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">LinkedIn URL</label>
                  <input type="url" name="linkedinUrl" value={formState.linkedinUrl || ''} onChange={handleGeneralChange} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold" />
                </div>
              </div>
            </div>
          </div>

          {/* Banners Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-[#002366] uppercase tracking-tighter">Banners Publicitários</h3>
              <Button type="button" onClick={addSlide} variant="primary" className="py-2 px-6 rounded-xl text-xs font-black">
                <PlusCircle size={16} /> NOVO BANNER
              </Button>
            </div>

            <div className="space-y-12">
              {formState.heroSlides.map((slide, index) => (
                <div key={slide.id} className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden group">
                  <div className="bg-gray-50/80 px-8 py-4 border-b flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <span className="h-8 w-8 rounded-full bg-[#002366] text-white flex items-center justify-center font-black text-sm">{index + 1}</span>
                      <select
                        value={slide.type || 'image'}
                        onChange={(e) => handleSlideChange(index, 'type', e.target.value)}
                        className="bg-transparent border-none text-xs font-black uppercase tracking-widest text-[#002366] focus:ring-0 cursor-pointer"
                      >
                        <option value="image">Banner Clássico (Imagem)</option>
                        <option value="html">Banner Digital (Texto + Arte)</option>
                      </select>
                    </div>
                    <button type="button" onClick={() => removeSlide(index)} className="text-red-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50">
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="p-8">
                    {slide.type === 'html' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                          <div className="bg-gray-50 p-6 rounded-3xl">
                            <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">Design do Texto</label>
                            <div className="space-y-4">
                              <input type="text" value={slide.title || ''} onChange={(e) => handleSlideChange(index, 'title', e.target.value)} placeholder="Título Promessa" className="w-full p-4 bg-white rounded-2xl border-none shadow-sm font-black text-lg" />
                              <div className="flex gap-4">
                                <div className="flex-1">
                                  <label className="text-[10px] font-bold text-gray-400">COR FUNDO</label>
                                  <input type="color" value={slide.bgColor} onChange={(e) => handleSlideChange(index, 'bgColor', e.target.value)} className="w-full h-10 cursor-pointer rounded-xl border-none p-0" />
                                </div>
                                <div className="flex-1">
                                  <label className="text-[10px] font-bold text-gray-400">COR TEXTO</label>
                                  <input type="color" value={slide.textColor} onChange={(e) => handleSlideChange(index, 'textColor', e.target.value)} className="w-full h-10 cursor-pointer rounded-xl border-none p-0" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50 p-6 rounded-3xl">
                            <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">Chamada de Ação (CTA)</label>
                            <input type="text" value={slide.ctaText || ''} onChange={(e) => handleSlideChange(index, 'ctaText', e.target.value)} className="w-full p-4 bg-white rounded-2xl border-none shadow-sm font-bold text-sm mb-4" placeholder="Ex: INSCREVA-SE JÁ" />
                            <input type="text" value={slide.linkUrl} onChange={(e) => handleSlideChange(index, 'linkUrl', e.target.value)} className="w-full p-3 bg-white/50 rounded-xl border-none text-xs font-mono" placeholder="URL ou Caminho" />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest">Ajuste de Imagem (Drag)</label>
                          <PrecisionDragPreview
                            imageUrl={slide.overlayImageUrl || slide.imageUrl}
                            percent={slide.desktopAlignmentPercent || 50}
                            onChange={(p) => handleSlideChange(index, 'desktopAlignmentPercent', p)}
                            aspectRatio="aspect-square"
                          />
                          <label className="cursor-pointer bg-blue-50 w-full py-4 border-2 border-dashed border-blue-200 rounded-3xl text-xs font-black text-blue-500 hover:bg-blue-100 flex items-center justify-center gap-3 transition-all">
                            <Upload size={18} /> TROCAR ARTE
                            <input type="file" className="sr-only" onChange={(e) => handleSlideImageChange(index, 'overlay', e)} />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          <div className="md:col-span-2 space-y-4">
                            <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest">Enquadramento Desktop (Arraste para ajustar)</label>
                            <PrecisionDragPreview
                              imageUrl={slide.imageUrl}
                              percent={slide.desktopAlignmentPercent || 50}
                              onChange={(p) => handleSlideChange(index, 'desktopAlignmentPercent', p)}
                              isLoading={isLoadingLocal}
                              aspectRatio="aspect-[3/2]"
                            />
                            <div className="flex gap-4">
                              <label className="cursor-pointer flex-1 bg-blue-50 py-3 rounded-2xl text-[10px] font-black text-blue-600 hover:bg-blue-100 flex items-center justify-center gap-2 transition-all">
                                <Upload size={14} /> ADQUIRIR NOVA IMAGEM
                                <input type="file" className="sr-only" onChange={(e) => handleSlideImageChange(index, 'desktop', e)} />
                              </label>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Versão Mobile</label>
                            <div className="relative aspect-[9/16] bg-gray-100 rounded-[2rem] overflow-hidden border-2 border-dashed border-gray-200 group/mobile h-[300px] mx-auto">
                              {slide.mobileImageUrl ? (
                                <img src={slide.mobileImageUrl} alt="Mobile" className="w-full h-full object-cover" />
                              ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                                  <ImageIcon size={32} />
                                  <span className="text-[10px] font-black uppercase tracking-widest">Opcional</span>
                                </div>
                              )}
                              <label className="absolute inset-0 bg-black/40 opacity-0 group-hover/mobile:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                                <Upload className="text-white" />
                                <input type="file" className="sr-only" onChange={(e) => handleSlideImageChange(index, 'mobile', e)} />
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-3xl">
                          <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Link do Banner</label>
                          <input type="text" value={slide.linkUrl} onChange={(e) => handleSlideChange(index, 'linkUrl', e.target.value)} className="w-full p-4 bg-white rounded-2xl border-none shadow-sm text-sm" placeholder="Ex: /curso/id-do-curso" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Settings;
