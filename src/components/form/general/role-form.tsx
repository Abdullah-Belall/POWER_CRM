"use client"
import { useAppSelector } from "@/store/hooks/selector"
import { closePopup, selectPopup } from "@/store/slices/popups-slice"
import BlackLayer from "../black-layer"
import { useAppDispatch } from "@/store/hooks/dispatch"
import { MdOutlineClose  } from "react-icons/md";
import { useCallback, useEffect, useState } from "react"
import {  handleData } from "@/utils/base"
import Select from "../Select"
import { CLIENT_COLLECTOR_REQ } from "@/utils/requests/client-reqs/common-reqs"
import { SnakeBarTypeEnum } from "@/types/enums/common-enums"
import { openSnakeBar } from "@/store/slices/snake-bar-slice"
import { ADD_ROLE, GET_ROLES_REQ, UPDATE_ROLE } from "@/utils/requests/client-reqs/managers-reqs"
import Input from "../input/InputField"
import Checkbox from "../input/Checkbox"
import { fillTable } from "@/store/slices/tables-slice"

export default function RoleFormPopup() {
  const popup = useAppSelector(selectPopup('roleForm'))
  const dispatch = useAppDispatch()
  const handleClose = useCallback(() => dispatch(closePopup({
    popup: 'roleForm'
  })),[])
  const [data, setData] = useState({
    code: '',
    name: '',
  });
  useEffect(() => {
    if(popup.data) {
      setData({
        code: popup.data?.code?.toString(),
        name: popup.data?.name,
      })
      setSelectedRoles(popup.data?.roles)
    }
  }, [popup.isOpen])
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [loading, setLoading] = useState(false);
  const handleConfirm: any = async () => {
    if (loading) return;
    setLoading(true);
    const res = await CLIENT_COLLECTOR_REQ(popup.data ? UPDATE_ROLE : ADD_ROLE, {
        data: {
          name: popup.data ? undefined : data.name,
          code: popup.data ? undefined : Number(data.code),
          roles: JSON.stringify(selectedRoles)
        },
        role_id: popup.data?.id,
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
      const res2 = await CLIENT_COLLECTOR_REQ(GET_ROLES_REQ)
      if(res2) {
        dispatch(fillTable({
          tableName: 'rolesTable',
          obj: {
            data: res2.data.roles,
            total: res2.data.total,
          }
        }))
      }
      setSelectedRoles([])
      setData({
        code: '',
        name: ''
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
  const roles = [
    "create-tenant",
    "read-tenant",
    "update-tenant",
  
    "create-user",
    "read-user",
    "update-user",
    "read-system",
    "create-system",
    "update-system",
    "read-service",
    "create-service",
    "update-service",
    "create-role",
    "read-role",
    "update-role",
  
    "sub-complaint-f-client",
    "self-solve-complaint",
    "create-complaint",
    "read-complaint",
    "assign-complaint",
    'complaint-assignable',
    "update-complaint",
  
    "read-potential-customers",
    "potential-customers-assign",
    "potential-customers-assignable",
    "suitable_for_meeting",

    'read-task',

    'general-ladger'
  ];
  return popup.isOpen ? (<BlackLayer onClick={handleClose}>
    <div className="w-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ">
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
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6 max-h-[calc(100dvh-120px)] overflow-y-scroll custom-scrollbar">
        <div className="space-y-6">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Input disabled={popup.data ? true: false} placeholder="Role Name" value={data.name} onChange={(e) => handleData(setData, 'name', e.target.value)} />
              </div>
              <div>
              <Select options={[
                  {
                    value: '1000',
                    label: '1000',
                  },
                  {
                    value: '2000',
                    label: '2000',
                  },
                  {
                    value: '3000',
                    label: '3000',
                  },
                  {
                    value: '4000',
                    label: '4000',
                  },
                  {
                    value: '5000',
                    label: '5000',
                  },
                  {
                    value: '6000',
                    label: '6000',
                  },
                  {
                    value: '7000',
                    label: '7000',
                  },
                  {
                    value: '8000',
                    label: '8000',
                  },
                  {
                    value: '9000',
                    label: '9000',
                  },
                ]}  disabled={popup.data ? true: false} placeholder="Code" value={data.code} onChange={(e) => handleData(setData, 'code', e.target.value)} />
              </div>
              <div className="col-span-full flex flex-wrap items-center justify-between">
                {roles.map((e) => (
                  <div key={e} className="flex gap-2 items-center w-[50%]">
                    <Checkbox checked={selectedRoles.includes(e)} onChange={() => {
                        const isSelected = selectedRoles.includes(e)
                        if(isSelected) { 
                          setSelectedRoles(selectedRoles.filter((role) => e !== role))}
                        else {
                          setSelectedRoles([...selectedRoles, e])
                        }
                      }} />
                    <h1 className="text-black dark:text-white">{e}</h1>
                  </div>
                ))}
              </div>
              <div className="col-span-full flex justify-center">
                <button onClick={handleConfirm} className="w-fit inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300">
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