export type UserRole = 'admin' | 'normal';

export interface User {
  id : string;
  name: string;
  email: string;
  password: string;
  phone ? : string,
  address ? : string,
  avatarUrl?: string;
  role: UserRole;
  createdAt: Date;
}
