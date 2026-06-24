import React, {useEffect, useRef} from 'react';
import {View, Image, Animated, StyleSheet, Dimensions} from 'react-native';
import {Storage} from '../storage/storage';

const {width, height} = Dimensions.get('window');

const BARS = [
  {
    gradient: ['#66BFFF', '#2B9DEE', '#1392EC', '#0F74BD'],
    shadow: '#66BFFF',
    delay: 0,
  },
  {
    gradient: ['#2B9DEE', '#1392EC', '#0F74BD', '#66BFFF'],
    shadow: '#2B9DEE',
    delay: 100,
  },
  {
    gradient: ['#1392EC', '#0F74BD', '#66BFFF', '#2B9DEE'],
    shadow: '#1392EC',
    delay: 200,
  },
  {
    gradient: ['#0F74BD', '#66BFFF', '#2B9DEE', '#1392EC'],
    shadow: '#0F74BD',
    delay: 300,
  },
];

interface Props {
  onFinish: (onboardingDone: boolean) => void;
}

export const LoaderScreen: React.FC<Props> = ({onFinish}) => {
  const anims = useRef(BARS.map(() => new Animated.Value(1))).current;

  useEffect(() => {
    const listenerIds = anims.map(anim => anim.addListener(() => {}));

    const loops = anims.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(BARS[i].delay),
          Animated.timing(anim, {
            toValue: 2,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ),
    );
    loops.forEach(l => l.start());

    const timer = setTimeout(async () => {
      loops.forEach(l => l.stop());
      anims.forEach(a => a.stopAnimation());
      await Storage.isOnboardingDone();
      onFinish(false);
    }, 2800);

    return () => {
      clearTimeout(timer);
      loops.forEach(l => l.stop());
      anims.forEach((a, i) => {
        a.removeListener(listenerIds[i]);
        a.stopAnimation();
      });
    };
  }, []);

  return (
    <View style={styles.LoaderScreenContainer}>
      <Image
        source={require('../assets/images/sculpted-explorer-loader_bg.png')}
        style={styles.LoaderScreenBg}
        resizeMode="cover"
      />
      <View style={styles.LoaderScreenOverlay} />

      <View style={styles.LoaderScreenBarsRow}>
        {BARS.map((bar, i) => (
          <Animated.View
            key={i}
            style={[
              styles.LoaderScreenBar,
              {backgroundColor: bar.gradient[0]},
              {
                shadowColor: bar.shadow,
                transform: [{scaleY: anims[i]}],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  LoaderScreenContainer: {
    flex: 1,
    backgroundColor: '#001829',
    alignItems: 'center',
    justifyContent: 'center',
  },
  LoaderScreenBg: {
    ...StyleSheet.absoluteFillObject,
    width,
    height,
  },
  LoaderScreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  LoaderScreenBarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  LoaderScreenBar: {
    width: 6,
    height: 26,
    borderRadius: 20,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 8,
  },
});
