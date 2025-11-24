import { ClientComplaintInterface } from "./complaints-clients-interface";

export interface ManagerComplaintInterface extends ClientComplaintInterface {
  image1: string;
  image2: string;
  intervention_date: null;
  curr_supporter_id: string;
  client: {
    id: string;
    user_name: string;
    index: number
  };
  solving: ComplaintSolvingInterface[];
}

export interface ComplaintSolvingInterface {
  id: string;
  index: number;
  supporter: {
    id: string;
    index: number;
    user_name: string;
  };
  accept_status: string;
  intervention_date: Date | null;
  choice_taked_at: Date;
  created_at: Date;
}