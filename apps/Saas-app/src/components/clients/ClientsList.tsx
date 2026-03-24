import ClientCard from "./ClientCard";
import { View } from "react-native";
import { ClientExtended } from "../../types/client";
import { styles } from "./styles/ClientsList.styles";

type ClientsListProps = {
  clients: ClientExtended[];
  updatingClientId: string | null;
  onDeactivate: (client: ClientExtended) => void;
  onReactivate: (client: ClientExtended) => void;
};

export default function ClientsList({
  clients,
  updatingClientId,
  onDeactivate,
  onReactivate,
}: ClientsListProps) {
  return (
    <View style={styles.container}>
      {clients.map((c) => (
        <ClientCard
          key={c.id}
          client={c}
          isStatusUpdating={updatingClientId === c.id}
          onDeactivate={onDeactivate}
          onReactivate={onReactivate}
        />
      ))}
    </View>
  );
}
