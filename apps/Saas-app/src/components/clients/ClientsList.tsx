import ClientCard from "./ClientCard";
import { View } from "react-native";

export default function ClientsList({ clients }) {
  return (
    <View style={{ marginTop: 10 }}>
      {clients.map((c) => (
        <ClientCard key={c.id} client={c} />
      ))}
    </View>
  );
}
