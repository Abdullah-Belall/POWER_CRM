'use client'
import { useAppSelector } from "@/store/hooks/selector";
import { fillTable, getTable } from "@/store/slices/tables-slice";
import { affectedFlagsTypesArr, formatDate } from "@/utils/base";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks/dispatch";
import MainTable from "../../main-table";
import { FlagInterface } from "@/types/interfaces/erp/flag-interface";
import Checkbox from "@/components/form/input/Checkbox";
import { FlagsTypesEnum } from "@/types/enums/erp/flags-enum";

export default function FlagsTable({data, flag_type, onChangeFlag}: {data: {flags: FlagInterface[], total: number} , flag_type: FlagsTypesEnum, onChangeFlag: (flag: FlagsTypesEnum) => void}) {
  const tableData = useAppSelector(getTable('flagsTable'))
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fillTable({tableName: 'flagsTable', obj: {
      data: data?.flags,
      total: data?.total
    }}))
  }, [data])
  const formateData = tableData?.data?.map((e) => {
    return ({
    ...e,
    created_at: formatDate(e.created_at),
    be_affected_slug: <Checkbox checked={e.be_affected ? true : false} />
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
    { id: "ar_name", label: 'AR Name' },
    { id: "en_name", label: 'EN Name' },
  ];
  if(affectedFlagsTypesArr.includes(flag_type)) {
    columns.push({ id: "be_affected_slug", label: 'Affected By Operations', hideSearch: true })
  }
  return (
    <MainTable columns={columns} data={formateData} list={{
      label: 'Select Flag',
      data: [
        {
          label: FlagsTypesEnum.ACCOUNT_TYPE,
          action: async () => onChangeFlag(FlagsTypesEnum.ACCOUNT_TYPE),
        },
        {
          label: FlagsTypesEnum.ACCOUNT_REPORT,
          action: async () => onChangeFlag(FlagsTypesEnum.ACCOUNT_REPORT),
        },
        {
          label: FlagsTypesEnum.ACCOUNT_NATURE,
          action: async () => onChangeFlag(FlagsTypesEnum.ACCOUNT_NATURE),
        },
        {
          label: FlagsTypesEnum.ACCOUNT_ANALYTIC,
          action: async () => onChangeFlag(FlagsTypesEnum.ACCOUNT_ANALYTIC),
        },
        {
          label: FlagsTypesEnum.ACCOUNT_GROUP,
          action: async () => onChangeFlag(FlagsTypesEnum.ACCOUNT_GROUP),
        },
        {
          label: FlagsTypesEnum.ACCOUNT_CLASS,
          action: async () => onChangeFlag(FlagsTypesEnum.ACCOUNT_CLASS),
        },
        {
          label: FlagsTypesEnum.COST_CENTER_TYPE,
          action: async () => onChangeFlag(FlagsTypesEnum.COST_CENTER_TYPE),
        },
        {
          label: FlagsTypesEnum.COST_CENTER_GROUP,
          action: async () => onChangeFlag(FlagsTypesEnum.COST_CENTER_GROUP),
        },
        {
          label: FlagsTypesEnum.PROJECT_TYPE,
          action: async () => onChangeFlag(FlagsTypesEnum.PROJECT_TYPE),
        },
        {
          label: FlagsTypesEnum.PROJECT_GROUP,
          action: async () => onChangeFlag(FlagsTypesEnum.PROJECT_GROUP),
        },
        {
          label: FlagsTypesEnum.COVENANT_TYPE,
          action: async () => onChangeFlag(FlagsTypesEnum.COVENANT_TYPE),
        },
        {
          label: FlagsTypesEnum.EXPENSE_TYPE,
          action: async () => onChangeFlag(FlagsTypesEnum.EXPENSE_TYPE),
        },
        {
          label: FlagsTypesEnum.ASSET_TYPE,
          action: async () => onChangeFlag(FlagsTypesEnum.ASSET_TYPE),
        },
        {
          label: FlagsTypesEnum.JURISDICTION_TYPE,
          action: async () => onChangeFlag(FlagsTypesEnum.JURISDICTION_TYPE),
        },
        {
          label: FlagsTypesEnum.RECEIPT_TYPE,
          action: async () => onChangeFlag(FlagsTypesEnum.RECEIPT_TYPE),
        },
        {
          label: FlagsTypesEnum.EMPLOYEE_TYPE,
          action: async () => onChangeFlag(FlagsTypesEnum.EMPLOYEE_TYPE),
        },
      ]
    }} />
  )
}