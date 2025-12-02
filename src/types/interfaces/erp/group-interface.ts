import { AccAnalyticEnum } from "@/types/enums/erp/acc-enums";
import { ChartOfAccountsInterface } from "./chart-of-accounts-interface";

export interface GroupSettingInterface {
  id: string;
  tenant_id: string;
  index: number;
  account: ChartOfAccountsInterface;
  created_by: string;
  updated_by: string;
  ar_name: string;
  en_name: string;
  type: AccAnalyticEnum;
  notes: string;
  is_stopped: boolean;
  created_at: Date;
  updated_at: Date;
}