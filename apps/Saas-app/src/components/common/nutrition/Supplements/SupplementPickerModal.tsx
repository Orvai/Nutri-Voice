import { useState, useMemo } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  FlatList,
} from "react-native";
import { GlobalSupplement } from "../../../../hooks/nutrition-plan/useSupplementsStore";

interface Props {
  visible: boolean;
  onClose: () => void;

  allSupplements: GlobalSupplement[];
  existingIds: string[];

  onSelect: (id: string) => void;
  onCreateNew: () => void;
}

export default function SupplementPickerModal({
  visible,
  onClose,
  allSupplements,
  existingIds,
  onSelect,
  onCreateNew,
}: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return allSupplements
      .filter((s) => !existingIds.includes(s.id))
      .filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));
  }, [query, allSupplements, existingIds]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.25)",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 12,
            width: "90%",
            maxHeight: "80%",
          }}
        >
          <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 12 }}>
            הוסף תוסף קיים
          </Text>

          <TextInput
            placeholder="חיפוש לפי שם..."
            value={query}
            onChangeText={setQuery}
            style={{
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 8,
              padding: 10,
              marginBottom: 12,
              textAlign: "right",
            }}
          />

          {/* Add new supplement */}
          <Pressable
            onPress={() => {
              onClose();
              onCreateNew();
            }}
            style={{
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#f1f5f9",
              marginBottom: 10,
            }}
          >
            <Text style={{ fontWeight: "600", color: "#0f766e" }}>
              + הוסף תוסף חדש (לא קיים במערכת)
            </Text>
          </Pressable>

          {/* List */}
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: "row-reverse",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: "#f1f5f9",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "600" }}>{item.name}</Text>
                  {item.description ? (
                    <Text style={{ fontSize: 12, color: "#6b7280" }}>
                      {item.description}
                    </Text>
                  ) : null}
                </View>

                <Pressable
                  onPress={() => {
                    onSelect(item.id);
                    onClose();
                  }}
                  style={{
                    backgroundColor: "#0f766e",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "600" }}>הוסף</Text>
                </Pressable>
              </View>
            )}
          />

          <Pressable onPress={onClose} style={{ paddingVertical: 6 }}>
            <Text style={{ color: "#6b7280", fontWeight: "600" }}>סגור</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
