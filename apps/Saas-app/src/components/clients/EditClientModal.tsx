import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { putApiUsersIdInfo } from "@common/api/sdk/nutri-api";
import { useUpdateClient } from "@/hooks/clients/useUpdateClient";
import type { ClientExtended } from "@/types/client";
import { styles } from "./styles/EditClientModal.styles";

type EditClientModalProps = {
  visible: boolean;
  client: ClientExtended | null;
  onClose: () => void;
};

type EditClientForm = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  gender: string;
};

const EMAIL_USERNAME_REGEX = /^[A-Za-z][A-Za-z0-9._+-]{2,29}$/;

function createInitialForm(client: ClientExtended | null): EditClientForm {
  return {
    firstName: client?.firstName || "",
    lastName: client?.lastName || "",
    phone: client?.phone || "",
    email: client?.email || "",
    gender: client?.gender || "",
  };
}

function extractApiErrorMessage(error: unknown) {
  if (!error || typeof error !== "object") {
    return "לא הצלחנו לעדכן את פרטי הלקוח.";
  }

  const maybeError = error as {
    message?: string;
    response?: {
      data?: {
        error?: {
          message?: string;
          details?: Array<{ message?: string }>;
        };
        message?: string;
      } | string;
    };
  };

  const responseData = maybeError.response?.data;
  if (typeof responseData === "string" && responseData.trim().length > 0) {
    return responseData;
  }

  if (responseData && typeof responseData === "object") {
    const details = responseData.error?.details;
    if (Array.isArray(details) && details.length > 0) {
      const firstMessage = details[0]?.message;
      if (typeof firstMessage === "string" && firstMessage.trim().length > 0) {
        return firstMessage;
      }
    }

    const backendMessage = responseData.error?.message;
    if (typeof backendMessage === "string" && backendMessage.trim().length > 0) {
      return backendMessage;
    }

    if (typeof responseData.message === "string" && responseData.message.trim().length > 0) {
      return responseData.message;
    }
  }

  if (typeof maybeError.message === "string" && maybeError.message.trim().length > 0) {
    return maybeError.message;
  }

  return "לא הצלחנו לעדכן את פרטי הלקוח.";
}

function validateForm(form: EditClientForm) {
  if (!form.firstName.trim()) {
    return "יש להזין שם פרטי.";
  }

  if (!form.lastName.trim()) {
    return "יש להזין שם משפחה.";
  }

  if (form.phone.trim().length < 4) {
    return "מספר טלפון חייב להכיל לפחות 4 תווים.";
  }

  const email = form.email.trim();
  if (!email.includes("@")) {
    return "יש להזין כתובת אימייל תקינה.";
  }

  const [username] = email.split("@");
  if (!username || !EMAIL_USERNAME_REGEX.test(username)) {
    return "האימייל חייב להתחיל באות ולהכיל רק אותיות, מספרים, נקודה, קו תחתון, פלוס או מקף.";
  }

  return null;
}

export default function EditClientModal({ visible, client, onClose }: EditClientModalProps) {
  const updateClient = useUpdateClient();
  const [form, setForm] = useState<EditClientForm>(createInitialForm(client));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setForm(createInitialForm(client));
      setErrorMessage(null);
    }
  }, [visible, client]);

  const isSubmitDisabled = useMemo(() => {
    return (
      updateClient.isPending ||
      !client ||
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.phone.trim() ||
      !form.email.trim()
    );
  }, [updateClient.isPending, client, form]);

  function updateField<K extends keyof EditClientForm>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleClose() {
    setErrorMessage(null);
    onClose();
  }

  async function handleSubmit() {
    if (!client) {
      return;
    }

    setErrorMessage(null);

    const validationMessage = validateForm(form);
    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    try {
      await updateClient.mutateAsync({
        clientId: client.id,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim().toLowerCase(),
      });

      const prevGender = (client.gender || "").trim();
      const nextGender = form.gender.trim();

      if (nextGender && nextGender !== prevGender) {
        await putApiUsersIdInfo(client.id, {
          gender: nextGender,
        });
      }

      handleClose();
    } catch (error) {
      setErrorMessage(extractApiErrorMessage(error));
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <View style={styles.header}>
            <Text style={styles.title}>עריכת פרטי לקוח</Text>
            <Pressable style={styles.closeButton} onPress={handleClose} hitSlop={10}>
              <Text style={styles.closeButtonText}>×</Text>
            </Pressable>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={styles.content}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>שם פרטי</Text>
                <TextInput
                  value={form.firstName}
                  onChangeText={(value) => updateField("firstName", value)}
                  placeholder="לדוגמה: דניאל"
                  style={styles.input}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>שם משפחה</Text>
                <TextInput
                  value={form.lastName}
                  onChangeText={(value) => updateField("lastName", value)}
                  placeholder="לדוגמה: כהן"
                  style={styles.input}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>טלפון</Text>
                <TextInput
                  value={form.phone}
                  onChangeText={(value) => updateField("phone", value)}
                  placeholder="0501234567"
                  keyboardType="phone-pad"
                  style={styles.input}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>אימייל</Text>
                <TextInput
                  value={form.email}
                  onChangeText={(value) => updateField("email", value)}
                  placeholder="name@example.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={styles.input}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>מגדר</Text>
                <View style={styles.genderRow}>
                  {["זכר", "נקבה", "אחר"].map((genderOption) => {
                    const selected = form.gender === genderOption;
                    return (
                      <Pressable
                        key={genderOption}
                        style={[
                          styles.genderOption,
                          selected && styles.genderOptionSelected,
                        ]}
                        onPress={() => updateField("gender", genderOption)}
                      >
                        <Text
                          style={[
                            styles.genderOptionText,
                            selected && styles.genderOptionTextSelected,
                          ]}
                        >
                          {genderOption}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable style={styles.secondaryBtn} onPress={handleClose}>
              <Text style={styles.secondaryBtnText}>ביטול</Text>
            </Pressable>
            <Pressable
              style={[
                styles.primaryBtn,
                isSubmitDisabled && styles.primaryBtnDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isSubmitDisabled}
            >
              {updateClient.isPending ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.primaryBtnText}>שמירת שינויים</Text>
              )}
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
