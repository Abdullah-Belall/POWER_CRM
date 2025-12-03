"use client"
import TableActions from "@/components/common/table-actions";
import { CLIENT_COLLECTOR_REQ } from "@/utils/requests/client-reqs/common-reqs";
import { useAppDispatch } from "@/store/hooks/dispatch";
import { fillTable } from "@/store/slices/tables-slice";
import { useEffect } from "react";
import { DELETE_FUND_CREQ, GET_FUNDS_CREQ } from "@/utils/erp-requests/clients-reqs/funds-reqs";
import { AccAnalyticEnum } from "@/types/enums/erp/acc-enums";
import CashInHandFundsTable from "@/components/tables/erp/funds/cash-in-hand-funds-table"
import FundFormPopup from "@/components/form/erp/funds/fund-form-popup";
import DeleteAlertFormPopup from "@/components/form/common/delete-alert";
import { closePopup, selectPopup } from "@/store/slices/popups-slice";
import { useAppSelector } from "@/store/hooks/selector";
import { openSnakeBar } from "@/store/slices/snake-bar-slice";
import { SnakeBarTypeEnum } from "@/types/enums/common-enums";

export default function CashInHand() {
  const dispatch = useAppDispatch()
  const fetchData = async () => {
    const res = await CLIENT_COLLECTOR_REQ(GET_FUNDS_CREQ, {type: AccAnalyticEnum.CASH_HAND});
    if(res.done) {
      dispatch(fillTable({
        tableName: 'cashFundsTable',
        obj: {
          data: res.data.funds,
          total: res.data.total
        }
      }))
    }
  }
  useEffect(() => {
    fetchData()
  }, [])
  const deleteFundPopup = useAppSelector(selectPopup('deleteFundAlert'))
  return (
    <>
      <div>
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
          <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Funds
              </h3>
            </div>
            <TableActions popup={"fundsFormPopup"} btn={"Create Fund"} />
          </div>
          <div>
            <CashInHandFundsTable />
          </div>
        </div>
      </div>
      <FundFormPopup acc_analy_type={AccAnalyticEnum.CASH_HAND} tableName={'cashFundsTable'} />
      <DeleteAlertFormPopup popupName={'deleteFundAlert'} onDone={async () => {
        const res = await CLIENT_COLLECTOR_REQ(DELETE_FUND_CREQ, {id : deleteFundPopup.data?.id})
        if(res.done){
          fetchData()
          dispatch(closePopup({popup: 'deleteFundAlert'}))
          dispatch(openSnakeBar({
            type: SnakeBarTypeEnum.SUCCESS,
            message: 'Fund deleted successfully'
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
