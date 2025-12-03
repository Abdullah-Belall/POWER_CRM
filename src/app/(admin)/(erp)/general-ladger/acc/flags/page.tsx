"use client"
import TableActions from "@/components/common/table-actions";
import FlagsFormPopup from "@/components/form/erp/acc/flags-form-popup";
import FlagsTable from "@/components/tables/erp/acc/flags-table";
import { FlagsTypesEnum } from "@/types/enums/erp/flags-enum";
import { FlagInterface } from "@/types/interfaces/erp/flag-interface";
import { GET_FLAGS_CREQ } from "@/utils/erp-requests/clients-reqs/accounts-reqs";
import { CLIENT_COLLECTOR_REQ } from "@/utils/requests/client-reqs/common-reqs";
import { useEffect, useState } from "react";

export default function Flags() {
  const [flagType, setFlagType] = useState(FlagsTypesEnum.ACCOUNT_GROUP)
  const [data, setData] = useState<{
    flags: FlagInterface[],
    total: number
  }>({
    flags: [],
    total: 0
  })
  const fetchData = async (flagType: FlagsTypesEnum) => {
    const res = await CLIENT_COLLECTOR_REQ(GET_FLAGS_CREQ, {type: flagType})
    if(res.data) {
      setData({
        flags: res.data?.flags,
        total: res.data?.total
      })
    }
  }
  useEffect(() => {
    fetchData(FlagsTypesEnum.ACCOUNT_GROUP)
  },[])
  return (
    <>
    <div>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Flags
            </h3>
          </div>
          <TableActions popup={'flagsFormPopup'} btn={'Add Flag'} />
        </div>
        <div>
          <FlagsTable data={data} flag_type={flagType} onChangeFlag={(flag:FlagsTypesEnum) => {
            fetchData(flag)
            setFlagType(flag)
          }} />
        </div>
      </div>
    </div>
    <FlagsFormPopup />
    </>
  )
}