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
import { CLIENT_COLLECTOR_REQ, COMMON_SEARCH } from "@/utils/requests/client-reqs/common-reqs"
import { SnakeBarTypeEnum } from "@/types/enums/common-enums"
import { openSnakeBar } from "@/store/slices/snake-bar-slice"
import { CREATE_SYSTEM } from "@/utils/requests/client-reqs/sales-reqs"
import { fillTable } from "@/store/slices/tables-slice"

export default function SystemFormPopup() {
  const popup = useAppSelector(selectPopup('systemFormPopup'))
  const dispatch = useAppDispatch()
  const handleClose = useCallback(() => dispatch(closePopup({
    popup: 'systemFormPopup'
  })),[])
  const [data, setData] = useState({
    name: "",
    desc: "",
    price: "",
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
      desc,
      price
    } = data;
    if (
      name.trim().length === 0
    ) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Select client for the complaint");
      return false;
    }
    if (desc.trim().length < 13) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "System Desc is to short");
      return false;
    }
    if(+price < 1) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Invaild Price");
      return false;
    }
    return true;
  };
  const [loading, setLoading] = useState(false);
  const handleDone = async () => {
    if (loading) return;
    if (!vaildation()) return false;
    setLoading(true);
    const res = await CLIENT_COLLECTOR_REQ(CREATE_SYSTEM, {data: {...data, price: Number(data.price)}});
    if (res.done) {
      const res2 = await CLIENT_COLLECTOR_REQ(COMMON_SEARCH, {
        body: {
          search_in: "systems",
          search_with: "",
          created_sort: "DESC",
        },
      });
      if(res2.done) {
        dispatch(fillTable({
          tableName: 'systemsTable',
          obj: res2.data,
        }))
      }
      dispatch(
        closePopup({
          popup: "systemFormPopup",
        })
      );
      setData({
        name: '',
        desc: '',
        price: ''
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
    <div className="w-md !h-fit border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ">
    <div className="px-6 py-5">
      <div className="flex items-center justify-between">
    <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
      Add System
    </h3>
      <button onClick={handleClose} className="text-xl !bg-brand-500 hover:bg-brand-600! rounded-full text-white w-[30px] h-[30px] flex justify-center items-center">
        <MdOutlineClose />
      </button>
    </div>
    </div>
  <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6 max-h-[calc(100dvh-120px)] overflow-y-scroll custom-scrollbar">
    <div className="space-y-6">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="col-span-full">
              <Input placeholder="System Name" value={data.name} onChange={(e) => handleData(setData, 'name', e.target.value)} />
          </div>
          <div className="col-span-full">
              <TextArea
              placeholder="System Desc"
              value={data.desc}
              onChange={(e) => handleData(setData, 'desc', e.target.value)}
              rows={4}
              />
          </div>
          <div className="col-span-full">
            <Input placeholder="System Price" value={data.price} onChange={(e) => handleData(setData, 'price', !isNaN(Number(e.target.value)) &&
                  Number(e.target.value) > 0
                  ? e.target.value
                  : "")} />
          </div>

          <div className="col-span-full flex justify-center">
            <button onClick={handleDone} className="w-fit inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300">
              Add
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>

    </BlackLayer>) : ""
}