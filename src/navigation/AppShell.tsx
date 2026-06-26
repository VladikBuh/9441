import React, {useEffect} from 'react';
import {
  BackHandler,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {CalculatorHistoryScreen} from '../screens/calculator/CalculatorHistoryScreen';
import {CalculatorScreen} from '../screens/calculator/CalculatorScreen';
import {ExhibitionDetailScreen} from '../screens/exhibitions/ExhibitionDetailScreen';
import {ExhibitionsScreen} from '../screens/exhibitions/ExhibitionsScreen';
import {FactsScreen} from '../screens/facts/FactsScreen';
import {LoaderScreen} from '../screens/LoaderScreen';
import {OnboardingScreen} from '../screens/OnboardingScreen';
import {QuizGameScreen} from '../screens/quiz/QuizGameScreen';
import {QuizIntroScreen} from '../screens/quiz/QuizIntroScreen';
import {QuizResultScreen} from '../screens/quiz/QuizResultScreen';
import {StudioScreen} from '../screens/studio/StudioScreen';
import {Colors} from '../theme/colors';
import {useAppNavigation} from './NavigationContext';
import type {AppTab} from './types';

const TABS: {name: AppTab; label: string; emoji: string}[] = [
  {name: 'ExhibitionsTab', label: 'Exhibitions', emoji: '🗺️'},
  {name: 'FactsTab', label: 'Facts', emoji: '❄️'},
  {name: 'QuizTab', label: 'Quiz', emoji: '🏆'},
  {name: 'StudioTab', label: 'Studio', emoji: '✏️'},
  {name: 'CalculatorTab', label: 'Calculator', emoji: '🧮'},
];

function TabContent() {
  const {activeTab} = useAppNavigation();

  switch (activeTab) {
    case 'ExhibitionsTab':
      return <ExhibitionsScreen />;
    case 'FactsTab':
      return <FactsScreen />;
    case 'QuizTab':
      return <QuizIntroScreen />;
    case 'StudioTab':
      return <StudioScreen />;
    case 'CalculatorTab':
      return <CalculatorScreen />;
    default:
      return <ExhibitionsScreen />;
  }
}

function OverlayContent() {
  const {overlay} = useAppNavigation();

  switch (overlay.type) {
    case 'ExhibitionDetail':
      return <ExhibitionDetailScreen />;
    case 'QuizGame':
      return <QuizGameScreen />;
    case 'QuizResult':
      return <QuizResultScreen />;
    case 'CalculatorHistory':
      return <CalculatorHistoryScreen />;
    default:
      return null;
  }
}

function MainShell() {
  const {activeTab, overlay, selectTab, goBack} = useAppNavigation();
  const hasOverlay = overlay.type !== 'none';

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (hasOverlay) {
        goBack();
        return true;
      }
      return false;
    });
    return () => handler.remove();
  }, [hasOverlay, goBack]);

  return (
    <View style={styles.root}>
      <View style={styles.content}>
        <TabContent />
      </View>
      <Modal
        visible={hasOverlay}
        animationType="none"
        transparent={false}
        statusBarTranslucent
        onRequestClose={goBack}>
        <View style={styles.overlayContainer}>
          <OverlayContent />
        </View>
      </Modal>
      {!hasOverlay && (
        <View style={styles.tabBar}>
          {TABS.map(tab => {
            const isActive = tab.name === activeTab;
            return (
              <TouchableOpacity
                key={tab.name}
                style={styles.tab}
                onPress={() => selectTab(tab.name)}
                activeOpacity={0.7}>
                {isActive && <View style={styles.indicator} />}
                <Text style={styles.emoji}>{tab.emoji}</Text>
                <Text style={[styles.label, isActive && styles.labelActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

export function AppShell() {
  const {phase, finishLoader, finishOnboarding} = useAppNavigation();

  if (phase === 'Loader') {
    return <LoaderScreen onFinish={finishLoader} />;
  }

  if (phase === 'Onboarding') {
    return <OnboardingScreen onFinish={finishOnboarding} />;
  }

  return <MainShell />;
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.arcticNavy},
  content: {flex: 1},
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.arcticNavy,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.darkPanel,
    borderTopWidth: 1,
    borderTopColor: Colors.deepIceBlue,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    paddingTop: 2,
    height: Platform.OS === 'ios' ? 92 : 74,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    position: 'relative',
    paddingTop: 4,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    width: 32,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.crystalCyan,
  },
  emoji: {fontSize: 20},
  label: {color: Colors.mutedText, fontSize: 10, fontWeight: '500'},
  labelActive: {color: Colors.crystalCyan, fontWeight: '700'},
});
