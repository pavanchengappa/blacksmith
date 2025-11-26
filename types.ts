export interface User {
  id: string;
  name: string;
  avatarColor: string;
}

export type BodyPart = 'Chest' | 'Back' | 'Shoulders' | 'Arms' | 'Legs' | 'Core';

export interface Exercise {
  id: string;
  name: string;
  bodyPart: BodyPart;
  isCustom?: boolean;
}

export interface WorkoutSet {
  weight: number;
  reps: number;
}

export interface WorkoutLog {
  id: string;
  userId: string;
  date: string; // ISO String
  exerciseId: string;
  exerciseName: string;
  bodyPart: BodyPart;
  sets: WorkoutSet[];
  notes?: string;
  timestamp: number;
}

export interface ExportData {
  user: string;
  date: string;
  bodyPart: string;
  exercise: string;
  set: number;
  weight: number;
  reps: number;
  notes: string;
}