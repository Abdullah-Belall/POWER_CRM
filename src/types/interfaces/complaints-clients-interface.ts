import { ComplaintPriorityStatusEnum, ComplaintStatusEnum, ScreenViewerEnum } from "../enums/complaints-enums";

export interface ClientComplaintInterface {
  id: string;
  index: null;
  tenant_id: string;
  title: string;
  details: string;
  full_name: string;
  phone: string;
  max_time_to_solve: number | null;
  screen_viewer: ScreenViewerEnum;
  screen_viewer_id: string;
  screen_viewer_password: string | null;
  server_viewer: string;
  server_viewer_id: string;
  server_viewer_password: string | null;
  start_solve_at: Date | null;
  end_solve_at: Date | null;
  status: ComplaintStatusEnum;
  priority_status: ComplaintPriorityStatusEnum;
  accept_excuse: boolean | null;
  intervention_date: Date | null;
  choice_taked_at: Date;
  image1: string;
  image2: string;
  created_at: Date | string;
  updated_at: Date | string;
}