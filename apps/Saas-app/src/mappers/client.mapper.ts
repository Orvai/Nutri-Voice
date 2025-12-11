// src/mappers/client.mapper.ts
import { paths } from "../../../common/api/types/generated";
import { ClientExtended } from "../types/client";

// 🎯 נגדיר כאן את ה-API response type
export type ClientsApiResponse =
  paths["/api/clients"]["get"]["responses"]["200"]["content"]["application/json"];

// 🎯 נשתמש בו במיפוי עצמו
export function buildClient(
  c: ClientsApiResponse["data"][0]
): ClientExtended {
  return {
    id: c.id,
    name: c.name,
    phone: c.phone ?? "",
    email: c.email ?? "",
    profileImageUrl: c.profileImageUrl ?? null,
    gender: c.gender ?? null,
    age: c.age ?? null,
    height: c.height ?? null,
    weight: c.weight ?? null,
    goals: (c.goals as string) ?? null,
    activityLevel: (c.activityLevel as string) ?? null,
    creationDate: c.creationDate ?? null,
    address: c.address ?? null,
    city: c.city ?? null,
  };
}
