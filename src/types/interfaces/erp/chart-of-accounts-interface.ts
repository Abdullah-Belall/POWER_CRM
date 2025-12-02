import { AccAnalyticEnum, AccNatureEnum, AccReportEnum, AccTypeEnum } from "@/types/enums/erp/acc-enums";
import { FlagInterface } from "./flag-interface";
import { CurrencyInterface } from "./currencies-interface";

export interface ChartOfAccountsInterface {
  id: string;
  tenant_id: string;
  flags: FlagInterface[];
  currencies: CurrencyInterface[]
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
  acc_analy: AccAnalyticEnum;
  acc_type: AccTypeEnum;
  acc_rep: AccReportEnum;
  acc_nat: AccNatureEnum;
  created_at: Date;
  updated_at: Date;
}