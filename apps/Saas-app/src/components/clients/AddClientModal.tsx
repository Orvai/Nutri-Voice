import { useMemo, useState } from "react";
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
import { useCreateClient } from "@/hooks/clients/useCreateClient";
import type { CreateClientPayload } from "@/hooks/clients/useCreateClient";
import { styles } from "./styles/AddClientModal.styles";

type AddClientModalProps = {
  visible: boolean;
  onClose: () => void;
};

type CreateClientForm = CreateClientPayload & {
  gender: string;
};

const EMAIL_USERNAME_REGEX = /^[A-Za-z][A-Za-z0-9._+-]{2,29}$/;

function generateTemporaryPassword() {
  const randomSegment = Math.random().toString(36).slice(2, 8);
  return `Ntr!${randomSegment}9A`;
}

function createInitialForm(): CreateClientForm {
  return {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: generateTemporaryPassword(),
    gender: "",
  };
}

function extractApiErrorMessage(error: unknown) {
  if (!error || typeof error !== "object") {
    return "לא הצלחנו ליצור לקוח חדש.";
  }

  const maybeError = error as {
    message?: string;
    response?: {
      data?: {
        error?: {
          message?: string;
          code?: string;
          details?: Array<{ message?: string; path?: Array<string | number> }>;
        };
      } | unknown;
    };
  };

  const responseData = maybeError.response?.data;
  if (typeof responseData === "string" && responseData.trim().length > 0) {
    return responseData;
  }

  if (responseData && typeof responseData === "object") {
    const backendError = (responseData as { error?: unknown }).error;
    if (backendError && typeof backendError === "object") {
      const details = (backendError as { details?: unknown }).details;
      if (Array.isArray(details) && details.length > 0) {
        const firstDetail = details[0];
        if (firstDetail && typeof firstDetail === "object") {
          const firstMessage = (firstDetail as { message?: unknown }).message;
          if (typeof firstMessage === "string" && firstMessage.trim().length > 0) {
            return firstMessage;
          }
        }
      }

      const backendMessage = (backendError as { message?: unknown }).message;
      if (typeof backendMessage === "string" && backendMessage.trim().length > 0) {
        return backendMessage;
      }
    }

    const maybeMessage = (responseData as { message?: unknown }).message;
    if (typeof maybeMessage === "string" && maybeMessage.trim().length > 0) {
      return maybeMessage;
    }
  }

  if (typeof maybeError.message === "string" && maybeError.message.trim().length > 0) {
    return maybeError.message;
  }

  return "לא הצלחנו ליצור לקוח חדש.";
}

function validateClientForm(form: CreateClientForm) {
  const firstName = form.firstName.trim();
  if (!firstName) {
    return "יש להזין שם פרטי.";
  }

  const lastName = form.lastName.trim();
  if (!lastName) {
    return "יש להזין שם משפחה.";
  }

  const phone = form.phone.trim();
  if (phone.length < 4) {
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

  const password = form.password;
  if (password.length < 8) {
    return "הסיסמה הזמנית חייבת להכיל לפחות 8 תווים.";
  }

  if (!/[a-z]/.test(password)) {
    return "הסיסמה חייבת להכיל לפחות אות קטנה אחת.";
  }

  if (!/[A-Z]/.test(password)) {
    return "הסיסמה חייבת להכיל לפחות אות גדולה אחת.";
  }

  if (!/\d/.test(password)) {
    return "הסיסמה חייבת להכיל לפחות ספרה אחת.";
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return "הסיסמה חייבת להכיל לפחות תו מיוחד אחד.";
  }

  if (!form.gender.trim()) {
    return "יש לבחור מגדר.";
  }

  return null;
}

function extractRegisteredUserId(response: unknown) {
  if (!response || typeof response !== "object") {
    return null;
  }

  const topLevelId = (response as { id?: unknown }).id;
  if (typeof topLevelId === "string" && topLevelId.trim().length > 0) {
    return topLevelId;
  }

  const nestedId = (response as { data?: { id?: unknown } }).data?.id;
  if (typeof nestedId === "string" && nestedId.trim().length > 0) {
    return nestedId;
  }

  return null;
}

export default function AddClientModal({ visible, onClose }: AddClientModalProps) {
  const createClient = useCreateClient();
  const [form, setForm] = useState<CreateClientForm>(createInitialForm);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSubmitDisabled = useMemo(() => {
    return (
      createClient.isPending ||
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.phone.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.gender.trim()
    );
  }, [createClient.isPending, form]);

  function updateField<K extends keyof CreateClientForm>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleClose() {
    setForm(createInitialForm());
    setErrorMessage(null);
    onClose();
  }

  async function handleSubmit() {
    setErrorMessage(null);

    const validationMessage = validateClientForm(form);
    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    try {
      const registerResult = await createClient.mutateAsync({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      const userId = extractRegisteredUserId(registerResult);
      if (!userId) {
        throw new Error("הלקוח נוצר אבל לא התקבל מזהה משתמש לעדכון הפרטים.");
      }

      await putApiUsersIdInfo(userId, {
        gender: form.gender,
      });

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
            <Text style={styles.title}>הוספת לקוח חדש</Text>
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
                <Text style={styles.label}>סיסמה זמנית</Text>
                <TextInput
                  value={form.password}
                  onChangeText={(value) => updateField("password", value)}
                  placeholder="בחר סיסמה התחלתית"
                  autoCapitalize="none"
                  style={styles.input}
                />
                <View style={styles.passwordHintRow}>
                  <Text style={styles.passwordHint}>
                    אפשר למסור ללקוח סיסמה זו ולהחליף אחר כך.
                  </Text>
                  <Pressable
                    style={styles.regenPasswordBtn}
                    onPress={() => updateField("password", generateTemporaryPassword())}
                  >
                    <Text style={styles.regenPasswordText}>יצירת סיסמה</Text>
                  </Pressable>
                </View>
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
              {createClient.isPending ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.primaryBtnText}>הוספת לקוח</Text>
              )}
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
