import { useAppSelector } from "@/store/hooks/selector";
import MainTable from "../../main-table";
import { getTable } from "@/store/slices/tables-slice";
import { useAppDispatch } from "@/store/hooks/dispatch";
import { checkNull, formatDate } from "@/utils/base";
import { openPopup } from "@/store/slices/popups-slice";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export default function CashInHandFundsTable() {
  const tableData = useAppSelector(getTable('cashFundsTable'))
  const dispatch = useAppDispatch()

  const formateData = tableData?.data?.map((e) => {
    return ({
    ...e,
    created_at: formatDate(e.created_at),
    en_name: checkNull(e.en_name, '-'),
    cashier: checkNull(e.cashier, '-'),
    notes: checkNull(e.notes, '-'),
    actions: <div className="flex items-center gap-2">
      <button
        onClick={() => {
          dispatch(
            openPopup({
              popup: 'fundsFormPopup',
            })
          )
          dispatch(
            openPopup({
              popup: 'updateFundsFormPopup',
              data: e
            })
          )
        }
        }
        className={`dark:text-white text-black hover:text-brand-500! duration-200`}
      >
        <FaRegEdit />
      </button>
      <button
        onClick={() => {
          dispatch(
            openPopup({
              popup: 'deleteFundAlert',
              data: e
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
    { id: "ar_name", label: 'AR Name', hideSort: true },
    { id: "en_name", label: 'EN Name', hideSort: true },
    { id: "cashier", label: 'Cashier', hideSort: true },
    { id: "notes", label: 'Notes', hideSort: true },
    { id: "actions", label: 'Actions', hideSearch: true , hideSort: true},
  ];
  return (
    <MainTable columns={columns} data={formateData} />
  )
}