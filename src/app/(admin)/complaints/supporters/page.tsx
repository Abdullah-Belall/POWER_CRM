import ManagerComplaintsTableActions from "@/components/complaints/managers-complaints-table-actions";
import FinishComplaintFormPopup from "@/components/form/complaints/finish-complaint-form-popup";
import RefereComplaintFormPopup from "@/components/form/complaints/refere-complaint";
import ViewComplaintFormPopup from "@/components/form/complaints/view-complaint-form-popup";
import SupportersComplaintsTable from "@/components/tables/complaints/supporter-complaints-table";
import { SERVER_COLLECTOR_REQ } from "@/utils/requests/server-reqs/complaints-manager-reqs";
import { SUPPORTER_COMPLAINTS_SERVER_REQ } from "@/utils/requests/server-reqs/complaints-supporter-reqs";

export default async function SupportersComplaints() {
  const res= await SERVER_COLLECTOR_REQ(SUPPORTER_COMPLAINTS_SERVER_REQ)
  if(res.done){
  return (
    <>
    <div>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
    <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Clients Complaints
        </h3>
      </div>
    <ManagerComplaintsTableActions />
    </div>
    <div>
      <SupportersComplaintsTable data={res.data} />
    </div>
      </div>
    </div>
    <ViewComplaintFormPopup />
    <FinishComplaintFormPopup />
    <RefereComplaintFormPopup />
    </>
  )}
  else {
    <h1>ERRRRORRRR</h1>
  }
}