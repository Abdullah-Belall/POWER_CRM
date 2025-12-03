"use client"
import { useEffect, useState } from "react"
import { MdOutlineClose } from "react-icons/md"
import { useAppSelector } from "@/store/hooks/selector"
import { useAppDispatch } from "@/store/hooks/dispatch"
import { closePopup, selectPopup } from "@/store/slices/popups-slice"
import { handleData } from "@/utils/base"
import { CLIENT_COLLECTOR_REQ } from "@/utils/requests/client-reqs/common-reqs"
import { SnakeBarTypeEnum } from "@/types/enums/common-enums"
import { openSnakeBar } from "@/store/slices/snake-bar-slice"
import { fillTable } from "@/store/slices/tables-slice"
import { AccAnalyticEnum, AccTypeEnum} from "@/types/enums/erp/acc-enums"
import BlackLayer from "../../black-layer"
import Input from "../../input/InputField"
import Select from "../../Select"
import TextArea from "../../input/TextArea"
import { TenantBranchInterface } from "@/types/interfaces/tenants-interface"
import { GET_TENANT_BRANCHES_CREQ } from "@/utils/requests/client-reqs/tenants-reqs"
import { CREATE_BANK_FUND_CREQ, EDIT_FUND_CREQ, GET_FUNDS_CREQ } from "@/utils/erp-requests/clients-reqs/funds-reqs"
import { CurrencyInterface } from "@/types/interfaces/erp/currencies-interface"
import MultiSelect from "../../MultiSelect"
import { ChartOfAccountsInterface } from "@/types/interfaces/erp/chart-of-accounts-interface"
import { GET_MAIN_ACCOUNTS_SELECT_LIST_CREQ } from "@/utils/erp-requests/clients-reqs/accounts-reqs"
import Checkbox from "../../input/Checkbox"

const createInitialFormState = () => ({
  branch_id: '',
  acc_id: '',
  notes_receivable_acc_id: '',
  notes_payable_acc_id: '',
  ar_name: "",
  en_name: "",
  cashier: "",
  notes: '',

  bank_acc_num: '',
  bank_branch: '',
  bank_manager: '',
  bank_employee_phone: '',
  bank_address: '',
  iban: '',
  swift: '',
})

type GroupSettingFormState = ReturnType<typeof createInitialFormState>

