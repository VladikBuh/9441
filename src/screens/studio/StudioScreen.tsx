import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  Dimensions,
  ScrollView,
  Share,
} from 'react-native';
import Svg, {Path, Rect} from 'react-native-svg';

import {Colors} from '../../theme/colors';
import {DRAWING_TASKS} from '../../data/tasks';
import {Storage} from '../../storage/storage';
import {ConfirmModal} from '../../components/ConfirmModal';
import {DrawingPath, SavedDrawing} from '../../types';
import {useFocusEffect} from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';

const {width} = Dimensions.get('window');
const CANVAS_W = width - 32;
const CANVAS_H = 320;

const PALETTE = [
  {color: Colors.frostWhite, label: 'Ice White'},
  {color: Colors.crystalCyan, label: 'Crystal Blue'},
  {color: Colors.sculpturalRed, label: 'Red Accent'},
  {color: Colors.brightArctic, label: 'Arctic Blue'},
  {color: Colors.iceGold, label: 'Ice Gold'},
];

const BRUSH_SIZES = [3, 6, 10];

export const StudioScreen: React.FC = () => {
  const [taskIndex, setTaskIndex] = useState(0);
  const [paths, setPaths] = useState<DrawingPath[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const [selectedColor, setSelectedColor] = useState(Colors.frostWhite);
  const [brushSize, setBrushSize] = useState(6);
  const [deleteModal, setDeleteModal] = useState(false);
  const [hasSavedDrawing, setHasSavedDrawing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const currentPts = useRef('');
  const scrollRef = useRef<any>(null);
  // pathsRef is the stable accumulator used by the PanResponder (created once)
  const pathsRef = useRef<DrawingPath[]>([]);
  const taskIndexRef = useRef(taskIndex);
  // Refs so the PanResponder always reads latest values without stale closure
  const colorRef = useRef(selectedColor);
  const brushRef = useRef(brushSize);
  const setCurrentPathRef = useRef(setCurrentPath);

  colorRef.current = selectedColor;
  brushRef.current = brushSize;
  taskIndexRef.current = taskIndex;
  setCurrentPathRef.current = setCurrentPath;

  useEffect(() => {
    Storage.getLastTaskIndex().then(setTaskIndex);
    Storage.getSavedDrawing().then(d => {
      if (d) {
        pathsRef.current = d.paths;
        setPaths(d.paths);
        setHasSavedDrawing(true);
      }
    });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      Orientation.lockToPortrait();
      return () => {
        Orientation.unlockAllOrientations();
      };
    }, []),
  );

  // Created once — never recreated on re-render
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: e => {
        // Lock scroll so canvas gets all touches
        scrollRef.current?.setNativeProps({scrollEnabled: false});
        const {locationX, locationY} = e.nativeEvent;
        const x = Math.max(0, Math.min(locationX, CANVAS_W));
        const y = Math.max(0, Math.min(locationY, CANVAS_H));
        currentPts.current = `M ${x} ${y}`;
        setCurrentPathRef.current(currentPts.current);
      },
      onPanResponderMove: e => {
        const {locationX, locationY} = e.nativeEvent;
        const x = Math.max(0, Math.min(locationX, CANVAS_W));
        const y = Math.max(0, Math.min(locationY, CANVAS_H));
        currentPts.current += ` L ${x} ${y}`;
        setCurrentPathRef.current(currentPts.current);
      },
      onPanResponderRelease: () => {
        scrollRef.current?.setNativeProps({scrollEnabled: true});
        if (currentPts.current.length > 4) {
          const newPath: DrawingPath = {
            path: currentPts.current,
            color: colorRef.current,
            strokeWidth: brushRef.current,
          };
          pathsRef.current = [...pathsRef.current, newPath];
          setPaths(pathsRef.current);

          Storage.saveDrawing({
            id: 'canvas_autosave',
            paths: pathsRef.current,
            taskPrompt: DRAWING_TASKS[taskIndexRef.current],
            date: new Date().toISOString(),
          });
        }
        currentPts.current = '';
        setCurrentPathRef.current('');
      },
      onPanResponderTerminate: () => {
        scrollRef.current?.setNativeProps({scrollEnabled: true});
        currentPts.current = '';
        setCurrentPathRef.current('');
      },
    }),
  ).current;

  const handleClearCanvas = () => {
    pathsRef.current = [];
    setPaths([]);
    setCurrentPath('');
    currentPts.current = '';
  };

  const handleDeleteDrawing = async () => {
    handleClearCanvas();
    await Storage.clearDrawing();
    setHasSavedDrawing(false);
    setDeleteModal(false);
  };

  const handleSaveDrawing = async () => {
    if (paths.length === 0) {
      return;
    }
    const drawing: SavedDrawing = {
      id: `drawing_${Date.now()}`,
      paths,
      taskPrompt: DRAWING_TASKS[taskIndex],
      date: new Date().toISOString(),
    };
    await Storage.saveDrawing(drawing);
    setHasSavedDrawing(true);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `I created a custom ice figure in Sculpted Ice Explorer!\n\nTask: "${DRAWING_TASKS[taskIndex]}"\n\n— Sculpted Ice Explorer App`,
      });
    } catch {}
  };

  const handleNewTask = async () => {
    const next = (taskIndex + 1) % DRAWING_TASKS.length;
    setTaskIndex(next);
    await Storage.setLastTaskIndex(next);
  };

  return (
    <View style={styles.StudioScreenContainer}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <View style={styles.StudioScreenHeader}>
          <Text style={styles.StudioScreenScreenTitle}>Ice Shape Studio</Text>
          <Text style={styles.StudioScreenScreenSubtitle}>
            Draw a figure from the task card and save your frozen idea.
          </Text>
        </View>
        <View style={styles.StudioScreenContentPad}>
          <View style={styles.StudioScreenTaskCard}>
            <View style={styles.StudioScreenTaskCardHeader}>
              <Text style={styles.StudioScreenTaskLabel}>Drawing Task</Text>
              <TouchableOpacity
                style={styles.StudioScreenNewTaskBtn}
                onPress={handleNewTask}>
                <Text style={styles.StudioScreenNewTaskBtnText}>New Task</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.StudioScreenTaskText}>
              "{DRAWING_TASKS[taskIndex]}"
            </Text>
          </View>

          {saveSuccess && (
            <View style={styles.StudioScreenSuccessBanner}>
              <Text style={styles.StudioScreenSuccessText}>
                Ice figure saved.
              </Text>
            </View>
          )}

          <View style={styles.StudioScreenCanvasContainer}>
            <View
              style={styles.StudioScreenCanvas}
              {...panResponder.panHandlers}>
              <Svg width={CANVAS_W} height={CANVAS_H}>
                <Rect
                  x={0}
                  y={0}
                  width={CANVAS_W}
                  height={CANVAS_H}
                  fill="#E6F5FF"
                  rx={0}
                />
                {paths.map((p, i) => (
                  <Path
                    key={i}
                    d={p.path}
                    stroke={p.color}
                    strokeWidth={p.strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
                {currentPath ? (
                  <Path
                    d={currentPath}
                    stroke={selectedColor}
                    strokeWidth={brushSize}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : null}
              </Svg>
            </View>
          </View>

          <View style={styles.StudioScreenToolbarCard}>
            <Text style={styles.StudioScreenToolbarLabel}>Color</Text>
            <View style={styles.StudioScreenPaletteRow}>
              {PALETTE.map(p => (
                <TouchableOpacity
                  key={p.color}
                  style={[
                    styles.StudioScreenColorSwatch,
                    {backgroundColor: p.color},
                    selectedColor === p.color &&
                      styles.StudioScreenColorSwatchActive,
                  ]}
                  onPress={() => setSelectedColor(p.color)}
                />
              ))}
            </View>

            <Text style={styles.StudioScreenToolbarLabel}>Brush Size</Text>
            <View style={styles.StudioScreenBrushRow}>
              {BRUSH_SIZES.map(sz => (
                <TouchableOpacity
                  key={sz}
                  style={[
                    styles.StudioScreenBrushBtn,
                    brushSize === sz && styles.StudioScreenBrushBtnActive,
                  ]}
                  onPress={() => setBrushSize(sz)}>
                  <View
                    style={[
                      styles.StudioScreenBrushDot,
                      {width: sz * 2, height: sz * 2, borderRadius: sz},
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.StudioScreenActionRow}>
            <TouchableOpacity
              style={styles.StudioScreenClearBtn}
              onPress={handleClearCanvas}>
              <Text style={styles.StudioScreenClearBtnText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.StudioScreenSaveBtn}
              onPress={handleSaveDrawing}>
              <Text style={styles.StudioScreenSaveBtnText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.StudioScreenShareBtn}
              onPress={handleShare}>
              <Text style={styles.StudioScreenShareBtnText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.StudioScreenDeleteBtn}
              onPress={() => setDeleteModal(true)}>
              <Text style={styles.StudioScreenDeleteBtnText}>Delete</Text>
            </TouchableOpacity>
          </View>

          {paths.length === 0 && !hasSavedDrawing && (
            <View style={styles.StudioScreenEmptyHint}>
              <Text style={styles.StudioScreenEmptyHintText}>
                Use the canvas above to sketch your first ice figure.
              </Text>
            </View>
          )}

          <View style={styles.StudioScreenBottomSpacer} />
        </View>
      </ScrollView>

      <ConfirmModal
        visible={deleteModal}
        title="Delete Drawing?"
        message="Your current ice figure sketch will be cleared."
        confirmLabel="Delete"
        danger
        onConfirm={handleDeleteDrawing}
        onCancel={() => setDeleteModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  StudioScreenContainer: {flex: 1, backgroundColor: Colors.arcticNavy},
  StudioScreenHeader: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 14,
    backgroundColor: Colors.darkPanel,
    borderBottomWidth: 1,
    borderBottomColor: Colors.deepIceBlue,
  },
  StudioScreenScreenTitle: {
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },

  StudioScreenScreenSubtitle: {
    color: Colors.mutedText,
    fontSize: 12,
    lineHeight: 17,
  },
  StudioScreenContentPad: {padding: 16},
  StudioScreenBottomSpacer: {height: 20},
  StudioScreenTaskCard: {
    backgroundColor: Colors.solidCardNavy,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.borderIce,
  },
  StudioScreenTaskCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  StudioScreenTaskLabel: {
    color: Colors.mutedText,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  StudioScreenNewTaskBtn: {
    backgroundColor: Colors.deepIceBlue,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: Colors.borderIce,
  },
  StudioScreenNewTaskBtnText: {
    color: Colors.crystalCyan,
    fontSize: 12,
    fontWeight: '600',
  },
  StudioScreenTaskText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  StudioScreenSuccessBanner: {
    backgroundColor: Colors.cyanActive,
    borderRadius: 9,
    paddingVertical: 9,
    alignItems: 'center',
    marginBottom: 12,
  },
  StudioScreenSuccessText: {
    color: Colors.arcticNavy,
    fontSize: 14,
    fontWeight: '700',
  },
  StudioScreenCanvasContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.borderIce,
    marginBottom: 14,
  },
  StudioScreenCanvas: {
    width: CANVAS_W,
    height: CANVAS_H,
    backgroundColor: '#E6F5FF',
  },

  StudioScreenToolbarCard: {
    backgroundColor: Colors.solidCardNavy,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.deepIceBlue,
  },

  StudioScreenToolbarLabel: {
    color: Colors.mutedText,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  StudioScreenPaletteRow: {flexDirection: 'row', gap: 10, marginBottom: 16},
  StudioScreenColorSwatch: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  StudioScreenColorSwatchActive: {
    borderColor: Colors.borderIce,
  },
  StudioScreenBrushRow: {flexDirection: 'row', gap: 14, alignItems: 'center'},
  StudioScreenBrushBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: Colors.darkPanel,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.deepIceBlue,
  },

  StudioScreenBrushBtnActive: {
    borderColor: Colors.borderIce,
    backgroundColor: Colors.deepIceBlue,
  },
  StudioScreenBrushDot: {backgroundColor: Colors.frostWhite},
  StudioScreenActionRow: {flexDirection: 'row', gap: 8, marginBottom: 12},
  StudioScreenClearBtn: {
    flex: 1,
    backgroundColor: Colors.darkPanel,
    borderRadius: 9,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.deepIceBlue,
  },
  StudioScreenClearBtnText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  StudioScreenSaveBtn: {
    flex: 1,
    backgroundColor: Colors.crystalCyan,
    borderRadius: 9,
    paddingVertical: 12,
    alignItems: 'center',
  },
  StudioScreenSaveBtnText: {
    color: Colors.arcticNavy,
    fontSize: 13,
    fontWeight: '700',
  },

  StudioScreenShareBtn: {
    flex: 1,
    backgroundColor: Colors.brightArctic,
    borderRadius: 9,
    paddingVertical: 12,
    alignItems: 'center',
  },
  StudioScreenShareBtnText: {
    color: Colors.arcticNavy,
    fontSize: 13,
    fontWeight: '700',
  },
  StudioScreenDeleteBtn: {
    flex: 1,
    backgroundColor: Colors.deepRed + '33',
    borderRadius: 9,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.sculpturalRed,
  },
  StudioScreenDeleteBtnText: {
    color: Colors.sculpturalRed,
    fontSize: 13,
    fontWeight: '600',
  },
  StudioScreenEmptyHint: {
    backgroundColor: Colors.darkPanel,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.deepIceBlue,
  },

  StudioScreenEmptyHintText: {
    color: Colors.mutedText,
    fontSize: 13,
    textAlign: 'center',
  },
});
