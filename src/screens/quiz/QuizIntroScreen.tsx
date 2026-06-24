import {useEffect} from 'react';
import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {Colors} from '../../theme/colors';
import {useAppNavigation} from '../../navigation/NavigationContext';
import {Storage} from '../../storage/storage';
const SESSION_SIZE = 10;

export const QuizIntroScreen: React.FC = () => {
  const {openQuizGame} = useAppNavigation();
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    Storage.getBestQuizScore().then(setBestScore);
  }, []);

  return (
    <View style={styles.QuizIntroScreenContainer}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.QuizIntroScreenHeader}>
          <Text style={styles.QuizIntroScreenScreenTitle}>
            Ice Knowledge Quiz
          </Text>
          <Text style={styles.QuizIntroScreenScreenSubtitle}>
            Test what you know about sculptures, frozen displays, transport,
            melting, and ice facts.
          </Text>
        </View>

        <View style={styles.QuizIntroScreenContentPad}>
          <View style={styles.QuizIntroScreenScoreCard}>
            <Text style={styles.QuizIntroScreenScoreLabel}>Best Score</Text>
            {bestScore === 0 ? (
              <Text style={styles.QuizIntroScreenNoScore}>
                No best score yet. Start the quiz and set your first record.
              </Text>
            ) : (
              <>
                <Text style={styles.QuizIntroScreenScoreValue}>
                  {bestScore}
                </Text>
                <Text style={styles.QuizIntroScreenScoreTotal}>
                  out of {SESSION_SIZE}
                </Text>
              </>
            )}
          </View>

          <View style={styles.QuizIntroScreenInfoCard}>
            <Text style={styles.QuizIntroScreenInfoTitle}>Quiz Details</Text>
            <View style={styles.QuizIntroScreenInfoRow}>
              <Text style={styles.QuizIntroScreenInfoLabel}>Questions</Text>
              <Text style={styles.QuizIntroScreenInfoValue}>
                {SESSION_SIZE}
              </Text>
            </View>
            <View style={styles.QuizIntroScreenInfoRow}>
              <Text style={styles.QuizIntroScreenInfoLabel}>Topics</Text>
              <Text style={styles.QuizIntroScreenInfoValue}>
                Ice Art, Science, Exhibitions
              </Text>
            </View>
            <View style={styles.QuizIntroScreenInfoRow}>
              <Text style={styles.QuizIntroScreenInfoLabel}>Format</Text>
              <Text style={styles.QuizIntroScreenInfoValue}>
                4 answer choices per question
              </Text>
            </View>
          </View>

          <View style={styles.QuizIntroScreenTipCard}>
            <Text style={styles.QuizIntroScreenTipTitle}>How It Works</Text>
            <Text style={styles.QuizIntroScreenTipText}>
              Read each question carefully and select one answer. Correct
              answers glow cyan, wrong answers highlight in red. You can pause
              at any time and restart or exit.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.QuizIntroScreenStartBtn}
            onPress={() => openQuizGame()}>
            <Text style={styles.QuizIntroScreenStartBtnText}>Start Quiz</Text>
          </TouchableOpacity>

          <View style={styles.QuizIntroScreenBottomSpacer} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  QuizIntroScreenContainer: {flex: 1, backgroundColor: Colors.arcticNavy},
  QuizIntroScreenHeader: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 14,
    backgroundColor: Colors.darkPanel,
    borderBottomWidth: 1,
    borderBottomColor: Colors.deepIceBlue,
  },

  QuizIntroScreenScreenTitle: {
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  QuizIntroScreenScreenSubtitle: {
    color: Colors.mutedText,
    fontSize: 13,
    lineHeight: 18,
  },
  QuizIntroScreenContentPad: {padding: 16},
  QuizIntroScreenScoreCard: {
    backgroundColor: Colors.solidCardNavy,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderIce,
  },
  QuizIntroScreenScoreLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  QuizIntroScreenNoScore: {
    color: Colors.mutedText,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  QuizIntroScreenScoreValue: {
    color: Colors.crystalCyan,
    fontSize: 56,
    fontWeight: '800',
    lineHeight: 64,
  },

  QuizIntroScreenScoreTotal: {
    color: Colors.mutedText,
    fontSize: 16,
    fontWeight: '500',
  },
  QuizIntroScreenInfoCard: {
    backgroundColor: Colors.solidCardNavy,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.deepIceBlue,
  },
  QuizIntroScreenInfoTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  QuizIntroScreenInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.deepIceBlue,
  },

  QuizIntroScreenInfoLabel: {color: Colors.mutedText, fontSize: 13},
  QuizIntroScreenInfoValue: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  QuizIntroScreenTipCard: {
    backgroundColor: Colors.deepIceBlue,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.borderIce,
  },
  QuizIntroScreenTipTitle: {
    color: Colors.crystalCyan,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.5,
  },

  QuizIntroScreenTipText: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  QuizIntroScreenStartBtn: {
    backgroundColor: Colors.crystalCyan,
    borderRadius: 13,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: Colors.crystalCyan,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  QuizIntroScreenStartBtnText: {
    color: Colors.arcticNavy,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  QuizIntroScreenBottomSpacer: {height: 30},
});
