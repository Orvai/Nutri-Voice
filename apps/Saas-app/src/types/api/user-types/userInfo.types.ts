export interface UserInfo {
    id: string;
    userId: string;
    status: "active" | "deleted" | "archived";
  
    // User information fields
    dateOfBirth: string | null;
    gender: string | null;
    address: string | null;
    city: string | null;
    profileImageUrl: string | null;
    height: number | null;
    age: number | null;
  
    // Metadata
    createdAt: string;
    updatedAt: string;
  }
  