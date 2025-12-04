import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  Pressable,
} from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;

  // Called when user submits a NEW supplement
  onSubmit: (data: { name: string; description?: string }) => void;
}

export default function SupplementCreateModal({
  visible,
  onClose,
  onSubmit,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const reset = () => {
    setName("");
    setDescription("");
  };

  const handleSubmit = () => {
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      description: description.trim(),
    });

    reset();
    onClose();
  };

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
          }}
        >
          <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 12 }}>
            הוסף תוסף חדש
          </Text>

          <TextInput
            placeholder="שם התוסף"
            value={name}
            onChangeText={setName}
            style={{
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 8,
              padding: 10,
              marginBottom: 12,
              textAlign: "right",
            }}
          />

          <TextInput
            placeholder="תיאור (לא חובה)"
            value={description}
            onChangeText={setDescription}
            multiline
            style={{
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 8,
              padding: 10,
              height: 80,
              marginBottom: 20,
              textAlign: "right",
            }}
          />

          <View
            style={{
              flexDirection: "row-reverse",
              justifyContent: "flex-end",
              gap: 14,
            }}
          >
            <Pressable onPress={onClose}>
              <Text style={{ fontWeight: "600", color: "#6b7280" }}>ביטול</Text>
            </Pressable>

            <Pressable
              onPress={handleSubmit}
              style={{
                backgroundColor: "#0f766e",
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>הוסף</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
