import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal as RNModal,
    Pressable,
    ScrollView,
} from 'react-native';
import { IconX } from '@tabler/icons-react-native';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../constants/theme';

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    maxHeight?: number;
}

export function Modal({ visible, onClose, title, children, maxHeight = 600 }: ModalProps) {
    return (
        <RNModal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Pressable style={styles.backdrop} onPress={onClose} />
                <View style={[styles.modal, maxHeight ? { maxHeight } : undefined]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>{title}</Text>
                        <Pressable style={styles.closeButton} onPress={onClose}>
                            <IconX size={24} color={colors.gray[600]} strokeWidth={1.5} />
                        </Pressable>
                    </View>

                    {/* Content */}
                    <ScrollView
                        style={styles.content}
                        showsVerticalScrollIndicator={false}
                    >
                        {children}
                    </ScrollView>
                </View>
            </View>
        </RNModal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: spacing.lg,
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modal: {
        backgroundColor: colors.background.primary,
        borderRadius: borderRadius.xl,
        width: '100%',
        maxWidth: 400,
        ...shadows.xl,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.xl,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[100],
    },
    title: {
        fontSize: fontSize.lg,
        fontWeight: '700',
        color: colors.gray[900],
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: borderRadius.md,
        backgroundColor: colors.gray[50],
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: spacing.xl,
    },
});