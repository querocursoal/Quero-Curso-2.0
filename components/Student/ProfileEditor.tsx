import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Camera, X, Loader2, Save, Trash2 } from 'lucide-react';

interface ProfileEditorProps {
    onClose: () => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ onClose }) => {
    const { profile, updateProfile, uploadAvatar } = useAuth();
    const [fullName, setFullName] = useState(profile?.full_name || '');
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await updateProfile({
                full_name: fullName,
                avatar_url: avatarUrl
            });
            if (error) throw error;
            onClose();
        } catch (error: any) {
            console.error('Error updating profile:', error);
            alert(`Erro ao salvar perfil: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecione uma imagem válida.');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert('A imagem deve ter no máximo 2MB.');
            return;
        }

        setUploading(true);
        try {
            const { publicUrl, error } = await uploadAvatar(file);
            if (error) throw error;
            if (publicUrl) setAvatarUrl(publicUrl);
        } catch (error: any) {
            console.error('Error uploading avatar:', error);
            alert(`Erro ao carregar imagem: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const removeAvatar = async () => {
        setAvatarUrl('');
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-md w-full shadow-2xl relative overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-[#002366] transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="text-center mb-8">
                    <h3 className="text-2xl font-black text-[#002366] uppercase tracking-tighter mb-2">Editar Perfil</h3>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Personalize sua presença na plataforma</p>
                </div>

                <form onSubmit={handleSave} className="space-y-8">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-blue-50 border-4 border-white shadow-xl shadow-blue-200/50 flex items-center justify-center relative">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={64} className="text-blue-200" />
                                )}

                                {uploading && (
                                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-sm">
                                        <Loader2 size={32} className="text-blue-600 animate-spin" />
                                    </div>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-1 right-1 bg-blue-600 text-white p-2.5 rounded-full shadow-lg hover:bg-black transition-all transform hover:scale-110"
                                title="Trocar foto"
                            >
                                <Camera size={18} />
                            </button>

                            {avatarUrl && (
                                <button
                                    type="button"
                                    onClick={removeAvatar}
                                    className="absolute -top-1 -right-1 bg-red-100 text-red-600 p-1.5 rounded-full shadow-md hover:bg-red-200 transition-all opacity-0 group-hover:opacity-100"
                                    title="Remover foto"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <p className="mt-4 text-[10px] font-black text-blue-600 uppercase tracking-widest">Toque na câmera para mudar a foto</p>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-2">Nome Completo</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:border-blue-600 rounded-2xl font-bold text-[#002366] focus:outline-none transition-all"
                                placeholder="Seu nome completo"
                                required
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 bg-gray-100 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="flex-1 py-4 bg-[#002366] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-blue-200 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <>
                                    <Save size={16} />
                                    Salvar
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Decor */}
                <div className="absolute bottom-[-10%] left-[-10%] w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
            </div>
        </div>
    );
};

export default ProfileEditor;
