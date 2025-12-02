import TableActions from "@/components/common/table-actions";
import TenantBranchesTable from "@/components/tables/tenants/tenant-branches-table";
import TenantBranchFormPopup from "@/components/form/tenants/tenant-branch-form";

export default async function TenantsBranches({ params }: { params: Promise<{ id: string }> }) {
  const tenant_id = (await params).id
  return (
    <>
    <div>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Domain Branches
            </h3>
          </div>
          <TableActions popup="tenantBranchesFormPopup" btn="Add Branch" />
        </div>
        <div>
          <TenantBranchesTable tenant_id={tenant_id} />
        </div>
      </div>
    </div>
    <TenantBranchFormPopup />
    </>
  )}