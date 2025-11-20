import RoleFormPopup from "@/components/form/general/role-form";
import RolesTableActions from "@/components/general/roles-table-actions";
import RolesTable from "@/components/tables/general/roles-table";
import {  SERVER_COLLECTOR_REQ } from "@/utils/requests/server-reqs/complaints-manager-reqs";
import { ROLES_SERVER_REQ } from "@/utils/requests/server-reqs/general-reqs";

export default async function Roles() {
  const res = await SERVER_COLLECTOR_REQ(ROLES_SERVER_REQ)
  if(res.done){
  return (
    <>
    <div>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Roles
            </h3>
          </div>
          <RolesTableActions />
        </div>
        <div>
          <RolesTable data={res.data} />
        </div>
      </div>
    </div>
    <RoleFormPopup />
    </>
  )}
  else {
    <h1>ERRRRORRRR</h1>
  }
}