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

export interface TenantBranchInterface {
  id: string;
  index: number;
  tenant: TenantInterface;
  ar_name: string;
  en_name: string;
  country: string;
  state: string;
  city: string;
  address_details: string;
  tax_id: string;
  tax_registry: string;
  logo: string;
  tax_branch_code: string;
  user_num: number;
  password: string;
  OS: string;
  version: string;
  serial: string;
  created_at: Date;
  updated_at: Date;
}

export interface TelegramInterface {
  id: string;
  chat_id: string;
  user: UserInterface;
  active: boolean;
  created_at: Date;
}