import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { NeonButton } from "@/components/ui/NeonButton";
import type { NutritionProduct } from "@/types/nutrition/nutrition.ui";
import { colors } from "@/constants/colors";
import { radius, spacing } from "@/constants/layout";

type ProductPickerModalProps = {
  visible: boolean;
  mealName: string;
  products: NutritionProduct[];
  selectedProductId: string;
  grams: number;
  onSelectProduct: (productId: string) => void;
  onChangeGrams: (grams: number) => void;
  onClose: () => void;
  onConfirm: () => void;
};

export function ProductPickerModal({
  visible,
  mealName,
  products,
  selectedProductId,
  grams,
  onSelectProduct,
  onChangeGrams,
  onClose,
  onConfirm
}: ProductPickerModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => null}>
          <Text style={styles.title}>בחירת מוצר · {mealName}</Text>

          <View style={styles.productList}>
            {products.map((product) => (
              <Pressable
                key={product.id}
                style={[
                  styles.productRow,
                  selectedProductId === product.id && styles.productRowSelected
                ]}
                onPress={() => onSelectProduct(product.id)}
              >
                <Text
                  style={[
                    styles.productName,
                    selectedProductId === product.id && styles.productNameSelected
                  ]}
                >
                  {product.name}
                </Text>
                <Text style={styles.productMeta}>{product.caloriesPer100g} קל׳ ל-100ג׳</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.gramsEditor}>
            <Pressable
              style={styles.gramControl}
              onPress={() => onChangeGrams(Math.max(25, grams - 25))}
            >
              <Text style={styles.gramControlText}>-25</Text>
            </Pressable>
            <Text style={styles.gramsValue}>{grams} גרם</Text>
            <Pressable style={styles.gramControl} onPress={() => onChangeGrams(grams + 25)}>
              <Text style={styles.gramControlText}>+25</Text>
            </Pressable>
          </View>

          <View style={styles.actions}>
            <NeonButton label="אישור" onPress={onConfirm} />
            <NeonButton label="ביטול" onPress={onClose} variant="secondary" />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end"
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md
  },
  title: {
    color: colors.white,
    textAlign: "right",
    fontWeight: "700",
    fontSize: 18
  },
  productList: {
    gap: spacing.xs,
    maxHeight: 220
  },
  productRow: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    backgroundColor: colors.surfaceElevated,
    gap: 2
  },
  productRowSelected: {
    borderColor: colors.neon,
    backgroundColor: colors.neonSoft
  },
  productName: {
    color: colors.white,
    textAlign: "right",
    fontSize: 14,
    fontWeight: "600"
  },
  productNameSelected: {
    color: colors.neon
  },
  productMeta: {
    color: colors.textSecondary,
    textAlign: "right",
    fontSize: 12
  },
  gramsEditor: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center"
  },
  gramControl: {
    minWidth: 70,
    minHeight: 40,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    justifyContent: "center",
    alignItems: "center"
  },
  gramControlText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700"
  },
  gramsValue: {
    color: colors.neon,
    fontSize: 16,
    fontWeight: "700"
  },
  actions: {
    gap: spacing.xs
  }
});
