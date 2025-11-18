import AssignSalerFormPopup from "@/components/form/customers/assign-saler-form";
import CustomerFormPopup from "@/components/form/customers/customer-form";
import CustomersTableActions from "@/components/sales/inputs/customers/customersTableActions";
import PotentialCustomersTable from "@/components/tables/sales/inputs/potential-customers-table";
import { SERVER_COLLECTOR_REQ } from "@/utils/requests/server-reqs/complaints-manager-reqs";
import { POTENTIAL_CUSTOMERS_SERVER_REQ } from "@/utils/requests/server-reqs/sales-managers-reqs";

export default async function ManagersComplaints() {
  const res= await SERVER_COLLECTOR_REQ(POTENTIAL_CUSTOMERS_SERVER_REQ)
  if(res.done){
  return (
    <>
    <div>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
    <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Potential Customers
        </h3>
      </div>
    <CustomersTableActions />
    </div>
    <div>
      <PotentialCustomersTable data={res.data} />
    </div>
      </div>
    </div>
    <CustomerFormPopup />
    <AssignSalerFormPopup />
    <AssignSalerFormPopup />
    </>
  )}
  else {
    <h1>ERRRRORRRR</h1>
  }
}