"use client"
import UploadExcelFilePopup from "@/components/form/common/upload-excel";
import AssignSalerFormPopup from "@/components/form/customers/assign-saler-form";
import CustomerFormPopup from "@/components/form/customers/customer-form";
import CustomersTableActions from "@/components/sales/inputs/customers/customersTableActions";
import PotentialCustomersTable from "@/components/tables/sales/inputs/potential-customers-table";
import { CLIENT_COLLECTOR_REQ } from "@/utils/requests/client-reqs/common-reqs";
import { GET_POTENTIAL_CUSTOMERS } from "@/utils/requests/client-reqs/sales-reqs";
import { useEffect, useState } from "react";

export default function PotentialCustomers() {
  const [data, setData] = useState()

  const fetchData = async () => {
  const res= await CLIENT_COLLECTOR_REQ(GET_POTENTIAL_CUSTOMERS)
    if(res.done) {
      setData(res.data)
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
          Potential Customers
        </h3>
      </div>
    <CustomersTableActions />
    </div>
    <div>
      <PotentialCustomersTable data={data as any} />
    </div>
      </div>
    </div>
    <CustomerFormPopup />
    <AssignSalerFormPopup />
    <AssignSalerFormPopup />
    <UploadExcelFilePopup />
    </>
  )
}