'use client'
import { useAppSelector } from "@/store/hooks/selector";
import { fillTable, getTable } from "@/store/slices/tables-slice";
import { checkNull, formatDate, StatusViewer } from "@/utils/base";
import MainTable from "../main-table";
import { getPageTrans } from "@/store/slices/language-slice";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks/dispatch";
import { openPopup } from "@/store/slices/popups-slice";
import { FaEye } from "react-icons/fa6";
import { ClientComplaintInterface } from "@/types/interfaces/complaints-clients-interface";

export default function ClientsComplaintsTable({data}: {data: {complaints: ClientComplaintInterface[], total: number}}) {
  console.log(data);
  const tableData = useAppSelector(getTable('clientComplaintsTable'))
  const trans = useAppSelector(getPageTrans("managersComplaintsPage")).table;
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fillTable({tableName: 'clientComplaintsTable', obj: {
      data: data?.complaints,
      total: data?.total
    }}))
  }, [data])
  const formateData = tableData?.data?.map((e) => {
    return ({
    ...e,
    created_at: formatDate(e.created_at),
    start_solve_at: e.start_solve_at ? formatDate(e.start_solve_at) : "-",
    title: e.title?.trim()?.length > 25 ? e.title?.slice(0, 25)?.trim() + "..." : e.title,
    details: e.details?.trim()?.length > 40 ? e.details?.slice(0, 40)?.trim() + "..." : e.details,
    screen_viewer_password: checkNull(e.screen_viewer_password, "-"),
    actions: <div className="flex items-center gap-2">
      <button
        onClick={() =>
          dispatch(
            openPopup({
              popup: 'viewComplaintFormPopup',
              data: {
                typeFor: 'supporter',
                full_name: e.full_name,
                phone: e.phone,
                title: e.title,
                details: e.details,
                screen_viewer: e.screen_viewer,
                screen_viewer_id: e.screen_viewer_id,
                screen_viewer_password: e.screen_viewer_password ?? "",
                server_viewer: e.server_viewer ?? "",
                server_viewer_id: e.server_viewer_id ?? "",
                server_viewer_password: e.server_viewer_password ?? "",
                intervention_date: e.intervention_date,
                image1: e.image1,
                image2: e.image2,
              },
            })
          )
        }
        className={`dark:text-white text-black hover:text-brand-500! duration-200`}
      >
        <FaEye />
      </button>
      </div>
  })});
  const columns = [
    { id: "index", label: "#" , minWidth: 'w-[20px]'},
    { id: "full_name", label: trans[1] , minWidth: 'w-[80px]' },
    { id: "phone", label: trans[2], minWidth: 'w-[120px]' },
    { id: "title", label: trans[3], minWidth: 'w-[120px]' },
    {
      id: "details",
      label: trans[4],
      minWidth: 'w-[120px]',
    },
    {
      id: "status",
      label: trans[5],
      render: (row: any) => <StatusViewer status={row.status} />,
      hideSearch: true,
      hideSort: true
    },
    {
      id: "created_at",
      label: trans[8],
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