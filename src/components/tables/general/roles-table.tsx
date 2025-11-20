'use client'
import { useAppSelector } from "@/store/hooks/selector";
import { fillTable, getTable } from "@/store/slices/tables-slice";
import { formatDate } from "@/utils/base";
import MainTable from "../main-table";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks/dispatch";
import { RoleInterface } from "@/types/interfaces/common-interfaces";
import { openPopup } from "@/store/slices/popups-slice";
import { FaRegEdit } from "react-icons/fa";

export default function RolesTable({data}: {data: {roles: RoleInterface[], total: number}}) {
  const tableData = useAppSelector(getTable('rolesTable'))
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fillTable({tableName: 'rolesTable', obj: {
      data: data?.roles,
      total: data?.total
    }}))
  }, [data])
  const formateData = tableData?.data?.map((e) => {
    return ({
    ...e,
    created_at: formatDate(e.created_at),
    actions: <div className="flex items-center gap-2">
      <button
        onClick={() =>
          dispatch(
            openPopup({
              popup: 'roleForm',
              data: {
                id: e.id,
                code: e.code,
                name: e.name,
                roles: e.roles
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
    { id: "code", label: "#"},
    { id: "name", label: 'Role Name' },
    { id: "usersCount", label: 'Users Count' },
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