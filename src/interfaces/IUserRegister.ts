export interface UserRegisterProps {
    onRegister: (formData:{name:string,email:string;password:string,role:"organizer" | "user" | null}) => void;
  }
export interface OrganizerRegisterProps {
    onRegister: (formData:{name:string,email:string;password:string,role:"organizer" | "user" | null ,organizationName:string}) => void;
  }