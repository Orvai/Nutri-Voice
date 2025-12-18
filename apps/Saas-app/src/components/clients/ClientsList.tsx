import ClientCard from "./ClientCard";
import { View } from "react-native";
import { ClientExtended } from "../../types/client";
import { styles } from "./styles/ClientsList.styles";

type ClientsListProps = {
  clients: ClientExtended[];
};

export default function ClientsList({ clients }: ClientsListProps) {
  return (
    <View style={styles.container}>
      {clients.map((c) => (
        <ClientCard key={c.id} client={c} />
      ))}
    </View>
  );
}