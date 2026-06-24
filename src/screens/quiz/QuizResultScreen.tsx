import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useAppNavigation} from '../../navigation/NavigationContext';
import {Colors} from '../../theme/colors';
import {Storage} from '../../storage/storage';

const getMessage = (score: number, total: number) => {
  const pct = score / total;
  if (pct >= 0.9) return 'Outstanding! You know ice art inside and out.';
  if (pct >= 0.7) return 'Great result! A solid understanding of frozen art.';
  if (pct >= 0.5)
    return 'Good effort! Keep exploring to sharpen your knowledge.';
  return 'Keep learning! Every fact brings you closer to mastery.';
};

export const QuizResultScreen: React.FC = () => {
  const {openQuizGame, goBack, overlay} = useAppNavigation();
  const {score, total, correctCount} = overlay as {type: 'QuizResult'; score: number; total: number; correctCount: number};
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    Storage.setBestQuizScore(score).then(() => {
      Storage.getBestQuizScore().then(setBestScore);
    });
  }, [score]);

  const pct = Math.round((score / total) * 100);

  return (
    <View style={styles.QuizResultScreenContainer}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.QuizResultScreenHeader}>
          <Text style={styles.QuizResultScreenHeaderTitle}>Quiz Complete</Text>
        </View>

        <View style={styles.QuizResultScreenContentPad}>
          <View style={styles.QuizResultScreenMainScoreCard}>
            <Text style={styles.QuizResultScreenScoreLabel}>Your Score</Text>
            <Text style={styles.QuizResultScreenScoreValue}>{score}</Text>
            <Text style={styles.QuizResultScreenScoreOf}>out of {total}</Text>
            <View
              style={[
                styles.QuizResultScreenPctBadge,
                {
                  backgroundColor:
                    pct >= 70 ? Colors.cyanActive : Colors.sculpturalRed,
                },
              ]}>
              <Text style={styles.QuizResultScreenPctText}>{pct}%</Text>
            </View>
            <Text style={styles.QuizResultScreenMessage}>
              {getMessage(score, total)}
            </Text>
          </View>

          <View style={styles.QuizResultScreenStatsCard}>
            <View style={styles.QuizResultScreenStatRow}>
              <Text style={styles.QuizResultScreenStatLabel}>
                Correct Answers
              </Text>
              <Text
                style={[
                  styles.QuizResultScreenStatValue,
                  {color: Colors.crystalCyan},
                ]}>
                {correctCount}
              </Text>
            </View>
            <View style={styles.QuizResultScreenStatRow}>
              <Text style={styles.QuizResultScreenStatLabel}>
                Wrong Answers
              </Text>
              <Text
                style={[
                  styles.QuizResultScreenStatValue,
                  {color: Colors.sculpturalRed},
                ]}>
                {total - correctCount}
              </Text>
            </View>
            <View style={styles.QuizResultScreenStatRow}>
              <Text style={styles.QuizResultScreenStatLabel}>
                Total Questions
              </Text>
              <Text style={styles.QuizResultScreenStatValue}>{total}</Text>
            </View>
            <View
              style={[
                styles.QuizResultScreenStatRow,
                styles.QuizResultScreenStatRowLast,
              ]}>
              <Text style={styles.QuizResultScreenStatLabel}>Best Score</Text>
              <Text
                style={[
                  styles.QuizResultScreenStatValue,
                  {color: Colors.iceGold},
                ]}>
                {bestScore}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.QuizResultScreenTryAgainBtn}
            onPress={() => openQuizGame()}>
            <Text style={styles.QuizResultScreenTryAgainBtnText}>
              Try Again
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.QuizResultScreenHomeBtn}
            onPress={() => goBack()}>
            <Text style={styles.QuizResultScreenHomeBtnText}>
              Back to Quiz Home
            </Text>
          </TouchableOpacity>

          <View style={styles.QuizResultScreenBottomSpacer} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  QuizResultScreenContainer: {flex: 1, backgroundColor: Colors.arcticNavy},
  QuizResultScreenHeader: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 14,
    backgroundColor: Colors.darkPanel,
    borderBottomWidth: 1,
    borderBottomColor: Colors.deepIceBlue,
  },
  QuizResultScreenHeaderTitle: {
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  QuizResultScreenContentPad: {padding: 16},
  QuizResultScreenMainScoreCard: {
    backgroundColor: Colors.solidCardNavy,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderIce,
  },
  QuizResultScreenScoreLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  QuizResultScreenScoreValue: {
    color: Colors.crystalCyan,
    fontSize: 72,
    fontWeight: '800',
    lineHeight: 80,
  },

  QuizResultScreenScoreOf: {
    color: Colors.mutedText,
    fontSize: 18,
    marginBottom: 14,
  },
  QuizResultScreenPctBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 14,
  },

  QuizResultScreenPctText: {
    color: Colors.arcticNavy,
    fontSize: 15,
    fontWeight: '800',
  },
  QuizResultScreenMessage: {
    color: Colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  QuizResultScreenStatsCard: {
    backgroundColor: Colors.solidCardNavy,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.deepIceBlue,
  },
  QuizResultScreenStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.deepIceBlue,
  },
  QuizResultScreenStatRowLast: {borderBottomWidth: 0},
  QuizResultScreenStatLabel: {color: Colors.mutedText, fontSize: 14},
  QuizResultScreenStatValue: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  QuizResultScreenTryAgainBtn: {
    backgroundColor: Colors.crystalCyan,
    borderRadius: 13,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: Colors.crystalCyan,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  QuizResultScreenTryAgainBtnText: {
    color: Colors.arcticNavy,
    fontSize: 16,
    fontWeight: '800',
  },

  QuizResultScreenHomeBtn: {
    backgroundColor: Colors.darkPanel,
    borderRadius: 13,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderIce,
  },
  QuizResultScreenHomeBtnText: {
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  QuizResultScreenBottomSpacer: {height: 30},
});
