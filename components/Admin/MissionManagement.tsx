import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Trophy, Plus, Trash2, Edit, Save, X, CheckCircle } from 'lucide-react';

interface Mission {
    id: string;
    title: string;
    description: string;
    requirement_type: 'course_count' | 'points' | 'specific_course';
    requirement_value: number;
    reward_points: number;
    reward_xp: number;
    icon: string;
    is_active: boolean;
}

const MissionManagement: React.FC = () => {
    const [missions, setMissions] = useState<Mission[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentMission, setCurrentMission] = useState<Partial<Mission>>({});

    useEffect(() => {
        fetchMissions();
    }, []);

    const fetchMissions = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('missions')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setMissions(data);
        setLoading(false);
    };

    const handleSave = async () => {
        if (!currentMission.title) return alert('Título é obrigatório');

        try {
            if (currentMission.id) {
                // Update
                const { error } = await supabase
                    .from('missions')
                    .update(currentMission)
                    .eq('id', currentMission.id);
                if (error) throw error;
            } else {
                // Create
                const { error } = await supabase
                    .from('missions')
                    .insert([{ ...currentMission, is_active: true }]);
                if (error) throw error;
            }

            setIsEditing(false);
            setCurrentMission({});
            fetchMissions();
        } catch (error) {
            console.error('Error saving mission:', error);
            alert('Erro ao salvar missão');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Excluir esta missão?')) return;

        try {
            const { error } = await supabase
                .from('missions')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchMissions();
        } catch (error) {
            console.error('Error deleting mission:', error);
            alert('Erro ao excluir missão');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
                        <Trophy size={24} className="text-[#002366]" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-[#002366] uppercase tracking-tight">
                            Gerenciar Missões
                        </h2>
                        <p className="text-sm text-gray-500 font-medium">
                            Crie desafios para engajar os alunos
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => { setIsEditing(true); setCurrentMission({}); }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#002366] text-white rounded-xl font-bold text-sm hover:bg-blue-900 transition-colors"
                >
                    <Plus size={18} />
                    Nova Missão
                </button>
            </div>

            {isEditing && (
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-lg font-bold text-[#002366] mb-4">
                        {currentMission.id ? 'Editar Missão' : 'Nova Missão'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Título da Missão"
                            value={currentMission.title || ''}
                            onChange={e => setCurrentMission({ ...currentMission, title: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                        />
                        <input
                            type="text"
                            placeholder="Descrição"
                            value={currentMission.description || ''}
                            onChange={e => setCurrentMission({ ...currentMission, description: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                        />
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Recompensa (Pontos)</label>
                            <input
                                type="number"
                                placeholder="Ex: 100"
                                value={currentMission.reward_points || ''}
                                onChange={e => setCurrentMission({ ...currentMission, reward_points: parseInt(e.target.value) })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Meta (Valor Numérico)</label>
                            <input
                                type="number"
                                placeholder="Ex: 5 (Cursos)"
                                value={currentMission.requirement_value || ''}
                                onChange={e => setCurrentMission({ ...currentMission, requirement_value: parseInt(e.target.value) })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 flex items-center gap-2"
                        >
                            <Save size={18} />
                            Salvar
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {missions.map(mission => (
                    <div key={mission.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative group">
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => { setCurrentMission(mission); setIsEditing(true); }}
                                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                            >
                                <Edit size={14} />
                            </button>
                            <button
                                onClick={() => handleDelete(mission.id)}
                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-600">
                                <Trophy size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#002366]">{mission.title}</h4>
                                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                    +{mission.reward_points} pts
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">{mission.description}</p>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full w-1/3"></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 text-center">Meta: {mission.requirement_value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MissionManagement;
