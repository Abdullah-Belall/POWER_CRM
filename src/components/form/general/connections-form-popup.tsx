"use client"
import { useAppSelector } from "@/store/hooks/selector"
import { closePopup, selectPopup } from "@/store/slices/popups-slice"
import BlackLayer from "../black-layer"
import { useAppDispatch } from "@/store/hooks/dispatch"
import { MdOutlineClose  } from "react-icons/md";
import { useCallback, useEffect, useState } from "react"
import {  handleData } from "@/utils/base"
import { CLIENT_COLLECTOR_REQ } from "@/utils/requests/client-reqs/common-reqs"
import { SnakeBarTypeEnum } from "@/types/enums/common-enums"
import { openSnakeBar } from "@/store/slices/snake-bar-slice"
import { ADD_TELEGRAM_CHAT_ID,GET_USERS_REQ, UPDATE_TELEGRAM_CHAT_ID } from "@/utils/requests/client-reqs/managers-reqs"
import Input from "../input/InputField"
import { fillTable } from "@/store/slices/tables-slice"

export default function UserConnectionsFormPopup() {
  const popup = useAppSelector(selectPopup('userConnectionsFormPopup'))
  const dispatch = useAppDispatch()
  const handleClose = useCallback(() => dispatch(closePopup({
    popup: 'userConnectionsFormPopup'
  })),[])
  const [data, setData] = useState({
    telegram_chat_id: '',
  });
  useEffect(() => {
    setData({
      telegram_chat_id: popup.data?.telegram_chat_id || ''
    })
  }, [popup.data])
  const [loading, setLoading] = useState(false);
  const handleConfirm: any = async () => {
    if (loading) return;
    setLoading(true);
    const res = await CLIENT_COLLECTOR_REQ(popup.data?.telegram_chat_id === ''? ADD_TELEGRAM_CHAT_ID: UPDATE_TELEGRAM_CHAT_ID, {
      data: {
        chat_id: data.telegram_chat_id
      },
      user_id: popup.data?.user_id,
      telegram_id: popup.data?.telegram_id,
    });
    setLoading(false);
    if (res.done) {
      handleClose()
      dispatch(
        openSnakeBar({
          message: "Successfully added telegram chat id",
          type: SnakeBarTypeEnum.SUCCESS,
        })
      );
      const res2 = await CLIENT_COLLECTOR_REQ(GET_USERS_REQ)
      if(res2) {
        dispatch(fillTable({
          tableName: 'usersTable',
          obj: {
            data: res2.data.users,
            total: res2.data.total
          }
        }))
      }
      setData({
        telegram_chat_id: '',
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
    <div className="w-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ">
      <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              User Connections
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
                <div className="w-full flex gap-1">
                  <div className="w-full">
                    <Input placeholder="Telegram Chat ID" value={data.telegram_chat_id} onChange={(e) => handleData(setData, 'telegram_chat_id', e.target.value)} />
                  </div>
                  <button onClick={handleConfirm} className="w-fit inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    </BlackLayer>) : ""
}