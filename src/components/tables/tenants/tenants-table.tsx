'use client'
import { useAppSelector } from "@/store/hooks/selector";
import { fillTable, getTable } from "@/store/slices/tables-slice";
import { checkNull, formatDate, StatusViewer } from "@/utils/base";
import MainTable from "../main-table";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks/dispatch";
import { TenantInterface } from "@/types/interfaces/tenants-interface";
import Link from "next/link";
import { CiSquareMore } from "react-icons/ci";

export default function TenantsTable({data}: {data: {tenants: TenantInterface[], total: number}}) {
  const tableData = useAppSelector(getTable('tenantsTable'))
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fillTable({tableName: 'tenantsTable', obj: {
      data: data?.tenants,
      total: data?.total
    }}))
  }, [data])
  const formateData = tableData?.data?.map((e) => {
    return ({
    ...e,
    created_at: formatDate(e.created_at),
    company_logo: checkNull(e.company_logo, '-'),
    phone: checkNull(e.phone, '-'),
    actions: (<div className="flex items-center gap-2">
              <Link href={`tenants/${e.tenant_id}`}>
                <button
                  className={`dark:text-white text-lg text-black hover:text-brand-500! duration-200`}
                >
                  <CiSquareMore />
                </button>
              </Link>
            </div>)
  })});
  const columns = [
    { id: "index", label: "#" , minWidth: 'w-[20px]', hideSearch: true },
    { id: "domain", label: 'Domain' },
    { id: "branches_count", label: 'Branches Count', hideSearch: true },
    { id: "company_title", label: 'Company Title' },
    { id: "company_logo", label: 'Company Logo' },
    {
      id: "phone",
      label: 'Phone', hideSearch: true 
    },
    {
      id: "is_active",
      label: 'Active',
      render: (row: any) => <StatusViewer status={row.is_active} />,
      hideSearch: true,
      hideSort: true
    },
    {
      id: "created_at",
      label: 'Created At',
      minWidth: 'w-[120px]',
      hideSearch: true
    },
    {
      id: "actions",
      label: 'Actions',
      hideSearch: true,
      hideSort: true
    },
  ];
  return (
    <MainTable columns={columns} data={formateData} />
  )
}