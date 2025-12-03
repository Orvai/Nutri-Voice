export type LoginResponse = {
    accessToken: string;
    user: {
      id: string;
      email: string;
      role: "coach" | "client";
      firstName: string;
      lastName: string;
      imageUrl?: string | null;
    };
  };
  export type UserProfile = {
    id: string;
    email: string;
    role: "coach" | "client";
    firstName: string;
    lastName: string;
    phone?: string | null;
    imageUrl?: string | null;
  };