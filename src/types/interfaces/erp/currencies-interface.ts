import { CurrencyTypeEnum } from "@/types/enums/erp/currency-enum";

export interface CurrencyInterface {
  id: string;
  index: number;
  created_by: string;
  updated_by: string;
  ar_name: string;
  en_name: string;
  symbol: string;
  ar_change: string;
  en_change: string;
  type: CurrencyTypeEnum;
  is_stock_currency: boolean;
  rate: number;
  max_exchange_limit: number;
  min_exchange_limit: number;
  created_at: Date;
  updated_at: Date;
}