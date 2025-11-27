"use client"
import { useEffect, useState } from "react"
import { MdOutlineClose } from "react-icons/md"
import BlackLayer from "../../black-layer"
import Input from "../../input/InputField"
import { useAppSelector } from "@/store/hooks/selector"
import { useAppDispatch } from "@/store/hooks/dispatch"
import { closePopup, selectPopup } from "@/store/slices/popups-slice"
import { handleData } from "@/utils/base"
import { CLIENT_COLLECTOR_REQ } from "@/utils/requests/client-reqs/common-reqs"
import { SnakeBarTypeEnum } from "@/types/enums/common-enums"
import { openSnakeBar } from "@/store/slices/snake-bar-slice"
import { ADD_CHART_OF_ACCOUNT_CREQ, GET_CHARTS_OF_ACCOUNTS_CREQ, GET_FLAGS_FOR_CREATE_ACCOUNT_CREQ, GET_MAIN_ACCOUNTS_SELECT_LIST_CREQ } from "@/utils/erp-requests/clients-reqs/accounts-reqs"
import { fillTable } from "@/store/slices/tables-slice"
import Select from "../../Select"
import { ChartOfAccountsInterface } from "@/types/interfaces/erp/chart-of-accounts-interface"
import TreeView from "@/components/acc/tree-view/tree-view"
import { AccAnalyticEnum, AccNatureEnum, AccReportEnum, AccTypeEnum } from "@/types/enums/erp/acc-enums"

const createInitialFormState = () => ({
  ar_name: "",
  en_name: "",
  parent_id: "",
  acc_analy: '',
  acc_type: '',
  acc_rep: '',
  acc_nat: '',
})

type ChartOfAccountFormState = ReturnType<typeof createInitialFormState>

