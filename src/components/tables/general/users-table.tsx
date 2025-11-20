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
    actions: <div className="flex items-center gap-2">
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