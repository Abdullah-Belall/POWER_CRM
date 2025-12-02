'use client'
import { useAppSelector } from "@/store/hooks/selector";
import { getTable } from "@/store/slices/tables-slice";
import { checkNull, formatDate, StatusViewer } from "@/utils/base";
import MainTable from "../../main-table";
import { useAppDispatch } from "@/store/hooks/dispatch";
import { openPopup } from "@/store/slices/popups-slice";
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

export default function CashGroupTable() {
  const tableData = useAppSelector(getTable('cashGroupTable'))
  const dispatch = useAppDispatch()
  const formateData = tableData?.data?.map((e) => {
    return ({
    ...e,
    created_at: formatDate(e.created_at),
    acc_code: e.account?.code,
    acc_name: e.account?.en_name || e.account?.ar_name,
    en_name: checkNull(e.en_name, '-'),
    notes: checkNull(e.notes, '-'),
    is_stopped: <StatusViewer status={!e.is_stopped} />,
    actions: <div className="flex items-center gap-2">
    <button
      onClick={() => {
        dispatch(
          openPopup({
            popup: 'deleteGroupAlert',
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
    <button
      onClick={() => {
        dispatch(
          openPopup({
            popup: 'groupSettingFormPopup',
          })
        )
        dispatch(
          openPopup({
            popup: 'updateGroupSettingFormPopup',
            data: {
              id: e.id,
              ar_name: e.ar_name,
              en_name: e.en_name,
              account_id: e.account?.id,
              is_stopped: e.is_stopped,
              notes: e.notes
            }
          })
        )
      }
      }
      className={`dark:text-white text-black hover:text-brand-500! duration-200`}
    >
      <FaRegEdit />
    </button>
    </div>
  })});
  const columns = [
    { id: "index", label: "Code", hideSearch: true},
    { id: "acc_code", label: 'Acc Code' },
    { id: "acc_name", label: 'Acc Name' },
    { id: "ar_name", label: 'AR Name' },
    { id: "en_name", label: 'EN Name' },
    { id: "notes", label: 'Notes' },
    { id: "is_stopped", label: 'Active' },
    { id: "actions", label: 'Actions' },
  ];
  return (
    <MainTable columns={columns} data={formateData} />
  )
}