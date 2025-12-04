import { ScrollView, View, Text } from "react-native";
import { useState, useMemo } from "react";

import ClientsSearchBar from "../../../src/components/clients/ClientSearchBar";
import ClientsList from "../../../src/components/clients/ClientsList";

import { useClients } from "../../../src/hooks/useClients";

export default function ClientsScreen() {
  const { data, isLoading, error } = useClients();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return (data ?? []).filter((c) => {
      return (
        !query ||
        c.name.includes(query) ||
        c.phone.includes(query)
      );
    });
  }, [data, query]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f3f4f6" }}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* Titles */}
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 6 }}>
        לקוחות
      </Text>

      <Text style={{ color: "#6b7280", marginBottom: 20 }}>
        ניהול ומעקב אחר כל הלקוחות שלך
      </Text>

      {/* Search */}
      <ClientsSearchBar query={query} onChange={setQuery} />

      {/* Loading / Error */}
      {isLoading && <Text style={{ marginTop: 20 }}>טוען נתונים...</Text>}
      {error && (
        <Text style={{ marginTop: 20, color: "red" }}>{error.message}</Text>
      )}

      {/* List */}
      {!isLoading && !error && <ClientsList clients={filtered} />}
    </ScrollView>
  );
}
