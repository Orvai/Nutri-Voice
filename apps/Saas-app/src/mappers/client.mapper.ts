import { ClientListItemDto } from "../../../common/api/sdk/schemas";
import { ClientExtended } from "../types/client";

export function buildClient(c: ClientListItemDto): ClientExtended {
  const safeName = (c.name ?? "").trim();
  const [derivedFirstName, ...derivedLastNameParts] = safeName.split(" ").filter(Boolean);
  const derivedLastName = derivedLastNameParts.join(" ").trim();

  return {
    id: c.id,
    name: c.name,
    firstName: c.firstName?.trim() || derivedFirstName || "",
    lastName: c.lastName?.trim() || derivedLastName || "",
    status: c.status ?? "active",
    phone: c.phone ?? "",
    email: c.email ?? "",
    profileImageUrl: c.profileImageUrl ?? null,
    gender: c.gender ?? null,
    age: c.age ?? null,
    height: c.height ?? null,
    weight: c.weight ?? null,
    goals: c.goals ? String(c.goals) : null,
    activityLevel: c.activityLevel ? String(c.activityLevel) : null,
    creationDate: c.creationDate ?? null,
    address: c.address ?? null,
    city: c.city ?? null,
  };
}
