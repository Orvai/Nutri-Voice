import { useState } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import WorkoutPlanCard from "./WorkoutPlanCard";
import WorkoutTemplatesList from "../../workout/WorkoutTemplatesList";

export default function WorkoutPlansList({
  plans,
  templates,
  onCreateFromTemplate,
  onUpdate,
  onDelete,
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <View>
      <Text
        style={{
          fontSize: 22,
          fontWeight: "700",
          marginBottom: 20,
          textAlign: "right",
        }}
      >
        תוכניות אימון של הלקוח
      </Text>

      {plans.map((plan) => (
        <WorkoutPlanCard
          key={plan.id}
          plan={plan}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}

      {/* כפתור יצירת תכנית */}
      <Pressable
        onPress={() => setShowModal(true)}
        style={{
          backgroundColor: "#2563eb",
          paddingVertical: 12,
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontWeight: "700",
          }}
        >
          + צור תוכנית אימון
        </Text>
      </Pressable>

      {/* Modal בחירת תבנית */}
      <Modal visible={showModal} animationType="slide">
        <View style={{ flex: 1, padding: 20 }}>
          <Pressable onPress={() => setShowModal(false)}>
            <Text style={{ textAlign: "right", color: "#2563eb" }}>
              ✕ סגור
            </Text>
          </Pressable>

          <WorkoutTemplatesList
            templates={templates}
            onCreateNew={() => {}}
          />

          {templates.map((template) => (
            <Pressable
              key={template.id}
              onPress={() => {
                onCreateFromTemplate(template);
                setShowModal(false);
              }}
              style={{
                padding: 12,
                borderRadius: 8,
                marginTop: 12,
                backgroundColor: "#e0f2fe",
              }}
            >
              <Text style={{ textAlign: "center", color: "#0284c7" }}>
                בחר {template.name ?? template.workoutType}
              </Text>
            </Pressable>
          ))}
        </View>
      </Modal>
    </View>
  );
}
