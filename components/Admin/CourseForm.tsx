
import React, { useState, useEffect } from 'react';
import { useCourses } from '../../context/CoursesContext';
import { Course } from '../../types';
import Button from '../Button';
import { X, Save, Upload, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import PrecisionDragPreview from './PrecisionDragPreview';
import { maskCurrency, parseCurrency, maskDate } from '../../utils/masks';

interface CourseFormProps {
  courseToEdit: Course | null;
  onClose: () => void;
}

// Utility to convert base64 to Blob robustly
const base64ToBlob = (base64: string) => {
  try {
    const byteString = atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  } catch (e) {
    console.error("base64ToBlob error:", e);
    return null;
  }
};

const FormField = ({ label, name, children }: { label: string, name: string, children?: React.ReactNode }) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={name} className="text-sm font-bold text-gray-700">{label}</label>
    {children}
  </div>
);

const CourseForm: React.FC<CourseFormProps> = ({ courseToEdit, onClose }) => {
  const { addCourse, updateCourse } = useCourses();

  const [programContentBulk, setProgramContentBulk] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    presentation: '',
    professors: '',
    city: '',
    date: '',
    totalVacancies: '',
    remainingVacancies: '',
    isVip: false,
    registrationFee: '',
    registrationDeadline: '',
    workload: '',
    classPeriod: '',
    targetAudience: '',
    objectives: '',
    priceCash: '',
    fullPrice: '',
    installmentsText: '',
    thumbnailAlignmentPercent: 50,
    cert_professor_name: '',
    cert_template_url: '',
    cert_signature_url: '',
  });

  const [thumbnail, setThumbnail] = useState<string>('');
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // State for image cropper
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  useEffect(() => {
    if (courseToEdit) {
      setFormData({
        name: courseToEdit.name,
        presentation: courseToEdit.presentation,
        professors: courseToEdit.professors.join(', '),
        city: courseToEdit.city,
        date: courseToEdit.date,
        totalVacancies: String(courseToEdit.totalVacancies),
        remainingVacancies: String(courseToEdit.remainingVacancies),
        isVip: courseToEdit.isVip,
        registrationFee: String(courseToEdit.registrationFee),
        registrationDeadline: courseToEdit.registrationDeadline,
        workload: courseToEdit.workload,
        classPeriod: courseToEdit.classPeriod,
        targetAudience: courseToEdit.targetAudience,
        objectives: courseToEdit.objectives,
        priceCash: String(courseToEdit.priceCash),
        fullPrice: String(courseToEdit.fullPrice),
        installmentsText: courseToEdit.installmentsText,
      });
      setThumbnail(courseToEdit.thumbnail);
      setThumbnailPreview(courseToEdit.thumbnail);

      const bulkText = courseToEdit.programContent
        .map(pc => `${pc.title}\n${pc.topics.join('\n')}`)
        .join('\n\n');
      setProgramContentBulk(bulkText);

      setFormData(prev => ({
        ...prev,
        cert_professor_name: (courseToEdit as any).cert_professor_name || '',
        cert_template_url: (courseToEdit as any).cert_template_url || '',
        cert_signature_url: (courseToEdit as any).cert_signature_url || '',
      }));
    }
  }, [courseToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const name = target.name;
    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: target.checked }));
    } else {
      let value = target.value;

      // Apply masks for specific fields
      if (['registrationFee', 'priceCash', 'fullPrice'].includes(name)) {
        value = maskCurrency(value);
      } else if (['date', 'registrationDeadline'].includes(name)) {
        value = maskDate(value);
      }

      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setFormError(null);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `courses/${fileName}`;

        const { data, error } = await supabase.storage
          .from('site-assets')
          .upload(filePath, file, { upsert: true });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('site-assets')
          .getPublicUrl(filePath);

        setThumbnail(publicUrl);
        setThumbnailPreview(publicUrl);
        setFormData(prev => ({ ...prev, thumbnailAlignmentPercent: 50 })); // Reset alignment for new image
      } catch (err: any) {
        console.error("Upload error:", err);
        setFormError(`Erro ao carregar imagem: ${err.message}`);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleCertAssetChange = async (e: React.ChangeEvent<HTMLInputElement>, field: 'cert_template_url' | 'cert_signature_url') => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `cert_${field}_${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `certificates/assets/${fileName}`;

        const { data, error } = await supabase.storage
          .from('site-assets')
          .upload(filePath, file, { upsert: true });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('site-assets')
          .getPublicUrl(filePath);

        setFormData(prev => ({ ...prev, [field]: publicUrl }));
      } catch (err: any) {
        console.error("Upload error:", err);
        setFormError(`Erro ao carregar arquivo de certificado: ${err.message}`);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleAlignmentChange = (percent: number) => {
    setFormData(prev => ({ ...prev, thumbnailAlignmentPercent: percent }));
  };

  const validateForm = () => {
    const total = parseInt(formData.totalVacancies);

    if (total < 0) {
      setFormError('O número de vagas não pode ser negativo.');
      return false;
    }
    if (!thumbnail) {
      setFormError('É necessário carregar uma imagem de capa.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsUploading(true);
    setFormError(null);
    let finalThumbnailUrl = thumbnail;

    try {
      // Image is already uploaded to storage via handleImageChange

      const sections = programContentBulk.split(/\n\s*\n/).filter(s => s.trim() !== '');
      const structuredProgram = sections.map(section => {
        const lines = section.split('\n').filter(l => l.trim() !== '');
        const title = lines[0] || '';
        const topics = lines.slice(1);
        return { title, topics };
      });

      const courseData: Omit<Course, 'id'> = {
        name: formData.name,
        presentation: formData.presentation,
        thumbnail: finalThumbnailUrl,
        professors: formData.professors.split(',').map(p => p.trim()),
        city: formData.city,
        date: formData.date,
        totalVacancies: parseInt(formData.totalVacancies) || 0,
        remainingVacancies: parseInt(formData.totalVacancies) || 0, // Default to total for now
        isVip: formData.isVip,
        registrationFee: parseCurrency(formData.registrationFee) || 0,
        registrationDeadline: formData.registrationDeadline,
        workload: formData.workload,
        classPeriod: formData.classPeriod,
        targetAudience: formData.targetAudience,
        objectives: formData.objectives,
        programContent: structuredProgram,
        priceCash: parseCurrency(formData.priceCash) || 0,
        fullPrice: parseCurrency(formData.fullPrice) || 0,
        installmentsText: formData.installmentsText,
        thumbnailAlignmentPercent: formData.thumbnailAlignmentPercent || 50,
        cert_template_url: formData.cert_template_url,
        cert_signature_url: formData.cert_signature_url,
        cert_professor_name: formData.cert_professor_name,
      } as any;

      if (courseToEdit) {
        await updateCourse({ ...courseData, id: courseToEdit.id });
      } else {
        await addCourse(courseData);
      }
      onClose();
    } catch (err: any) {
      console.error("Save error:", err);
      setFormError(`Erro ao salvar: ${err.message || 'Verifique sua conexão ou permissões.'}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-5xl mx-auto mb-20">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">{courseToEdit ? 'Editar Curso' : 'Criar Novo Curso'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-8">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-[#333fa4] border-b pb-2">Informações Básicas</h4>
              <FormField label="Nome do Curso" name="name">
                <input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Ex: Fisioterapia Intensiva" className="p-2 border rounded w-full" required />
              </FormField>
              <FormField label="Apresentação (Vitrine)" name="presentation">
                <textarea id="presentation" name="presentation" value={formData.presentation} onChange={handleChange} placeholder="Breve texto que aparece no card do curso..." className="p-2 border rounded w-full" rows={3} required />
              </FormField>
              <FormField label="Objetivos do Curso" name="objectives">
                <textarea id="objectives" name="objectives" value={formData.objectives} onChange={handleChange} placeholder="O que o aluno vai aprender..." className="p-2 border rounded w-full" rows={3} required />
              </FormField>
            </div>

            {/* Detalhes e Logística */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-[#333fa4] border-b pb-2">Detalhes e Logística</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField label="Professores" name="professors">
                  <input id="professors" name="professors" value={formData.professors} onChange={handleChange} placeholder="Nomes separados por vírgula" className="p-2 border rounded w-full" required />
                </FormField>
                <FormField label="Cidade / Local" name="city">
                  <input id="city" name="city" value={formData.city} onChange={handleChange} placeholder="Ex: Arapiraca/AL" className="p-2 border rounded w-full" required />
                </FormField>
                <FormField label="Público-Alvo" name="targetAudience">
                  <input id="targetAudience" name="targetAudience" value={formData.targetAudience} onChange={handleChange} placeholder="Ex: Estudantes e Profissionais" className="p-2 border rounded w-full" required />
                </FormField>
                <FormField label="Início Previsto" name="date">
                  <input id="date" name="date" value={formData.date} onChange={handleChange} placeholder="01/01/2026" className="p-2 border rounded w-full" required />
                </FormField>
                <FormField label="Prazo Final Inscrição" name="registrationDeadline">
                  <input id="registrationDeadline" name="registrationDeadline" value={formData.registrationDeadline} onChange={handleChange} placeholder="01/01/2026" className="p-2 border rounded w-full" required />
                </FormField>
                <FormField label="Período das Aulas" name="classPeriod">
                  <input id="classPeriod" name="classPeriod" value={formData.classPeriod} onChange={handleChange} placeholder="Ex: Sábado e Domingo (08h às 18h)" className="p-2 border rounded w-full" required />
                </FormField>
                <FormField label="Carga Horária" name="workload">
                  <input id="workload" name="workload" value={formData.workload} onChange={handleChange} placeholder="Ex: 20h" className="p-2 border rounded w-full" required />
                </FormField>
              </div>
            </div>

            {/* Valores e Vagas */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-[#333fa4] border-b pb-2">Valores e Vagas</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField label="Taxa de Inscrição" name="registrationFee">
                  <input id="registrationFee" type="text" name="registrationFee" value={formData.registrationFee} onChange={handleChange} placeholder="R$ 0,00" className="p-2 border rounded w-full" required />
                </FormField>
                <FormField label="Valor à Vista" name="priceCash">
                  <input id="priceCash" type="text" name="priceCash" value={formData.priceCash} onChange={handleChange} placeholder="R$ 0,00" className="p-2 border rounded w-full" required />
                </FormField>
                <FormField label="Valor Total Cartão" name="fullPrice">
                  <input id="fullPrice" type="text" name="fullPrice" value={formData.fullPrice} onChange={handleChange} placeholder="R$ 0,00" className="p-2 border rounded w-full" required />
                </FormField>
                <FormField label="Texto de Parcelamento" name="installmentsText">
                  <input id="installmentsText" name="installmentsText" value={formData.installmentsText} onChange={handleChange} placeholder="Ex: 10x de R$ 150" className="p-2 border rounded w-full" required />
                </FormField>
                <FormField label="Total de Vagas" name="totalVacancies">
                  <input id="totalVacancies" type="number" name="totalVacancies" value={formData.totalVacancies} onChange={handleChange} placeholder="0" className="p-2 border rounded w-full" required />
                </FormField>
              </div>
            </div>

            {/* Conteúdo Programático */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-[#333fa4] border-b pb-2">Conteúdo Programático (Modo Lista)</h4>
              <textarea
                value={programContentBulk}
                onChange={(e) => setProgramContentBulk(e.target.value)}
                placeholder="Cole o programa do curso aqui..."
                className="p-4 border rounded w-full font-mono text-sm leading-relaxed"
                rows={12}
                required
              />
            </div>

            {/* Capa do Curso */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-[#333fa4] border-b pb-2">Capa do Curso (Vertical 1080x1350)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest">Enquadramento (Arraste para ajustar)</label>
                  <PrecisionDragPreview
                    imageUrl={thumbnailPreview || ''}
                    percent={formData.thumbnailAlignmentPercent}
                    onChange={handleAlignmentChange}
                    isLoading={isUploading}
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest">Ações</label>
                  <label htmlFor="file-upload" className="cursor-pointer bg-white py-4 px-6 border-2 border-dashed border-gray-300 rounded-3xl shadow-sm text-sm font-black text-gray-500 hover:bg-gray-50 hover:border-blue-400 hover:text-blue-500 flex items-center justify-center gap-3 transition-all">
                    <Upload size={20} />
                    <span>{thumbnailPreview ? 'TROCAR FLYER' : 'ESCOLHER FLYER'}</span>
                  </label>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                  <p className="text-xs text-gray-400 leading-relaxed italic">
                    Dica: Suba o flyer completo (1080x1350). Arraste no preview ao lado para enquadrar a parte principal sem cortar logos ou textos importantes.
                  </p>
                </div>
              </div>
            </div>

            {/* Configuração do Certificado */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-[#333fa4] border-b pb-2">Configuração do Certificado (Automático)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Nome do Professor (Assinante)" name="cert_professor_name">
                  <input
                    id="cert_professor_name"
                    name="cert_professor_name"
                    value={formData.cert_professor_name}
                    onChange={handleChange}
                    placeholder="Ex: Dr. João Silva"
                    className="p-2 border rounded w-full"
                  />
                </FormField>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-700">Modelo do Certificado (Template)</label>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer bg-blue-50 py-2 px-4 border border-blue-200 rounded-xl text-xs font-black text-blue-600 hover:bg-blue-100 transition-all flex items-center gap-2">
                      <Upload size={14} />
                      <span>{formData.cert_template_url ? 'Alterar Template' : 'Subir Template (Fundo)'}</span>
                      <input type="file" className="sr-only" onChange={(e) => handleCertAssetChange(e, 'cert_template_url')} accept="image/*" />
                    </label>
                    {formData.cert_template_url && <span className="text-[10px] text-green-600 font-bold uppercase">✓ Carregado</span>}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-700">Assinatura Digital (PNG Transparente)</label>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer bg-blue-50 py-2 px-4 border border-blue-200 rounded-xl text-xs font-black text-blue-600 hover:bg-blue-100 transition-all flex items-center gap-2">
                      <Upload size={14} />
                      <span>{formData.cert_signature_url ? 'Alterar Assinatura' : 'Subir Assinatura'}</span>
                      <input type="file" className="sr-only" onChange={(e) => handleCertAssetChange(e, 'cert_signature_url')} accept="image/*" />
                    </label>
                    {formData.cert_signature_url && <span className="text-[10px] text-green-600 font-bold uppercase">✓ Carregada</span>}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400 italic">
                * O sistema usará esses arquivos para gerar o PDF automaticamente quando o aluno concluir o curso.
              </p>
            </div>

            {/* VIP Checkbox */}
            <div className="flex items-center gap-4 pt-4 border-t">
              <label className="flex items-center gap-3 font-semibold text-gray-700 cursor-pointer">
                <input type="checkbox" name="isVip" checked={formData.isVip} onChange={handleChange} className="h-5 w-5 rounded border-gray-300 text-[#333fa4] focus:ring-[#333fa4]" />
                Marcar como Curso VIP (Destaque)
              </label>
            </div>
          </div>

          {formError && (
            <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-lg border border-red-100">
              <AlertCircle size={20} />
              <span className="font-semibold text-sm">{formError}</span>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button type="button" onClick={onClose} variant="primary" className="bg-white border-gray-300 text-gray-600 hover:bg-gray-50">Cancelar</Button>
            <Button type="submit" variant="secondary" disabled={isUploading}>
              {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isUploading ? 'Salvando...' : 'Salvar Curso'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CourseForm;
