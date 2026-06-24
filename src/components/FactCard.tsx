import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Fact } from '../types';

interface Props {
  fact: Fact;
  onShare: () => void;
  onDelete?: () => void;
}

export const FactCard: React.FC<Props> = ({ fact, onShare, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={styles.FactCardCard}
      onPress={() => setExpanded(e => !e)}
      activeOpacity={0.85}
    >
      <View style={styles.FactCardTopRow}>
        <View style={styles.FactCardCategoryBadge}>
          <Text style={styles.FactCardCategoryText}>{fact.category}</Text>
        </View>
        {fact.isUserFact && (
          <View style={styles.FactCardUserBadge}>
            <Text style={styles.FactCardUserBadgeText}>Your Fact</Text>
          </View>
        )}
      </View>

      <Text style={styles.FactCardTitle}>{fact.title}</Text>
      <Text style={styles.FactCardShortText}>{fact.shortText}</Text>

      {expanded && fact.detailText ? (
        <Text style={styles.FactCardDetailText}>{fact.detailText}</Text>
      ) : null}

      <View style={styles.FactCardActions}>
        <TouchableOpacity style={styles.FactCardShareBtn} onPress={onShare}>
          <Text style={styles.FactCardShareBtnText}>Share</Text>
        </TouchableOpacity>
        {fact.isUserFact && onDelete && (
          <TouchableOpacity style={styles.FactCardDeleteBtn} onPress={onDelete}>
            <Text style={styles.FactCardDeleteBtnText}>Delete</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.FactCardExpandBtn} onPress={() => setExpanded(e => !e)}>
          <Text style={styles.FactCardExpandBtnText}>{expanded ? 'Less' : 'More'}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({ FactCardCard: {
    backgroundColor: Colors.solidCardNavy,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.deepIceBlue,
  }, FactCardTopRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  }, FactCardCategoryBadge: {
    backgroundColor: Colors.deepIceBlue,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: Colors.borderIce,
  }, FactCardCategoryText: {
    color: Colors.crystalCyan,
    fontSize: 11,
    fontWeight: '600',
  }, FactCardUserBadge: {
    backgroundColor: Colors.sculpturalRed + '22',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: Colors.sculpturalRed,
  }, FactCardUserBadgeText: {
    color: Colors.sculpturalRed,
    fontSize: 11,
    fontWeight: '600',
  }, FactCardTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  }, FactCardShortText: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  }, FactCardDetailText: {
    color: Colors.mutedText,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.deepIceBlue,
    paddingTop: 10,
  }, FactCardActions: {
    flexDirection: 'row',
    gap: 8,
  }, FactCardShareBtn: {
    backgroundColor: Colors.deepIceBlue,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.borderIce,
  }, FactCardShareBtnText: {
    color: Colors.crystalCyan,
    fontSize: 13,
    fontWeight: '600',
  }, FactCardDeleteBtn: {
    backgroundColor: Colors.deepRed + '33',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.sculpturalRed,
  }, FactCardDeleteBtnText: {
    color: Colors.sculpturalRed,
    fontSize: 13,
    fontWeight: '600',
  }, FactCardExpandBtn: {
    marginLeft: 'auto',
    paddingHorizontal: 10,
    paddingVertical: 8,
  }, FactCardExpandBtnText: {
    color: Colors.mutedText,
    fontSize: 13,
    fontWeight: '500',
  },
});
