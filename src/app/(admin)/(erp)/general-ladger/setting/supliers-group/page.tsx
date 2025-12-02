"use client"
import TableActions from "@/components/common/table-actions";
import { CLIENT_COLLECTOR_REQ } from "@/utils/requests/client-reqs/common-reqs";
import { useAppDispatch } from "@/store/hooks/dispatch";
import { fillTable } from "@/store/slices/tables-slice";
import { useEffect } from "react";
import { DELETE_GROUP_SETTING_CREQ, GET_GROUP_SETTING_CREQ } from "@/utils/erp-requests/clients-reqs/settings/groups-reqs";
import { AccAnalyticEnum } from "@/types/enums/erp/acc-enums";
import SuppliersGroupTable from "@/components/tables/erp/setting/suppliers-group-table";
import GroupSettingFormPopup from "@/components/form/erp/group-setting/group-setting-form";
import DeleteAlertFormPopup from "@/components/form/common/delete-alert";
import { useAppSelector } from "@/store/hooks/selector";
import { closePopup, selectPopup } from "@/store/slices/popups-slice";
import { openSnakeBar } from "@/store/slices/snake-bar-slice";
import { SnakeBarTypeEnum } from "@/types/enums/common-enums";

export default function SuppliersGroup() {
  const dispatch = useAppDispatch()
  const fetchData = async () => {
    const res = await CLIENT_COLLECTOR_REQ(GET_GROUP_SETTING_CREQ, {type: AccAnalyticEnum.SUPPLIERS});
    if(res.done) {
      dispatch(fillTable({
        tableName: 'suppliersGroupTable',
        obj: {
          data: res.data.groupSettings,
          total: res.data.total
        }
      }))
    }
  }
  useEffect(() => {
    fetchData()
  }, [])
  const deletePopup = useAppSelector(selectPopup('deleteGroupAlert'))
  return (
    <>
      <div>
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
          <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Suppliers Group Setting
              </h3>
            </div>
            <TableActions popup={"groupSettingFormPopup"} btn={"Create Suppliers Group Setting"} />
          </div>
          <div>
            <SuppliersGroupTable />
          </div>
        </div>
      </div>
      <GroupSettingFormPopup acc_analy_type={AccAnalyticEnum.SUPPLIERS} tableName="suppliersGroupTable" />
      <DeleteAlertFormPopup popupName={'deleteGroupAlert'} onDone={async () => {
        const res = await CLIENT_COLLECTOR_REQ(DELETE_GROUP_SETTING_CREQ, {id: deletePopup.data?.id})
        if(res.done) {
          fetchData()
          dispatch(closePopup({
            popup: 'deleteGroupAlert'
          }))
        } else {
          dispatch(openSnakeBar({
            message: res.message,
            type: SnakeBarTypeEnum.ERROR
          }))
        }
      }} />
    </>
  );
}

