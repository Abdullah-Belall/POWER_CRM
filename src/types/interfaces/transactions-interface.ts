import { ChartOfAccountsInterface } from "./erp/chart-of-accounts-interface";
import { CurrencyInterface } from "./erp/currencies-interface";
import { FlagInterface } from "./erp/flag-interface";
import { FundInterface } from "./funds-interface";

export interface MasterTransactionInterface {
  id: string;
  branch_id: string;
  transactions_dtl: DtlTransactionInterface[];
  flag: FlagInterface;
  created_by: string;
  updated_by: string;
  code: number;
  ref_num: string;
  statement: string;
  recipient_name: string;
  beneficiary_name: string;
  created_at: Date;
  updated_at: Date;
}

export interface DtlTransactionInterface {
  id: string;
  tenant_id: string;
  journal_mst?: MasterTransactionInterface;
  acc: ChartOfAccountsInterface;
  control_acc?: FundInterface;
  currency: CurrencyInterface;
  created_by: string;
  updated_by: string;
  currency_rate: number;
  debit: number;
  credit: number;
  statement: string;
  created_at: Date;
  updated_at: Date;
}