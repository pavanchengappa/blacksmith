import { User, Exercise, BodyPart } from './types';

export const DEFAULT_USERS: User[] = [
  { id: 'u1', name: 'Pavan', avatarColor: 'bg-blue-500' },
  { id: 'u2', name: 'Sandy', avatarColor: 'bg-emerald-500' },
];

export const BODY_PARTS = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core'] as const;

export const INITIAL_EXERCISES: Exercise[] = [
  { id: 'e1', name: 'Bench Press', bodyPart: 'Chest' },
  { id: 'e2', name: 'Push Ups', bodyPart: 'Chest' },
  { id: 'e3', name: 'Pull Ups', bodyPart: 'Back' },
  { id: 'e4', name: 'Lat Pulldown', bodyPart: 'Back' },
  { id: 'e5', name: 'Overhead Press', bodyPart: 'Shoulders' },
  { id: 'e6', name: 'Lateral Raise', bodyPart: 'Shoulders' },
  { id: 'e7', name: 'Bicep Curls', bodyPart: 'Arms' },
  { id: 'e8', name: 'Tricep Dips', bodyPart: 'Arms' },
  { id: 'e9', name: 'Squats', bodyPart: 'Legs' },
  { id: 'e10', name: 'Lunges', bodyPart: 'Legs' },
  { id: 'e11', name: 'Plank', bodyPart: 'Core' },
  { id: 'e12', name: 'Crunches', bodyPart: 'Core' },
];

// Geometric / Boxy SVG Paths
// ViewBox: 0 0 200 400

export const FRONT_VIEW_PATHS: Record<string, { path: string, part: BodyPart | 'Head' }> = {
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

export const BACK_VIEW_PATHS: Record<string, { path: string, part: BodyPart | 'Head' }> = {
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