import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import {useAppNavigation} from '../../navigation/NavigationContext';
import {Colors} from '../../theme/colors';
import {QUIZ_QUESTIONS} from '../../data/quiz';

type AnswerState = 'idle' | 'correct' | 'wrong';

const SESSION_SIZE = 10;

const pickQuestions = () =>
  [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, SESSION_SIZE);

export const QuizGameScreen: React.FC = () => {
  const {openQuizResult, goBack} = useAppNavigation();
  const [questions] = useState(pickQuestions);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answerStates, setAnswerStates] = useState<AnswerState[]>([
    'idle',
    'idle',
    'idle',
    'idle',
  ]);
  const [paused, setPaused] = useState(false);
  const nextTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const question = questions[qIndex];

  const clearTimer = () => {
    if (nextTimer.current) {
      clearTimeout(nextTimer.current);
      nextTimer.current = null;
    }
  };

  const goToResult = useCallback(
    (finalScore: number) => {
      openQuizResult(finalScore, questions.length, finalScore);
    },
    [openQuizResult, questions.length],
  );

  const nextQuestion = useCallback(
    (currentScore: number) => {
      const nextIdx = qIndex + 1;
      if (nextIdx >= questions.length) {
        goToResult(currentScore);
      } else {
        setQIndex(nextIdx);
        setSelected(null);
        setAnswerStates(['idle', 'idle', 'idle', 'idle']);
      }
    },
    [qIndex, goToResult, questions.length],
  );

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = question.correctIndex;
    const newScore = idx === correct ? score + 1 : score;
    if (idx === correct) setScore(newScore);

    const states: AnswerState[] = question.answers.map((_, i) => {
      if (i === correct) return 'correct';
      if (i === idx && idx !== correct) return 'wrong';
      return 'idle';
    });
    setAnswerStates(states);

    nextTimer.current = setTimeout(() => nextQuestion(newScore), 1400);
  };

  const restart = () => {
    clearTimer();
    setQIndex(0);
    setScore(0);
    setSelected(null);
    setAnswerStates(['idle', 'idle', 'idle', 'idle']);
    setPaused(false);
  };

  useEffect(() => () => clearTimer(), []);

  const progress = ((qIndex + 1) / questions.length) * 100;

  const answerBg = (state: AnswerState) => {
    if (state === 'correct') return Colors.cyanActive;
    if (state === 'wrong') return Colors.sculpturalRed;
    return Colors.solidCardNavy;
  };

  const answerBorder = (state: AnswerState) => {
    if (state === 'correct') return Colors.borderIce;
    if (state === 'wrong') return Colors.deepRed;
    return Colors.deepIceBlue;
  };

  const answerText = (state: AnswerState) => {
    if (state === 'correct') return Colors.arcticNavy;
    if (state === 'wrong') return Colors.frostWhite;
    return Colors.textSecondary;
  };

  return (
    <View style={styles.QuizGameScreenContainer}>
      <ScrollView
        style={styles.QuizGameScreenContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.QuizGameScreenTopBar}>
          <TouchableOpacity
            style={styles.QuizGameScreenPauseBtn}
            onPress={() => setPaused(true)}>
            <Text style={styles.QuizGameScreenPauseIcon}>⏸</Text>
          </TouchableOpacity>
          <View style={styles.QuizGameScreenQCounter}>
            <Text style={styles.QuizGameScreenQCounterText}>
              {qIndex + 1} / {questions.length}
            </Text>
          </View>
          <View style={styles.QuizGameScreenScoreDisplay}>
            <Text style={styles.QuizGameScreenScoreLabel}>Score</Text>
            <Text style={styles.QuizGameScreenScoreValue}>{score}</Text>
          </View>
        </View>

        <View style={styles.QuizGameScreenProgressBar}>
          <View
            style={[styles.QuizGameScreenProgressFill, {width: `${progress}%`}]}
          />
        </View>

        <View style={styles.QuizGameScreenContentContainer}>
          <View style={styles.QuizGameScreenQuestionCard}>
            <Text style={styles.QuizGameScreenQuestionNumber}>
              Question {qIndex + 1}
            </Text>
            <Text style={styles.QuizGameScreenQuestionText}>
              {question.question}
            </Text>
          </View>

          <View style={styles.QuizGameScreenAnswersContainer}>
            {question.answers.map((answer, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.QuizGameScreenAnswerBtn,
                  {
                    backgroundColor: answerBg(answerStates[i]),
                    borderColor: answerBorder(answerStates[i]),
                  },
                ]}
                onPress={() => handleAnswer(i)}
                disabled={selected !== null}
                activeOpacity={0.8}>
                <View style={styles.QuizGameScreenAnswerRow}>
                  <View
                    style={[
                      styles.QuizGameScreenAnswerLetter,
                      {
                        backgroundColor:
                          answerStates[i] === 'idle'
                            ? Colors.deepIceBlue
                            : 'transparent',
                        borderColor: answerText(answerStates[i]),
                      },
                    ]}>
                    <Text
                      style={[
                        styles.QuizGameScreenAnswerLetterText,
                        {color: answerText(answerStates[i])},
                      ]}>
                      {String.fromCharCode(65 + i)}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.QuizGameScreenAnswerText,
                      {color: answerText(answerStates[i])},
                    ]}>
                    {answer}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={paused}
        transparent
        animationType="fade"
        statusBarTranslucent={Platform.OS === 'android'}>
        <View style={styles.QuizGameScreenPauseOverlay}>
          <ScrollView
            contentContainerStyle={styles.QuizGameScreenPauseScroll}
            bounces={false}
            showsVerticalScrollIndicator={false}>
            <View style={styles.QuizGameScreenPauseCard}>
              <Text style={styles.QuizGameScreenPauseTitle}>Quiz Paused</Text>
              <Text style={styles.QuizGameScreenPauseInfo}>
                Question {qIndex + 1} of {questions.length} · Score: {score}
              </Text>
              <TouchableOpacity
                style={styles.QuizGameScreenResumeBtn}
                onPress={() => setPaused(false)}>
                <Text style={styles.QuizGameScreenResumeBtnText}>Resume</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.QuizGameScreenRestartBtn}
                onPress={restart}>
                <Text style={styles.QuizGameScreenRestartBtnText}>Restart</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.QuizGameScreenExitBtn}
                onPress={() => {
                  clearTimer();
                  goBack();
                }}>
                <Text style={styles.QuizGameScreenExitBtnText}>Exit Quiz</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  QuizGameScreenContainer: {flex: 1, backgroundColor: Colors.arcticNavy},
  QuizGameScreenTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 62,
    paddingBottom: 10,
    backgroundColor: Colors.darkPanel,
  },
  QuizGameScreenPauseBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.solidCardNavy,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.deepIceBlue,
  },

  QuizGameScreenPauseIcon: {fontSize: 16},
  QuizGameScreenQCounter: {
    backgroundColor: Colors.deepIceBlue,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.borderIce,
  },
  QuizGameScreenQCounterText: {
    color: Colors.crystalCyan,
    fontSize: 13,
    fontWeight: '700',
  },
  QuizGameScreenScoreDisplay: {alignItems: 'flex-end'},
  QuizGameScreenScoreLabel: {
    color: Colors.mutedText,
    fontSize: 11,
    fontWeight: '600',
  },

  QuizGameScreenScoreValue: {
    color: Colors.crystalCyan,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 26,
  },
  QuizGameScreenProgressBar: {
    height: 4,
    backgroundColor: Colors.deepIceBlue,
    marginHorizontal: 16,
  },
  QuizGameScreenProgressFill: {
    height: 4,
    backgroundColor: Colors.crystalCyan,
  },
  QuizGameScreenContent: {flex: 1},
  QuizGameScreenContentContainer: {padding: 16},
  QuizGameScreenQuestionCard: {
    backgroundColor: Colors.solidCardNavy,
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: Colors.deepIceBlue,
    minHeight: 130,
    justifyContent: 'center',
  },
  QuizGameScreenQuestionNumber: {
    color: Colors.mutedText,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 10,
    textTransform: 'uppercase',
  },

  QuizGameScreenQuestionText: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
  },
  QuizGameScreenAnswersContainer: {gap: 10},
  QuizGameScreenAnswerBtn: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  QuizGameScreenAnswerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  QuizGameScreenAnswerLetter: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    flexShrink: 0,
  },
  QuizGameScreenAnswerLetterText: {fontSize: 14, fontWeight: '700'},
  QuizGameScreenAnswerText: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
    lineHeight: 21,
  },
  QuizGameScreenPauseOverlay: {
    flex: 1,
    backgroundColor: '#000000CC',
  },
  QuizGameScreenPauseScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },

  QuizGameScreenPauseCard: {
    backgroundColor: Colors.solidCardNavy,
    borderRadius: 20,
    padding: 28,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.borderIce,
    alignItems: 'center',
  },
  QuizGameScreenPauseTitle: {
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  QuizGameScreenPauseInfo: {
    color: Colors.mutedText,
    fontSize: 14,
    marginBottom: 28,
  },
  QuizGameScreenResumeBtn: {
    backgroundColor: Colors.crystalCyan,
    borderRadius: 11,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  QuizGameScreenResumeBtnText: {
    color: Colors.arcticNavy,
    fontWeight: '700',
    fontSize: 15,
  },
  QuizGameScreenRestartBtn: {
    backgroundColor: Colors.deepIceBlue,
    borderRadius: 11,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderIce,
  },

  QuizGameScreenRestartBtnText: {
    color: Colors.textPrimary,
    fontWeight: '600',
    fontSize: 15,
  },
  QuizGameScreenExitBtn: {
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  QuizGameScreenExitBtnText: {
    color: Colors.mutedText,
    fontSize: 14,
    fontWeight: '500',
  },
});
