import { User, Exercise, BodyPart, AnatomicalPart } from './types';

export const DEFAULT_USERS: User[] = [
  { id: 'u1', name: 'Pavan', avatarColor: 'bg-blue-500' },
  { id: 'u2', name: 'Sandy', avatarColor: 'bg-emerald-500' },
];

export const BODY_PARTS: BodyPart[] = [
  'QUADS FOCUSED',
  'CHEST + BICEP',
  'BACK + TRICEPS',
  'REST DAY – 10k STEPS + ABS',
  'REST DAY – ABS + 10k STEPS + CALF',
  'CHEST + SHOULDER',
  'HAMS & BACK',
  'ARMS'
];

export const INITIAL_EXERCISES: Exercise[] = [
  // QUADS FOCUSED
  { id: 'e1', name: 'Weighted single-leg calf raise', bodyPart: 'QUADS FOCUSED' },
  { id: 'e2', name: 'Leg extension', bodyPart: 'QUADS FOCUSED' },
  { id: 'e3', name: 'Smith squat', bodyPart: 'QUADS FOCUSED' },
  { id: 'e4', name: 'Leg press (45 degree)', bodyPart: 'QUADS FOCUSED' },
  { id: 'e5', name: 'Lunges', bodyPart: 'QUADS FOCUSED' },
  { id: 'e6', name: 'Seated leg curl', bodyPart: 'QUADS FOCUSED' },
  { id: 'e7', name: 'Calf press', bodyPart: 'QUADS FOCUSED' },

  // CHEST + BICEP
  { id: 'e8', name: 'Incline bench press', bodyPart: 'CHEST + BICEP' },
  { id: 'e9', name: 'Incline dumbbell press', bodyPart: 'CHEST + BICEP' },
  { id: 'e10', name: 'Decline smith press', bodyPart: 'CHEST + BICEP' },
  { id: 'e11', name: 'Cable side lateral', bodyPart: 'CHEST + BICEP' },
  { id: 'e12', name: 'Flat dumbbell fly', bodyPart: 'CHEST + BICEP' },
  { id: 'e13', name: 'Cable crossover', bodyPart: 'CHEST + BICEP' },
  { id: 'e14', name: 'Cable curl', bodyPart: 'CHEST + BICEP' },

  // BACK + TRICEPS
  { id: 'e15', name: 'Deadlift', bodyPart: 'BACK + TRICEPS' },
  { id: 'e16', name: 'Neutral-grip pull-ups', bodyPart: 'BACK + TRICEPS' },
  { id: 'e17', name: 'Supinated-grip lat pull-down', bodyPart: 'BACK + TRICEPS' },
  { id: 'e18', name: 'Barbell row', bodyPart: 'BACK + TRICEPS' },
  { id: 'e19', name: 'Single-arm supinated-grip cable row', bodyPart: 'BACK + TRICEPS' },
  { id: 'e20', name: 'Straight-bar cable pullover', bodyPart: 'BACK + TRICEPS' },
  { id: 'e21', name: 'Cable overhead extension (bar)', bodyPart: 'BACK + TRICEPS' },

  // REST DAY – 10k STEPS + ABS
  { id: 'e22', name: 'Swiss ball sit-ups', bodyPart: 'REST DAY – 10k STEPS + ABS' },
  { id: 'e23', name: 'Abs roller', bodyPart: 'REST DAY – 10k STEPS + ABS' },
  { id: 'e24', name: 'Leg raise', bodyPart: 'REST DAY – 10k STEPS + ABS' },

  // REST DAY – ABS + 10k STEPS + CALF
  { id: 'e25', name: 'Cable crunches', bodyPart: 'REST DAY – ABS + 10k STEPS + CALF' },
  { id: 'e26', name: 'Decline leg raises → decline sit-ups (superset)', bodyPart: 'REST DAY – ABS + 10k STEPS + CALF' },
  { id: 'e27', name: 'Wood choppers (high to low)', bodyPart: 'REST DAY – ABS + 10k STEPS + CALF' },


  // CHEST + SHOULDER
  { id: 'e28', name: 'Incline smith chest press', bodyPart: 'CHEST + SHOULDER' },
  { id: 'e29', name: 'Dumbbell shoulder press', bodyPart: 'CHEST + SHOULDER' },
  { id: 'e30', name: 'Machine shoulder press', bodyPart: 'CHEST + SHOULDER' },
  { id: 'e31', name: 'Incline chest cable fly', bodyPart: 'CHEST + SHOULDER' },
  { id: 'e32', name: 'Incline bench chest-supported dumbbell side lateral', bodyPart: 'CHEST + SHOULDER' },
  { id: 'e33', name: 'Dumbbell rear lateral', bodyPart: 'CHEST + SHOULDER' },

  // HAMS & BACK
  { id: 'e34', name: 'RDL', bodyPart: 'HAMS & BACK' },
  { id: 'e35', name: 'Supinated-grip lat pull-down', bodyPart: 'HAMS & BACK' }, // Duplicate, handled by ID if needed, but here we just list initials
  { id: 'e36', name: 'Dumbbell row', bodyPart: 'HAMS & BACK' },
  { id: 'e37', name: 'Pronated-grip cable row', bodyPart: 'HAMS & BACK' },
  { id: 'e38', name: 'Barbell shrugs', bodyPart: 'HAMS & BACK' },
  { id: 'e39', name: 'Stiff-leg deadlift', bodyPart: 'HAMS & BACK' },
  { id: 'e40', name: 'Hyperextension', bodyPart: 'HAMS & BACK' },
  { id: 'e41', name: 'Cable crunches', bodyPart: 'HAMS & BACK' },

  // ARMS
  { id: 'e42', name: 'Dips', bodyPart: 'ARMS' },
  { id: 'e43', name: 'Dumbbell skullcrusher', bodyPart: 'ARMS' },
  { id: 'e44', name: 'Dumbbell overhead extension', bodyPart: 'ARMS' },
  { id: 'e45', name: 'Barbell curl', bodyPart: 'ARMS' },
  { id: 'e46', name: 'Single-arm cable hammer curl', bodyPart: 'ARMS' },
  { id: 'e47', name: 'Dumbbell incline curl → dumbbell hammer curl (superset)', bodyPart: 'ARMS' },
  { id: 'e48', name: 'Reverse pec deck fly (rear delt)', bodyPart: 'ARMS' },
];

