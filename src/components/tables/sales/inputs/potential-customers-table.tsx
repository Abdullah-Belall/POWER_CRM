'use client'
import { useAppSelector } from "@/store/hooks/selector";
import { fillTable, getTable } from "@/store/slices/tables-slice";
import { checkNull, formatDate, StatusViewer } from "@/utils/base";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks/dispatch";
import MainTable from "../../main-table";
import { PotentialCustomerInterface } from "@/types/interfaces/sales-interface";
import { openPopup } from "@/store/slices/popups-slice";
import { MdAssignmentTurnedIn } from "react-icons/md";
import { BiSolidDetail } from "react-icons/bi";
import Link from "next/link";
import { FaRegEdit } from "react-icons/fa";
import { selectCurrentUserRoles } from "@/store/slices/user-slice";
import { CLIENT_COLLECTOR_REQ } from "@/utils/requests/client-reqs/common-reqs";
import { GET_ALL_POTENTIAL_CUSTOMERS, GET_POTENTIAL_CUSTOMERS } from "@/utils/requests/client-reqs/sales-reqs";

export default function PotentialCustomersTable({data}: {data: {customers: PotentialCustomerInterface[], total: number}}) {
  const tableData = useAppSelector(getTable('potentialCustomerTable'))
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fillTable({tableName: 'potentialCustomerTable', obj: {
      data: data?.customers || [],
      total: data?.total || 0
    }}))
  }, [data])
  const currUserRoles = useAppSelector(selectCurrentUserRoles())
  const formateData = tableData?.data?.map((e) => {
    return ({
      ...e,
      created_at: formatDate(e.created_at),
      note: checkNull(e.note, '-'),
      assigner: e.assigner ?? {
        id: null,
        user_name: '-'
      },
      saler: e.saler ?? {
        id: null,
        user_name: '-'
      },
      company: checkNull(e.company, '-'),
      phone: checkNull(e.phone, '-'),
      actions:(<div className="flex items-center gap-1">
                  <button disabled={!!e.saler} onClick={() => dispatch(openPopup({popup: 'assignSalerFormPopup',
                    data: {
                      customer_id: e.id
                    }
                  }))} className={`dark:text-white text-black ${!!e.saler ? 'opacity-[.4]' :'hover:text-brand-500!'} duration-200`}><MdAssignmentTurnedIn /></button>
                  <Link href={`/sales/inputs/potential-customers/${e.id}`} className={`text-black dark:text-white hover:text-brand-500! duration-200`}><BiSolidDetail /></Link>
                  <button onClick={() => dispatch(openPopup({popup: 'customerFormPopup',
                    data: {
                      id: e.id,
                      company: checkNull(e.company, ''),
                      name: checkNull(e.name, ''),
                      note: checkNull(e.note, ''),
                      phone: checkNull(e.phone, '')
                    }
                  }))} className={`dark:text-white text-black hover:text-brand-500! duration-200`}><FaRegEdit /></button>
              </div>)
    })
  });
  const columns = [
    { id: "index", label: "#" , minWidth: 'w-[20px]'},
    { id: "assigner.user_name", label: 'Assigner' , minWidth: 'w-[70px]' },
    { id: "saler.user_name", label: 'Saler' , minWidth: 'w-[80px]' },
    { id: "name", label: 'Customer Name', minWidth: 'w-[100px]' },
    { id: "phone", label: 'Customer Phone', minWidth: 'w-[100px]' },
    {
      id: "company",
      label: 'Customer Company',
      minWidth: 'w-[120px]',
    },
    {
      id: "status",
      label: 'Customer Status',
      render: (row: any) => <StatusViewer status={row.status} />,
      hideSearch: true,
      hideSort: true
    },
    {
      id: "contracts_count",
      label: 'Contracts Count',
      hideSearch: true, minWidth: 'w-[100px]'
    },
    {
      id: "note",
      label: 'Note',
      minWidth: 'w-[80px]',
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
  const list = {
    label: 'Filtering',
    data: [
      {
        label: 'All Records',
        action: async () => {
          const res= await CLIENT_COLLECTOR_REQ(GET_ALL_POTENTIAL_CUSTOMERS)
          if(res.done) {
            dispatch(fillTable({tableName: 'potentialCustomerTable', obj: {
              data: res.data?.customers || [],
              total: res.data?.total || 0
            }}))
          }
        }
      },
      {
        label: 'My Records',
        action: async () => {
          const res= await CLIENT_COLLECTOR_REQ(GET_POTENTIAL_CUSTOMERS)
          if(res.done) {
            dispatch(fillTable({tableName: 'potentialCustomerTable', obj: {
              data: res.data?.customers || [],
              total: res.data?.total || 0
            }}))
          }
        }
      },
    ]
  }
  return (
    <MainTable columns={columns} data={formateData} list={currUserRoles?.includes("read-potential-customers") ? list : undefined} />
  )
}