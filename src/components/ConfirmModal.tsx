import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export const ConfirmModal: React.FC<Props> = ({
  visible, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel',
  onConfirm, onCancel, danger = false,
}) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.ConfirmModalOverlay}>
      <View style={styles.ConfirmModalCard}>
        <Text style={styles.ConfirmModalTitle}>{title}</Text>
        <Text style={styles.ConfirmModalMessage}>{message}</Text>
        <View style={styles.ConfirmModalButtons}>
          <TouchableOpacity style={styles.ConfirmModalCancelBtn} onPress={onCancel}>
            <Text style={styles.ConfirmModalCancelText}>{cancelLabel}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.ConfirmModalConfirmBtn, danger && styles.ConfirmModalDangerBtn]}
            onPress={onConfirm}
          >
            <Text style={styles.ConfirmModalConfirmText}>{confirmLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({ ConfirmModalOverlay: {
    flex: 1,
    backgroundColor: '#000000CC',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  }, ConfirmModalCard: {
    backgroundColor: Colors.solidCardNavy,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.borderIce,
  }, ConfirmModalTitle: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  }, ConfirmModalMessage: {
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  }, ConfirmModalButtons: {
    flexDirection: 'row',
    gap: 12,
  }, ConfirmModalCancelBtn: {
    flex: 1,
    backgroundColor: Colors.darkPanel,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderIce,
  }, ConfirmModalCancelText: {
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 15,
  }, ConfirmModalConfirmBtn: {
    flex: 1,
    backgroundColor: Colors.crystalCyan,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
  }, ConfirmModalDangerBtn: {
    backgroundColor: Colors.sculpturalRed,
  }, ConfirmModalConfirmText: {
    color: Colors.arcticNavy,
    fontWeight: '700',
    fontSize: 15,
  },
});
