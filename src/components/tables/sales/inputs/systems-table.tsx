'use client'
import { useAppSelector } from "@/store/hooks/selector";
import { fillTable, getTable } from "@/store/slices/tables-slice";
import { formatDate } from "@/utils/base";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks/dispatch";
import MainTable from "../../main-table";
import { SystemInterface } from "@/types/interfaces/sales-interface";

export default function SystemsTable({data}: {data: {systems: SystemInterface[], total: number}}) {
  const tableData = useAppSelector(getTable('systemsTable'))
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fillTable({tableName: 'systemsTable', obj: {
      data: data?.systems || [],
      total: data?.total || 0
    }}))
  }, [data])

  const formateData = tableData?.data?.map((e) => {
    return ({
      ...e,
      created_at: formatDate(e.created_at),
    })
  });
  const columns = [
    { id: "name", label: 'System Name' , minWidth: 'w-[90px]' },
    { id: "desc", label: 'System Desc' , minWidth: 'w-[100px]' },
    { id: "price", label: 'System Price', minWidth: 'w-[80px]', 
      hideSearch: true
      },
    {
      id: "contracts_count",
      label: 'Contracts Count',
      minWidth: 'w-[100px]', 
      hideSearch: true
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