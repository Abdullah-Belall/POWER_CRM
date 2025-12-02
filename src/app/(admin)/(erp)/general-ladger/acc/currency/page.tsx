import CurrenciesTableActions from "@/components/acc/currencies/currenices-table-actions";
import CurrencyFormPopup from "@/components/form/erp/acc/currency-form-popup";
import CurrenciesTable from "@/components/tables/erp/acc/currencies-table";
import { GET_CURRENCIES_SREQ } from "@/utils/erp-requests/server-reqs/currency-reqs";
import {  SERVER_COLLECTOR_REQ } from "@/utils/requests/server-reqs/complaints-manager-reqs";

export default async function Currencies() {
  const res = await SERVER_COLLECTOR_REQ(GET_CURRENCIES_SREQ)
  console.log(res.data);
  if(res.done){
  return (
    <>
    <div>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Currencies
            </h3>
          </div>
          <CurrenciesTableActions />
        </div>
        <div>
          <CurrenciesTable data={res.data} />
        </div>
      </div>
    </div>
    <CurrencyFormPopup />
    </>
  )}
  else {
    <h1>ERRRRORRRR</h1>
  }
}