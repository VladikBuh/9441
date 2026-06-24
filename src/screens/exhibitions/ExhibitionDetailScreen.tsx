import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Share,
} from 'react-native';
import {useAppNavigation} from '../../navigation/NavigationContext';
import {Colors} from '../../theme/colors';
import {Exhibition} from '../../types';
import {EXHIBITION_IMAGES} from '../../assets/exhibitionImages';

const HERO_HEIGHT = 300;

export const ExhibitionDetailScreen: React.FC = () => {
  const {goBack, overlay} = useAppNavigation();
  const exhibition: Exhibition = (overlay as {type: 'ExhibitionDetail'; exhibition: Exhibition}).exhibition;
  const image = EXHIBITION_IMAGES[exhibition.id];

  const shareExhibition = () => {
    Share.share({
      title: exhibition.title,
      message: `${exhibition.title}\n${exhibition.location}\n${exhibition.coordinates.lat.toFixed(4)}°, ${exhibition.coordinates.lon.toFixed(4)}°`,
    }).catch(() => {});
  };

  return (
    <View style={styles.ExhibitionDetailScreenContainer}>
      {/* Back button — always visible, floats above scroll */}
      <TouchableOpacity
        style={styles.ExhibitionDetailScreenBackBtn}
        onPress={() => goBack()}>
        <Text style={styles.ExhibitionDetailScreenBackBtnText}>← Back</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero image — scrolls up naturally */}
        <View style={styles.ExhibitionDetailScreenHero}>
          {image ? (
            <Image
              source={image}
              style={styles.ExhibitionDetailScreenHeroImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.ExhibitionDetailScreenHeroFallback} />
          )}
          <View style={styles.ExhibitionDetailScreenHeroOverlay} />
          <View style={styles.ExhibitionDetailScreenHeroContent}>
            <View style={styles.ExhibitionDetailScreenTagBadge}>
              <Text style={styles.ExhibitionDetailScreenTagText}>
                {exhibition.tag}
              </Text>
            </View>
            <Text style={styles.ExhibitionDetailScreenHeroTitle}>
              {exhibition.title}
            </Text>
            <Text style={styles.ExhibitionDetailScreenHeroLocation}>
              📍 {exhibition.location}
            </Text>
            <Text style={styles.ExhibitionDetailScreenHeroSeason}>
              {exhibition.typicalSeason}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.ExhibitionDetailScreenContentContainer}>
          <View style={styles.ExhibitionDetailScreenCoordCard}>
            <Text style={styles.ExhibitionDetailScreenCoordLabel}>
              Coordinates
            </Text>
            <Text style={styles.ExhibitionDetailScreenCoordValue}>
              {exhibition.coordinates.lat.toFixed(4)}°N,{' '}
              {exhibition.coordinates.lon.toFixed(4)}°
            </Text>
          </View>

          <Text style={styles.ExhibitionDetailScreenSectionTitle}>
            About This Exhibition
          </Text>
          <View style={styles.ExhibitionDetailScreenInfoCard}>
            <Text style={styles.ExhibitionDetailScreenInfoText}>
              {exhibition.fullDescription}
            </Text>
          </View>

          <Text style={styles.ExhibitionDetailScreenSectionTitle}>
            What to Expect
          </Text>
          <View style={styles.ExhibitionDetailScreenInfoCard}>
            <Text style={styles.ExhibitionDetailScreenInfoText}>
              {exhibition.whatToExpect}
            </Text>
          </View>

          <Text style={styles.ExhibitionDetailScreenSectionTitle}>
            Best Time to Visit
          </Text>
          <View style={styles.ExhibitionDetailScreenInfoCard}>
            <Text style={styles.ExhibitionDetailScreenInfoText}>
              {exhibition.bestTimeToVisit}
            </Text>
          </View>

          <Text style={styles.ExhibitionDetailScreenSectionTitle}>
            Ice Art Notes
          </Text>
          <View style={styles.ExhibitionDetailScreenInfoCard}>
            <Text style={styles.ExhibitionDetailScreenInfoText}>
              {exhibition.iceArtNotes}
            </Text>
          </View>

          <View style={styles.ExhibitionDetailScreenBtnRow}>
            <TouchableOpacity
              style={styles.ExhibitionDetailScreenMapBtn}
              onPress={shareExhibition}>
              <Text style={styles.ExhibitionDetailScreenMapBtnText}>
                Share
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.ExhibitionDetailScreenRouteBtn}
              onPress={() => goBack()}>
              <Text style={styles.ExhibitionDetailScreenRouteBtnText}>
                Build Tour
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.ExhibitionDetailScreenBottomSpacer} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  ExhibitionDetailScreenContainer: {
    flex: 1,
    backgroundColor: Colors.arcticNavy,
  },

  ExhibitionDetailScreenBackBtn: {
    position: 'absolute',
    top: 52,
    left: 20,
    zIndex: 20,
    backgroundColor: Colors.solidCardNavy,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderIce,
  },
  ExhibitionDetailScreenBackBtnText: {
    color: Colors.crystalCyan,
    fontWeight: '700',
    fontSize: 14,
  },
  ExhibitionDetailScreenHero: {
    height: HERO_HEIGHT,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },

  ExhibitionDetailScreenHeroImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  ExhibitionDetailScreenHeroFallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.deepIceBlue,
  },
  ExhibitionDetailScreenHeroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.arcticNavy,
    opacity: 0.45,
  },
  ExhibitionDetailScreenHeroContent: {
    padding: 20,
    paddingBottom: 22,
  },

  ExhibitionDetailScreenTagBadge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.frostWhite,
    backgroundColor: Colors.solidCardNavy,
    marginBottom: 8,
  },
  ExhibitionDetailScreenTagText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: Colors.frostWhite,
  },

  ExhibitionDetailScreenHeroTitle: {
    color: Colors.frostWhite,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
  },
  ExhibitionDetailScreenHeroLocation: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  ExhibitionDetailScreenHeroSeason: {color: Colors.mutedText, fontSize: 13},
  ExhibitionDetailScreenContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  ExhibitionDetailScreenCoordCard: {
    backgroundColor: Colors.darkPanel,
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.deepIceBlue,
  },

  ExhibitionDetailScreenCoordLabel: {
    color: Colors.mutedText,
    fontSize: 12,
    fontWeight: '600',
  },
  ExhibitionDetailScreenCoordValue: {
    color: Colors.crystalCyan,
    fontSize: 13,
    fontFamily: 'Courier',
    fontWeight: '600',
  },

  ExhibitionDetailScreenSectionTitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  ExhibitionDetailScreenInfoCard: {
    backgroundColor: Colors.solidCardNavy,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.deepIceBlue,
  },

  ExhibitionDetailScreenInfoText: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
  ExhibitionDetailScreenBtnRow: {flexDirection: 'row', gap: 12, marginTop: 6},
  ExhibitionDetailScreenMapBtn: {
    flex: 1,
    backgroundColor: Colors.brightArctic,
    borderRadius: 11,
    paddingVertical: 14,
    alignItems: 'center',
  },
  ExhibitionDetailScreenMapBtnText: {
    color: Colors.arcticNavy,
    fontWeight: '700',
    fontSize: 15,
  },
  ExhibitionDetailScreenRouteBtn: {
    flex: 1,
    backgroundColor: Colors.sculpturalRed,
    borderRadius: 11,
    paddingVertical: 14,
    alignItems: 'center',
  },

  ExhibitionDetailScreenRouteBtnText: {
    color: Colors.frostWhite,
    fontWeight: '700',
    fontSize: 15,
  },
  ExhibitionDetailScreenBottomSpacer: {height: 40},
});
