'use client'
import { MdOutlineClose } from "react-icons/md";
import BlackLayer from "../black-layer";
import { closePopup, selectPopup } from "@/store/slices/popups-slice";
import { useAppSelector } from "@/store/hooks/selector";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks/dispatch";
import Select from "../Select";
import { ComplaintStatusEnum } from "@/types/enums/complaints-enums";
import { openSnakeBar } from "@/store/slices/snake-bar-slice";
import { SnakeBarTypeEnum } from "@/types/enums/common-enums";
import { errMsg, handleData } from "@/utils/base";
import { CLIENT_COLLECTOR_REQ } from "@/utils/requests/client-reqs/common-reqs";
import { FINISH_SOLVE, SUPPORTER_COMPLAINTS } from "@/utils/requests/client-reqs/supporter-reqs";
import { fillTable } from "@/store/slices/tables-slice";
import { usePathname } from "next/navigation";
import { MANAGER_COMPLAINTS_REQ } from "@/utils/requests/client-reqs/managers-reqs";

export default function FinishComplaintFormPopup() {
  const popup = useAppSelector(selectPopup('finishComplaintFormPopup'))
  const pathname = usePathname()
  const [data, setData] = useState({
    status: '',
    complaint_id: popup.data?.complaint_id,
  })
  useEffect(() => {
    setData({...data, status: popup.data?.status as any})
  }, [popup.data?.status])
  const dispatch = useAppDispatch()
  const handleClose = useCallback(() => dispatch(closePopup({
    popup: 'finishComplaintFormPopup'
  })),[])
  
  const validation = () => {
    if(!popup.data?.complaint_id) {
      dispatch(
        openSnakeBar({
          type: SnakeBarTypeEnum.WARNING,
          message: errMsg,
        })
      );
      return;
    }
    if (
      data.status !== ComplaintStatusEnum.COMPLETED &&
      data.status !== ComplaintStatusEnum.CANCELLED &&
      data.status !== ComplaintStatusEnum.DEVELOPMENT
    ) {
      dispatch(
        openSnakeBar({
          type: SnakeBarTypeEnum.WARNING,
          message: "Complaint status must be Completed, Cancelled or Development",
        })
      );
      return;
    }
    return true
  }
  const [loading, setLoading] = useState(false)
  const handleFinish = async () => {
    if (loading) return;
    if(!validation()) return;
    setLoading(true);
    const res = await CLIENT_COLLECTOR_REQ(FINISH_SOLVE, { data: { status: data.status, id: popup.data?.complaint_id } });
    if (res.done) {
      dispatch(closePopup({popup: 'finishComplaintFormPopup'}))
      dispatch(
        openSnakeBar({
          type: SnakeBarTypeEnum.SUCCESS,
          message: "Complaint finished successfully",
        })
      );
      const typeFor: 'managers' | 'supporters' = pathname.split("/")[pathname.split("/").length -1] === 'managers'? 'managers': 'supporters'
      const res= await CLIENT_COLLECTOR_REQ(typeFor === 'managers' ? MANAGER_COMPLAINTS_REQ : SUPPORTER_COMPLAINTS)
      if(res.done) {
        dispatch(fillTable({
          tableName: typeFor === 'managers' ? 'managerComplaintsTable': 'supporterComplaintsTable',
          obj: {
            data: res.data?.complaints,
            total: res.data?.total
          }
        }))
        setData({
          complaint_id: '',
          status: ''
        })
      }
    } else {
      dispatch(
        openSnakeBar({
          type: SnakeBarTypeEnum.ERROR,
          message: res?.message,
        })
      );
    }
    setLoading(false);
  };
  return popup.isOpen ? (<BlackLayer onClick={handleClose}>
    <div className="w-sm h-fit border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ">
    <div className="px-6 py-5">
    <div className="flex items-center justify-between">
    <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
      Finish Complaint
    </h3>
      <button onClick={handleClose} className="text-xl !bg-brand-500 hover:bg-brand-600! rounded-full text-white w-[30px] h-[30px] flex justify-center items-center">
        <MdOutlineClose />
      </button>
    </div>
    </div>
    <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6 max-h-[calc(100dvh-120px)] overflow-y-scroll custom-scrollbar">
      <div className="space-y-6">
        <div className="relative">
          <Select options={[{
            value: ComplaintStatusEnum.DEVELOPMENT,
            label: ComplaintStatusEnum.DEVELOPMENT
          },{
            value: ComplaintStatusEnum.COMPLETED,
            label: ComplaintStatusEnum.COMPLETED
          },{
            value: ComplaintStatusEnum.CANCELLED,
            label: ComplaintStatusEnum.CANCELLED
          }
          ]} placeholder="Status" value={data.status || ''} onChange={(e) => handleData(setData, 'status', e.target.value)} />
        </div>
      <div className="col-span-full flex justify-center">
      <button onClick={handleFinish} className="w-fit inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300">
        Finish
      </button>
    </div>
      </div>
    </div>
    </div>
    </BlackLayer>
  )
    : ""
}