import ClientCard from "./ClientCard";
import { View } from "react-native";
import { ClientExtended } from "../../types/client";

type ClientsListProps = {
  clients: ClientExtended[];
};

export default function ClientsList({ clients }: ClientsListProps) {
  return (
    <View style={{ marginTop: 10 }}>
      {clients.map((c) => (
        <ClientCard key={c.id} client={c} />
      ))}
    </View>
  );
}