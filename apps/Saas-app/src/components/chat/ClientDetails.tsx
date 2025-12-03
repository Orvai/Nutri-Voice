import { View, Text, Image } from "react-native";

export default function ClientDetails({ conversation }) {
  if (!conversation) return null;

  return (
    <View
      style={{
        width: 300,
        backgroundColor: "#fff",
        borderRightWidth: 1,
        borderRightColor: "#e5e7eb",
        padding: 20,
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* פרופיל */}
      <View style={{ flexDirection: "row-reverse", alignItems: "center" }}>
        <Image
          source={{ uri: conversation.avatar }}
          style={{ width: 60, height: 60, borderRadius: 30, marginLeft: 12 }}
        />
        <View>
          <Text style={{ fontSize: 18, fontWeight: "700", textAlign: "right" }}>
            {conversation.name}
          </Text>
          <Text style={{ fontSize: 13, color: "#6b7280", textAlign: "right" }}>
            לקוח פעיל
          </Text>
        </View>
      </View>

      {/* מידע ופרטים נוספים */}
      <View style={{ gap: 6 }}>
        <Text style={{ textAlign: "right" }}>דוא״ל: example@gmail.com</Text>
        <Text style={{ textAlign: "right" }}>טלפון: 050-1234567</Text>
        <Text style={{ textAlign: "right" }}>משקל: 78 ק״ג</Text>
        <Text style={{ textAlign: "right" }}>יעד: ירידה במשקל</Text>
      </View>

      {/* כפתור */}
      <View
        style={{
          marginTop: 20,
          backgroundColor: "#2563eb",
          paddingVertical: 12,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "700" }}>
          צפה בפרופיל מלא
        </Text>
      </View>
    </View>
  );
}
