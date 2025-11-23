import React from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import { spacing } from "../../styles/spacing";
import { radii } from "../../styles/dimens";
import { typography } from "../../styles/typography";

interface CitySelectorProps {
    visible: boolean;
    onClose: () => void;
    cities: string[];
    selectedCity?: string;
    onSelect: (city: string) => void;
}

const CitySelector: React.FC<CitySelectorProps> = ({ visible, onClose, cities, selectedCity, onSelect }) => {
    return (
        <Modal visible={Boolean(visible)} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalCard}>
                    <View style={styles.modalHeaderRow}>
                        <Text style={styles.modalTitle}>Select city</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={20} color={colors.textPrimary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={{ maxHeight: 280 }}>
                        {cities.map((cityName) => {
                            const selected = cityName === selectedCity;
                            return (
                                <TouchableOpacity
                                    key={cityName}
                                    style={[styles.modalRow, selected && styles.selectedRow]}
                                    onPress={() => {
                                        onSelect(cityName);
                                        onClose();
                                    }}
                                >
                                    <Text style={styles.cityName}>{cityName}</Text>
                                    {selected && (
                                        <Ionicons name="checkmark" size={16} color={colors.accentAlt} />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                        {!cities.length && (
                            <Text style={styles.emptyText}>No cities available for this country.</Text>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: colors.overlay,
        justifyContent: "center",
        padding: spacing.enormous,
    },
    modalCard: {
        backgroundColor: colors.white,
        borderRadius: radii.xl,
        padding: spacing.xxl,
    },
    modalHeaderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacing.md,
    },
    modalTitle: {
        ...typography.label,
        fontWeight: "800",
    },
    modalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: spacing.enormous,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderMuted,
    },
    selectedRow: {
        backgroundColor: colors.highlight,
    },
    cityName: {
        ...typography.body,
    },
    emptyText: {
        ...typography.helper,
        color: colors.textSecondary,
        paddingVertical: spacing.enormous,
    },
});

export default CitySelector;