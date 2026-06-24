import AsyncStorage from '@react-native-async-storage/async-storage';
import {Fact, CalcHistoryItem, SavedDrawing} from '../types';

const KEYS = {
  ONBOARDING_DONE: 'onboarding_done',
  CUSTOM_FACTS: 'custom_facts',
  DELETED_FACT_IDS: 'deleted_fact_ids',
  BEST_QUIZ_SCORE: 'best_quiz_score',
  QUIZ_PROGRESS: 'quiz_progress',
  CALC_HISTORY: 'calc_history',
  SAVED_DRAWING: 'saved_drawing',
  LAST_TASK_INDEX: 'last_task_index',
};

export const Storage = {
  async isOnboardingDone(): Promise<boolean> {
    try {
      const val = await AsyncStorage.getItem(KEYS.ONBOARDING_DONE);
      return val === 'true';
    } catch {
      return false;
    }
  },

  async setOnboardingDone(): Promise<void> {
    await AsyncStorage.setItem(KEYS.ONBOARDING_DONE, 'true');
  },

  async getCustomFacts(): Promise<Fact[]> {
    try {
      const raw = await AsyncStorage.getItem(KEYS.CUSTOM_FACTS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  async saveCustomFact(fact: Fact): Promise<void> {
    const existing = await Storage.getCustomFacts();
    existing.push(fact);
    await AsyncStorage.setItem(KEYS.CUSTOM_FACTS, JSON.stringify(existing));
  },

  async deleteCustomFact(id: string): Promise<void> {
    const existing = await Storage.getCustomFacts();
    const updated = existing.filter(f => f.id !== id);
    await AsyncStorage.setItem(KEYS.CUSTOM_FACTS, JSON.stringify(updated));
  },

  async getBestQuizScore(): Promise<number> {
    try {
      const val = await AsyncStorage.getItem(KEYS.BEST_QUIZ_SCORE);
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  },

  async setBestQuizScore(score: number): Promise<void> {
    const current = await Storage.getBestQuizScore();
    if (score > current) {
      await AsyncStorage.setItem(KEYS.BEST_QUIZ_SCORE, score.toString());
    }
  },

  async getCalcHistory(): Promise<CalcHistoryItem[]> {
    try {
      const raw = await AsyncStorage.getItem(KEYS.CALC_HISTORY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  async addCalcHistory(item: CalcHistoryItem): Promise<void> {
    const existing = await Storage.getCalcHistory();
    existing.unshift(item);
    const trimmed = existing.slice(0, 50);
    await AsyncStorage.setItem(KEYS.CALC_HISTORY, JSON.stringify(trimmed));
  },

  async deleteCalcHistoryItem(id: string): Promise<void> {
    const existing = await Storage.getCalcHistory();
    const updated = existing.filter(i => i.id !== id);
    await AsyncStorage.setItem(KEYS.CALC_HISTORY, JSON.stringify(updated));
  },

  async clearCalcHistory(): Promise<void> {
    await AsyncStorage.setItem(KEYS.CALC_HISTORY, JSON.stringify([]));
  },

  async getSavedDrawing(): Promise<SavedDrawing | null> {
    try {
      const raw = await AsyncStorage.getItem(KEYS.SAVED_DRAWING);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  async saveDrawing(drawing: SavedDrawing): Promise<void> {
    await AsyncStorage.setItem(KEYS.SAVED_DRAWING, JSON.stringify(drawing));
  },

  async clearDrawing(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.SAVED_DRAWING);
  },

  async getLastTaskIndex(): Promise<number> {
    try {
      const val = await AsyncStorage.getItem(KEYS.LAST_TASK_INDEX);
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  },

  async setLastTaskIndex(index: number): Promise<void> {
    await AsyncStorage.setItem(KEYS.LAST_TASK_INDEX, index.toString());
  },
};
