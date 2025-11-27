import { FlagInterface } from "./flag-interface";

export interface ChartOfAccountsInterface {
  id: string;
  tenant_id: string;
  flags: FlagInterface[];
  created_by: string;
  updated_by: string;
  code: string;
  ar_name: string;
  en_name: string;
  level: number;
  parent: ChartOfAccountsInterface;
  children: ChartOfAccountsInterface[];
  path: string;
  is_stoped: boolean;
  created_at: Date;
  updated_at: Date;
}