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
import { DELETE_COST_CENTER_CREQ, GET_COST_CENTER_CREQ } from "@/utils/erp-requests/clients-reqs/cost-center-reqs";
import CostCenterTable from "@/components/tables/erp/cost-center/cost-center-table";
import CostCenterTreeView from "@/components/cost-center/tree-view/cost-center-tree-view";
import CostCenterFormPopup from "@/components/form/erp/cost-center/cost-center-form-popup";

export default function CostCenter() {
  const dispatch = useAppDispatch()
  const fetchData = async () => {
    const res = await CLIENT_COLLECTOR_REQ(GET_COST_CENTER_CREQ);
    if(res.done) {
      dispatch(fillTable({
        tableName: 'costCenterTable',
        obj: {
          data: res.data.costCenters,
          total: res.data.total
        }
      }))
    }
  }
  useEffect(() => {
    fetchData()
  }, [])
  const deleteCostCenterPopup = useAppSelector(selectPopup('deleteCostCenterAlert'))
  return (
    <>
      <div>
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
          <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Cost Centers
              </h3>
            </div>
            <TableActions popup={"costCenterFormPopup"} btn={"Create Cost"} />
          </div>
          <div className="flex w-full h-full gap-2">
            <div className="w-full">
              <CostCenterTable />
            </div>
            <div>
              <CostCenterTreeView />
            </div>
          </div>
        </div>
      </div>
      <CostCenterFormPopup />
      {/* <UpdateAccountsFormPopup /> */}
      <DeleteAlertFormPopup popupName={'deleteCostCenterAlert'} onDone={async () => {
        const res = await CLIENT_COLLECTOR_REQ(DELETE_COST_CENTER_CREQ, {id : deleteCostCenterPopup.data?.id})
        if(res.done){
          fetchData()
          dispatch(closePopup({popup: 'deleteCostCenterAlert'}))
          dispatch(openSnakeBar({
            type: SnakeBarTypeEnum.SUCCESS,
            message: 'Cost deleted successfully'
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