import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import NutritionDayCard from "../../nutrition/NutritionDayCard";

export default function PlansList({ plans, onCreate }) {
  // אתה עובד עם MOCK ולכן יש תמיד ARR של תכנית אחת
  const plan = plans[0];

  const [openTraining, setOpenTraining] = useState(false);
  const [openRest, setOpenRest] = useState(false);

  return (
    <View style={{ padding: 20 }}>
      <Text
        style={{
          fontSize: 22,
          fontWeight: "700",
          marginBottom: 20,
          textAlign: "right",
        }}
      >
        תוכניות תזונה של הלקוח
      </Text>

      {/* תפריט יום אימון */}
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#e5e7eb",
          padding: 16,
          marginBottom: 16,
        }}
      >
        <Pressable onPress={() => setOpenTraining((p) => !p)}>
          <Text style={{ fontSize: 18, fontWeight: "600", textAlign: "right" }}>
            תפריט יום אימון
          </Text>
        </Pressable>

        {openTraining && (
          <View style={{ marginTop: 20 }}>
            <NutritionDayCard plan={plan.trainingDay} />

            <Pressable
              onPress={() => setOpenTraining(false)}
              style={{
                marginTop: 12,
                paddingVertical: 10,
                borderRadius: 8,
                backgroundColor: "#e5e7eb",
              }}
            >
              <Text style={{ textAlign: "center" }}>סגור</Text>
            </Pressable>

            <Pressable
              style={{
                backgroundColor: "#10b981",
                paddingVertical: 12,
                borderRadius: 8,
                marginTop: 12,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "white",
                  fontWeight: "700",
                }}
              >
                שמור שינויים
              </Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* תפריט יום ללא אימון */}
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#e5e7eb",
          padding: 16,
        }}
      >
        <Pressable onPress={() => setOpenRest((p) => !p)}>
          <Text style={{ fontSize: 18, fontWeight: "600", textAlign: "right" }}>
            תפריט יום ללא אימון
          </Text>
        </Pressable>

        {openRest && (
          <View style={{ marginTop: 20 }}>
            <NutritionDayCard plan={plan.restDay} />

            <Pressable
              onPress={() => setOpenRest(false)}
              style={{
                marginTop: 12,
                paddingVertical: 10,
                borderRadius: 8,
                backgroundColor: "#e5e7eb",
              }}
            >
              <Text style={{ textAlign: "center" }}>סגור</Text>
            </Pressable>

            <Pressable
              style={{
                backgroundColor: "#10b981",
                paddingVertical: 12,
                borderRadius: 8,
                marginTop: 12,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "white",
                  fontWeight: "700",
                }}
              >
                שמור שינויים
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}
