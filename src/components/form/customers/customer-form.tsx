"use client"
import { useAppSelector } from "@/store/hooks/selector"
import { closePopup, selectPopup } from "@/store/slices/popups-slice"
import BlackLayer from "../black-layer"
import { useAppDispatch } from "@/store/hooks/dispatch"
import { MdOutlineClose  } from "react-icons/md";
import { useCallback, useState } from "react"
import Input from "../input/InputField"
import { handleData } from "@/utils/base"
import TextArea from "../input/TextArea"
import { CLIENT_COLLECTOR_REQ } from "@/utils/requests/client-reqs/common-reqs"
import { SnakeBarTypeEnum } from "@/types/enums/common-enums"
import { openSnakeBar } from "@/store/slices/snake-bar-slice"
import { ADD_POTENTIAL_CUSTOMER, GET_ALL_POTENTIAL_CUSTOMERS } from "@/utils/requests/client-reqs/sales-reqs"
import { fillTable } from "@/store/slices/tables-slice"

export default function CustomerFormPopup() {
  const popup = useAppSelector(selectPopup('addCustomerFormPopup'))
  const dispatch = useAppDispatch()
  const handleClose = useCallback(() => dispatch(closePopup({
    popup: 'addCustomerFormPopup'
  })),[])
  const [data, setData] = useState({
    name: "",
    phone: "+20",
    note: "",
  });
  const handleOpenSnakeBar = (type: SnakeBarTypeEnum, message: string) => {
    dispatch(
      openSnakeBar({
        type,
        message,
      })
    );
  };
  const vaildation = () => {
    const {
      name,
      phone
    } = data;
    if (
      name.trim().length === 0
    ) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Select client for the complaint");
      return false;
    }
    if (phone.trim().length !== 13) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Invaild phone number");
      return false;
    }
    return true;
  };
  const [loading, setLoading] = useState(false);
  const handleDone = async () => {
    if (loading) return;
    if (!vaildation()) return false;
    const submitData: any = {
      ...data,
      phone: data.phone === "+20" ? undefined : data.phone,
    };
    setLoading(true);
    const res = await CLIENT_COLLECTOR_REQ(ADD_POTENTIAL_CUSTOMER, {data: submitData});
    if (res.done) {
      const res2 = await CLIENT_COLLECTOR_REQ(GET_ALL_POTENTIAL_CUSTOMERS)
      if(res2.done) {
        dispatch(fillTable({
          tableName: 'potentialCustomerTable',
          obj: {
            data: res2.data.customers,
            total: res2.data.total,
          },
        }))
      }
      dispatch(
        closePopup({
          popup: "addCustomerFormPopup",
        })
      );
      setData({
        name: '',
        note: '',
        phone: ''
      })
    } else {
      dispatch(
        openSnakeBar({
          type: SnakeBarTypeEnum.ERROR,
          message: res.message,
        })
      );
    }
    setLoading(false);
  };
  return popup.isOpen ? (<BlackLayer onClick={handleClose}>
    <div className="w-md !h-fit rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ">
    <div className="px-6 py-5">
      <div className="flex items-center justify-between">
    <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
      Add New Potential Customer
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
          <div>
              <Input placeholder="Customer Name" value={data.name} onChange={(e) => handleData(setData, 'name', e.target.value)} />
          </div>
          <div>
            <Input placeholder="Custome Phone" value={data.phone} onChange={(e) => handleData(setData, 'phone', e.target.value)} />
          </div>
          <div className="col-span-full">
              <TextArea
              placeholder="Notes"
              value={data.note}
              onChange={(e) => handleData(setData, 'note', e.target.value)}
              rows={4}
              />
          </div>
          <div className="col-span-full flex justify-center">
            <button onClick={handleDone} className="w-fit inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>

    </BlackLayer>) : ""
}