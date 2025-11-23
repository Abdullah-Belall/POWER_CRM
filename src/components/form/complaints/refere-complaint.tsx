"use client"
import { useAppSelector } from "@/store/hooks/selector"
import { closePopup, selectPopup } from "@/store/slices/popups-slice"
import BlackLayer from "../black-layer"
import { useAppDispatch } from "@/store/hooks/dispatch"
import { MdOutlineClose  } from "react-icons/md";
import { useCallback, useEffect, useState } from "react"
import { errMsg, handleData } from "@/utils/base"
import Select from "../Select"
import { CLIENT_COLLECTOR_REQ, GET_USERS } from "@/utils/requests/client-reqs/common-reqs"
import { UserInterface } from "@/types/interfaces/common-interfaces"
import { SnakeBarTypeEnum } from "@/types/enums/common-enums"
import { openSnakeBar } from "@/store/slices/snake-bar-slice"
import { REFERE_COMPLAINT, SUPPORTER_COMPLAINTS } from "@/utils/requests/client-reqs/supporter-reqs"
import { fillTable } from "@/store/slices/tables-slice"
import { selectCurrentUserId } from "@/store/slices/user-slice"

export default function RefereComplaintFormPopup() {
  const popup = useAppSelector(selectPopup('refereComplaintFormPopup'))
  const currUserId = useAppSelector(selectCurrentUserId())
  const dispatch = useAppDispatch()
  const handleClose = useCallback(() => dispatch(closePopup({
    popup: 'refereComplaintFormPopup'
  })),[])
  const [data, setData] = useState({
    supporter_id: ""
  });
  const [supporters,setSupporters] = useState<UserInterface[]>([])
  const fetchSupporters = async () => {
    if (supporters.length > 0 || !currUserId) return;
    const res = await CLIENT_COLLECTOR_REQ(GET_USERS, {
      roleAttributes: JSON.stringify(["complaint-assignable"]),
    });
    if (res.done) {
      setSupporters(res.data.users?.filter((e: any) => e.id !== currUserId));
    }
  };
  useEffect(() => {
    if (popup.isOpen && currUserId) {
      fetchSupporters();
    }
  }, [popup.isOpen, currUserId]);
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
    const {supporter_id} = data
    setLoading(true);
    const res = await CLIENT_COLLECTOR_REQ(REFERE_COMPLAINT, {
      supporter_id,
      complaint_id: popup.data?.complaint_id,
    });
    setLoading(false);
    if (res.done) {
      handleClose()
      dispatch(
        openSnakeBar({
          message: "Successfully refered complaint to the supporter",
          type: SnakeBarTypeEnum.SUCCESS,
        })
      );
      const refetchComplaints = await CLIENT_COLLECTOR_REQ(SUPPORTER_COMPLAINTS)
      if(refetchComplaints.done) {
        dispatch(fillTable({
          tableName:'supporterComplaintsTable',
          obj: {
            data: refetchComplaints.data.complaints,
            total: refetchComplaints.data.total
          }
        }))
      }
      setData({
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
    <div className="w-sm h-fit border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ">
      <div className="px-6 py-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            Refere Complaint To Supporter
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
              <div className="col-span-full">
                <Select options={supporters.map((e) => ({value: e.id, label: e.index+ ' | ' + e.user_name}))} placeholder="Select Supporter" value={data.supporter_id} onChange={(e) => handleData(setData, 'supporter_id', e.target.value)} />
              </div>
              <div className="col-span-full flex justify-center">
                <button onClick={handleAssign} className="w-fit inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300">
                  Confirm
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    </BlackLayer>) : ""
}