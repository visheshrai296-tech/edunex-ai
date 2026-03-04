export interface EduNexUser {
  uid: string;
  name: string;
  email: string;
  photo?: string;
  role: "student" | "admin";
  course?: string;
  phone?: string;
  age?: string;
  bio?: string;
  createdAt?: any;
  updatedAt?: any;
}