'use client'
import { useAppSelector } from "@/store/hooks/selector";
import { fillTable, getTable } from "@/store/slices/tables-slice";
import { checkNull, formatDate } from "@/utils/base";
import MainTable from "../main-table";
import { useAppDispatch } from "@/store/hooks/dispatch";
import { CLIENT_COLLECTOR_REQ } from "@/utils/requests/client-reqs/common-reqs";
import { GET_TENANT_BRANCHES_CREQ } from "@/utils/requests/client-reqs/tenants-reqs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import { openPopup } from "@/store/slices/popups-slice";
import { CiSquareMore } from "react-icons/ci";

export default function TenantBranchesTable({ tenant_id }: { tenant_id?: string }) {
  const tableData = useAppSelector(getTable('tenantBranchesTable'))
  const router = useRouter()
  const dispatch = useAppDispatch()
  const fetchData = async () => {
    const res = await CLIENT_COLLECTOR_REQ(GET_TENANT_BRANCHES_CREQ, {tenant_id})
    if(res.done){
      dispatch(fillTable({tableName: 'tenantBranchesTable', obj: {
        data: res.data.branches,
        total: res.data.total,
      }}))
    } else {
      router.push('/signin')
    }
  }
  useEffect(() => {
    fetchData()
  }, [])
  const formateData = tableData?.data?.map((e) => {
    return ({
    ...e,
    created_at: formatDate(e.created_at),
    en_name: checkNull(e.en_name, '-'),
    tax_id: checkNull(e.tax_id, '-'),
    tax_registry: checkNull(e.tax_registry, '-'),
    logo: checkNull(e.logo, '-'),
    actions: <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    dispatch(openPopup({
                      popup: 'tenantBranchesFormPopup'
                    }))
                    dispatch(openPopup({
                      popup: 'viewTenantBranchesFormPopup',
                      data: e
                    }))
                  }}
                  className={`dark:text-white text-xl text-black hover:text-brand-500! duration-200`}
                >
                  <CiSquareMore />
                </button>
                {
                  tenant_id ? <button
                  onClick={() => {
                    dispatch(openPopup({
                      popup: 'tenantBranchesFormPopup'
                    }))
                    dispatch(openPopup({
                      popup: 'updateTenantBranchesFormPopup',
                      data: e
                    }))
                  }}
                  className={`dark:text-white text-lg text-black hover:text-brand-500! duration-200`}
                >
                  <FaRegEdit />
                </button> : ''
                }
              </div>
  })});
  const columns = [
    { id: "index", label: "#" , minWidth: 'w-[20px]', hideSearch: true },
    { id: "ar_name", label: 'AR Name' },
    { id: "en_name", label: 'EN Name' },
    { id: "tax_id", label: 'Tax ID', hideSearch: true, hideSort: true },
    { id: "tax_registry", label: 'Tax Registry', hideSearch: true, hideSort: true },
    { id: "logo", label: 'Logo', hideSearch: true, hideSort: true },
    {
      id: "actions",
      label: 'Actions',
      hideSearch: true,
      hideSort: true
    }
  ];
  return (
    <MainTable columns={columns} data={formateData} />
  )
}