'use client'
import { useAppSelector } from "@/store/hooks/selector";
import { fillTable, getTable } from "@/store/slices/tables-slice";
import { checkNull, formatDate } from "@/utils/base";
import MainTable from "../main-table";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks/dispatch";
import { UserInterface } from "@/types/interfaces/common-interfaces";
import { openPopup } from "@/store/slices/popups-slice";
import { FaRegEdit } from "react-icons/fa";
import { TbFlagShare } from "react-icons/tb";
import { FaConnectdevelop } from "react-icons/fa6";

export default function UsersTable({data}: {data: {users: UserInterface[], total: number}}) {
  const tableData = useAppSelector(getTable('usersTable'))
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fillTable({tableName: 'usersTable', obj: {
      data: data?.users,
      total: data?.total
    }}))
  }, [data])
  const formateData = tableData?.data?.map((e) => {
    return ({
    ...e,
    email: checkNull(e.email, "-"),
    phone: checkNull(e.phone, "-"),
    created_at: formatDate(e.created_at),
    chat_id: checkNull(e.chat_id?.chat_id, "-"),
    actions: <div className="flex items-center gap-2">
      <button
        onClick={() =>
          dispatch(
            openPopup({
              popup: 'roleAttributeFormPopup',
              data: {
                user_id: e.id,
                user_name: e.user_name,
                user_roles: e.role.roles || []
              },
            })
          )
        }
        className={`dark:text-white text-black hover:text-brand-500! duration-200`}
      >
        <TbFlagShare />
      </button>
      <button
        onClick={() =>
          dispatch(
            openPopup({
              popup: 'userConnectionsFormPopup',
              data: {
                user_id: e.id,
                telegram_chat_id: e.chat_id?.chat_id || '',
                telegram_id: e.chat_id?.id
              },
            })
          )
        }
        className={`dark:text-white text-black hover:text-brand-500! duration-200`}
      >
        <FaConnectdevelop />
      </button>
      <button
        onClick={() =>
          dispatch(
            openPopup({
              popup: 'userForm',
              data: {
                id: e.id,
                user_name: e.user_name,
                email: e.email,
                phone: e.phone,
                role_id: e.role.id
              },
            })
          )
        }
        className={`dark:text-white text-black hover:text-brand-500! duration-200`}
      >
        <FaRegEdit />
      </button>
      </div>
  })});
  const columns = [
    { id: "index", label: "#"},
    { id: "user_name", label: 'User Name' },
    { id: "email", label: 'User Email' },
    { id: "role.name", label: 'User Role' },
    { id: "chat_id", label: 'Telegram Chat ID',
      hideSearch: true,
      hideSort: true
    },
    {
      id: "created_at",
      label: 'Created At',
      minWidth: 'w-[120px]',
      hideSearch: true
    },
    {
      id: "actions",
      label: 'Actions',
      hideSearch: true,
      hideSort: true
    },
  ];
  return (
    <MainTable columns={columns} data={formateData} />
  )
}