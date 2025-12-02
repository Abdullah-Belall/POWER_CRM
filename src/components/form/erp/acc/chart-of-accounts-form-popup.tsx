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
import { ADD_CHART_OF_ACCOUNT_CREQ, EDIT_ACCOUNT_CREQ, GET_CHARTS_OF_ACCOUNTS_CREQ, GET_FLAGS_FOR_CREATE_ACCOUNT_CREQ, GET_MAIN_ACCOUNTS_SELECT_LIST_CREQ } from "@/utils/erp-requests/clients-reqs/accounts-reqs"
import { fillTable, getTable } from "@/store/slices/tables-slice"
import Select from "../../Select"
import { ChartOfAccountsInterface } from "@/types/interfaces/erp/chart-of-accounts-interface"
import ChartAccountsTreeView from "@/components/acc/tree-view/chart-accounts-tree-view"
import { AccAnalyticEnum, AccNatureEnum, AccReportEnum, AccTypeEnum } from "@/types/enums/erp/acc-enums"
import { CurrencyInterface } from "@/types/interfaces/erp/currencies-interface"
import { GET_CURRENCIES_CREQ } from "@/utils/erp-requests/clients-reqs/currency-reqs"
import MultiSelect from "../../MultiSelect"

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
  const updatePopup = useAppSelector(selectPopup("updateAccFormPopup"))
  const dispatch = useAppDispatch()
  const [data, setData] = useState<ChartOfAccountFormState>(createInitialFormState())
  const [loading, setLoading] = useState(false)
  const [accounts, setAccounts] = useState<ChartOfAccountsInterface[]>([])
  const [selectedParent, setSelectedParent] = useState<ChartOfAccountsInterface | null>(null)
  const [currencies, setCurrencies] = useState<CurrencyInterface[]>([])
  const [selectedCurrencies, setSelectedCurrencies] = useState<CurrencyInterface[]>([])
  const [flags, setFlags] = useState<any>({
    account_class: [],
    account_group: [],
  })
  const [flagsData, setFlagsData] = useState({
    acc_class: '',
    acc_group: '',
  })
  const tableData = useAppSelector(getTable('chartOfAccountsTable'))
  const handleClose = () =>{
    dispatch(
      closePopup({
        popup: "chartOfAccountsFormPopup",
      })
    )
    dispatch(
      closePopup({
        popup: "updateAccFormPopup",
      })
    )
  }

  const fetchFlags = async () => {
    const res = await CLIENT_COLLECTOR_REQ(GET_FLAGS_FOR_CREATE_ACCOUNT_CREQ)
    console.log(res);
    if(res.done) {
      setFlags(res.data)
    }
  }
  const fetchAccounts = async () => {
    const res = await CLIENT_COLLECTOR_REQ(GET_MAIN_ACCOUNTS_SELECT_LIST_CREQ, {acc_type: AccTypeEnum.MAIN})
    console.log(`-------------`);
    console.log(res);
    if(res.done) {
      setAccounts(res.data.accounts)
    }
  }
  const fetchCurrencies = async () => {
    const res = await CLIENT_COLLECTOR_REQ(GET_CURRENCIES_CREQ)
    if(res.done) {
      setCurrencies(res.data.currencies)
    }
  }
  useEffect(() => {
    if(popup.isOpen) {
      fetchAccounts()
      fetchFlags()
    }
  }, [popup.isOpen, tableData])
  //* Fetch Currencies
  useEffect(() => {
    if(data.acc_type === AccTypeEnum.SUB && popup.isOpen) {
      fetchCurrencies()
    }
  }, [data.acc_type, popup.isOpen])
  //* Set Selected Parent
  useEffect(() => {
    setSelectedParent(accounts.find((e) => e.id === data.parent_id) ?? null)
  }, [accounts, data.parent_id])

  //* Render Selected Parent
  useEffect(() => {
    if(selectedParent && updatePopup.data?.parent?.id !== selectedParent?.id) {
      setData({...data,
        acc_analy: selectedParent.acc_analy,
        acc_nat: selectedParent.acc_nat,
        acc_rep: selectedParent.acc_rep,
        acc_type: selectedParent.acc_type,
      })
    }
  }, [selectedParent])

  //* Render Selected From The Tree
  useEffect(() => {
    if (!updatePopup.isOpen) {
      setData(createInitialFormState())
      return
    }
    console.log(updatePopup.data?.parent?.id);
    if (updatePopup.data) {
      setData({
        ar_name: updatePopup.data?.ar_name || "",
        en_name: updatePopup.data?.en_name || "",
        parent_id: (updatePopup.data?.parent?.id as string) || "",
        acc_analy: updatePopup.data?.acc_analy || "",
        acc_nat: updatePopup.data?.acc_nat || "",
        acc_rep: updatePopup.data?.acc_rep || "",
        acc_type: updatePopup.data?.acc_type || "",
      })
      setSelectedCurrencies(updatePopup.data.currencies)
      setCurrencies([...currencies])
    }
  }, [updatePopup.isOpen, updatePopup.data])
  const handleOpenSnakeBar = (type: SnakeBarTypeEnum, message: string) => {
    dispatch(
      openSnakeBar({
        type,
        message,
      })
    )
  }
  const isValid = () => {
    const { ar_name, acc_nat, acc_rep, acc_type } = data
    if (ar_name.trim()?.length === 0) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Arabic name is required")
      return false
    }
    // if (en_name.trim()?.length === 0) {
    //   handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "English name is required")
    //   return false
    // }
    if (!acc_type) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Account Type is required")
      return false
    }
    if (!acc_rep) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Account Report is required")
      return false
    }
    if (!acc_nat) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Account Nature is required")
      return false
    }
    if(acc_type === AccTypeEnum.SUB && selectedCurrencies.length === 0) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Currencies is requierd at Sub Accounts")
      return false
    }
    return true
  }
  const refetchData = async () => {
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
  }
  const handleSubmit = async () => {
    if (loading) return
    if (!isValid()) return

    const payload: any = {
      ar_name: data.ar_name.trim(),
      en_name: data.en_name.trim()?.length > 0 ? data.en_name : undefined,
      parent_id: data.parent_id.trim() || undefined,
      acc_analy: data.acc_analy !== '' ? data.acc_analy : undefined,
      acc_type: data.acc_type,
      acc_rep: data.acc_rep,
      acc_nat: data.acc_nat,
      currencies_ids: data.acc_type === AccTypeEnum.SUB ? JSON.stringify(selectedCurrencies.map((e) => e.id)) : undefined
    }

    setLoading(true)
    const res = await CLIENT_COLLECTOR_REQ(ADD_CHART_OF_ACCOUNT_CREQ, { data: payload })
    setLoading(false)

    if (res.done) {
      handleOpenSnakeBar(SnakeBarTypeEnum.SUCCESS, "Account created successfully")
      setData(createInitialFormState())
      setSelectedCurrencies([])
      setFlagsData({
        acc_class: '',
        acc_group: ""
      })
      await refetchData()
      return
    }

    handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, res.message || "Failed to create account")
  }
  const handleUpdate = async () => {
    if(loading) return;
    if (!isValid()) return

    const payload: any = {
      ar_name: data.ar_name.trim(),
      en_name: data.en_name.trim() || undefined,
      acc_rep: data.acc_rep,
      currencies_ids: data.acc_type === AccTypeEnum.SUB ? JSON.stringify(selectedCurrencies.map((e) => e.id)) : undefined
    }
    
    setLoading(true)
    const res = await CLIENT_COLLECTOR_REQ(EDIT_ACCOUNT_CREQ, { data: payload, id: updatePopup.data?.id })
    setLoading(false)
    if(res.done) {
      handleOpenSnakeBar(SnakeBarTypeEnum.SUCCESS, "Account updated successfully")
      setData(createInitialFormState())
      setSelectedCurrencies([])
      setFlagsData({
        acc_class: '',
        acc_group: ""
      })
      dispatch(closePopup({
        popup: 'updateAccFormPopup'
      }))
      await refetchData()
      return
    }
  }
  useEffect(() => {
    window.HSStaticMethods?.autoInit?.();
  }, []);
  if (!popup.isOpen) {
    return null
  }

  const fixArrToSelect = (arr: any[]) => {
    return arr.map((e: any) => ({label: e.en_name ?? e.ar_name, value: e.id}))
  }

  console.log(selectedCurrencies);
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
                        <Select 
                        disabled={updatePopup.isOpen}
                        options={accounts ? ([{
                          label: '',
                          value: ''
                        }, ...accounts?.map((e) => ({label: e.en_name || e.ar_name, value: e.id}))]) : []} placeholder="Main Account" value={data.parent_id} onChange={(e) => handleData(setData, 'parent_id', e.target.value)} />
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
                        }]} 
                        disabled={updatePopup.isOpen}
                        placeholder="Account Type" value={data.acc_type} onChange={(e) => handleData(setData, 'acc_type', e.target.value)} />
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
                        ]} 
                        disabled={updatePopup.isOpen}
                        placeholder="Account Nature" value={data.acc_nat} onChange={(e) => handleData(setData, 'acc_nat', e.target.value)} />
                      </div>
                      <div>
                        <Select options={[
                          {
                            label: AccAnalyticEnum.GENERAL,
                            value: AccAnalyticEnum.GENERAL,
                          },
                          {
                            label: AccAnalyticEnum.ASSITS,
                            value: AccAnalyticEnum.ASSITS,
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
                            label: AccAnalyticEnum.INCOME,
                            value: AccAnalyticEnum.INCOME,
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
                        ]} 
                        disabled={updatePopup.isOpen}
                        placeholder="Account Analy" value={data.acc_analy} onChange={(e) => handleData(setData, 'acc_analy', e.target.value)} />
                      </div>
                      <div>
                        <Select options={fixArrToSelect(flags.account_class)} placeholder="Account Class" value={flagsData.acc_class} onChange={(e) => handleData(setFlagsData, 'acc_class', e.target.value)} />
                      </div>
                      <div>
                        <Select options={fixArrToSelect(flags.account_group)} placeholder="Account Group" value={flagsData.acc_group} onChange={(e) => handleData(setFlagsData, 'acc_group', e.target.value)} />
                      </div>
                      {
                        data.acc_type === AccTypeEnum.SUB ? 
                        <div className="col-span-full">
                          <MultiSelect defaultSelected={selectedCurrencies.map((e) => e.id)} options={currencies?.map((e: any) => ({
                            text: (e.en_name || e.ar_name),
                            value: e.id,
                            selected: e.selected
                          }))} label="Currencies" onChange={(selectedIds) => {
                            const selected = currencies?.filter((curr: any) => 
                              selectedIds.includes(String(curr.id))
                            );
                            setSelectedCurrencies(selected);
                          }} />
                        </div> : ""
                      }
                    </div>
                  </div>

                  <div className="col-span-full flex justify-center mb-3">
                    <button
                      onClick={updatePopup.isOpen ? handleUpdate : handleSubmit}
                      className="w-fit inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : updatePopup.isOpen ? 'Edit' :"Submit"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className=" min-w-[400px]">
          <ChartAccountsTreeView
          />
          </div>
        </div>
      </div>
    </BlackLayer>
  )
}