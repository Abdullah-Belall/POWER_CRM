"use client"
import TableActions from "@/components/common/table-actions";
import { CLIENT_COLLECTOR_REQ } from "@/utils/requests/client-reqs/common-reqs";
import { useAppDispatch } from "@/store/hooks/dispatch";
import { fillTable } from "@/store/slices/tables-slice";
import { useEffect } from "react";
import DeleteAlertFormPopup from "@/components/form/common/delete-alert";
import { useAppSelector } from "@/store/hooks/selector";
import { closePopup, selectPopup } from "@/store/slices/popups-slice";
import { openSnakeBar } from "@/store/slices/snake-bar-slice";
import { SnakeBarTypeEnum } from "@/types/enums/common-enums";
import { DELETE_ACTIVITY_CREQ, GET_ACTIVITIES_CREQ } from "@/utils/erp-requests/clients-reqs/activity-reqs";
import ActivitiesTable from "@/components/tables/erp/activites/activies-table";
import ActivityTreeView from "@/components/activities/tree-view/activity-tree-view";
import ActivityFormPopup from "@/components/form/erp/activities/activity-form-popup";

export default function Activities() {
  const dispatch = useAppDispatch()
  const fetchData = async () => {
    const res = await CLIENT_COLLECTOR_REQ(GET_ACTIVITIES_CREQ);
    if(res.done) {
      dispatch(fillTable({
        tableName: 'activitiesTable',
        obj: {
          data: res.data.activities,
          total: res.data.total
        }
      }))
    }
  }
  useEffect(() => {
    fetchData()
  }, [])
  const deleteActivityPopup = useAppSelector(selectPopup('deleteActivityAlert'))
  return (
    <>
      <div>
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
          <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Activities
              </h3>
            </div>
            <TableActions popup={"activityFormPopup"} btn={"Create Activity"} />
          </div>
          <div className="flex w-full h-full gap-2">
            <div className="w-full">
              <ActivitiesTable />
            </div>
            <div>
              <ActivityTreeView />
            </div>
          </div>
        </div>
      </div>
      <ActivityFormPopup />
      {/* <UpdateAccountsFormPopup /> */}
      <DeleteAlertFormPopup popupName={'deleteActivityAlert'} onDone={async () => {
        const res = await CLIENT_COLLECTOR_REQ(DELETE_ACTIVITY_CREQ, {id : deleteActivityPopup.data?.id})
        if(res.done){
          fetchData()
          dispatch(closePopup({popup: 'deleteActivityAlert'}))
          dispatch(openSnakeBar({
            type: SnakeBarTypeEnum.SUCCESS,
            message: 'Activity deleted successfully'
          }))
        } else {
          dispatch(openSnakeBar({
            type: SnakeBarTypeEnum.ERROR,
            message: res.message
          }))
        }
      }} />
    </>
  );
}
