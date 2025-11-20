import RoleFormPopup from "@/components/form/general/role-form";
import UserFormPopup from "@/components/form/general/user-form";
import UsersTableActions from "@/components/general/users-table-action";
import UsersTable from "@/components/tables/general/users-table";
import { SERVER_COLLECTOR_REQ } from "@/utils/requests/server-reqs/complaints-manager-reqs";
import { USERS_SERVER_REQ } from "@/utils/requests/server-reqs/general-reqs";

export default async function Users() {
  const res = await SERVER_COLLECTOR_REQ(USERS_SERVER_REQ)
  if(res.done){
  return (
    <>
    <div>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Users
            </h3>
          </div>
          <UsersTableActions />
        </div>
        <div>
          <UsersTable data={res.data} />
        </div>
      </div>
    </div>
    <UserFormPopup />
    </>
  )}
  else {
    <h1>ERRRRORRRR</h1>
  }
}