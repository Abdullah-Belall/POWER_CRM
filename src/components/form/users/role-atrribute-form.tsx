"use client"
import { useAppSelector } from "@/store/hooks/selector"
import { closePopup, selectPopup } from "@/store/slices/popups-slice"
import BlackLayer from "../black-layer"
import { useAppDispatch } from "@/store/hooks/dispatch"
import { MdOutlineClose  } from "react-icons/md";
import { useCallback, useEffect, useState } from "react"
import { CLIENT_COLLECTOR_REQ, GET_USERS } from "@/utils/requests/client-reqs/common-reqs"
import { SnakeBarTypeEnum } from "@/types/enums/common-enums"
import { openSnakeBar } from "@/store/slices/snake-bar-slice"
import { ROLE_TOGGLE } from "@/utils/requests/client-reqs/managers-reqs"
import { fillTable } from "@/store/slices/tables-slice"
import Switch from "../switch/Switch"

export default function RoleArrributeFormPopup() {
  const popup = useAppSelector(selectPopup('roleAttributeFormPopup'))
  const dispatch = useAppDispatch()
  const handleClose = useCallback(() => dispatch(closePopup({
    popup: 'roleAttributeFormPopup'
  })),[])
  const [data, setData] = useState([
    {
      label: 'create-complaint-forbidden',
      value: false
    },
  ]);
  useEffect(() => {
    console.log(popup.data?.user_roles?.includes('create-complaint-forbidden'));
    setData([
      {
        label: 'create-complaint-forbidden',
        value: !popup.data?.user_roles?.includes('create-complaint-forbidden')
      }
    ])
  }, [popup?.data])
  const [loading, setLoading] = useState(false);
  const handleConfirm: any = async (label: string) => {
    if (loading) return;
    setLoading(true);
    const res = await CLIENT_COLLECTOR_REQ(ROLE_TOGGLE, {
        data: {
          roles: label
        },
        user_id: popup.data?.user_id
    });
    setLoading(false);
    if (res.done) {
      dispatch(
        openSnakeBar({
          message: "Successfully updated user roles",
          type: SnakeBarTypeEnum.SUCCESS,
        })
      );
      const labelUpdate = data.find((e) => e.label === label)
      setData([...data.filter(e => e.label !== labelUpdate?.label), {...labelUpdate as any, value: !labelUpdate?.value}])
      const res2 = await CLIENT_COLLECTOR_REQ(GET_USERS)
      if(res2) {
        dispatch(fillTable({
          tableName: 'managerUsersTable',
          obj: {
            data: res2.data.users,
            total: res2.data.total,
          }
        }))
      }
    } else {
      dispatch(
        openSnakeBar({
          message: res?.message,
          type: SnakeBarTypeEnum.ERROR,
        })
      );
    }
  };
  console.log(data[0]);
  return popup.isOpen ? (<BlackLayer onClick={handleClose}>
    <div className="w-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ">
      <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            User Accessibility
            </h3>
            <button onClick={handleClose} className="text-xl !bg-brand-500 hover:bg-brand-600! rounded-full text-white w-[30px] h-[30px] flex justify-center items-center">
              <MdOutlineClose />
            </button>
          </div>
      </div>
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6 max-h-[calc(100dvh-120px)] overflow-y-scroll custom-scrollbar">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1 dark:text-white text-black">
              <h1 className="font-[500]">Create Complaint</h1>
              <p className="text-xs opacity-[.7] max-w-[80%]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore officia amet saepe recusandae, quidem explicabo.</p>
            </div>
            <div>
              <Switch disabled={loading} checked={data[0].value} onClick={() => handleConfirm(data[0].label)} />
            </div>
          </div>
        </div>
      </div>
    </div>

    </BlackLayer>) : ""
}