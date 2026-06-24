import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Share,
} from 'react-native';
import {useAppNavigation} from '../../navigation/NavigationContext';
import {Colors} from '../../theme/colors';
import {Storage} from '../../storage/storage';
import {CalcHistoryItem} from '../../types';

const ICE_DENSITY = 917;

type Shape = 'rectangular' | 'cube' | 'cylinder' | 'sphere' | 'custom';
type Unit = 'cm' | 'm';

const SHAPES: {key: Shape; label: string; fields: string[]}[] = [
  {
    key: 'rectangular',
    label: 'Rectangular Block',
    fields: ['Length', 'Width', 'Height'],
  },
  {key: 'cube', label: 'Cube', fields: ['Side Length']},
  {key: 'cylinder', label: 'Cylinder', fields: ['Radius', 'Height']},
  {key: 'sphere', label: 'Sphere', fields: ['Radius']},
  {key: 'custom', label: 'Custom Volume', fields: ['Volume (m³)']},
];

interface CalcResult {
  volume: number;
  mass: number;
  waterLiters: number;
  waterM3: number;
}

const toMeters = (val: number, unit: Unit) => (unit === 'cm' ? val / 100 : val);

const calcVolume = (
  shape: Shape,
  inputs: Record<string, number>,
  unit: Unit,
): number => {
  const v = (n: number) => toMeters(n, unit);
  switch (shape) {
    case 'rectangular':
      return v(inputs['Length']) * v(inputs['Width']) * v(inputs['Height']);
    case 'cube':
      return Math.pow(v(inputs['Side Length']), 3);
    case 'cylinder':
      return Math.PI * Math.pow(v(inputs['Radius']), 2) * v(inputs['Height']);
    case 'sphere':
      return (4 / 3) * Math.PI * Math.pow(v(inputs['Radius']), 3);
    case 'custom':
      return inputs['Volume (m³)'] || 0;
    default:
      return 0;
  }
};

