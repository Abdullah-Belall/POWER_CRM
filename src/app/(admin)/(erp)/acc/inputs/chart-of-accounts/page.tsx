"use client"
import TableActions from "@/components/common/table-actions";
import ChartOfAccounstsTable from "@/components/tables/erp/acc/chart-of-accounts-table";
import ChartOfAccountsFormPopup from "@/components/form/erp/acc/chart-of-accounts-form-popup";
import { CLIENT_COLLECTOR_REQ } from "@/utils/requests/client-reqs/common-reqs";
import { GET_CHARTS_OF_ACCOUNTS_CREQ } from "@/utils/erp-requests/clients-reqs/accounts-reqs";
import { useAppDispatch } from "@/store/hooks/dispatch";
import { fillTable } from "@/store/slices/tables-slice";
import { useEffect } from "react";

export default function ChartOfAccounts() {
  const dispatch = useAppDispatch()
  const fetchData = async () => {
    const res = await CLIENT_COLLECTOR_REQ(GET_CHARTS_OF_ACCOUNTS_CREQ);
    if(res.done) {
      dispatch(fillTable({
        tableName: 'chartOfAccountsTable',
        obj: {
          data: res.data.accounts,
          total: res.data.total
        }
      }))
    }
  }
  useEffect(() => {
    fetchData()
  }, [])
  return (
    <>
      <div>
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
          <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Accounts
              </h3>
            </div>
            <TableActions popup={"chartOfAccountsFormPopup"} btn={"Create Account"} />
          </div>
          <div>
            <ChartOfAccounstsTable />
          </div>
        </div>
      </div>
      <ChartOfAccountsFormPopup />
    </>
  );
}