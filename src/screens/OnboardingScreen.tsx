import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  ImageBackground,
} from 'react-native';

import {Storage} from '../storage/storage';

const {width, height} = Dimensions.get('window');

const PAGES = [
  {
    image: require('../assets/images/sculpted-explorer-onboarding1.png'),
    title: 'Discover Ice Exhibitions',
    subtitle:
      'Explore beautiful ice sculpture locations, event cards, dates, coordinates, and detailed exhibit information.',
    button: 'Next',
  },
  {
    image: require('../assets/images/sculpted-explorer-onboarding2.png'),
    title: 'Learn Frozen Secrets',
    subtitle:
      'Read facts about ice art, transport, carving, melting, storage, and what happens after exhibitions.',
    button: 'Next',
  },
  {
    image: require('../assets/images/sculpted-explorer-onboarding3.png'),
    title: 'Create and Calculate',
    subtitle:
      'Draw your own ice figure, save it, share it, and estimate how much ice and water your idea needs.',
    button: 'Start Exploring',
  },
];

interface Props {
  onFinish: () => void;
}

export const OnboardingScreen: React.FC<Props> = ({onFinish}) => {
  const [page, setPage] = useState(0);
  const current = PAGES[page];

  const complete = async () => {
    await Storage.setOnboardingDone();
    onFinish();
  };

  const next = () => {
    if (page < PAGES.length - 1) {
      setPage(page + 1);
    } else {
      complete();
    }
  };

  return (
    <ImageBackground
      source={current.image}
      style={styles.OnboardingScreenContainer}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <View style={styles.OnboardingScreenContentCard}>
          <View style={styles.OnboardingScreenDotsRow}>
            {PAGES.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.OnboardingScreenDot,
                  i === page && styles.OnboardingScreenDotActive,
                ]}
              />
            ))}
          </View>

          <Text style={styles.OnboardingScreenTitle}>{current.title}</Text>
          <Text style={styles.OnboardingScreenSubtitle}>
            {current.subtitle}
          </Text>

          <TouchableOpacity
            style={styles.OnboardingScreenNextBtn}
            onPress={next}>
            <Text style={styles.OnboardingScreenNextBtnText}>
              {current.button}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.OnboardingScreenSkipBtn}
            onPress={complete}>
            <Text style={styles.OnboardingScreenSkipBtnText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  OnboardingScreenContainer: {flex: 1, backgroundColor: '#0D66A6'},
  OnboardingScreenBg: {
    ...StyleSheet.absoluteFillObject,
    width,
    height,
  },
  OnboardingScreenContentCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 40,
  },
  OnboardingScreenDotsRow: {flexDirection: 'row', gap: 8, marginBottom: 20},
  OnboardingScreenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0F74BD',
    borderWidth: 1,
    borderColor: '#66BFFF',
  },
  OnboardingScreenDotActive: {
    width: 24,
    backgroundColor: '#66BFFF',
    borderColor: '#66BFFF',
  },
  OnboardingScreenTitle: {
    color: '#F0FAFF',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 12,
    lineHeight: 33,
  },
  OnboardingScreenSubtitle: {
    color: '#B3DFFF',
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 28,
  },
  OnboardingScreenNextBtn: {
    backgroundColor: '#66BFFF',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#66BFFF',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  OnboardingScreenNextBtnText: {
    color: '#0D66A6',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  OnboardingScreenSkipBtn: {paddingVertical: 10, alignItems: 'center'},
  OnboardingScreenSkipBtnText: {
    color: '#7BC2F5',
    fontSize: 14,
    fontWeight: '500',
  },
});
