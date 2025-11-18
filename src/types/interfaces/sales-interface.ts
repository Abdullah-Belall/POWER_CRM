import { ContractStatusEnum } from "../enums/contract-status-enum";
import { DiscussionStatusEnum } from "../enums/discussion-status-enums";
import { PotentialCustomerStatusEnum } from "../enums/potential-customers-enums";
import { UserInterface } from "./common-interfaces";

export interface PotentialCustomerInterface {
  id: string;
  assigner: UserInterface;
  saler: UserInterface;
  index: number;
  status: PotentialCustomerStatusEnum;
  name: string;
  phone: string;
  company: string;
  note: string;
  created_at: Date;
}

export interface DiscussionInterface {
  id: string;
  index: number;
  discussant: UserInterface;
  customer: UserInterface;
  details: string;
  status: DiscussionStatusEnum;
  created_at: Date;
}

export interface ContractInterface {
  id: string;
  index: number;
  status_history: ContractStatusInterface[];
  services: ServiceInterface[];
  systems: SystemsContractInterface[];
  customer: PotentialCustomerInterface;
  curr_status: ContractStatusEnum;
  discount: number;
  vat: number;
  w_tax: number;
  total_price: number;
  created_at: Date;
}

export interface ContractStatusInterface {
  id: string;
  index: number;
  status: ContractStatusEnum;
  created_at: Date;
}

export interface SystemsContractInterface {
  id: string;
  system: SystemInterface;
  services: SystemContractsServiceInterface[];
  created_at: Date;
}

export interface SystemInterface {
  id: string;
  // features: SystemFeaturesEntity[];
  name: string;
  desc: string;
  price: number;
  created_at: Date;
  updated_at: Date;
}

export interface SystemContractsServiceInterface {
  id: string;
  service: ServiceInterface;
  created_at: Date;
}

export interface ServiceInterface {
  id: string;
  title: string;
  desc: string;
  price: number;
  created_at: Date;
}
