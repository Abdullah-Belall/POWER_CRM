import { AccAnalyticEnum } from "../enums/erp/acc-enums";
import { ChartOfAccountsInterface } from "./erp/chart-of-accounts-interface";
import { CurrencyInterface } from "./erp/currencies-interface";
import { GroupSettingInterface } from "./erp/group-interface";

export interface FundInterface {
  id: string;
  branch_id: string;
  group?: GroupSettingInterface;
  bank_fund?: {
    id: string;
    acc: ChartOfAccountsInterface;
    notes_receivable_acc?: ChartOfAccountsInterface;
    notes_payable_acc?: ChartOfAccountsInterface;
  
    bank_acc_num: number;
    bank_branch: string;
    bank_manager: string;
    bank_employee_phone: string;
    bank_address: string;
    iban: string;
    swift: string;
    created_at: Date;
    updated_at: Date;
  },
  currencies: CurrencyInterface[];
  code: number;
  created_by: string;
  updated_by: string;
  ar_name: string;
  en_name: string;
  cashier: string;
  notes: string;
  type: AccAnalyticEnum;
  created_at: Date;
  updated_at: Date;
}