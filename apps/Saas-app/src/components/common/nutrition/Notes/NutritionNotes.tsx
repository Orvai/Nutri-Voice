import { View, Text, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

interface Props {
  notes: string[];
  onAdd: (text: string) => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, text: string) => void;
}

export default function NutritionNotes({
  notes,
  onAdd,
  onRemove,
  onUpdate,
}: Props) {
  const [newNote, setNewNote] = useState("");

  return (
    <View
      style={{
        backgroundColor: "#fefce8",
        borderColor: "#fef08a",
        borderWidth: 1,
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
      }}
    >
      <View
        style={{
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 6 }}>
          <Ionicons name="create-outline" size={18} color="#ca8a04" />
          <Text style={{ fontWeight: "700", color: "#ca8a04" }}>הערות</Text>
        </View>
      </View>

      {/* List of notes */}
      {notes.map((note, index) => (
        <View
          key={index}
          style={{
            flexDirection: "row-reverse",
            alignItems: "center",
            gap: 10,
            backgroundColor: "white",
            padding: 8,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#fde68a",
            marginBottom: 8,
          }}
        >
          <TextInput
            value={note}
            onChangeText={(t) => onUpdate(index, t)}
            style={{
              flex: 1,
              fontSize: 14,
              textAlign: "right",
            }}
          />

          <Pressable onPress={() => onRemove(index)}>
            <Ionicons name="trash-outline" size={20} color="#dc2626" />
          </Pressable>
        </View>
      ))}

      {/* Add new note */}
      <View style={{ flexDirection: "row-reverse", gap: 8 }}>
        <TextInput
          value={newNote}
          onChangeText={setNewNote}
          placeholder="הוסף הערה..."
          style={{
            flex: 1,
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: "#facc15",
            borderRadius: 8,
            padding: 8,
            textAlign: "right",
          }}
        />

        <Pressable
          onPress={() => {
            if (!newNote.trim()) return;
            onAdd(newNote);
            setNewNote("");
          }}
          style={{
            backgroundColor: "#facc15",
            paddingHorizontal: 12,
            justifyContent: "center",
            borderRadius: 8,
          }}
        >
          <Ionicons name="add" size={18} color="white" />
        </Pressable>
      </View>
    </View>
  );
}
