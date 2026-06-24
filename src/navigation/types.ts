import type {Exhibition} from '../types';

export type AppPhase = 'Loader' | 'Onboarding' | 'Main';

export type AppTab =
  | 'ExhibitionsTab'
  | 'FactsTab'
  | 'QuizTab'
  | 'StudioTab'
  | 'CalculatorTab';

export type AppOverlay =
  | {type: 'none'}
  | {type: 'ExhibitionDetail'; exhibition: Exhibition}
  | {type: 'QuizGame'}
  | {type: 'QuizResult'; score: number; total: number; correctCount: number}
  | {type: 'CalculatorHistory'};
