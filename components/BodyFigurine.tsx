import React from 'react';
import { BodyPart, WorkoutLog } from '../types';
import { FRONT_VIEW_PATHS, BACK_VIEW_PATHS } from '../constants';

interface BodyFigurineProps {
  logs: WorkoutLog[];
  selectedBodyPart: BodyPart | null;
  onPartClick: (part: BodyPart) => void;
}

export const BodyFigurine: React.FC<BodyFigurineProps> = ({ logs, selectedBodyPart, onPartClick }) => {
  
  // Calculate recency color
  const getPartColor = (part: BodyPart | 'Head') => {
    if (part === 'Head') return '#27272a'; // Zinc 800

    const partLogs = logs.filter(l => l.bodyPart === part);
    const isActive = selectedBodyPart === part;
    
    // Base colors (Neon Theme)
    const activeColor = '#ccff00'; // Neon Lime
    const baseColor = '#27272a';   // Zinc 800 (Inactive)

    if (isActive) return activeColor;

    if (partLogs.length === 0) return baseColor; 

    // Heatmap logic if not selected
    const lastLog = partLogs.sort((a, b) => b.timestamp - a.timestamp)[0];
    const daysSince = (Date.now() - lastLog.timestamp) / (1000 * 60 * 60 * 24);

    if (daysSince < 3) return '#a3cc00'; // Darker Lime
    if (daysSince < 7) return '#84cc16'; // Even Darker Lime
    return '#3f3f46'; // Zinc 700 (Old)
  };

  const renderPaths = (paths: typeof FRONT_VIEW_PATHS) => {
    return Object.entries(paths).map(([key, { path, part }]) => {
      const isInteractive = part !== 'Head';
      const isSelected = selectedBodyPart === part;
      const fillColor = getPartColor(part);
      
      return (
        <path
          key={key}
          d={path}
          fill={fillColor}
          stroke={isSelected ? '#ccff00' : '#09090b'}
          strokeWidth="2"
          className={`transition-all duration-300 ${isInteractive ? 'cursor-pointer hover:opacity-80' : ''}`}
          onClick={isInteractive ? (e) => { e.stopPropagation(); onPartClick(part as BodyPart); } : undefined}
        />
      );
    });
  };

  return (
    <div className="flex items-center justify-center gap-12 w-full py-4 select-none">
      {/* Front View */}
      <div className="flex flex-col items-center group">
        <div className="relative w-24 h-48 sm:w-32 sm:h-64 filter drop-shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:scale-105">
           <svg viewBox="0 0 200 400" className="w-full h-full overflow-visible">
             {renderPaths(FRONT_VIEW_PATHS)}
           </svg>
        </div>
        <span className="text-[10px] text-muted mt-4 uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity font-bold">Front</span>
      </div>

      {/* Back View */}
      <div className="flex flex-col items-center group">
        <div className="relative w-24 h-48 sm:w-32 sm:h-64 filter drop-shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:scale-105">
           <svg viewBox="0 0 200 400" className="w-full h-full overflow-visible">
             {renderPaths(BACK_VIEW_PATHS)}
           </svg>
        </div>
        <span className="text-[10px] text-muted mt-4 uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity font-bold">Back</span>
      </div>
    </div>
  );
};