import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useState, useMemo } from "react";
import { colors } from "../../../src/styles/colors";

import ClientsSearchBar from "../../../src/components/clients/ClientSearchBar";
import ClientsList from "../../../src/components/clients/ClientsList";
import AddClientModal from "../../../src/components/clients/AddClientModal";
import EditClientModal from "../../../src/components/clients/EditClientModal";

import { useClients, useUpdateClientStatus } from "@/hooks/clients";
import { ClientExtended } from "@/types/client";

type ClientsStatusTab = "active" | "inactive";

const DELETE_CONFIRMATION_TEXT = "DELETEEE";

function isClientActive(client: ClientExtended) {
  return String(client.status || "active").toLowerCase() === "active";
}

function extractApiErrorMessage(error: unknown) {
  if (!error || typeof error !== "object") {
    return "לא הצלחנו לעדכן את הסטטוס של הלקוח.";
  }

  const maybeError = error as {
    message?: string;
    response?: {
      data?: {
        error?: {
          message?: string;
        };
        message?: string;
      } | string;
    };
  };

  const data = maybeError.response?.data;

  if (typeof data === "string" && data.trim().length > 0) {
    return data;
  }

  if (data && typeof data === "object") {
    const innerErrorMessage = data.error?.message;
    if (typeof innerErrorMessage === "string" && innerErrorMessage.trim().length > 0) {
      return innerErrorMessage;
    }

    if (typeof data.message === "string" && data.message.trim().length > 0) {
      return data.message;
    }
  }

  if (typeof maybeError.message === "string" && maybeError.message.trim().length > 0) {
    return maybeError.message;
  }

  return "לא הצלחנו לעדכן את הסטטוס של הלקוח.";
}

