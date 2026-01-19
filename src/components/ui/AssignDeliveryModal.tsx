import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Alert,
    Platform,
} from 'react-native';
import { IconUser, IconCheck } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { Modal } from './Modal';
import { Button, LoadingState } from './';
import { useDeliveryPersonnel, useAssignDelivery } from '../../hooks/useOrders';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { User } from '../../types/user';

interface AssignDeliveryModalProps {
    visible: boolean;
    onClose: () => void;
    orderId: string;
    currentDeliveryPerson?: User | string | null;
}

export function AssignDeliveryModal({
    visible,
    onClose,
    orderId,
    currentDeliveryPerson
}: AssignDeliveryModalProps) {
    const { t } = useTranslation();
    const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);

    const { data: deliveryPersonnel, isLoading } = useDeliveryPersonnel();
    const assignMutation = useAssignDelivery();

    const currentPersonId = typeof currentDeliveryPerson === 'object'
        ? currentDeliveryPerson?.id
        : currentDeliveryPerson;

    const handleAssign = () => {
        if (!selectedPersonId) {
            const message = 'Please select a delivery person';
            if (Platform.OS === 'web') {
                window.alert(message);
            } else {
                Alert.alert('Error', message);
            }
            return;
        }

        assignMutation.mutate(
            { orderId, deliveryPersonId: selectedPersonId },
            {
                onSuccess: () => {
                    const message = 'Delivery person assigned successfully!';
                    if (Platform.OS === 'web') {
                        window.alert(message);
                    } else {
                        Alert.alert('Success', message);
                    }
                    onClose();
                },
                onError: (error) => {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to assign delivery person';
                    if (Platform.OS === 'web') {
                        window.alert(`Error: ${errorMessage}`);
                    } else {
                        Alert.alert('Error', errorMessage);
                    }
                },
            }
        );
    };

    const renderDeliveryPerson = (person: User) => {
        const isSelected = selectedPersonId === person.id;
        const isCurrent = currentPersonId === person.id;

        return (
            <Pressable
                key={person.id}
                style={[
                    styles.personItem,
                    isSelected && styles.selectedItem,
                    isCurrent && styles.currentItem,
                ]}
                onPress={() => setSelectedPersonId(person.id)}
            >
                <View style={styles.personInfo}>
                    <View style={[styles.avatar, isCurrent && styles.currentAvatar]}>
                        <IconUser size={20} color={isCurrent ? colors.success : colors.gray[600]} strokeWidth={1.5} />
                    </View>
                    <View style={styles.personDetails}>
                        <Text style={styles.personName}>{person.fullName}</Text>
                        <Text style={styles.personPhone}>{person.phoneNumber}</Text>
                        {isCurrent && (
                            <Text style={styles.currentLabel}>Currently Assigned</Text>
                        )}
                    </View>
                </View>
                {isSelected && (
                    <View style={styles.checkIcon}>
                        <IconCheck size={20} color={colors.primary[600]} strokeWidth={2} />
                    </View>
                )}
            </Pressable>
        );
    };

    return (
        <Modal
            visible={visible}
            onClose={onClose}
            title="Assign Delivery Person"
            maxHeight={500}
        >
            {isLoading ? (
                <LoadingState />
            ) : (
                <View>
                    <Text style={styles.instruction}>
                        Select a delivery person to assign this order:
                    </Text>

                    <View style={styles.personList}>
                        {deliveryPersonnel?.map(renderDeliveryPerson)}
                    </View>

                    {deliveryPersonnel?.length === 0 && (
                        <Text style={styles.emptyText}>
                            No delivery personnel available
                        </Text>
                    )}

                    <View style={styles.actions}>
                        <Button
                            title="Cancel"
                            variant="outline"
                            onPress={onClose}
                            style={styles.cancelButton}
                        />
                        <Button
                            title="Assign"
                            onPress={handleAssign}
                            loading={assignMutation.isPending}
                            disabled={!selectedPersonId}
                            style={styles.assignButton}
                        />
                    </View>
                </View>
            )}
        </Modal>
    );
}

const styles = StyleSheet.create({
    instruction: {
        fontSize: fontSize.md,
        color: colors.gray[600],
        marginBottom: spacing.lg,
    },
    personList: {
        marginBottom: spacing.xl,
    },
    personItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.gray[200],
        marginBottom: spacing.md,
    },
    selectedItem: {
        borderColor: colors.primary[600],
        backgroundColor: colors.primary[50],
    },
    currentItem: {
        borderColor: colors.success,
        backgroundColor: colors.successLight,
    },
    personInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        backgroundColor: colors.gray[100],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    currentAvatar: {
        backgroundColor: colors.successLight,
    },
    personDetails: {
        flex: 1,
    },
    personName: {
        fontSize: fontSize.md,
        fontWeight: '600',
        color: colors.gray[900],
        marginBottom: 2,
    },
    personPhone: {
        fontSize: fontSize.sm,
        color: colors.gray[500],
    },
    currentLabel: {
        fontSize: fontSize.xs,
        color: colors.success,
        fontWeight: '500',
        marginTop: 2,
    },
    checkIcon: {
        width: 24,
        height: 24,
        borderRadius: borderRadius.full,
        backgroundColor: colors.primary[100],
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: fontSize.md,
        color: colors.gray[500],
        marginVertical: spacing.xl,
    },
    actions: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    cancelButton: {
        flex: 1,
    },
    assignButton: {
        flex: 1,
    },
});