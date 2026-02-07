export interface Note {
  frequency: number;
}

export interface Chord {
  name: string;
  notes: number[]; // Array of frequencies
  color: string; // Tailwind color class for visual distinction
}

export interface SplitChordButton {
  id: number;
  call: Chord;
  response: Chord;
}