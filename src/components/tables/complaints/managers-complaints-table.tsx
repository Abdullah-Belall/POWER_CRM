'use client'
import { useAppSelector } from "@/store/hooks/selector";
import { fillTable, getTable } from "@/store/slices/tables-slice";
import { checkNull, ComplaintPriorityStatusViewer, formatDate, StatusViewer } from "@/utils/base";
import MainTable from "../main-table";
import { getPageTrans } from "@/store/slices/language-slice";
import { ManagerComplaintInterface } from "@/types/interfaces/complaints-manager-interfaces";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks/dispatch";
import { MdAssignmentTurnedIn } from "react-icons/md";
import { closePopup, openPopup } from "@/store/slices/popups-slice";
import { ComplaintStatusEnum } from "@/types/enums/complaints-enums";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { FaEye } from "react-icons/fa6";
import { GiAutoRepair } from "react-icons/gi";
import { CLIENT_COLLECTOR_REQ } from "@/utils/requests/client-reqs/common-reqs";
import { MANAGER_COMPLAINTS_REQ, START_SOLVE_COMPLAINT } from "@/utils/requests/client-reqs/managers-reqs";
import { SnakeBarTypeEnum } from "@/types/enums/common-enums";
import { openSnakeBar } from "@/store/slices/snake-bar-slice";
import { selectCurrentUser } from "@/store/slices/user-slice";

export default function ManagersComplaintsTable({data}: {data: {complaints: ManagerComplaintInterface[], total: number}}) {
  console.log(data);
  const tableData = useAppSelector(getTable('managerComplaintsTable'))
  const trans = useAppSelector(getPageTrans("managersComplaintsPage")).table;
  const currUser = useAppSelector(selectCurrentUser())
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fillTable({tableName: 'managerComplaintsTable', obj: {
      data: data?.complaints,
      total: data?.total
    }}))
  }, [data])
  const [loading, setLoading] = useState(false)
  const formateData = tableData?.data?.map((e) => {
    const isCurrentSupporterAssigned = e.solving?.some(
      (solvingRecord) => solvingRecord.supporter.id === currUser?.id
    );
    const canFinishComplaint =
      e.status === ComplaintStatusEnum.IN_PROGRESS && isCurrentSupporterAssigned;
    return ({
    ...e,
    created_at: formatDate(e.created_at),
    start_solve_at: e.start_solve_at ? formatDate(e.start_solve_at) : "-",
    title: e.title?.trim()?.length > 25 ? e.title?.slice(0, 25)?.trim() + "..." : e.title,
    details: e.details?.trim()?.length > 40 ? e.details?.slice(0, 40)?.trim() + "..." : e.details,
    screen_viewer_password: checkNull(e.screen_viewer_password, "-"),
    actions: <div className="flex items-center gap-2">
      <button disabled={e.status !== ComplaintStatusEnum.PENDING} onClick={() => dispatch(openPopup({popup: 'assignComplaintFormPopup', data: {complaint_id: e.id}}))} className={`text-lg text-white ${e.status !== ComplaintStatusEnum.PENDING ? 'opacity-[.2]' :'hover:text-brand-500'} duration-200`}><MdAssignmentTurnedIn /></button>
      <button
        onClick={() =>
          dispatch(
            openPopup({
              popup: 'viewComplaintFormPopup',
              data: {
                typeFor: 'supporter',
                client: {
                  id: e.client.id,
                  user_name: e.client.user_name,
                  index: e.client.index
                },
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
        className={`text-white hover:text-brand-500 duration-200`}
      >
        <FaEye />
      </button>
      <button onClick={async () => {
          if (loading) return;
          setLoading(true);
          const res = await CLIENT_COLLECTOR_REQ(START_SOLVE_COMPLAINT, {
            complaint_id: e?.id,
          });
          setLoading(false);
          if (res.done) {
            dispatch(openSnakeBar({
              type: SnakeBarTypeEnum.SUCCESS,
              message: "Successfully picked complaint"
            }))
            const reftechComplaints = await CLIENT_COLLECTOR_REQ(MANAGER_COMPLAINTS_REQ)
            if(reftechComplaints.done) {
              dispatch(fillTable({
                tableName: 'managerComplaintsTable',
                obj: {
                  data: reftechComplaints.data.complaints,
                  total: reftechComplaints.data.total,
                }
              }))
            }
          } else {
            dispatch(openSnakeBar({
              type: SnakeBarTypeEnum.ERROR,
              message: res.message
            }))
          }
      }} disabled={e.status !== ComplaintStatusEnum.PENDING} className={`text-white ${e.status !== ComplaintStatusEnum.PENDING ? 'opacity-[.2]' :'hover:text-brand-500'} duration-200`}><GiAutoRepair /></button>
      <button onClick={() =>{
          dispatch(
            openPopup({
              popup: 'finishComplaintFormPopup',
              data: {
                complaint_id: e.id,
                status: e.status
              },
            })
          )
        }} 
          disabled={!canFinishComplaint}
          className={`text-white ${!canFinishComplaint ? 'opacity-[.2]' : 'hover:text-brand-500'} duration-200`}><IoCheckmarkDoneCircle /></button>
      </div>
  })});
  const columns = [
    { id: "index", label: "#" , minWidth: 'w-[20px]'},
    { id: "client.user_name", label: trans[0] , minWidth: 'w-[70px]' },
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
      id: "priority_status",
      label: trans[6],
      render: (row: any) => <ComplaintPriorityStatusViewer status={row.priority_status} />,
      hideSearch: true,
      hideSort: true
    },
    {
      id: "start_solve_at",
      label: trans[7],
      minWidth: 'w-[120px]',
      hideSearch: true
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