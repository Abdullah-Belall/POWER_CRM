'use client'
import { useAppSelector } from "@/store/hooks/selector";
import { getTable } from "@/store/slices/tables-slice";
import { formatDate} from "@/utils/base";
import MainTable from "../../main-table";
import { useAppDispatch } from "@/store/hooks/dispatch";
import { openPopup } from "@/store/slices/popups-slice";
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

export default function JournalsTable() {
  const tableData = useAppSelector(getTable('journalsTable'))
  const dispatch = useAppDispatch()
  const formateData = tableData?.data?.map((e) => {
    return ({
    ...e,
    created_at: formatDate(e.created_at),
    actions: <div className="flex items-center gap-2">
    <button
      onClick={() => {
        dispatch(
          openPopup({
            popup: 'deleteJournalAlert',
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
            popup: 'journalFormPopup',
          })
        )
        dispatch(
          openPopup({
            popup: 'updateJournalFormPopup',
            data: e
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
    { id: "code", label: "Code", hideSearch: true},
    { id: "ref_num", label: 'Reference Number', hideSort: true },
    { id: "statement", label: 'Statement', hideSort: true },
    { id: "recipient_name", label: 'Recipient Name', hideSort: true },
    { id: "beneficiary_name", label: 'Bneficiary Name', hideSort: true },
  ];
  return (
    <MainTable columns={columns} data={formateData} />
  )
}

