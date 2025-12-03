"use client"
import ManagerComplaintsTableActions from "@/components/complaints/managers-complaints-table-actions";
import { ViewImage } from "@/components/form/common/view-image";
import AssignComplaintFormPopup from "@/components/form/complaints/assign-complaint-form-popup";
import ComplaintSupportersHistoryPopup from "@/components/form/complaints/complaint-supporters-history-popup";
import FinishComplaintFormPopup from "@/components/form/complaints/finish-complaint-form-popup";
import ManagerComplaintFormPopup from "@/components/form/complaints/manager-complaint-form-popup";
import ViewComplaintFormPopup from "@/components/form/complaints/view-complaint-form-popup";
import ManagersComplaintsTable from "@/components/tables/complaints/managers-complaints-table";
import { useAppDispatch } from "@/store/hooks/dispatch";
import { fillTable } from "@/store/slices/tables-slice";
import { CLIENT_COLLECTOR_REQ } from "@/utils/requests/client-reqs/common-reqs";
import { MANAGER_COMPLAINTS_REQ } from "@/utils/requests/client-reqs/managers-reqs";
import { useEffect } from "react";

export default function ManagersComplaints() {
  const dispatch = useAppDispatch()
  const fetchData = async () => {
    const res = await CLIENT_COLLECTOR_REQ(MANAGER_COMPLAINTS_REQ)
    if(res.done) {
      dispatch(fillTable({tableName: 'managerComplaintsTable', obj: {
        data: res?.data?.complaints,
        total: res?.data?.total
      }}))
    }
  }
  useEffect(() => {
    fetchData()
    const intervalId = setInterval(() => {
      fetchData()
    }, 25000);

    return () => {
      clearInterval(intervalId)
    }
  }, [])
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
      <ManagersComplaintsTable />
    </div>
      </div>
    </div>
    <ManagerComplaintFormPopup />
    <AssignComplaintFormPopup />
    <ViewComplaintFormPopup />
    <FinishComplaintFormPopup />
    <ComplaintSupportersHistoryPopup />
    <ViewImage />
    </>
  )
}