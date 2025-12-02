import { AccTypeEnum } from "@/types/enums/erp/acc-enums";


export interface CSAPInterface {
  id: string;
  acc_type: AccTypeEnum;
  index: number;
  created_by: string;
  updated_by: string;
  deleted_by: string;
  code: string;
  ar_name: string;
  en_name: string;
  level: number;
  parent: CSAPInterface;
  children: CSAPInterface[];
  path: string;
  is_stoped: boolean;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
}