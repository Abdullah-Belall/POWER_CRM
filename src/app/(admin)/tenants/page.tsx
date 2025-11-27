import TenantFormPopup from "@/components/form/tenants/tenant-form";
import TenantsTable from "@/components/tables/tenants/tenants-table";
import TenantsTableActions from "@/components/tenants/tenants-table-actions";
import { SERVER_COLLECTOR_REQ } from "@/utils/requests/server-reqs/complaints-manager-reqs";
import { ALL_TENANTS_SERVER_REQ } from "@/utils/requests/server-reqs/tenants-reqs";

export default async function AllTenants() {
  const res= await SERVER_COLLECTOR_REQ(ALL_TENANTS_SERVER_REQ)
  if(res.done){
  return (
    <>
    <div>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
    <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Tenants
        </h3>
      </div>
    <TenantsTableActions />
    </div>
    <div>
      <TenantsTable data={res.data} />
    </div>
      </div>
    </div>
    <TenantFormPopup />
    </>
  )}
  else {
    <h1>ERRRRORRRR</h1>
  }
}