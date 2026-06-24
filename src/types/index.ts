export interface Exhibition {
  id: string;
  title: string;
  location: string;
  coordinates: {lat: number; lon: number};
  typicalSeason: string;
  tag: string;
  shortDescription: string;
  fullDescription: string;
  whatToExpect: string;
  bestTimeToVisit: string;
  iceArtNotes: string;
}

export interface Fact {
  id: string;
  title: string;
  category: string;
  shortText: string;
  detailText: string;
  isUserFact?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  answers: string[];
  correctIndex: number;
}

export interface DrawingPath {
  path: string;
  color: string;
  strokeWidth: number;
}

export interface SavedDrawing {
  id: string;
  paths: DrawingPath[];
  taskPrompt: string;
  date: string;
}

export interface CalcHistoryItem {
  id: string;
  shape: string;
  inputs: Record<string, number>;
  unit: string;
  volume: number;
  mass: number;
  waterLiters: number;
  waterM3: number;
  date: string;
}
