import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import type {Exhibition} from '../types';
import type {AppOverlay, AppPhase, AppTab} from './types';

type NavigationContextValue = {
  phase: AppPhase;
  activeTab: AppTab;
  overlay: AppOverlay;
  finishLoader: (skipOnboarding: boolean) => void;
  finishOnboarding: () => void;
  selectTab: (tab: AppTab) => void;
  goBack: () => void;
  openExhibitionDetail: (exhibition: Exhibition) => void;
  openQuizGame: () => void;
  openQuizResult: (score: number, total: number, correctCount: number) => void;
  openCalculatorHistory: () => void;
  closeOverlay: () => void;
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({children}: {children: React.ReactNode}) {
  const [phase, setPhase] = useState<AppPhase>('Loader');
  const [activeTab, setActiveTab] = useState<AppTab>('ExhibitionsTab');
  const [overlay, setOverlay] = useState<AppOverlay>({type: 'none'});

  const finishLoader = useCallback((skipOnboarding: boolean) => {
    setPhase(skipOnboarding ? 'Main' : 'Onboarding');
  }, []);

  const finishOnboarding = useCallback(() => {
    setPhase('Main');
  }, []);

  const selectTab = useCallback((tab: AppTab) => {
    setActiveTab(tab);
    setOverlay({type: 'none'});
  }, []);

  const goBack = useCallback(() => {
    setOverlay({type: 'none'});
  }, []);

  const openExhibitionDetail = useCallback((exhibition: Exhibition) => {
    setOverlay({type: 'ExhibitionDetail', exhibition});
  }, []);

  const openQuizGame = useCallback(() => {
    setOverlay({type: 'QuizGame'});
  }, []);

  const openQuizResult = useCallback(
    (score: number, total: number, correctCount: number) => {
      setOverlay({type: 'QuizResult', score, total, correctCount});
    },
    [],
  );

  const openCalculatorHistory = useCallback(() => {
    setOverlay({type: 'CalculatorHistory'});
  }, []);

  const closeOverlay = useCallback(() => {
    setOverlay({type: 'none'});
  }, []);

  const value = useMemo(
    () => ({
      phase,
      activeTab,
      overlay,
      finishLoader,
      finishOnboarding,
      selectTab,
      goBack,
      openExhibitionDetail,
      openQuizGame,
      openQuizResult,
      openCalculatorHistory,
      closeOverlay,
    }),
    [
      phase,
      activeTab,
      overlay,
      finishLoader,
      finishOnboarding,
      selectTab,
      goBack,
      openExhibitionDetail,
      openQuizGame,
      openQuizResult,
      openCalculatorHistory,
      closeOverlay,
    ],
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useAppNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useAppNavigation must be used within NavigationProvider');
  }
  return context;
}