export const CalculatorScreen: React.FC = () => {
  const {openCalculatorHistory} = useAppNavigation();
  const [shape, setShape] = useState<Shape>('rectangular');
  const [unit, setUnit] = useState<Unit>('cm');
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<CalcResult | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const currentShape = SHAPES.find(s => s.key === shape)!;

  const handleCalculate = async () => {
    const inputs: Record<string, number> = {};
    for (const field of currentShape.fields) {
      const val = parseFloat(fieldValues[field] || '0');
      inputs[field] = isNaN(val) ? 0 : val;
    }
    const effectiveUnit = shape === 'custom' ? 'm' : unit;
    const volume = calcVolume(shape, inputs, effectiveUnit);
    const mass = volume * ICE_DENSITY;
    const waterLiters = mass;
    const waterM3 = mass / 1000;
    const res: CalcResult = {volume, mass, waterLiters, waterM3};
    setResult(res);

    const historyItem: CalcHistoryItem = {
      id: `calc_${Date.now()}`,
      shape: currentShape.label,
      inputs,
      unit: effectiveUnit,
      volume,
      mass,
      waterLiters,
      waterM3,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    await Storage.addCalcHistory(historyItem);
  };

  const handleCopy = async () => {
    if (!result) return;
    const text = [
      `Ice Calculator Result — Sculpted Ice Explorer`,
      `Shape: ${currentShape.label}`,
      `Volume: ${result.volume.toFixed(4)} m³`,
      `Ice Mass: ${result.mass.toFixed(2)} kg`,
      `Melted Water: ${result.waterLiters.toFixed(2)} liters`,
      `Melted Water: ${result.waterM3.toFixed(4)} m³`,
      `Note: This is an estimate based on standard ice density (917 kg/m³).`,
    ].join('\n');
    await Share.share({message: text});
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleReset = () => {
    setFieldValues({});
    setResult(null);
  };

  return (
    <View style={styles.CalculatorScreenContainer}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.CalculatorScreenHeader}>
          <Text style={styles.CalculatorScreenScreenTitle}>Ice Calculator</Text>
          <Text style={styles.CalculatorScreenScreenSubtitle}>
            Estimate ice mass, melted water, and volume for your sculpted
            figure.
          </Text>
        </View>
        <View style={styles.CalculatorScreenContent}>
          <View style={styles.CalculatorScreenShapeSelector}>
            <Text style={styles.CalculatorScreenSectionLabel}>Shape</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              bounces={false}
              contentContainerStyle={styles.CalculatorScreenShapePills}>
              {SHAPES.map(s => (
                <TouchableOpacity
                  key={s.key}
                  style={[
                    styles.CalculatorScreenShapePill,
                    shape === s.key && styles.CalculatorScreenShapePillActive,
                  ]}
                  onPress={() => {
                    setShape(s.key);
                    setResult(null);
                    setFieldValues({});
                  }}>
                  <Text
                    style={[
                      styles.CalculatorScreenShapePillText,
                      shape === s.key &&
                        styles.CalculatorScreenShapePillTextActive,
                    ]}>
                    {s.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {shape !== 'custom' && (
            <View style={styles.CalculatorScreenUnitRow}>
              <Text style={styles.CalculatorScreenSectionLabel}>Unit</Text>
              <View style={styles.CalculatorScreenUnitBtns}>
                {(['cm', 'm'] as Unit[]).map(u => (
                  <TouchableOpacity
                    key={u}
                    style={[
                      styles.CalculatorScreenUnitBtn,
                      unit === u && styles.CalculatorScreenUnitBtnActive,
                    ]}
                    onPress={() => {
                      setUnit(u);
                      setResult(null);
                    }}>
                    <Text
                      style={[
                        styles.CalculatorScreenUnitBtnText,
                        unit === u && styles.CalculatorScreenUnitBtnTextActive,
                      ]}>
                      {u}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.CalculatorScreenInputsCard}>
            <Text style={styles.CalculatorScreenSectionLabel}>Dimensions</Text>
            {currentShape.fields.map(field => (
              <View key={field} style={styles.CalculatorScreenInputRow}>
                <Text style={styles.CalculatorScreenInputLabel}>
                  {field} {shape !== 'custom' ? `(${unit})` : ''}
                </Text>
                <TextInput
                  style={styles.CalculatorScreenInput}
                  placeholder="0"
                  placeholderTextColor={Colors.mutedText}
                  value={fieldValues[field] || ''}
                  onChangeText={v =>
                    setFieldValues(prev => ({...prev, [field]: v}))
                  }
                  keyboardType="decimal-pad"
                />
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.CalculatorScreenCalcBtn}
            onPress={handleCalculate}>
            <Text style={styles.CalculatorScreenCalcBtnText}>Calculate</Text>
          </TouchableOpacity>

          {result && (
            <View style={styles.CalculatorScreenResultCard}>
              <Text style={styles.CalculatorScreenResultTitle}>Result</Text>
              <View style={styles.CalculatorScreenResultRow}>
                <Text style={styles.CalculatorScreenResultLabel}>Volume</Text>
                <Text style={styles.CalculatorScreenResultValue}>
                  {result.volume.toFixed(4)} m³
                </Text>
              </View>
              <View style={styles.CalculatorScreenResultRow}>
                <Text style={styles.CalculatorScreenResultLabel}>Ice Mass</Text>
                <Text style={styles.CalculatorScreenResultValue}>
                  {result.mass.toFixed(2)} kg
                </Text>
              </View>
              <View style={styles.CalculatorScreenResultRow}>
                <Text style={styles.CalculatorScreenResultLabel}>
                  Melted Water
                </Text>
                <Text style={styles.CalculatorScreenResultValue}>
                  {result.waterLiters.toFixed(2)} L
                </Text>
              </View>
              <View
                style={[
                  styles.CalculatorScreenResultRow,
                  {borderBottomWidth: 0},
                ]}>
                <Text style={styles.CalculatorScreenResultLabel}>
                  Water Volume
                </Text>
                <Text style={styles.CalculatorScreenResultValue}>
                  {result.waterM3.toFixed(4)} m³
                </Text>
              </View>
              <Text style={styles.CalculatorScreenResultNote}>
                This is an estimate based on standard ice density (917 kg/m³).
              </Text>
              <View style={styles.CalculatorScreenResultActions}>
                <TouchableOpacity
                  style={[
                    styles.CalculatorScreenCopyBtn,
                    copySuccess && styles.CalculatorScreenCopyBtnSuccess,
                  ]}
                  onPress={handleCopy}>
                  <Text style={styles.CalculatorScreenCopyBtnText}>
                    {copySuccess ? 'Copied!' : 'Copy Result'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.CalculatorScreenResetBtn}
                  onPress={handleReset}>
                  <Text style={styles.CalculatorScreenResetBtnText}>Reset</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={styles.CalculatorScreenHistoryBtn}
            onPress={() => openCalculatorHistory()}>
            <Text style={styles.CalculatorScreenHistoryBtnText}>
              Calculation History
            </Text>
          </TouchableOpacity>

          <View style={styles.CalculatorScreenBottomSpacer} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  CalculatorScreenContainer: {flex: 1, backgroundColor: Colors.arcticNavy},
  CalculatorScreenHeader: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 14,
    backgroundColor: Colors.darkPanel,
    borderBottomWidth: 1,
    borderBottomColor: Colors.deepIceBlue,
  },

  CalculatorScreenScreenTitle: {
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  CalculatorScreenBottomSpacer: {height: 30},
  CalculatorScreenScreenSubtitle: {
    color: Colors.mutedText,
    fontSize: 12,
    lineHeight: 17,
  },
  CalculatorScreenContent: {padding: 16},
  CalculatorScreenSectionLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  CalculatorScreenShapeSelector: {marginBottom: 16},
  CalculatorScreenShapePills: {gap: 8, paddingRight: 4},
  CalculatorScreenShapePill: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 9,
    backgroundColor: Colors.darkPanel,
    borderWidth: 1,
    borderColor: Colors.deepIceBlue,
  },

  CalculatorScreenShapePillActive: {
    backgroundColor: Colors.deepIceBlue,
    borderColor: Colors.borderIce,
  },
  CalculatorScreenShapePillText: {
    color: Colors.mutedText,
    fontSize: 13,
    fontWeight: '600',
  },

  CalculatorScreenShapePillTextActive: {color: Colors.crystalCyan},
  CalculatorScreenUnitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  CalculatorScreenUnitBtns: {flexDirection: 'row', gap: 8},
  CalculatorScreenUnitBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.darkPanel,
    borderWidth: 1,
    borderColor: Colors.deepIceBlue,
  },
  CalculatorScreenUnitBtnActive: {
    backgroundColor: Colors.deepIceBlue,
    borderColor: Colors.borderIce,
  },

  CalculatorScreenUnitBtnText: {
    color: Colors.mutedText,
    fontWeight: '600',
    fontSize: 14,
  },
  CalculatorScreenUnitBtnTextActive: {color: Colors.crystalCyan},
  CalculatorScreenInputsCard: {
    backgroundColor: Colors.solidCardNavy,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.deepIceBlue,
  },
  CalculatorScreenInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  CalculatorScreenInputLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  CalculatorScreenInput: {
    backgroundColor: Colors.darkPanel,
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    width: 120,
    textAlign: 'right',
    borderWidth: 1,
    borderColor: Colors.deepIceBlue,
  },

  CalculatorScreenCalcBtn: {
    backgroundColor: Colors.crystalCyan,
    borderRadius: 13,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: Colors.crystalCyan,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  CalculatorScreenCalcBtnText: {
    color: Colors.arcticNavy,
    fontSize: 16,
    fontWeight: '800',
  },

  CalculatorScreenResultCard: {
    backgroundColor: Colors.solidCardNavy,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.borderIce,
  },
  CalculatorScreenResultTitle: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 14,
  },
  CalculatorScreenResultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.deepIceBlue,
  },
  CalculatorScreenResultLabel: {color: Colors.mutedText, fontSize: 14},
  CalculatorScreenResultValue: {
    color: Colors.crystalCyan,
    fontSize: 14,
    fontWeight: '700',
  },
  CalculatorScreenResultNote: {
    color: Colors.mutedText,
    fontSize: 12,
    marginTop: 12,
    marginBottom: 14,
    lineHeight: 17,
  },
  CalculatorScreenResultActions: {flexDirection: 'row', gap: 10},
  CalculatorScreenCopyBtn: {
    flex: 1,
    backgroundColor: Colors.brightArctic,
    borderRadius: 9,
    paddingVertical: 11,
    alignItems: 'center',
  },
  CalculatorScreenCopyBtnSuccess: {backgroundColor: Colors.cyanActive},
  CalculatorScreenCopyBtnText: {
    color: Colors.arcticNavy,
    fontWeight: '700',
    fontSize: 14,
  },
  CalculatorScreenResetBtn: {
    flex: 1,
    backgroundColor: Colors.darkPanel,
    borderRadius: 9,
    paddingVertical: 11,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.deepIceBlue,
  },

  CalculatorScreenResetBtnText: {
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
  CalculatorScreenHistoryBtn: {
    backgroundColor: Colors.solidCardNavy,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.deepIceBlue,
  },
  CalculatorScreenHistoryBtnText: {
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
});