export default function BankFundFormPopup() {
  const popup = useAppSelector(selectPopup("bankfundFormPopup"))
  const updatePopup = useAppSelector(selectPopup("updateBankFundsFormPopup"))
  const dispatch = useAppDispatch()
  const [data, setData] = useState<GroupSettingFormState>(createInitialFormState())
  const [loading, setLoading] = useState(false)
  const [enterBankInfo, setEnterBankInfo] = useState(false)
  const [banksAccounts, setBanksAccounts] = useState<ChartOfAccountsInterface[]>([])
  const [generalAccounts, setGeneralAccounts] = useState<ChartOfAccountsInterface[]>([])
  const [accCurrencies, setAccCurrencies] = useState<CurrencyInterface[]>([])
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([])
  const [branches, setBranches] = useState<TenantBranchInterface[]>([])
  const handleClose = () => {
    dispatch(
      closePopup({
        popup: "bankfundFormPopup",
      })
    )
    dispatch(
      closePopup({
        popup: "updateBankFundsFormPopup",
      })
    )
    setData(createInitialFormState())
    setAccCurrencies([])
    setSelectedCurrencies([])
    setEnterBankInfo(false)
  }
  const fetchBranches = async () => {
    const res = await CLIENT_COLLECTOR_REQ(GET_TENANT_BRANCHES_CREQ ,{})
    if(res.done) {
      setBranches(res.data.branches)
    }
  }
  const fetchBanksAccs = async () => {
    const res = await CLIENT_COLLECTOR_REQ(GET_MAIN_ACCOUNTS_SELECT_LIST_CREQ, {acc_analy_type: AccAnalyticEnum.BANKS, acc_type: AccTypeEnum.SUB})
    if(res.done) {
      setBanksAccounts(res.data.accounts)
    }
  }
  const fetchGeneralAccs = async () => {
    const res = await CLIENT_COLLECTOR_REQ(GET_MAIN_ACCOUNTS_SELECT_LIST_CREQ, {acc_analy_type: AccAnalyticEnum.GENERAL, acc_type: AccTypeEnum.SUB})
    if(res.done) {
      setGeneralAccounts(res.data.accounts)
    }
  }
  useEffect(() => {
    if(popup.isOpen) {
      fetchBranches()
      fetchBanksAccs()
      fetchGeneralAccs()
    }
  }, [popup.isOpen])
  useEffect(() => {
    if(updatePopup.isOpen) {
      setData({
        acc_id: updatePopup.data?.bank_fund?.acc?.id || '',
        notes_payable_acc_id: updatePopup.data?.bank_fund?.notes_payable_acc?.id || '',
        notes_receivable_acc_id: updatePopup.data?.bank_fund?.notes_receivable_acc?.id || '',
        ar_name: updatePopup.data?.ar_name || "",
        en_name: updatePopup.data?.en_name || "",
        notes: updatePopup.data?.notes || "",
        branch_id: updatePopup.data?.branch_id || '',
        cashier: updatePopup.data?.cashier || '',
        bank_acc_num: String(updatePopup.data?.bank_fund?.bank_acc_num || ''),
        bank_branch: updatePopup.data?.bank_fund?.bank_branch || '',
        bank_manager: updatePopup.data?.bank_fund?.bank_manager || '',
        bank_employee_phone: updatePopup.data?.bank_fund?.bank_employee_phone || '',
        bank_address: updatePopup.data?.bank_fund?.bank_address || '',
        iban: updatePopup.data?.bank_fund?.iban || '',
        swift: updatePopup.data?.bank_fund?.swift || '',
      })
      setAccCurrencies(updatePopup.data?.currencies || [])
      setSelectedCurrencies(updatePopup.data?.currencies?.map((e) => e.id) || [])
      if(updatePopup.data?.bank_fund?.bank_acc_num) {
        setEnterBankInfo(true)
      }
    }
  }, [updatePopup.isOpen, updatePopup.data])
  //* RENDER CURRENCIES AFTER SELECT GROUP
  useEffect(() => {
    if(data.acc_id === '') {
      setAccCurrencies([])
      return;
    }
    if(data.acc_id && !updatePopup.isOpen) {
      setAccCurrencies(banksAccounts.find((e) => e.id === data.acc_id)?.currencies || [])
    }
  }, [data.acc_id]) 
  const handleOpenSnakeBar = (type: SnakeBarTypeEnum, message: string) => {
    dispatch(
      openSnakeBar({
        type,
        message,
      })
    )
  }
  const isValid = () => {
    const { ar_name, branch_id, cashier, acc_id, notes_receivable_acc_id, notes_payable_acc_id } = data
    
    if (branch_id.trim()?.length === 0) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Branch is required")
      return false
    }
    
    if (acc_id.trim()?.length === 0) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Account is required")
      return false
    }
    
    if (selectedCurrencies.length === 0) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "At least one currency must be selected")
      return false
    }
    
    if (ar_name.trim()?.length === 0) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Arabic name is required")
      return false
    }
    
    if (cashier.trim()?.length === 0) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Cashier is required")
      return false
    }
    
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(branch_id)) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Invalid branch ID format")
      return false
    }
    
    if (!uuidRegex.test(acc_id)) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Invalid account ID format")
      return false
    }
    
    if (notes_receivable_acc_id.trim()?.length > 0 && !uuidRegex.test(notes_receivable_acc_id)) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Invalid notes receivable account ID format")
      return false
    }
    
    if (notes_payable_acc_id.trim()?.length > 0 && !uuidRegex.test(notes_payable_acc_id)) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Invalid notes payable account ID format")
      return false
    }
    
    try {
      const currenciesJson = JSON.stringify(selectedCurrencies)
      JSON.parse(currenciesJson)
    } catch {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Invalid currencies format")
      return false
    }
    
    return true
  }
  const refetchData = async () => {
    const refreshed = await CLIENT_COLLECTOR_REQ(GET_FUNDS_CREQ, { type: AccAnalyticEnum.BANKS })
      if (refreshed?.done) {
        dispatch(
          fillTable({
            tableName: 'cashAtBanksFundsTable',
            obj: {
              data: refreshed.data.funds,
              total: refreshed.data.total,
            },
          })
        )
      }
  }
  const handleSubmit = async () => {
    if (loading) return
    if (!isValid()) return

    let payload: any = {
      branch_id: data.branch_id,
      acc_id: data.acc_id,
      notes_receivable_acc_id: data.notes_receivable_acc_id.trim()?.length > 0 ? data.notes_receivable_acc_id : undefined,
      notes_payable_acc_id: data.notes_payable_acc_id.trim()?.length > 0 ? data.notes_payable_acc_id : undefined,
      ar_name: data.ar_name.trim(),
      en_name: data.en_name.trim()?.length > 0 ? data.en_name : undefined,
      cashier: data.cashier.trim(),
      currencies_ids: JSON.stringify(selectedCurrencies),
      notes: data.notes.trim()?.length > 0 ? data.notes : undefined,
    }

    if(enterBankInfo) {
      payload = {...payload,
        bank_acc_num: data.bank_acc_num.trim()?.length > 0 ? Number(data.bank_acc_num) : undefined,
        bank_branch: data.bank_branch.trim()?.length > 0 ? data.bank_branch : undefined,
        bank_manager: data.bank_manager.trim()?.length > 0 ? data.bank_manager : undefined,
        bank_employee_phone: data.bank_employee_phone.trim()?.length > 0 ? data.bank_employee_phone : undefined,
        bank_address: data.bank_address.trim()?.length > 0 ? data.bank_address : undefined,
        iban: data.iban.trim()?.length > 0 ? data.iban : undefined,
        swift: data.swift.trim()?.length > 0 ? data.swift : undefined,
      }
    }

    setLoading(true)
    const res = await CLIENT_COLLECTOR_REQ(CREATE_BANK_FUND_CREQ, { data: payload })
    setLoading(false)

    if (res.done) {
      handleClose()
      handleOpenSnakeBar(SnakeBarTypeEnum.SUCCESS, "Fund created successfully")
      await refetchData()
      return
    }

    handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, res.message || "Failed to create fund")
  }
  const handleUpdate = async () => {
    if(loading) return;
    if (!isValid()) return
    
    const payload: any = {
      ar_name: data.ar_name.trim(),
      en_name: data.en_name.trim()?.length > 0 ? data.en_name : undefined,
      cashier: data.cashier.trim(),
      notes: data.notes.trim()?.length > 0 ? data.notes : undefined,
    }
    
    setLoading(true)
    const res = await CLIENT_COLLECTOR_REQ(EDIT_FUND_CREQ, { data: payload, id: updatePopup.data?.id })
    setLoading(false)
    if(res.done) {
      handleClose()
      handleOpenSnakeBar(SnakeBarTypeEnum.SUCCESS, "Funds updated successfully")
      setData(createInitialFormState())
      dispatch(closePopup({
        popup: 'updateBankFundsFormPopup'
      }))
      await refetchData()
      return
    } else {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, res.message || "Failed to update fund")
    }
  }
  if (!popup.isOpen) {
    return null
  }
  return (
    <BlackLayer onClick={handleClose}>
      <div
        className="w-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Fund</h3>
            <button
              onClick={handleClose}
              className="text-xl !bg-brand-500 hover:bg-brand-600! rounded-full text-white w-[30px] h-[30px] flex justify-center items-center"
            >
              <MdOutlineClose />
            </button>
          </div>
        </div>
        <div className="w-full flex justify-between border-t border-gray-100 dark:border-gray-800 p-4 sm:p-6 max-h-[calc(100dvh-120px)] overflow-y-scroll custom-scrollbar gap-[50px]">
          <div className="w-full space-y-6">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-8">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">General Info</p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="col-span-full">
                      <Select 
                      disabled={updatePopup.isOpen}
                      options={branches?.map((e) => ({label: e.en_name || e.ar_name, value: e.id}))} placeholder="Select Branch" value={data.branch_id} onChange={(e) => handleData(setData, 'branch_id', e.target.value)} />
                    </div>
                    <div className="col-span-full">
                      <Select 
                      disabled={updatePopup.isOpen}
                      options={banksAccounts?.map((e) => ({label:   (e.code) + ' | ' + (e.en_name || e.ar_name) , value: e.id}))} placeholder="Select Account" value={data.acc_id} onChange={(e) => handleData(setData, 'acc_id', e.target.value)} />
                    </div>
                    <div className="col-span-full">
                      <MultiSelect 
                        options={accCurrencies.map((group: any) => ({
                          value: String(group.id), 
                          text: group.index + ' | ' + (group.en_name || group.ar_name), 
                          selected: group.selected
                        }))}
                        defaultSelected={selectedCurrencies}
                        label="Select Currencies"
                        disabled={updatePopup.isOpen}
                        onChange={(selectedIds) => {
                          const selected = accCurrencies.filter((group: any) => 
                            selectedIds.includes(String(group.id))
                          );
                          setSelectedCurrencies(selected.map((e) => e.id));
                        }}
                      />
                    </div>
                    <p className="col-span-full text-sm font-semibold text-gray-600 dark:text-gray-300">Basic Info</p>
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
                        <Input
                          placeholder="Cashier"
                          value={data.cashier}
                          onChange={(e) => handleData(setData, "cashier", e.target.value)}
                        />
                      </div>
                      <div className="col-span-full">
                      <TextArea
                        placeholder="Notes"
                        value={data.notes}
                        onChange={(e) => handleData(setData, 'notes', e.target.value)}
                        rows={4}
                      />
                      </div>
                      <p className="col-span-full text-sm font-semibold text-gray-600 dark:text-gray-300">Other Info</p>
                      <div className="col-span-full">
                        <Select 
                        disabled={updatePopup.isOpen}
                        options={generalAccounts?.map((e) => ({label:   (e.code) + ' | ' + (e.en_name || e.ar_name) , value: e.id}))} placeholder="Select Notes Receivable Account" value={data.notes_receivable_acc_id} onChange={(e) => handleData(setData, 'notes_receivable_acc_id', e.target.value)} />
                      </div>
                      <div className="col-span-full">
                        <Select 
                        disabled={updatePopup.isOpen}
                        options={generalAccounts?.map((e) => ({label:   (e.code) + ' | ' + (e.en_name || e.ar_name) , value: e.id}))} placeholder="Select Notes Payable Account" value={data.notes_payable_acc_id} onChange={(e) => handleData(setData, 'notes_payable_acc_id', e.target.value)} />
                      </div>
                      <div className="col-span-full">
                        <Checkbox
                          label="Enter Bank Info"
                          checked={enterBankInfo}
                          // disabled={viewPopup.isOpen}
                          onChange={() => setEnterBankInfo(!enterBankInfo)}
                        />
                      </div>
                      {
                        enterBankInfo ? 
                        <>
                            <div className="col-span-full">
                            <Input
                              placeholder="Bank Account Number"
                              value={data.bank_acc_num}
                              onChange={(e) => handleData(setData, "bank_acc_num", e.target.value)}
                            />
                          </div>
                          <div className="col-span-full">
                            <Input
                              placeholder="Bank Branch"
                              value={data.bank_branch}
                              onChange={(e) => handleData(setData, "bank_branch", e.target.value)}
                            />
                          </div>
                          <div>
                            <Input
                              placeholder="Bank Manager"
                              value={data.bank_manager}
                              onChange={(e) => handleData(setData, "bank_manager", e.target.value)}
                            />
                          </div>
                          <div>
                            <Input
                              placeholder="Employee Phone"
                              value={data.bank_employee_phone}
                              onChange={(e) => handleData(setData, "bank_employee_phone", e.target.value)}
                            />
                          </div>
                          <div className="col-span-full">
                            <Input
                              placeholder="Bank Address"
                              value={data.bank_address}
                              onChange={(e) => handleData(setData, "bank_address", e.target.value)}
                            />
                          </div>
                          <div className="col-span-full">
                            <Input
                              placeholder="IBAN"
                              value={data.iban}
                              onChange={(e) => handleData(setData, "iban", e.target.value)}
                            />
                          </div>
                          <div className="col-span-full">
                            <Input
                              placeholder="SWIFT"
                              value={data.swift}
                              onChange={(e) => handleData(setData, "swift", e.target.value)}
                            />
                          </div>
                        </> : ''
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
      </div>
    </BlackLayer>
  )
}