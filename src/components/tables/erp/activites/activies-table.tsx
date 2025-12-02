'use client'
import { useAppSelector } from "@/store/hooks/selector";
import { getTable } from "@/store/slices/tables-slice";
import { formatDate } from "@/utils/base";
import MainTable from "../../main-table";
import { MdDelete } from "react-icons/md";
import { useAppDispatch } from "@/store/hooks/dispatch";
import { openPopup } from "@/store/slices/popups-slice";

export default function ActivitiesTable() {
  const tableData = useAppSelector(getTable('activitiesTable'))
  const dispatch = useAppDispatch()

  const formateData = tableData?.data?.map((e) => {
    return ({
    ...e,
    created_at: formatDate(e.created_at),
    parent_code: e.parent?.code || '-',
    actions: <div className="flex items-center gap-2">
      <button
        onClick={() => {
          dispatch(
            openPopup({
              popup: 'deleteActivityAlert',
              data: {
                id: e.id
              }
            })
          )
        }
        }
        className={`dark:text-white text-black hover:text-brand-500! duration-200`}
      >
        <MdDelete />
      </button>
      </div>
  })});
  const columns = [
    { id: "code", label: "Code", hideSearch: true},
    { id: "ar_name", label: 'AR Name' },
    { id: "en_name", label: 'EN Name' },
    { id: "parent_code", label: 'Parent Code', hideSearch: true },
    { id: "actions", label: 'Actions', hideSearch: true , hideSort: true},
  ];
  return (
    <MainTable columns={columns} data={formateData} />
  )
}