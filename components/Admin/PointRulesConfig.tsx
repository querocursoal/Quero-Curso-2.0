import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Award, Save, RefreshCw } from 'lucide-react';

const PointRulesConfig: React.FC = () => {
    const [rules, setRules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = async () => {
        setLoading(true);
        // This assumes a 'gamification_rules' table exists or we store in settings.
        // For now we will mock or use a settings table query.
        // Let's assume we store in a simple key-value table or JSON in settings.
        // To be simpler, we'll just mock the state for UI demonstration if table doesn't exist yet,
        // but typically we'd fetch from 'gamification_rules'.

        // Mock data for initial view
        setRules([
            { key: 'course_enrollment', label: 'Matrícula em Curso', points: 50 },
            { key: 'course_completion', label: 'Conclusão de Curso', points: 200 },
            { key: 'daily_login', label: 'Login Diário', points: 5 },
            { key: 'profile_complete', label: 'Perfil Completo', points: 100 },
        ]);
        setLoading(false);
    };

    const handlePointChange = (key: string, value: number) => {
        setRules(rules.map(r => r.key === key ? { ...r, points: value } : r));
    };

    const handleSave = async () => {
        // Ideally save to DB
        alert('Regras salvas com sucesso! (Simulação)');
        // Implement actual DB save here later
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                    <Award size={24} className="text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-[#002366] uppercase tracking-tight">
                        Regras de Pontuação
                    </h2>
                    <p className="text-sm text-gray-500 font-medium">
                        Defina quantos pontos vale cada ação
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-2xl">
                <div className="space-y-6">
                    {rules.map((rule) => (
                        <div key={rule.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                            <div>
                                <h4 className="font-bold text-[#002366] text-lg">{rule.label}</h4>
                                <p className="text-xs text-gray-500 font-mono uppercase">{rule.key}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={rule.points}
                                        onChange={(e) => handlePointChange(rule.key, parseInt(e.target.value))}
                                        className="w-24 px-4 py-2 border border-gray-200 rounded-lg text-right font-black text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                    <span className="absolute right-8 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-300 pointer-events-none">PTS</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleSave}
                        className="px-8 py-3 bg-purple-600 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-lg shadow-purple-200"
                    >
                        <Save size={18} />
                        Salvar Regras
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PointRulesConfig;