export default function ClientsScreen() {
  const { data, isLoading, error } = useClients({ statusFilter: "all" });
  const updateClientStatus = useUpdateClientStatus();
  const [query, setQuery] = useState("");
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [statusTab, setStatusTab] = useState<ClientsStatusTab>("active");
  const [updatingClientId, setUpdatingClientId] = useState<string | null>(null);
  const [clientPendingDeactivate, setClientPendingDeactivate] =
    useState<ClientExtended | null>(null);
  const [clientPendingEdit, setClientPendingEdit] = useState<ClientExtended | null>(null);
  const [deleteConfirmValue, setDeleteConfirmValue] = useState("");
  const [statusActionError, setStatusActionError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return (data ?? []).filter((c) => {
      const active = isClientActive(c);
      if (statusTab === "active" && !active) {
        return false;
      }
      if (statusTab === "inactive" && active) {
        return false;
      }

      return (
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q)
      );
    });
  }, [data, query, statusTab]);

  const activeCount = useMemo(
    () => (data ?? []).filter((c) => isClientActive(c)).length,
    [data]
  );
  const inactiveCount = useMemo(
    () => (data ?? []).filter((c) => !isClientActive(c)).length,
    [data]
  );

  const errorMessage =
    error instanceof Error ? error.message : "אירעה שגיאה בטעינת הלקוחות";

  const closeDeactivateModal = () => {
    setClientPendingDeactivate(null);
    setDeleteConfirmValue("");
    setStatusActionError(null);
  };

  const requestDeactivate = (client: ClientExtended) => {
    setClientPendingDeactivate(client);
    setDeleteConfirmValue("");
    setStatusActionError(null);
  };

  const confirmDeactivate = async () => {
    if (!clientPendingDeactivate) {
      return;
    }

    if (deleteConfirmValue !== DELETE_CONFIRMATION_TEXT) {
      setStatusActionError("יש להקליד DELETEEE כדי לאשר השבתה.");
      return;
    }

    try {
      setStatusActionError(null);
      setUpdatingClientId(clientPendingDeactivate.id);
      await updateClientStatus.mutateAsync({
        clientId: clientPendingDeactivate.id,
        status: "deleted",
      });
      closeDeactivateModal();
    } catch (statusError) {
      setStatusActionError(extractApiErrorMessage(statusError));
    } finally {
      setUpdatingClientId(null);
    }
  };

  const reactivateClient = async (client: ClientExtended) => {
    try {
      setStatusActionError(null);
      setUpdatingClientId(client.id);
      await updateClientStatus.mutateAsync({
        clientId: client.id,
        status: "active",
      });
    } catch (statusError) {
      setStatusActionError(extractApiErrorMessage(statusError));
    } finally {
      setUpdatingClientId(null);
    }
  };

  const openEditModal = (client: ClientExtended) => {
    setClientPendingEdit(client);
  };

  const closeEditModal = () => {
    setClientPendingEdit(null);
  };

  const canConfirmDeactivate =
    deleteConfirmValue === DELETE_CONFIRMATION_TEXT && !updateClientStatus.isPending;

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.content}
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>לקוחות</Text>
          <Text style={styles.subtitle}>ניהול ומעקב אחר כל הלקוחות שלך</Text>
        </View>
        <Pressable
          style={styles.addClientButton}
          onPress={() => setIsAddClientOpen(true)}
        >
          <Text style={styles.addClientButtonText}>לקוח חדש</Text>
        </Pressable>
      </View>

      <ClientsSearchBar query={query} onChange={setQuery} />

      <View style={styles.statusTabsRow}>
        <Pressable
          style={[
            styles.statusTabButton,
            statusTab === "active" && styles.statusTabButtonActive,
          ]}
          onPress={() => setStatusTab("active")}
        >
          <Text
            style={[
              styles.statusTabText,
              statusTab === "active" && styles.statusTabTextActive,
            ]}
          >
            פעילים ({activeCount})
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.statusTabButton,
            statusTab === "inactive" && styles.statusTabButtonActive,
          ]}
          onPress={() => setStatusTab("inactive")}
        >
          <Text
            style={[
              styles.statusTabText,
              statusTab === "inactive" && styles.statusTabTextActive,
            ]}
          >
            לא פעילים ({inactiveCount})
          </Text>
        </Pressable>
      </View>

      {statusActionError && (
        <Text style={styles.actionErrorText}>{statusActionError}</Text>
      )}

      {isLoading && <Text style={styles.loadingText}>טוען נתונים...</Text>}
      {error && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}

      {!isLoading && !error && (
        <ClientsList
          clients={filtered}
          updatingClientId={updatingClientId}
          onDeactivate={requestDeactivate}
          onReactivate={reactivateClient}
          onEdit={openEditModal}
        />
      )}

      <AddClientModal
        visible={isAddClientOpen}
        onClose={() => setIsAddClientOpen(false)}
      />

      <EditClientModal
        visible={!!clientPendingEdit}
        client={clientPendingEdit}
        onClose={closeEditModal}
      />

      <Modal
        visible={!!clientPendingDeactivate}
        transparent
        animationType="fade"
        onRequestClose={closeDeactivateModal}
      >
        <Pressable style={styles.modalOverlay} onPress={closeDeactivateModal}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>השבתת לקוח</Text>
            <Text style={styles.modalDescription}>
              כדי להשבית את {clientPendingDeactivate?.name || "הלקוח"}, יש להקליד
              {" "}
              <Text style={styles.modalKeyword}>DELETEEE</Text>
            </Text>

            <TextInput
              value={deleteConfirmValue}
              onChangeText={(value) => setDeleteConfirmValue(value.trim())}
              autoCapitalize="characters"
              placeholder="הקלד DELETEEE"
              style={styles.modalInput}
            />

            {statusActionError && (
              <Text style={styles.modalErrorText}>{statusActionError}</Text>
            )}

            <View style={styles.modalFooter}>
              <Pressable style={styles.modalCancelButton} onPress={closeDeactivateModal}>
                <Text style={styles.modalCancelButtonText}>ביטול</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.modalConfirmButton,
                  !canConfirmDeactivate && styles.modalConfirmButtonDisabled,
                ]}
                onPress={confirmDeactivate}
                disabled={!canConfirmDeactivate}
              >
                {updateClientStatus.isPending ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalConfirmButtonText}>השבת</Text>
                )}
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.neutral100,
  },
  content: {
    padding: 20,
  },
  headerRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6,
    color: colors.neutral800,
    textAlign: "right",
  },
  subtitle: {
    color: colors.neutral500,
    marginBottom: 8,
    textAlign: "right",
  },
  addClientButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  addClientButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
  },
  loadingText: {
    marginTop: 20,
    color: colors.neutral700,
    textAlign: "right",
  },
  errorText: {
    marginTop: 20,
    color: colors.danger,
    textAlign: "right",
  },
  actionErrorText: {
    marginBottom: 10,
    color: colors.danger,
    textAlign: "right",
    fontWeight: "600",
  },
  statusTabsRow: {
    flexDirection: "row-reverse",
    gap: 8,
    marginBottom: 12,
  },
  statusTabButton: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.neutral200,
    backgroundColor: colors.white,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  statusTabButtonActive: {
    borderColor: colors.primary,
    backgroundColor: "#eff6ff",
  },
  statusTabText: {
    color: colors.neutral700,
    fontWeight: "700",
    fontSize: 13,
  },
  statusTabTextActive: {
    color: colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(17, 24, 39, 0.45)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.neutral200,
    padding: 16,
  },
  modalTitle: {
    color: colors.neutral800,
    fontSize: 18,
    fontWeight: "800",
    textAlign: "right",
    marginBottom: 8,
  },
  modalDescription: {
    color: colors.neutral700,
    fontSize: 14,
    textAlign: "right",
    lineHeight: 21,
  },
  modalKeyword: {
    color: colors.danger,
    fontWeight: "800",
  },
  modalInput: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlign: "center",
    fontWeight: "700",
    color: colors.neutral800,
    backgroundColor: colors.white,
  },
  modalErrorText: {
    marginTop: 8,
    color: colors.danger,
    textAlign: "right",
    fontSize: 13,
  },
  modalFooter: {
    marginTop: 14,
    flexDirection: "row-reverse",
    gap: 10,
  },
  modalCancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCancelButtonText: {
    color: colors.neutral700,
    fontSize: 14,
    fontWeight: "700",
  },
  modalConfirmButton: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: colors.danger,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalConfirmButtonDisabled: {
    backgroundColor: "#fca5a5",
  },
  modalConfirmButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "800",
  },
});
