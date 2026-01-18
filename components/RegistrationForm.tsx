import React, { useState } from 'react';
import Button from './Button';
import { maskCEP, maskCPF, maskPhone } from '../utils/maskUtils';
import { Send, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RegistrationFormProps {
  courseName: string;
}

// FIX: Define a type for the form data for better type safety.
interface FormDataState {
  nome: string; email: string; celular: string; cpf: string; cep: string;
  rua: string; bairro: string; numero: string; cidade: string; estado: string;
  graduacao: string; periodo: string; complemento: string; indicadoPor: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ courseName }) => {
  const [formData, setFormData] = useState<FormDataState>({
    nome: '', email: '', celular: '', cpf: '', cep: '',
    rua: '', bairro: '', numero: '', cidade: '', estado: '',
    graduacao: '', periodo: courseName, complemento: '', indicadoPor: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormDataState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const requiredFields: (keyof FormDataState)[] = [
    'nome', 'email', 'celular', 'cpf', 'cep', 'rua', 'bairro', 'numero', 'cidade', 'estado', 'graduacao', 'periodo'
  ];

  const validate = () => {
    const newErrors: Partial<Record<keyof FormDataState, string>> = {};
    requiredFields.forEach(field => {
      // The original error was on this line. Stricter typing should resolve it.
      if (!formData[field].trim()) {
        newErrors[field] = 'Este campo é obrigatório.';
      }
    });
    // Simple email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Por favor, insira um email válido.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const key = name as keyof FormDataState;
    let maskedValue = value;
    if (key === 'cpf') maskedValue = maskCPF(value);
    if (key === 'celular') maskedValue = maskPhone(value);
    if (key === 'cep') maskedValue = maskCEP(value);
    
    setFormData(prev => ({ ...prev, [key]: maskedValue }));
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setSubmitStatus('error');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form data submitted:', formData);
      setIsSubmitting(false);
      setSubmitStatus('success');
      // Reset form if needed
      // setFormData({ ...initialState });
    }, 1500);
  };
  
  const InputField: React.FC<{ name: keyof FormDataState, label: string, required?: boolean, placeholder?: string }> = ({ name, label, required = false, placeholder }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type="text"
            id={name}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            placeholder={placeholder}
            className={`mt-1 block w-full px-3 py-2 border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-[#333fa4] focus:border-[#333fa4] sm:text-sm`}
        />
        {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField name="nome" label="Nome Completo" required />
        <InputField name="email" label="Email" required />
        <InputField name="celular" label="Celular" required placeholder="(00) 00000-0000" />
        <InputField name="cpf" label="CPF" required placeholder="000.000.000-00" />
        <InputField name="cep" label="CEP" required placeholder="00000-000" />
        <InputField name="rua" label="Rua" required />
        <InputField name="bairro" label="Bairro" required />
        <InputField name="numero" label="Número" required />
        <InputField name="cidade" label="Cidade" required />
        <InputField name="estado" label="Estado" required />
        <InputField name="graduacao" label="Graduação" required />
        <InputField name="periodo" label="Período do curso" required />
        <InputField name="complemento" label="Complemento" />
        <InputField name="indicadoPor" label="Indicado por" />
      </div>
      
      <div className="mt-6 text-center">
        <Button type="submit" variant="secondary" className="w-full md:w-auto text-lg" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : (<><Send size={20} /> Cadastrar / Garantir minha vaga</>)}
        </Button>
      </div>

      {submitStatus === 'error' && (
        <div className="mt-4 flex items-center justify-center gap-2 text-red-600 bg-red-100 p-3 rounded-md">
            <AlertCircle size={20} />
            <span>Por favor, corrija os campos em vermelho.</span>
        </div>
      )}
      {submitStatus === 'success' && (
        <div className="mt-4 flex items-center justify-center gap-2 text-green-700 bg-green-100 p-3 rounded-md">
            <CheckCircle size={20} />
            <span>Inscrição enviada com sucesso! Entraremos em contato em breve.</span>
        </div>
      )}

      <div className="mt-6 text-center text-xs text-gray-500">
        <p className="mb-1">Prometemos não utilizar suas informações de contato para enviar qualquer tipo de SPAM.</p>
        <p>Ao se inscrever, você concorda com nosso <Link to="/termos-de-inscricao" className="text-[#333fa4] hover:underline font-semibold">Termo de Inscrição</Link>.</p>
      </div>
    </form>
  );
};

export default RegistrationForm;
