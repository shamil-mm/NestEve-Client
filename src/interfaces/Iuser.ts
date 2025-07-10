export interface IUser  {
    name: string;
    email: string;
    avatarUrl?:string|null;
    role?: "user" | "admin" | "organizer";
    organizationName?: string | null;
    is_block: boolean;
  }
  