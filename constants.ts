import { Chord, SplitChordButton } from './types';

// Base Frequencies (Equal Temperament, A4=440Hz)
// Octave 3 (Lower/Body)
const E3 = 164.81;
const G3 = 196.00;
const A3 = 220.00;
const B3 = 246.94;

// Octave 4 (Mid/High)
const C4 = 261.63;
const D4 = 293.66;
const E4 = 329.63;
const F_SHARP_4 = 369.99;
const G4 = 392.00;
const A4 = 440.00;
const B4 = 493.88;

// Chord Definitions
const CHORD_Em: Chord = {
  name: 'Em',
  notes: [E4, G4, B4], // Revoiced to E4 octave
  color: 'bg-yellow-500', // Brighter Golden Yellow
};

const CHORD_C: Chord = {
  name: 'C',
  notes: [C4, E4, G4], // Root position C major
  color: 'bg-red-600', // Red
};

const CHORD_D: Chord = {
  name: 'D',
  notes: [D4, F_SHARP_4, A4], // Root position D major
  color: 'bg-orange-500', // Orange
};

const CHORD_Am: Chord = {
  name: 'Am',
  notes: [A3, C4, E4], // Root position A minor
  color: 'bg-blue-600', // Blue
};

const CHORD_G: Chord = {
  name: 'G',
  notes: [G3, B3, D4], // Root position G major (Octave 3)
  color: 'bg-teal-500', // Turquoise
};

// Set 1: Em/C, Em/C, D/Am, D/Em
const SET_1: SplitChordButton[] = [
  { id: 1, call: CHORD_Em, response: CHORD_C },
  { id: 2, call: CHORD_Em, response: CHORD_C },
  { id: 3, call: CHORD_D, response: CHORD_Am },
  { id: 4, call: CHORD_D, response: CHORD_Em },
];

// Set 2: G/C, G/C, D/Am, D/Em
const SET_2: SplitChordButton[] = [
  { id: 5, call: CHORD_G, response: CHORD_C },
  { id: 6, call: CHORD_G, response: CHORD_C },
  { id: 7, call: CHORD_D, response: CHORD_Am },
  { id: 8, call: CHORD_D, response: CHORD_Em },
];

export const CHORD_SETS = [SET_1, SET_2];