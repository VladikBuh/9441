import React, {useState, useEffect} from 'react';
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
import {ConfirmModal} from '../../components/ConfirmModal';
import {CalcHistoryItem} from '../../types';

export const CalculatorHistoryScreen: React.FC = () => {
  const {goBack} = useAppNavigation();
  const [history, setHistory] = useState<CalcHistoryItem[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [clearModal, setClearModal] = useState(false);

  useEffect(() => {
    Storage.getCalcHistory().then(setHistory);
  }, []);

  const handleDeleteItem = async () => {
    if (!deleteTarget) return;
    await Storage.deleteCalcHistoryItem(deleteTarget);
    setHistory(prev => prev.filter(i => i.id !== deleteTarget));
    setDeleteTarget(null);
  };

  const handleClearAll = async () => {
    await Storage.clearCalcHistory();
    setHistory([]);
    setClearModal(false);
  };

  return (
    <View style={styles.CalculatorHistoryScreenContainer}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.CalculatorHistoryScreenHeader}>
          <TouchableOpacity
            style={styles.CalculatorHistoryScreenBackBtn}
            onPress={() => goBack()}>
            <Text style={styles.CalculatorHistoryScreenBackBtnText}>
              ← Back
            </Text>
          </TouchableOpacity>
          <Text style={styles.CalculatorHistoryScreenScreenTitle}>
            Calculation History
          </Text>
          {history.length > 0 && (
            <TouchableOpacity
              style={styles.CalculatorHistoryScreenClearBtn}
              onPress={() => setClearModal(true)}>
              <Text style={styles.CalculatorHistoryScreenClearBtnText}>
                Clear All
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {history.length === 0 ? (
          <View style={styles.CalculatorHistoryScreenEmptyState}>
            <Text style={styles.CalculatorHistoryScreenEmptyIcon}>◆</Text>
            <Text style={styles.CalculatorHistoryScreenEmptyTitle}>
              No Calculations Yet
            </Text>
            <Text style={styles.CalculatorHistoryScreenEmptySubtitle}>
              Estimate an ice figure and your result will appear here.
            </Text>
          </View>
        ) : (
          <View style={styles.CalculatorHistoryScreenListContent}>
            {history.map(item => (
              <View
                key={item.id}
                style={styles.CalculatorHistoryScreenHistoryCard}>
                <View style={styles.CalculatorHistoryScreenCardHeader}>
                  <View>
                    <Text style={styles.CalculatorHistoryScreenCardShape}>
                      {item.shape}
                    </Text>
                    <Text style={styles.CalculatorHistoryScreenCardDate}>
                      {item.date}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.CalculatorHistoryScreenDeleteItemBtn}
                    onPress={() => setDeleteTarget(item.id)}>
                    <Text
                      style={styles.CalculatorHistoryScreenDeleteItemBtnText}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.CalculatorHistoryScreenDivider} />

                <View style={styles.CalculatorHistoryScreenInputsRow}>
                  {Object.entries(item.inputs).map(([key, val]) => (
                    <View
                      key={key}
                      style={styles.CalculatorHistoryScreenInputChip}>
                      <Text
                        style={styles.CalculatorHistoryScreenInputChipLabel}>
                        {key}
                      </Text>
                      <Text
                        style={styles.CalculatorHistoryScreenInputChipValue}>
                        {typeof val === 'number' ? val.toFixed(2) : val}{' '}
                        {item.unit}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={styles.CalculatorHistoryScreenResultsGrid}>
                  <View style={styles.CalculatorHistoryScreenResultCell}>
                    <Text style={styles.CalculatorHistoryScreenResultCellLabel}>
                      Volume
                    </Text>
                    <Text style={styles.CalculatorHistoryScreenResultCellValue}>
                      {item.volume.toFixed(4)} m³
                    </Text>
                  </View>
                  <View style={styles.CalculatorHistoryScreenResultCell}>
                    <Text style={styles.CalculatorHistoryScreenResultCellLabel}>
                      Ice Mass
                    </Text>
                    <Text style={styles.CalculatorHistoryScreenResultCellValue}>
                      {item.mass.toFixed(1)} kg
                    </Text>
                  </View>
                  <View style={styles.CalculatorHistoryScreenResultCell}>
                    <Text style={styles.CalculatorHistoryScreenResultCellLabel}>
                      Water
                    </Text>
                    <Text style={styles.CalculatorHistoryScreenResultCellValue}>
                      {item.waterLiters.toFixed(1)} L
                    </Text>
                  </View>
                  <View style={styles.CalculatorHistoryScreenResultCell}>
                    <Text style={styles.CalculatorHistoryScreenResultCellLabel}>
                      Water m³
                    </Text>
                    <Text style={styles.CalculatorHistoryScreenResultCellValue}>
                      {item.waterM3.toFixed(4)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
            <View style={styles.CalculatorHistoryScreenBottomSpacer} />
          </View>
        )}
      </ScrollView>

      <ConfirmModal
        visible={!!deleteTarget}
        title="Delete Calculation?"
        message="This saved calculation will be removed from your history."
        confirmLabel="Delete"
        danger
        onConfirm={handleDeleteItem}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmModal
        visible={clearModal}
        title="Clear History?"
        message="All recent ice calculations will be removed."
        confirmLabel="Clear All"
        danger
        onConfirm={handleClearAll}
        onCancel={() => setClearModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  CalculatorHistoryScreenContainer: {
    flex: 1,
    backgroundColor: Colors.arcticNavy,
  },

  CalculatorHistoryScreenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 14,
    backgroundColor: Colors.darkPanel,
    borderBottomWidth: 1,
    borderBottomColor: Colors.deepIceBlue,
  },
  CalculatorHistoryScreenBackBtn: {
    backgroundColor: Colors.solidCardNavy,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderIce,
    marginRight: 12,
  },
  CalculatorHistoryScreenBackBtnText: {
    color: Colors.crystalCyan,
    fontWeight: '700',
    fontSize: 13,
  },
  CalculatorHistoryScreenScreenTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    flex: 1,
  },
  CalculatorHistoryScreenClearBtn: {
    backgroundColor: Colors.deepRed + '33',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.sculpturalRed,
  },

  CalculatorHistoryScreenClearBtnText: {
    color: Colors.sculpturalRed,
    fontWeight: '600',
    fontSize: 13,
  },
  CalculatorHistoryScreenEmptyState: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 30,
  },
  CalculatorHistoryScreenEmptyIcon: {
    fontSize: 48,
    color: Colors.crystalCyan,
    marginBottom: 16,
  },

  CalculatorHistoryScreenEmptyTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },

  CalculatorHistoryScreenEmptySubtitle: {
    color: Colors.mutedText,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  CalculatorHistoryScreenListContent: {padding: 16},
  CalculatorHistoryScreenHistoryCard: {
    backgroundColor: Colors.solidCardNavy,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.deepIceBlue,
  },
  CalculatorHistoryScreenCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },

  CalculatorHistoryScreenCardShape: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
  },
  CalculatorHistoryScreenCardDate: {color: Colors.mutedText, fontSize: 12},
  CalculatorHistoryScreenDeleteItemBtn: {
    backgroundColor: Colors.deepRed + '33',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: Colors.sculpturalRed,
  },

  CalculatorHistoryScreenDeleteItemBtnText: {
    color: Colors.sculpturalRed,
    fontSize: 12,
    fontWeight: '600',
  },
  CalculatorHistoryScreenDivider: {
    height: 1,
    backgroundColor: Colors.deepIceBlue,
    marginBottom: 10,
  },
  CalculatorHistoryScreenInputsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },

  CalculatorHistoryScreenInputChip: {
    backgroundColor: Colors.darkPanel,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.deepIceBlue,
  },
  CalculatorHistoryScreenInputChipLabel: {
    color: Colors.mutedText,
    fontSize: 10,
    fontWeight: '600',
  },
  CalculatorHistoryScreenInputChipValue: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  CalculatorHistoryScreenResultsGrid: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  CalculatorHistoryScreenResultCell: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.darkPanel,
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.deepIceBlue,
  },
  CalculatorHistoryScreenResultCellLabel: {
    color: Colors.mutedText,
    fontSize: 11,
    marginBottom: 3,
  },
  CalculatorHistoryScreenResultCellValue: {
    color: Colors.crystalCyan,
    fontSize: 13,
    fontWeight: '700',
  },
  CalculatorHistoryScreenBottomSpacer: {height: 20},
});
