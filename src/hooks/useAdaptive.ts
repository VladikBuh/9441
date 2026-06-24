import {useMemo} from 'react';
import {useWindowDimensions} from 'react-native';

import {DESIGN_HEIGHT, DESIGN_WIDTH} from '../constants/theme';

export function useAdaptive() {
  const {width, height} = useWindowDimensions();

  return useMemo(() => {
    const isNarrow = width < 370;
    const isSmallHeight = height < 740;
    const isTinyHeight = height < 660;
    const portraitWidth = Math.min(width, height);

    const scale = (size: number) => (width / DESIGN_WIDTH) * size;
    const verticalScale = (size: number) => (height / DESIGN_HEIGHT) * size;
    const tabScale = (size: number) => (portraitWidth / DESIGN_WIDTH) * size;

    return {
      width,
      height,
      isNarrow,
      isSmallHeight,
      isTinyHeight,
      scale,
      verticalScale,
      horizontalPadding: isNarrow ? scale(16) : scale(20),
      loaderLogoSize: isTinyHeight
        ? scale(147)
        : isSmallHeight
        ? scale(165)
        : scale(190),
      tabIconSize: tabScale(22),
      tabPaddingTop: tabScale(2),
      tabPaddingBottom: tabScale(16),
      qrSize: scale(220),
    };
  }, [width, height]);
}
