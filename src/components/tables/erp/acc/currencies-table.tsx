'use client'
import { useAppSelector } from "@/store/hooks/selector";
import { fillTable, getTable } from "@/store/slices/tables-slice";
import { formatDate } from "@/utils/base";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks/dispatch";
import { openPopup } from "@/store/slices/popups-slice";
import { FaRegEdit } from "react-icons/fa";
import { CurrencyInterface } from "@/types/interfaces/erp/currencies-interface";
import MainTable from "../../main-table";

export default function CurrenciesTable({data}: {data: {currencies: CurrencyInterface[], total: number}}) {
  const tableData = useAppSelector(getTable('currenciesTable'))
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fillTable({tableName: 'currenciesTable', obj: {
      data: data?.currencies,
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
              popup: 'currencyFormPopup',
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
    { id: "index", label: "#", hideSearch: true},
    { id: "ar_name", label: 'AR Name' },
    { id: "en_name", label: 'EN Name' },
    { id: "rate", label: 'Rate', hideSearch: true },
    { id: "max_exchange_limit", label: 'Max exchange', hideSearch: true },
    { id: "min_exchange_limit", label: 'Min exchange', hideSearch: true },
  ];
  return (
    <MainTable columns={columns} data={formateData} />
  )
}