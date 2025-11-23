import React, { ReactNode, useMemo, useState } from "react";
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COUNTRY_OPTIONS, CountryOption } from "../../utils/locationData";
import { colors } from "../../styles/colors";
import { spacing } from "../../styles/spacing";
import { radii } from "../../styles/dimens";
import { typography } from "../../styles/typography";

export type CountrySelectorProps = {
    selectedCode: string;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    onSelect: (code: string) => void;
    title?: string;
    showCallingCode?: boolean;
    renderTrigger?: (args: {
        selectedCountry: CountryOption;
        onPress: () => void;
    }) => ReactNode;
};

const CountrySelector: React.FC<CountrySelectorProps> = ({
                                                             selectedCode,
                                                             isOpen,
                                                             onOpen,
                                                             onClose,
                                                             onSelect,
                                                             title = "Choose a country",
                                                             showCallingCode = true,
                                                             renderTrigger,
                                                         }) => {
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        if (!query.trim()) return COUNTRY_OPTIONS;
        const q = query.trim().toLowerCase();
        return COUNTRY_OPTIONS.filter((country) =>
            country.name.toLowerCase().includes(q) ||
            country.code.toLowerCase().includes(q) ||
            country.callingCode.replace("+", "").includes(q)
        );
    }, [query]);

    const selectedCountry = useMemo(
        () =>
            COUNTRY_OPTIONS.find((country) => country.code === selectedCode) ||
            COUNTRY_OPTIONS[0],
        [selectedCode]
    );

    const handleOpen = () => {
        setQuery("");
        onOpen();
    };

    const trigger = renderTrigger ? (
        renderTrigger({ selectedCountry, onPress: handleOpen })
    ) : (
        <TouchableOpacity style={styles.selector} onPress={handleOpen}>
            <Text style={styles.flag}>{selectedCountry.flag}</Text>
            <Text style={styles.code}>
                {showCallingCode ? selectedCountry.callingCode : selectedCountry.name}
            </Text>
            <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
        </TouchableOpacity>
    );

    return (
        <>
            {trigger}

            <Modal visible={Boolean(isOpen)} animationType="slide" transparent>
                <View style={styles.overlay}>
                    <View style={styles.modal}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{title}</Text>
                            <TouchableOpacity onPress={onClose}>
                                <Ionicons
                                    name="close"
                                    size={20}
                                    color={colors.textPrimary}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.searchBar}>
                            <Ionicons
                                name="search"
                                size={16}
                                color={colors.textMuted}
                            />
                            <TextInput
                                placeholder="Search by country or code"
                                placeholderTextColor={colors.textMuted}
                                style={styles.searchInput}
                                value={query}
                                onChangeText={setQuery}
                            />
                        </View>
                        <FlatList
                            data={filtered}
                            keyExtractor={(item) => item.code}
                            renderItem={({ item }) => {
                                const isSelected = item.code === selectedCode;
                                return (
                                    <TouchableOpacity
                                        style={[
                                            styles.row,
                                            isSelected && styles.rowSelected,
                                        ]}
                                        onPress={() => onSelect(item.code)}
                                    >
                                        <Text style={styles.flag}>
                                            {item.flag}
                                        </Text>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.countryName}>
                                                {item.name}
                                            </Text>
                                            <Text style={styles.countryMeta}>
                                                {item.code}
                                            </Text>
                                        </View>
                                        {showCallingCode && (
                                            <Text style={styles.calling}>
                                                {item.callingCode}
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                );
                            }}
                            ItemSeparatorComponent={() => (
                                <View style={styles.separator} />
                            )}
                            contentContainerStyle={{
                                paddingBottom: spacing.enormous,
                            }}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    selector: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: 103,
        height: 50,
        borderRadius: radii.md,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.white,
        paddingHorizontal: spacing.xxl,
    },
    flag: {
        fontSize: 18,
    },
    code: {
        flex: 1,
        marginLeft: spacing.md,
        ...typography.label,
    },
    overlay: {
        flex: 1,
        backgroundColor: colors.overlay,
        justifyContent: "flex-end",
    },
    modal: {
        backgroundColor: colors.white,
        padding: spacing.xxl,
        borderTopLeftRadius: radii.xxl,
        borderTopRightRadius: radii.xxl,
        maxHeight: "75%",
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: spacing.lg,
    },
    modalTitle: {
        ...typography.label,
        fontWeight: "800",
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
        backgroundColor: colors.borderMuted,
        borderRadius: radii.md,
        paddingHorizontal: spacing.xxl,
        paddingVertical: spacing.xxl,
        marginBottom: spacing.lg,
    },
    searchInput: {
        flex: 1,
        color: colors.textPrimary,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xl,
        paddingVertical: spacing.xxl,
        paddingHorizontal: spacing.lg,
        borderRadius: radii.md,
    },
    rowSelected: {
        backgroundColor: colors.highlight,
    },
    separator: {
        height: 1,
        backgroundColor: colors.borderMuted,
    },
    countryName: {
        ...typography.label,
        fontWeight: "700",
    },
    countryMeta: {
        ...typography.helper,
        color: colors.textSecondary,
    },
    calling: {
        ...typography.label,
        fontWeight: "700",
    },
});

export default CountrySelector;
