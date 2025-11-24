import { LangsEnum } from "../enums/common-enums";

export interface UserInterface {
  id: string;
  index: number;
  user_name: string;
  password: string;
  phone: string;
  email: string;
  role: RoleInterface;
  chat_id: {
    id: string;
    chat_id: string;
  };
  lang: LangsEnum;
  created_at: Date;
}

export interface RoleInterface {
  id: string;
  tenant_id: string;
  users: UserInterface[];
  users_count?: number;
  name: string;
  code: number;
  roles: string[];
  created_at: Date;
  updated_at: Date;
}