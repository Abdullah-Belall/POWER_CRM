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
import { ADD_USER, GET_ROLES_REQ, GET_USERS_REQ, UPDATE_USER } from "@/utils/requests/client-reqs/managers-reqs"
import Input from "../input/InputField"
import { fillTable, getTable } from "@/store/slices/tables-slice"

export default function UserFormPopup() {
  const popup = useAppSelector(selectPopup('userForm'))
  const dispatch = useAppDispatch()
  const handleClose = useCallback(() => dispatch(closePopup({
    popup: 'userForm'
  })),[])
  const [data, setData] = useState({
    user_name: "",
    email: "",
    phone: "+20",
    password: "",
    role_id: "",
  });
  const rolesTable = useAppSelector(getTable('rolesTable'))
  useEffect(() => {
    if(popup.data) {
      setData({
        user_name: popup.data?.user_name || '',
        email: popup.data?.email || '',
        password: '',
        phone: popup.data?.phone || '+20',
        role_id: popup.data?.role_id || '',
      })
    } else {
      setData({
        user_name: '',
        email: '',
        password: '',
        phone: '+20',
        role_id: '',
      })
    }
    if(rolesTable.total === 0) {
      const fetchRoles = async () => {
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
      }
      fetchRoles()
    }
  }, [popup.isOpen])
  // const vaildation = () => {
  //   const { role_id, user_name, phone, email, password } = data;
  //   if (user_name.trim().length < 4) {
  //     handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "User Name must be more than 3 character");
  //     return false;
  //   }
  //   if (email.trim().length > 0) {
  //     const re =
  //       /^(?!.*\.\.)(?!\.)[a-zA-Z0-9._%+-]+(?<!\.)@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[A-Za-z]{2,}$/;
  //     if (!re.test(email)) {
  //       handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Invaild email address");
  //       return false;
  //     }
  //   }
  //   if (phone.trim() !== "+20" && phone.trim().length !== 13) {
  //     handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Invaild phone number");
  //     return false;
  //   }
  //   if (!popup.data && password.trim().length < 7) {
  //     handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Password must be more than 7 character");
  //     return false;
  //   }
  //   if (role_id.trim() === "") {
  //     handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "You must pick role to confirm");
  //     return false;
  //   }
  //   return true;
  // };
  const [loading, setLoading] = useState(false);
  const handleConfirm: any = async () => {
    if (loading) return;
    setLoading(true);
    const res = await CLIENT_COLLECTOR_REQ(popup.data ? UPDATE_USER : ADD_USER, {
        data: { ...data, phone: data.phone === "+20" ? undefined : data.phone,
          password: data.password === "" ? undefined : data.password,
          email: data.email === "" ? undefined : data.email
        },
        id: popup.data?.id,
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
        user_name: '',
        email: '',
        password: '',
        phone: '+20',
        role_id: '',
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
              {popup.data ? 'Update' : 'Add New'} User
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
                <Input placeholder="User Name" value={data.user_name} onChange={(e) => handleData(setData, 'user_name', e.target.value)} />
              </div>
              <div>
                <Input placeholder="User Phone" value={data.phone} onChange={(e) => handleData(setData, 'phone', e.target.value)} />
              </div>
              <div className="col-span-full">
                <Input placeholder="User Email" value={data.email} onChange={(e) => handleData(setData, 'email', e.target.value)} />
              </div>
              <div className="col-span-full">
                <Input placeholder="User Password" value={data.password} onChange={(e) => handleData(setData, 'password', e.target.value)} />
              </div>
              <div className="col-span-full">
              <Select options={rolesTable?.data?.map((e) => ({
                label: e.name,
                value: e.id
              }))}  placeholder="Select Role" value={data.role_id} onChange={(e) => handleData(setData, 'role_id', e.target.value)} />
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