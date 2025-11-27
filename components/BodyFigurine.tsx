import React from 'react';
import { BodyPart, WorkoutLog, AnatomicalPart } from '../types';
import { FRONT_VIEW_PATHS, BACK_VIEW_PATHS } from '../constants';

interface BodyFigurineProps {
  logs: WorkoutLog[];
  selectedBodyPart: BodyPart | null;
  onPartClick: (part: BodyPart) => void;
}

// Mapping from Anatomical Parts (Visual) to Workout Splits (Logical)
const ANATOMY_TO_SPLITS: Record<AnatomicalPart, BodyPart[]> = {
  'Chest': ['CHEST + BICEP', 'CHEST + SHOULDER'],
  'Back': ['BACK + TRICEPS', 'HAMS & BACK'],
  'Shoulders': ['CHEST + SHOULDER'],
  'Arms': ['CHEST + BICEP', 'BACK + TRICEPS', 'ARMS'],
  'Legs': ['QUADS FOCUSED', 'HAMS & BACK', 'REST DAY – ABS + 10k STEPS + CALF'],
  'Core': ['REST DAY – 10k STEPS + ABS', 'REST DAY – ABS + 10k STEPS + CALF', 'HAMS & BACK'],
  'Head': []
};

export const BodyFigurine: React.FC<BodyFigurineProps> = ({ logs, selectedBodyPart, onPartClick }) => {

  // Calculate recency color
  const getPartColor = (part: AnatomicalPart) => {
    if (part === 'Head') return '#27272a'; // Zinc 800

    const relevantSplits = ANATOMY_TO_SPLITS[part];
    const partLogs = logs.filter(l => relevantSplits.includes(l.bodyPart));

    // Check if any of the relevant splits are currently selected
    const isSelected = selectedBodyPart && relevantSplits.includes(selectedBodyPart);

    // Base colors (Neon Theme)
    const activeColor = '#ccff00'; // Neon Lime
    const baseColor = '#27272a';   // Zinc 800 (Inactive)

    if (isSelected) return activeColor;

    if (partLogs.length === 0) return baseColor;

    // Heatmap logic if not selected
    const lastLog = partLogs.sort((a, b) => b.timestamp - a.timestamp)[0];
    const daysSince = (Date.now() - lastLog.timestamp) / (1000 * 60 * 60 * 24);

    if (daysSince < 3) return '#a3cc00'; // Darker Lime
    if (daysSince < 7) return '#84cc16'; // Even Darker Lime
    return '#3f3f46'; // Zinc 700 (Old)
  };

  const handlePartClick = (part: AnatomicalPart) => {
    if (part === 'Head') return;
    const splits = ANATOMY_TO_SPLITS[part];
    if (splits.length > 0) {
      // Default to the first split associated with this part, or cycle if needed.
      // For simplicity, we'll pick the first one. 
      // Ideally, we might want to show a menu, but for now, let's pick the most primary one.
      onPartClick(splits[0]);
    }
  };

  const renderPaths = (paths: typeof FRONT_VIEW_PATHS) => {
    return Object.entries(paths).map(([key, { path, part }]) => {
      const isInteractive = part !== 'Head';
      const isSelected = selectedBodyPart && ANATOMY_TO_SPLITS[part].includes(selectedBodyPart);
      const fillColor = getPartColor(part);

      return (
        <path
          key={key}
          d={path}
          fill={fillColor}
          stroke={isSelected ? '#ccff00' : '#09090b'}
          strokeWidth="2"
          className={`transition-all duration-300 ${isInteractive ? 'cursor-pointer hover:opacity-80' : ''}`}
          onClick={isInteractive ? (e) => { e.stopPropagation(); handlePartClick(part); } : undefined}
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