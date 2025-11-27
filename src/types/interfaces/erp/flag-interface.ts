import { FlagsTypesEnum } from "@/types/enums/erp/flags-enum";

export interface FlagInterface {
  id: string;
  index: number;
  created_by: string;
  updated_by: string;
  type: FlagsTypesEnum;
  be_affected?: boolean;
  ar_name: string;
  en_name: string;
  created_at: Date;
  updated_at: Date;
}