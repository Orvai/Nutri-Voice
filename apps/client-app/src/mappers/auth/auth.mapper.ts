import type { AuthUserDto } from "@/types/auth/auth.dto";
import type { AuthUser } from "@/types/auth/auth.ui";

export const mapAuthUserToUI = (dto: AuthUserDto): AuthUser => ({
  id: dto.id,
  email: dto.email,
  fullName: `${dto.firstName} ${dto.lastName}`.trim(),
  role: dto.role,
  avatarUrl: dto.avatarUrl
});
