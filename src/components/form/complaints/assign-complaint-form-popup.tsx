"use client"
import { useAppSelector } from "@/store/hooks/selector"
import { closePopup, selectPopup } from "@/store/slices/popups-slice"
import BlackLayer from "../black-layer"
import { useAppDispatch } from "@/store/hooks/dispatch"
import { MdOutlineClose  } from "react-icons/md";
import { useCallback, useEffect, useState } from "react"
import Input from "../input/InputField"
import { errMsg, handleData } from "@/utils/base"
import Select from "../Select"
import { CLIENT_COLLECTOR_REQ, GET_USERS } from "@/utils/requests/client-reqs/common-reqs"
import { UserInterface } from "@/types/interfaces/common-interfaces"
import { SnakeBarTypeEnum } from "@/types/enums/common-enums"
import { openSnakeBar } from "@/store/slices/snake-bar-slice"
import { ASSIGN_SUPPORTER } from "@/utils/requests/client-reqs/supporter-reqs"
import { fillTable } from "@/store/slices/tables-slice"
import { MANAGER_COMPLAINTS_REQ } from "@/utils/requests/client-reqs/managers-reqs"
import TextArea from "../input/TextArea"

export default function AssignComplaintFormPopup() {
  const popup = useAppSelector(selectPopup('assignComplaintFormPopup'))
  const dispatch = useAppDispatch()
  const handleClose = useCallback(() => dispatch(closePopup({
    popup: 'assignComplaintFormPopup'
  })),[])
  const [data, setData] = useState({
    note: "",
    max_time_to_solve: "",
    supporter_id: ""
  });
  const [supporters,setSupporters] = useState<UserInterface[]>([])
  const fetchSupporters = async () => {
    if (supporters.length > 0) return;
    const res = await CLIENT_COLLECTOR_REQ(GET_USERS, {
      roleAttributes: JSON.stringify(["complaint-assignable"]),
    });
    if (res.done) {
      setSupporters(res.data.users);
    }
  };
  useEffect(() => {
    fetchSupporters();
  }, []);
  const handleOpenSnakeBar = (type: SnakeBarTypeEnum, message: string) => {
    dispatch(
      openSnakeBar({
        type,
        message,
      })
    );
  };
  const vaildation = () => {
    if (
      !data.supporter_id ||
      data.supporter_id?.length === 0
    ) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Select supporter to assign");
      return false;
    }
    if(!popup.data || !popup.data?.complaint_id) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, errMsg);
      return false;
    }
    return true;
  };
  const [loading, setLoading] = useState(false);
  const handleAssign: any = async () => {
    if (loading) return;
    if (!vaildation()) return;
    const {max_time_to_solve, supporter_id, note} = data
    setLoading(true);
    const res = await CLIENT_COLLECTOR_REQ(ASSIGN_SUPPORTER, {
      data: {
        supporter_id,
        complaint_id: popup.data?.complaint_id,
        note: note?.trim().length > 0 ? note?.trim() : undefined,
        max_time_to_solve:
          max_time_to_solve?.trim().length > 0
            ? max_time_to_solve?.trim()
            : undefined,
      },
    });
    setLoading(false);
    if (res.done) {
      handleClose()
      dispatch(
        openSnakeBar({
          message: "Successfully assigned complaint to the supporter",
          type: SnakeBarTypeEnum.SUCCESS,
        })
      );
      const refetchComplaints = await CLIENT_COLLECTOR_REQ(MANAGER_COMPLAINTS_REQ)
      if(refetchComplaints.done) {
        dispatch(fillTable({
          tableName:'managerComplaintsTable',
          obj: {
            data: refetchComplaints.data.complaints,
            total: refetchComplaints.data.total
          }
        }))
      }
      setData({
        max_time_to_solve: '',
        note: '',
        supporter_id: ''
      })
    } else {
      dispatch(
        openSnakeBar({
          message: res?.message,
          type: SnakeBarTypeEnum.ERROR,
        })
      );
    }
  };
  return popup.isOpen ? (<BlackLayer onClick={handleClose}>
    <div className="w-md h-fit border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ">
    <div className="px-6 py-5">
      <div className="flex items-center justify-between">
    <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
      Assign Supporter To Complaint 
    </h3>
      <button onClick={handleClose} className="text-xl !bg-brand-500 hover:bg-brand-600! rounded-full text-white w-[30px] h-[30px] flex justify-center items-center">
        <MdOutlineClose />
      </button>
    </div>
    </div>
  <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6 max-h-[calc(100dvh-120px)] overflow-y-scroll custom-scrollbar">
    <div className="space-y-6">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
            <Select options={supporters.map((e) => ({value: e.id, label: e.index+ ' | ' + e.user_name}))} placeholder="Select Supporter" value={data.supporter_id} onChange={(e) => handleData(setData, 'supporter_id', e.target.value)} />
          </div>
          <div>
            <Input placeholder="Max Time To Solve" value={data.max_time_to_solve} onChange={(e) => handleData(setData, 'max_time_to_solve', e.target.value)} />
          </div>
          <div className="col-span-full">
            <TextArea
            placeholder="Note"
            value={data.note}
            onChange={(e) => handleData(setData, 'note', e.target.value)}
            rows={4}
            />
          </div>
          <div className="col-span-full flex justify-center">
            <button onClick={handleAssign} className="w-fit inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300">
              Assign
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>

    </BlackLayer>) : ""
}