import { getMockState, updateMockState } from "@/data/mocks/mockStore";
import { mockRequest } from "@/data/mocks/mockRequest";
import type {
  ForgotPasswordRequestDto,
  ForgotPasswordResponseDto,
  LoginRequestDto,
  LoginResponseDto
} from "@/types/auth/auth.dto";

export async function loginWithEmail(
  payload: LoginRequestDto
): Promise<LoginResponseDto> {
  return mockRequest("auth", () => {
    const email = payload.email.trim().toLowerCase();
    const state = getMockState();

    const user = state.auth.users.find((candidate) => candidate.email === email);
    const expectedPassword = state.auth.passwordsByEmail[email];

    if (!user || expectedPassword !== payload.password) {
      throw new Error("אימייל או סיסמה לא נכונים");
    }

    return {
      user,
      tokens: {
        accessToken: `mock-access-${user.id}`,
        refreshToken: `mock-refresh-${user.id}`,
        expiresInSec: 60 * 60
      }
    };
  });
}

export async function requestPasswordReset(
  payload: ForgotPasswordRequestDto
): Promise<ForgotPasswordResponseDto> {
  return mockRequest("auth", () => {
    const email = payload.email.trim().toLowerCase();
    const state = getMockState();
    const userExists = state.auth.users.some((user) => user.email === email);

    if (!userExists) {
      throw new Error("לא נמצא משתמש עם כתובת האימייל הזו");
    }

    updateMockState((draft) => {
      draft.auth.resetRequests.push(email);
    });

    return {
      message: "שלחנו קישור לאיפוס סיסמה למייל שלך"
    };
  });
}