export default function ChartOfAccountsFormPopup() {
  const popup = useAppSelector(selectPopup("chartOfAccountsFormPopup"))
  const dispatch = useAppDispatch()
  const [data, setData] = useState<ChartOfAccountFormState>(createInitialFormState())
  const [loading, setLoading] = useState(false)
  const [accounts, setAccounts] = useState<ChartOfAccountsInterface[]>([])
  const [selectedParent, setSelectedParent] = useState<ChartOfAccountsInterface | null>(null)
  const [flags, setFlags] = useState<any>({
    account_class: [],
    account_group: [],
  })
  const [flagsData, setFlagsData] = useState({
    acc_class: '',
    acc_group: '',
  })
  const handleClose = () =>{
    dispatch(
      closePopup({
        popup: "chartOfAccountsFormPopup",
      })
    )}

  const fetchFlags = async () => {
    const res = await CLIENT_COLLECTOR_REQ(GET_FLAGS_FOR_CREATE_ACCOUNT_CREQ)
    console.log(res);
    if(res.done) {
      setFlags(res.data)
    }
  }
  const fetchAccounts = async () => {
    const res = await CLIENT_COLLECTOR_REQ(GET_MAIN_ACCOUNTS_SELECT_LIST_CREQ)
    console.log(res);
    if(res.done) {
      setAccounts(res.data.accounts)
    }
  }
  useEffect(() => {
    setSelectedParent(accounts.find((e) => e.id === data.parent_id) ?? null)
  }, [accounts, data.parent_id])
  useEffect(() => {
    if (!popup.isOpen) {
      setData(createInitialFormState())
      return
    }
    if (popup.data) {
      setData({
        ar_name: popup.data?.ar_name || "",
        en_name: popup.data?.en_name || "",
        parent_id: popup.data?.parent_id || "",
        acc_analy: popup.data?.acc_analy || "",
        acc_nat: popup.data?.acc_nat || "",
        acc_rep: popup.data?.acc_rep || "",
        acc_type: popup.data?.acc_type || "",
      })
    }
    if(popup.isOpen) {
      fetchFlags()
      fetchAccounts()
    }
  }, [popup.isOpen, popup.data])

  useEffect(() => {
    window.HSStaticMethods?.autoInit?.();
  }, []);
  console.log(selectedParent);
  useEffect(() => {
    if(selectedParent) {
      setData({...data,
        acc_analy: selectedParent.acc_analy,
        acc_nat: selectedParent.acc_nat,
        acc_rep: selectedParent.acc_rep,
        acc_type: selectedParent.acc_type,
      })
    }
  }, [selectedParent])
  const handleOpenSnakeBar = (type: SnakeBarTypeEnum, message: string) => {
    dispatch(
      openSnakeBar({
        type,
        message,
      })
    )
  }

  const isValid = () => {
    const { ar_name, en_name, acc_nat, acc_rep, acc_type } = data
    if (ar_name.trim()?.length === 0) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Arabic name is required")
      return false
    }
    if (en_name.trim()?.length === 0) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Arabic name is required")
      return false
    }
    if (!acc_rep) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Arabic name is required")
      return false
    }
    if (!acc_type) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Arabic name is required")
      return false
    }
    if (!acc_nat) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Arabic name is required")
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (loading) return
    if (!isValid()) return

    const payload: any = {
      ar_name: data.ar_name.trim(),
      en_name: data.en_name.trim() || undefined,
      parent_id: data.parent_id.trim() || undefined,
      acc_analy: data.acc_analy !== '' ? data.acc_analy : undefined,
      acc_type: data.acc_type,
      acc_rep: data.acc_rep,
      acc_nat: data.acc_nat,
    }

    setLoading(true)
    const res = await CLIENT_COLLECTOR_REQ(ADD_CHART_OF_ACCOUNT_CREQ, { data: payload })
    setLoading(false)

    if (res.done) {
      handleOpenSnakeBar(SnakeBarTypeEnum.SUCCESS, "Account created successfully")
      handleClose()
      setData(createInitialFormState())
      const refreshed = await CLIENT_COLLECTOR_REQ(GET_CHARTS_OF_ACCOUNTS_CREQ)
      if (refreshed?.done) {
        dispatch(
          fillTable({
            tableName: "chartOfAccountsTable",
            obj: {
              data: refreshed.data.accounts,
              total: refreshed.data.total,
            },
          })
        )
      }
      return
    }

    handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, res.message || "Failed to create account")
  }

  if (!popup.isOpen) {
    return null
  }
  const fixArrToSelect = (arr: any[]) => {
    return arr.map((e: any) => ({label: e.en_name ?? e.ar_name, value: e.id}))
  }
  return (
    <BlackLayer onClick={handleClose}>
      <div
        className="min-w-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Create Account</h3>
            <button
              onClick={handleClose}
              className="text-xl !bg-brand-500 hover:bg-brand-600! rounded-full text-white w-[30px] h-[30px] flex justify-center items-center"
            >
              <MdOutlineClose />
            </button>
          </div>
        </div>
        <div className="flex justify-between border-t border-gray-100 dark:border-gray-800 p-4 sm:p-6 max-h-[calc(100dvh-120px)] overflow-y-scroll custom-scrollbar gap-[50px]">
          <div>
            <div className="space-y-6">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-8">
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Basic Info</p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <Input
                          placeholder="Arabic Name"
                          value={data.ar_name}
                          onChange={(e) => handleData(setData, "ar_name", e.target.value)}
                        />
                      </div>
                      <div>
                        <Input
                          placeholder="English Name"
                          value={data.en_name}
                          onChange={(e) => handleData(setData, "en_name", e.target.value)}
                        />
                      </div>
                      <div className="col-span-full">
                        <Select options={accounts ? ([{
                          label: '',
                          value: ''
                        }, ...accounts?.map((e) => ({label: e.en_name, value: e.id}))]) : []} placeholder="Main Account" value={data.parent_id} onChange={(e) => handleData(setData, 'parent_id', e.target.value)} />
                      </div>
                    </div>
                    <div className="ml-auto w-fit">
                      <Input
                        placeholder="Level"
                        value={(selectedParent?.level ? +selectedParent?.level + 1 : 1).toString()}
                        disabled={true}
                        slug={`Level`}
                        className={'!w-[45px]'}
                      />
                    </div>
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mt-[40px]">Flags</p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <Select options={[{
                          label: AccTypeEnum.MAIN,
                          value: AccTypeEnum.MAIN,
                        },
                        {
                          label: AccTypeEnum.SUB,
                          value: AccTypeEnum.SUB,
                        }]} placeholder="Account Type" value={data.acc_type} onChange={(e) => handleData(setData, 'acc_type', e.target.value)} />
                      </div>
                      <div>
                        <Select options={[
                          {
                            label: AccReportEnum.BALANCE_SHEET,
                            value: AccReportEnum.BALANCE_SHEET,
                          },
                          {
                            label: AccReportEnum.B_AND_L,
                            value: AccReportEnum.B_AND_L,
                          },
                        ]} placeholder="Account Report Type" value={data.acc_rep} onChange={(e) => handleData(setData, 'acc_rep', e.target.value)} />
                      </div>
                      <div>
                        <Select options={[
                          {
                            label: AccNatureEnum.DEPIT,
                            value: AccNatureEnum.DEPIT,
                          },
                          {
                            label: AccNatureEnum.CREDIT,
                            value: AccNatureEnum.CREDIT,
                          },
                        ]} placeholder="Account Nature" value={data.acc_nat} onChange={(e) => handleData(setData, 'acc_nat', e.target.value)} />
                      </div>
                      <div>
                        <Select options={[
                          {
                            label: AccAnalyticEnum.GENERAL,
                            value: AccAnalyticEnum.GENERAL,
                          },
                          {
                            label: AccAnalyticEnum.CASH_HAND,
                            value: AccAnalyticEnum.CASH_HAND,
                          },
                          {
                            label: AccAnalyticEnum.BANKS,
                            value: AccAnalyticEnum.BANKS,
                          },
                          {
                            label: AccAnalyticEnum.CUSTOMERS,
                            value: AccAnalyticEnum.CUSTOMERS,
                          },
                          {
                            label: AccAnalyticEnum.SUPPLIERS,
                            value: AccAnalyticEnum.SUPPLIERS,
                          },
                          {
                            label: AccAnalyticEnum.EMPLOYEE,
                            value: AccAnalyticEnum.EMPLOYEE,
                          },
                          {
                            label: AccAnalyticEnum.CON_CUSTOMER,
                            value: AccAnalyticEnum.CON_CUSTOMER,
                          },
                          {
                            label: AccAnalyticEnum.CON_SUPPLIERS,
                            value: AccAnalyticEnum.CON_SUPPLIERS,
                          },
                          {
                            label: AccAnalyticEnum.CON_EMP,
                            value: AccAnalyticEnum.CON_EMP,
                          },
                          {
                            label: AccAnalyticEnum.DEPIT_GROUP,
                            value: AccAnalyticEnum.DEPIT_GROUP,
                          },
                          {
                            label: AccAnalyticEnum.CREDIT_GROUP,
                            value: AccAnalyticEnum.CREDIT_GROUP,
                          },
                          {
                            label: AccAnalyticEnum.EX,
                            value: AccAnalyticEnum.EX,
                          },
                        ]} placeholder="Account Analy" value={data.acc_analy} onChange={(e) => handleData(setData, 'acc_analy', e.target.value)} />
                      </div>
                      <div>
                        <Select options={fixArrToSelect(flags.account_class)} placeholder="Account Class" value={flagsData.acc_class} onChange={(e) => handleData(setFlagsData, 'acc_class', e.target.value)} />
                      </div>
                      <div>
                        <Select options={fixArrToSelect(flags.account_group)} placeholder="Account Group" value={flagsData.acc_group} onChange={(e) => handleData(setFlagsData, 'acc_group', e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-full flex justify-center">
                    <button
                      onClick={handleSubmit}
                      className="w-fit inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Submit"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className=" min-w-[400px]">
          <TreeView
          />
          </div>
        </div>
      </div>
    </BlackLayer>
  )
}