// Geometric / Boxy SVG Paths
// ViewBox: 0 0 200 400

export const FRONT_VIEW_PATHS: Record<string, { path: string, part: AnatomicalPart }> = {
  head: {
    path: "M85,10 L115,10 L115,45 L85,45 Z",
    part: 'Head'
  },
  neck: {
    path: "M90,45 L110,45 L110,55 L90,55 Z",
    part: 'Head'
  },
  shoulders_left: {
    path: "M110,55 L160,55 L160,85 L130,85 L110,55 Z", // Trapezoidal
    part: 'Shoulders'
  },
  shoulders_right: {
    path: "M90,55 L40,55 L40,85 L70,85 L90,55 Z",
    part: 'Shoulders'
  },
  chest: {
    path: "M75,85 L125,85 L120,135 L80,135 Z", // Broad plate
    part: 'Chest'
  },
  arms_left_upper: {
    path: "M160,55 L185,55 L185,120 L160,120 Z",
    part: 'Arms'
  },
  arms_right_upper: {
    path: "M40,55 L15,55 L15,120 L40,120 Z",
    part: 'Arms'
  },
  arms_left_lower: {
    path: "M160,125 L185,125 L180,180 L165,180 Z",
    part: 'Arms'
  },
  arms_right_lower: {
    path: "M40,125 L15,125 L20,180 L35,180 Z",
    part: 'Arms'
  },
  core: {
    path: "M80,135 L120,135 L115,185 L85,185 Z", // Tapered abs
    part: 'Core'
  },
  legs_left_upper: {
    path: "M102,185 L145,185 L140,280 L102,280 Z", // Quad
    part: 'Legs'
  },
  legs_right_upper: {
    path: "M98,185 L55,185 L60,280 L98,280 Z", // Quad
    part: 'Legs'
  },
  legs_left_lower: {
    path: "M105,285 L138,285 L135,380 L108,380 Z", // Calf
    part: 'Legs'
  },
  legs_right_lower: {
    path: "M95,285 L62,285 L65,380 L92,380 Z", // Calf
    part: 'Legs'
  }
};

export const BACK_VIEW_PATHS: Record<string, { path: string, part: AnatomicalPart }> = {
  head: {
    path: "M85,10 L115,10 L115,45 L85,45 Z",
    part: 'Head'
  },
  neck: {
    path: "M90,45 L110,45 L110,55 L90,55 Z",
    part: 'Head'
  },
  shoulders_back: { // Traps/Rear Delts span
    path: "M40,55 L160,55 L150,85 L50,85 Z",
    part: 'Shoulders'
  },
  back_upper: { // Lats
    path: "M50,85 L150,85 L130,145 L70,145 Z", // V-taper
    part: 'Back'
  },
  back_lower: { // Lower Back
    path: "M70,145 L130,145 L120,185 L80,185 Z",
    part: 'Back'
  },
  arms_left_upper: {
    path: "M160,55 L185,55 L185,120 L160,120 Z",
    part: 'Arms'
  },
  arms_right_upper: {
    path: "M40,55 L15,55 L15,120 L40,120 Z",
    part: 'Arms'
  },
  arms_left_lower: {
    path: "M160,125 L185,125 L180,180 L165,180 Z",
    part: 'Arms'
  },
  arms_right_lower: {
    path: "M40,125 L15,125 L20,180 L35,180 Z",
    part: 'Arms'
  },
  legs_left_upper: { // Glutes/Hams
    path: "M102,185 L145,185 L140,280 L102,280 Z",
    part: 'Legs'
  },
  legs_right_upper: { // Glutes/Hams
    path: "M98,185 L55,185 L60,280 L98,280 Z",
    part: 'Legs'
  },
  legs_left_lower: { // Calves
    path: "M105,285 L138,285 L135,380 L108,380 Z",
    part: 'Legs'
  },
  legs_right_lower: { // Calves
    path: "M95,285 L62,285 L65,380 L92,380 Z",
    part: 'Legs'
  }
};