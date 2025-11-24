'use client'
import { useAppSelector } from "@/store/hooks/selector";
import { fillTable, getTable } from "@/store/slices/tables-slice";
import { checkNull, formatDate, StatusViewer } from "@/utils/base";
import MainTable from "../main-table";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks/dispatch";
import { TenantInterface } from "@/types/interfaces/tenants-interface";
import { FaRegEdit } from "react-icons/fa";

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
    actions: <div className="flex items-center gap-2">
      <button
        className={`dark:text-white text-black hover:text-brand-500! duration-200`}
      >
        <FaRegEdit />
      </button>
      </div>
  })});
  const columns = [
    { id: "index", label: "#" , minWidth: 'w-[20px]'},
    { id: "domain", label: 'Domain' },
    { id: "company_title", label: 'Company Title' },
    { id: "company_logo", label: 'Company Logo' },
    {
      id: "phone",
      label: 'Phone',
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
    // {
    //   id: "actions",
    //   label: 'Actions',
    //   hideSearch: true,
    //   hideSort: true
    // },
  ];
  return (
    <MainTable columns={columns} data={formateData} />
  )
}