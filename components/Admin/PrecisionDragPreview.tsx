
import React, { useState, useEffect, useRef } from 'react';
import { Move, Loader2 } from 'lucide-react';

interface PrecisionDragPreviewProps {
    imageUrl: string;
    percent: number;
    onChange: (newPercent: number) => void;
    aspectRatio?: string;
    isLoading?: boolean;
}

const PrecisionDragPreview: React.FC<PrecisionDragPreviewProps> = ({
    imageUrl,
    percent,
    onChange,
    aspectRatio = 'aspect-[0.8]',
    isLoading
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const startY = useRef(0);
    const startPercent = useRef(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (isLoading) return;
        setIsDragging(true);
        startY.current = e.clientY;
        startPercent.current = percent;
        e.preventDefault();
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !containerRef.current) return;
            const deltaY = e.clientY - startY.current;
            const height = containerRef.current.offsetHeight;

            // Sensitivity factor: adjusted for better control
            let newPercent = startPercent.current - (deltaY / height) * 50;
            newPercent = Math.max(0, Math.min(100, Math.round(newPercent)));
            onChange(newPercent);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, onChange]);

    return (
        <div
            ref={containerRef}
            className={`relative group bg-gray-100 rounded-2xl overflow-hidden cursor-ns-resize selection-none ${aspectRatio} border-2 border-dashed border-gray-200 shadow-inner group transition-all duration-300 hover:border-blue-400`}
            onMouseDown={handleMouseDown}
        >
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt="Preview"
                    className={`w-full h-full object-cover pointer-events-none transition-opacity duration-300 ${isLoading ? 'opacity-30' : 'opacity-100'}`}
                    style={{ objectPosition: `center ${percent}%` }}
                />
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 p-4 text-center gap-2">
                    <Move size={32} className="opacity-20" />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Nenhuma imagem</span>
                </div>
            )}

            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[2px]">
                    <Loader2 size={32} className="text-blue-600 animate-spin" />
                </div>
            )}

            {imageUrl && !isLoading && (
                <div className={`absolute inset-0 bg-blue-600/10 flex items-center justify-center transition-opacity duration-300 ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-[#333fa4] font-bold text-xs uppercase tracking-widest border border-blue-100">
                        <Move size={16} />
                        {isDragging ? 'Solte para Finalizar' : 'Arraste para Enquadrar'}
                    </div>
                </div>
            )}

            {imageUrl && (
                <div className="absolute bottom-3 right-3 bg-[#002366]/80 text-white text-[10px] font-black px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg border border-white/20">
                    {percent}%
                </div>
            )}
        </div>
    );
};

export default PrecisionDragPreview;
