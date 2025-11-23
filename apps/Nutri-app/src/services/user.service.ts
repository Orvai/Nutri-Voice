import { api } from "../lib/api";

const USER_BASE_PATH = "/api/users";

export type UserInformationInput = {
    dateOfBirth: string;
    gender: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    profileImageUrl: string;
};

export async function upsertUserInformation(userId: string, payload: UserInformationInput) {
    const { data } = await api.post(`${USER_BASE_PATH}/${userId}/information`, payload);
    return data;
}
