import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { ClientExtended } from "../../types/client";
import { styles } from "./styles/ClientCard.styles";

type ClientCardProps = {
  client: ClientExtended;
  isStatusUpdating: boolean;
  onDeactivate: (client: ClientExtended) => void;
  onReactivate: (client: ClientExtended) => void;
};

export default function ClientCard({
  client,
  isStatusUpdating,
  onDeactivate,
  onReactivate,
}: ClientCardProps) {
  const goToProfile = () => {
    router.push({
      pathname: "/(dashboard)/clients/[id]",
      params: { id: client.id },
    });
  };

  const isActive = String(client.status || "active").toLowerCase() === "active";

  const avatarSource =
    client.profileImageUrl
      ? { uri: client.profileImageUrl }
      : {
          uri:
            "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-default.jpg",
        };

  return (
    <Pressable
      onPress={goToProfile}
      style={({ pressed }) => [
        styles.container,
        {
          borderColor: "#e5e7eb",
          opacity: pressed ? 0.8 : 1,
          shadowRadius: pressed ? 6 : 4,
          shadowOpacity: pressed ? 0.1 : 0.06,
          elevation: pressed ? 2 : 1,
        },
      ]}
    >
      <Image source={avatarSource} style={styles.avatar} />

      <View style={styles.infoContainer}>
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              isActive ? styles.statusDotActive : styles.statusDotInactive,
            ]}
          />
          <Text
            style={[
              styles.statusText,
              isActive ? styles.statusTextActive : styles.statusTextInactive,
            ]}
          >
            {isActive ? "פעיל" : "לא פעיל"}
          </Text>
        </View>

        <Text style={styles.name}>
          {client.name || "לא צוין"}
        </Text>

        <Text style={styles.phone}>
          {client.phone || "לא צוין"}
        </Text>

        <View style={styles.actionsRow}>
          {isActive ? (
            <Pressable
              onPress={(event) => {
                event.stopPropagation?.();
                onDeactivate(client);
              }}
              style={[styles.actionButton, styles.deactivateButton]}
              disabled={isStatusUpdating}
            >
              {isStatusUpdating ? (
                <ActivityIndicator size="small" color="#b91c1c" />
              ) : (
                <Text style={[styles.actionButtonText, styles.deactivateButtonText]}>
                  השבת לקוח
                </Text>
              )}
            </Pressable>
          ) : (
            <Pressable
              onPress={(event) => {
                event.stopPropagation?.();
                onReactivate(client);
              }}
              style={[styles.actionButton, styles.reactivateButton]}
              disabled={isStatusUpdating}
            >
              {isStatusUpdating ? (
                <ActivityIndicator size="small" color="#166534" />
              ) : (
                <Text style={[styles.actionButtonText, styles.reactivateButtonText]}>
                  הפעל מחדש
                </Text>
              )}
            </Pressable>
          )}
        </View>
      </View>

      <Text style={styles.viewText}>
        צפה
      </Text>
    </Pressable>
  );
}
