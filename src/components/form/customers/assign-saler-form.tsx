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
import { fillTable } from "@/store/slices/tables-slice"
import { ASSIGN_SALER, GET_ALL_POTENTIAL_CUSTOMERS } from "@/utils/requests/client-reqs/sales-reqs"

export default function AssignSalerFormPopup() {
  const popup = useAppSelector(selectPopup('assignSalerFormPopup'))
  const dispatch = useAppDispatch()
  const handleClose = useCallback(() => dispatch(closePopup({
    popup: 'assignSalerFormPopup'
  })),[])
  const [data, setData] = useState({
    saler_id: ""
  });
  const [salers,setSalers] = useState<UserInterface[]>([])
  const fetchsalers = async () => {
    if (salers.length > 0) return;
    const res = await CLIENT_COLLECTOR_REQ(GET_USERS, {
      roleAttributes: JSON.stringify(["potential-customers-assignable"]),
    });
    if (res.done) {
      setSalers(res.data.users);
    }
  };
  useEffect(() => {
    fetchsalers();
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
      !data.saler_id ||
      data.saler_id?.length === 0
    ) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Select supporter to assign");
      return false;
    }
    if(!popup.data || !popup.data?.customer_id) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, errMsg);
      return false;
    }
    return true;
  };
  const [loading, setLoading] = useState(false);
  const handleAssign: any = async () => {
    if (loading) return;
    if (!vaildation()) return;
    setLoading(true);
    const res = await CLIENT_COLLECTOR_REQ(ASSIGN_SALER, {
        saler_id: data.saler_id,
        customer_id: popup.data?.customer_id,
    });
    setLoading(false);
    if (res.done) {
      handleClose()
      dispatch(
        openSnakeBar({
          message: "Successfully assigned customer to the saler",
          type: SnakeBarTypeEnum.SUCCESS,
        })
      );
      const refetch = await CLIENT_COLLECTOR_REQ(GET_ALL_POTENTIAL_CUSTOMERS)
      if(refetch.done) {
        dispatch(fillTable({
          tableName: 'potentialCustomerTable',
          obj: {
            data: refetch.data.customers,
            total: refetch.data.total
          }
        }))
      }
      setData({
        saler_id: ''
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
    <div className="w-sm rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ">
      <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              Assign Saler
            </h3>
            <button onClick={handleClose} className="text-xl !bg-brand-500 hover:bg-brand-600! rounded-full text-white w-[30px] h-[30px] flex justify-center items-center">
              <MdOutlineClose />
            </button>
          </div>
      </div>
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6 max-h-[calc(100dvh-70px)] overflow-y-scroll custom-scrollbar">
        <div className="space-y-6">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="col-span-full">
                <Select options={salers.map((e) => ({value: e.id, label: e.index+ ' | ' + e.user_name}))} placeholder="Select Supporter" value={data.saler_id} onChange={(e) => handleData(setData, 'saler_id', e.target.value)} />
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