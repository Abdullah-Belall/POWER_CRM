'use client'
import { useAppSelector } from "@/store/hooks/selector";
import { fillTable, getTable } from "@/store/slices/tables-slice";
import { formatDate, StatusViewer } from "@/utils/base";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks/dispatch";
import { DiscussionInterface } from "@/types/interfaces/sales-interface";
import NormalMainTable from "../../normal-main-table";

export default function DiscussionsTable({data}: {data: {discussions: DiscussionInterface[], total: number}}) {
  const tableData = useAppSelector(getTable('customerDiscutionsTable'))
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fillTable({tableName: 'customerDiscutionsTable', obj: {
      data: data?.discussions,
      total: data?.total
    }}))
  }, [data])

  const formateData = tableData?.data?.map((e) => {
    return ({
      ...e,
      created_at: formatDate(e.created_at),
      // actions:(<div className="flex items-center gap-1">
      //             <button onClick={() => dispatch(openPopup({popup: 'assignSalerFormPopup',
      //               data: {
      //                 customer_id: e.id
      //               }
      //             }))} className={`text-white ${!!false ? 'opacity-[.2]' :'hover:text-brand-500'} duration-200`}><MdAssignmentTurnedIn /></button>
      //             <Link href={`/sales/inputs/potential-customers/${e.id}`} className={`text-white hover:text-brand-500 duration-200`}><BiSolidDetail /></Link>
      //         </div>)
    })
  });
  const columns = [
    { id: "index", label: "#" , minWidth: 'w-[20px]'},
    { id: "discussant.user_name", label: 'Discussant' , minWidth: 'w-[70px]' },
    { id: "details", label: 'Details' , minWidth: 'w-[70px]' },
    {
      id: "status",
      label: 'Status',
      render: (row: any) => <StatusViewer status={row.status} />,
    },
    {
      id: "created_at",
      label: 'Created At',
      minWidth: 'w-[120px]',
    },
  ];
  return (
    <NormalMainTable columns={columns} data={formateData} />
  )
}