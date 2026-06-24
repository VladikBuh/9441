import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Share,
} from 'react-native';
import {Colors} from '../../theme/colors';
import {BUILT_IN_FACTS} from '../../data/facts';
import {Storage} from '../../storage/storage';
import {FactCard} from '../../components/FactCard';
import {AddFactModal} from '../../components/AddFactModal';
import {ConfirmModal} from '../../components/ConfirmModal';
import {Fact} from '../../types';

export const FactsScreen: React.FC = () => {
  const [customFacts, setCustomFacts] = useState<Fact[]>([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const load = useCallback(async () => {
    const facts = await Storage.getCustomFacts();
    setCustomFacts(facts);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSaveFact = async (factData: Omit<Fact, 'id'>) => {
    const id = `user_${Date.now()}`;
    await Storage.saveCustomFact({...factData, id});
    await load();
    setAddModalVisible(false);
  };

  const handleDeleteFact = async () => {
    if (!deleteTarget) return;
    await Storage.deleteCustomFact(deleteTarget);
    await load();
    setDeleteTarget(null);
  };

  const handleShare = async (fact: Fact) => {
    try {
      await Share.share({
        message: `${fact.title}\n\n${fact.shortText}\n\n— Sculpted Ice Explorer`,
      });
    } catch {}
  };

  const allFacts = [...customFacts, ...BUILT_IN_FACTS];

  return (
    <View style={styles.FactsScreenContainer}>
      <ScrollView
        style={styles.FactsScreenList}
        showsVerticalScrollIndicator={false}>
        <View style={styles.FactsScreenHeader}>
          <View style={styles.FactsScreenHeaderLeft}>
            <Text style={styles.FactsScreenScreenTitle}>Ice Facts</Text>
            <Text style={styles.FactsScreenScreenSubtitle}>
              Learn how ice art is created, moved, preserved, and reused.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.FactsScreenAddBtn}
            onPress={() => setAddModalVisible(true)}>
            <Text style={styles.FactsScreenAddBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.FactsScreenContentPad}>
          {allFacts.length === 0 && (
            <View style={styles.FactsScreenEmptyState}>
              <Text style={styles.FactsScreenEmptyIcon}>❄</Text>
              <Text style={styles.FactsScreenEmptyTitle}>
                Add Your First Ice Fact
              </Text>
              <Text style={styles.FactsScreenEmptySubtitle}>
                Create a personal note about ice art, exhibits, or frozen
                design.
              </Text>
            </View>
          )}
          {allFacts.map(fact => (
            <FactCard
              key={fact.id}
              fact={fact}
              onShare={() => handleShare(fact)}
              onDelete={
                fact.isUserFact ? () => setDeleteTarget(fact.id) : undefined
              }
            />
          ))}
          <View style={styles.FactsScreenBottomSpacer} />
        </View>
      </ScrollView>

      <AddFactModal
        visible={addModalVisible}
        onSave={handleSaveFact}
        onCancel={() => setAddModalVisible(false)}
      />

      <ConfirmModal
        visible={!!deleteTarget}
        title="Delete Fact?"
        message="This custom fact will be removed from your collection."
        confirmLabel="Delete"
        danger
        onConfirm={handleDeleteFact}
        onCancel={() => setDeleteTarget(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  FactsScreenContainer: {flex: 1, backgroundColor: Colors.arcticNavy},
  FactsScreenList: {flex: 1},
  FactsScreenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 14,
    backgroundColor: Colors.darkPanel,
    borderBottomWidth: 1,
    borderBottomColor: Colors.deepIceBlue,
  },

  FactsScreenHeaderLeft: {flex: 1, marginRight: 12},
  FactsScreenScreenTitle: {
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  FactsScreenScreenSubtitle: {
    color: Colors.mutedText,
    fontSize: 12,
    lineHeight: 17,
  },
  FactsScreenAddBtn: {
    backgroundColor: Colors.crystalCyan,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 9,
  },

  FactsScreenAddBtnText: {
    color: Colors.arcticNavy,
    fontWeight: '700',
    fontSize: 14,
  },
  FactsScreenContentPad: {paddingHorizontal: 16, paddingTop: 14},
  FactsScreenEmptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 30,
  },
  FactsScreenEmptyIcon: {
    fontSize: 48,
    marginBottom: 16,
    color: Colors.crystalCyan,
  },
  FactsScreenEmptyTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  FactsScreenEmptySubtitle: {
    color: Colors.mutedText,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  FactsScreenBottomSpacer: {height: 20},
});
