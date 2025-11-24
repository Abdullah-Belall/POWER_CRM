import { UserInterface } from "./common-interfaces";

export interface TenantInterface {
  tenant_id: string;
  index: number;
  domain: string;
  company_title: string;
  company_logo: string;
  chat_ids: TelegramInterface[];
  phone: string;
  is_active: boolean;
  created_at: Date;
}

export interface TelegramInterface {
  id: string;
  chat_id: string;
  user: UserInterface;
  active: boolean;
  created_at: Date;
}