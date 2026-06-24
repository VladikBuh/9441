import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Colors } from '../theme/colors';
import { Exhibition } from '../types';
import { EXHIBITION_IMAGES } from '../assets/exhibitionImages';

interface Props {
  exhibition: Exhibition;
  onPress: () => void;
}

const TAG_COLORS: Record<string, string> = {
  'Large Ice Park': Colors.brightArctic,
  'Mountain Exhibit': Colors.crystalCyan,
  'Snow & Ice Rooms': Colors.iceGlow,
  'Ice Interior Art': Colors.borderIce,
  'City Ice Event': Colors.cyanActive,
  'Historic Winter Tour': Colors.iceGold,
  'Indoor Gallery': Colors.brightArctic,
  'Creative Ice Display': Colors.crystalCyan,
};

export const ExhibitionCard: React.FC<Props> = ({ exhibition, onPress }) => {
  const tagColor = TAG_COLORS[exhibition.tag] || Colors.crystalCyan;
  const image = EXHIBITION_IMAGES[exhibition.id];

  return (
    <TouchableOpacity style={styles.ExhibitionCardCard} onPress={onPress} activeOpacity={0.85}>
      {image && (
        <Image
          source={image}
          style={styles.ExhibitionCardCardImage}
          resizeMode="cover"
        />
      )}

      <View style={styles.ExhibitionCardBody}>
        <View style={styles.ExhibitionCardHeader}>
          <View style={[styles.ExhibitionCardTagBadge, { backgroundColor: tagColor + '22', borderColor: tagColor }]}>
            <Text style={[styles.ExhibitionCardTagText, { color: tagColor }]}>{exhibition.tag}</Text>
          </View>
          <Text style={styles.ExhibitionCardSeason}>{exhibition.typicalSeason}</Text>
        </View>

        <Text style={styles.ExhibitionCardTitle}>{exhibition.title}</Text>
        <Text style={styles.ExhibitionCardLocation}>📍 {exhibition.location}</Text>
        <Text style={styles.ExhibitionCardDesc} numberOfLines={2}>{exhibition.shortDescription}</Text>

        <View style={styles.ExhibitionCardFooter}>
          <Text style={styles.ExhibitionCardCoords}>
            {exhibition.coordinates.lat.toFixed(4)}°, {exhibition.coordinates.lon.toFixed(4)}°
          </Text>
          <TouchableOpacity style={styles.ExhibitionCardDetailBtn} onPress={onPress}>
            <Text style={styles.ExhibitionCardDetailBtnText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({ ExhibitionCardCard: {
    backgroundColor: Colors.solidCardNavy,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.deepIceBlue,
    overflow: 'hidden',
  }, ExhibitionCardCardImage: {
    width: '100%',
    height: 160,
  }, ExhibitionCardBody: {
    padding: 16,
  }, ExhibitionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  }, ExhibitionCardTagBadge: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  }, ExhibitionCardTagText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  }, ExhibitionCardSeason: {
    color: Colors.mutedText,
    fontSize: 12,
    fontWeight: '500',
  }, ExhibitionCardTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
  }, ExhibitionCardLocation: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginBottom: 8,
  }, ExhibitionCardDesc: {
    color: Colors.mutedText,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  }, ExhibitionCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }, ExhibitionCardCoords: {
    color: Colors.mutedText,
    fontSize: 11,
    fontFamily: 'Courier',
  }, ExhibitionCardDetailBtn: {
    backgroundColor: Colors.brightArctic,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  }, ExhibitionCardDetailBtnText: {
    color: Colors.arcticNavy,
    fontWeight: '700',
    fontSize: 13,
  },
});
