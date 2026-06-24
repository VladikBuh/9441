import React, { useState } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Colors } from '../theme/colors';
import { Fact } from '../types';

interface Props {
  visible: boolean;
  onSave: (fact: Omit<Fact, 'id'>) => void;
  onCancel: () => void;
}

export const AddFactModal: React.FC<Props> = ({ visible, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!title.trim()) { setError('Fact title cannot be empty.'); return; }
    if (!text.trim()) { setError('Fact text cannot be empty.'); return; }
    setError('');
    onSave({
      title: title.trim(),
      category: category.trim() || 'Custom',
      shortText: text.trim(),
      detailText: text.trim(),
      isUserFact: true,
    });
    setTitle('');
    setCategory('');
    setText('');
  };

  const handleCancel = () => {
    setTitle('');
    setCategory('');
    setText('');
    setError('');
    onCancel();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        style={styles.AddFactModalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.AddFactModalCard}>
          <Text style={styles.AddFactModalTitle}>Add Your Ice Fact</Text>

          <Text style={styles.AddFactModalLabel}>Fact Title *</Text>
          <TextInput
            style={styles.AddFactModalInput}
            placeholder="Enter a title..."
            placeholderTextColor={Colors.mutedText}
            value={title}
            onChangeText={t => { setTitle(t); setError(''); }}
          />

          <Text style={styles.AddFactModalLabel}>Category</Text>
          <TextInput
            style={styles.AddFactModalInput}
            placeholder="e.g. Ice Science, Carving, Preservation..."
            placeholderTextColor={Colors.mutedText}
            value={category}
            onChangeText={setCategory}
          />

          <Text style={styles.AddFactModalLabel}>Fact Text *</Text>
          <TextInput
            style={[styles.AddFactModalInput, styles.AddFactModalTextArea]}
            placeholder="Write your ice fact here..."
            placeholderTextColor={Colors.mutedText}
            value={text}
            onChangeText={t => { setText(t); setError(''); }}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          {error ? <Text style={styles.AddFactModalError}>{error}</Text> : null}

          <View style={styles.AddFactModalButtons}>
            <TouchableOpacity style={styles.AddFactModalCancelBtn} onPress={handleCancel}>
              <Text style={styles.AddFactModalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.AddFactModalSaveBtn} onPress={handleSave}>
              <Text style={styles.AddFactModalSaveText}>Save Fact</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({ AddFactModalOverlay: {
    flex: 1,
    backgroundColor: '#000000CC',
    justifyContent: 'flex-end',
  }, AddFactModalCard: {
    backgroundColor: Colors.solidCardNavy,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    borderTopWidth: 1,
    borderColor: Colors.borderIce,
  }, AddFactModalTitle: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  }, AddFactModalLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  }, AddFactModalInput: {
    backgroundColor: Colors.darkPanel,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: Colors.textPrimary,
    fontSize: 15,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.deepIceBlue,
  }, AddFactModalTextArea: {
    height: 100,
    paddingTop: 12,
  }, AddFactModalError: {
    color: Colors.sculpturalRed,
    fontSize: 13,
    marginBottom: 12,
  }, AddFactModalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  }, AddFactModalCancelBtn: {
    flex: 1,
    backgroundColor: Colors.darkPanel,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderIce,
  }, AddFactModalCancelText: {
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 15,
  }, AddFactModalSaveBtn: {
    flex: 1,
    backgroundColor: Colors.crystalCyan,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  }, AddFactModalSaveText: {
    color: Colors.arcticNavy,
    fontWeight: '700',
    fontSize: 15,
  },
});
