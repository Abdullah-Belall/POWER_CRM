'use client'
import { useAppSelector } from "@/store/hooks/selector";
import { getTable } from "@/store/slices/tables-slice";
import { formatDate } from "@/utils/base";
import MainTable from "../../main-table";

export default function ChartOfAccounstsTable() {
  const tableData = useAppSelector(getTable('chartOfAccountsTable'))

  const formateData = tableData?.data?.map((e) => {
    return ({
    ...e,
    created_at: formatDate(e.created_at),
    parent_code: e.parent?.code || '-'
    // actions: <div className="flex items-center gap-2">
    //   <button
    //     onClick={() =>
    //       dispatch(
    //         openPopup({
    //           popup: 'currencyFormPopup',
    //         })
    //       )
    //     }
    //     className={`dark:text-white text-black hover:text-brand-500! duration-200`}
    //   >
    //     <FaRegEdit />
    //   </button>
    //   </div>
  })});
  const columns = [
    { id: "index", label: "#", hideSearch: true},
    { id: "code", label: "Code", hideSearch: true},
    { id: "ar_name", label: 'AR Name' },
    { id: "en_name", label: 'EN Name' },
    { id: "parent_code", label: 'Parent Code', hideSearch: true },
    { id: "level", label: 'Level', hideSearch: true },
    { id: "children_count", label: 'Children Count', hideSearch: true },
  ];
  return (
    <MainTable columns={columns} data={formateData} />
  )
}