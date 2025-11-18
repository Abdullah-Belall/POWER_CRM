'use client'
import { useAppSelector } from "@/store/hooks/selector";
import { fillTable, getTable } from "@/store/slices/tables-slice";
import { checkNull, formatDate, StatusViewer } from "@/utils/base";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks/dispatch";
import { ContractInterface } from "@/types/interfaces/sales-interface";
import NormalMainTable from "../../normal-main-table";

export default function CustomerOffersTable({data}: {data: {contracts: ContractInterface[], total: number}}) {
  const tableData = useAppSelector(getTable('customerOffersTable'))
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fillTable({tableName: 'customerOffersTable', obj: {
      data: data?.contracts,
      total: data?.total
    }}))
  }, [data])

  const formateData = tableData?.data?.map((e) => {
    return ({
      ...e,
      created_at: formatDate(e.created_at),
      discount: checkNull(e.discount, '-', '%'),
      vat: checkNull(e.vat, '-', '%'),
      total_price: e.total_price + ' EGP'
      // actions:(<div className="flex items-center gap-1">
      //             <button onClick={() => dispatch(openPopup({popup: 'assignSalerFormPopup',
      //               data: {
      //                 customer_id: e.id
      //               }
      //             }))} className={`text-white duration-200`}><MdAssignmentTurnedIn /></button>
      //             <Link href={`/sales/inputs/potential-customers/${e.id}`} className={`text-white hover:text-brand-500 duration-200`}><BiSolidDetail /></Link>
      //         </div>)
    })
  });
  const columns = [
    { id: "index", label: "#" },
    { id: "systems_count", label: 'Systems Count' },
    {
      id: "curr_status",
      label: 'Status',
      render: (row: any) => <StatusViewer status={row.curr_status} />,
    },
    { id: "discount", label: 'Discount' },
    { id: "vat", label: 'VAT' },
    {
      id: "total_price",
      label: 'Total Price',
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
    <NormalMainTable columns={columns} data={formateData} />
  )
}