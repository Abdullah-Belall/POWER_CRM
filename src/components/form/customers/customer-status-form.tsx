"use client"
import { useAppSelector } from "@/store/hooks/selector"
import { closePopup, selectPopup } from "@/store/slices/popups-slice"
import BlackLayer from "../black-layer"
import { useAppDispatch } from "@/store/hooks/dispatch"
import { MdOutlineClose  } from "react-icons/md";
import { useCallback, useState } from "react"
import {  handleData } from "@/utils/base"
import Select from "../Select"
import { CLIENT_COLLECTOR_REQ } from "@/utils/requests/client-reqs/common-reqs"
import { SnakeBarTypeEnum } from "@/types/enums/common-enums"
import { openSnakeBar } from "@/store/slices/snake-bar-slice"
import { UPDATE_CUSTOMER_STATUS } from "@/utils/requests/client-reqs/sales-reqs"
import { useRouter } from "next/navigation"
import { PotentialCustomerStatusEnum } from "@/types/enums/potential-customers-enums"

export default function CustomerStatusFormPopup() {
  const router = useRouter()
  const popup = useAppSelector(selectPopup('updateCustomerStatusFormPopup'))
  const dispatch = useAppDispatch()
  const handleClose = useCallback(() => dispatch(closePopup({
    popup: 'updateCustomerStatusFormPopup'
  })),[])
  const [data, setData] = useState({
    status: ""
  });
  const [loading, setLoading] = useState(false);
  const handleUpdate: any = async () => {
    if (loading) return;
    setLoading(true);
    const res = await CLIENT_COLLECTOR_REQ(UPDATE_CUSTOMER_STATUS, {
        data: {status: data.status},
        customer_id: popup.data?.customer_id,
    });
    setLoading(false);
    if (res.done) {
      handleClose()
      dispatch(
        openSnakeBar({
          message: "Successfully updated customer status",
          type: SnakeBarTypeEnum.SUCCESS,
        })
      );
      router.push(window.location.pathname + `?forRefresh=${Math.random()}`)
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
              Update Customer Status
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
                <Select options={[
                  {
                    value: PotentialCustomerStatusEnum.CONTRACTED,
                    label: PotentialCustomerStatusEnum.CONTRACTED,
                  },
                  {
                    value: PotentialCustomerStatusEnum.DISCUSSION,
                    label: PotentialCustomerStatusEnum.DISCUSSION,
                  },
                  {
                    value: PotentialCustomerStatusEnum.LOSTED,
                    label: PotentialCustomerStatusEnum.LOSTED,
                  },
                  {
                    value: PotentialCustomerStatusEnum.PENDING,
                    label: PotentialCustomerStatusEnum.PENDING,
                  },
                  {
                    value: PotentialCustomerStatusEnum.PRICE_DISCUSSIONS,
                    label: PotentialCustomerStatusEnum.PRICE_DISCUSSIONS,
                  },
                ]} placeholder="Status" value={data.status} onChange={(e) => handleData(setData, 'status', e.target.value)} />
              </div>
              <div className="col-span-full flex justify-center">
                <button onClick={handleUpdate} className="w-fit inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300">
                  Confirm Update
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    </BlackLayer>) : ""
}