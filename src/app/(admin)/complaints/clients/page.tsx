import ManagerComplaintsTableActions from "@/components/complaints/managers-complaints-table-actions";
import ManagerComplaintFormPopup from "@/components/form/complaints/manager-complaint-form-popup";
import ViewComplaintFormPopup from "@/components/form/complaints/view-complaint-form-popup";
import ClientsComplaintsTable from "@/components/tables/complaints/clients-complaints-table";
import { CLIENT_COMPLAINTS_SERVER_REQ, SERVER_COLLECTOR_REQ } from "@/utils/requests/server-reqs/complaints-manager-reqs";

export default async function ClientsComplaints() {
  const res= await SERVER_COLLECTOR_REQ(CLIENT_COMPLAINTS_SERVER_REQ)

  if(res.done){
  return (
    <>
    <div>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
    <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Your Complaints
        </h3>
      </div>
    <ManagerComplaintsTableActions />
    </div>
    <div>
      <ClientsComplaintsTable data={res.data} />
    </div>
      </div>
    </div>
    <ViewComplaintFormPopup />
    <ManagerComplaintFormPopup />
    </>
  )}
  else {
    <h1>ERRRRORRRR</h1>
  }
}