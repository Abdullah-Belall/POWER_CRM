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
import { fillTable, TablesDataState } from "@/store/slices/tables-slice"
import { AccAnalyticEnum} from "@/types/enums/erp/acc-enums"
import BlackLayer from "../../black-layer"
import Input from "../../input/InputField"
import Select from "../../Select"
import TextArea from "../../input/TextArea"
import { TenantBranchInterface } from "@/types/interfaces/tenants-interface"
import { GroupSettingInterface } from "@/types/interfaces/erp/group-interface"
import { GET_TENANT_BRANCHES_CREQ } from "@/utils/requests/client-reqs/tenants-reqs"
import { CREATE_FUND_CREQ, EDIT_FUND_CREQ, GET_FUNDS_CREQ } from "@/utils/erp-requests/clients-reqs/funds-reqs"
import { CurrencyInterface } from "@/types/interfaces/erp/currencies-interface"
import MultiSelect from "../../MultiSelect"
import { GET_GROUPS_FOR_FUNDS_SELECT_LIST_CREQ } from "@/utils/erp-requests/clients-reqs/settings/groups-reqs"

const createInitialFormState = () => ({
  branch_id: '',
  group_id: '',
  ar_name: "",
  en_name: "",
  cashier: "",
  notes: '',
})

type GroupSettingFormState = ReturnType<typeof createInitialFormState>

export default function FundFormPopup({ acc_analy_type, tableName }: { acc_analy_type: AccAnalyticEnum, tableName: keyof TablesDataState }) {
  const popup = useAppSelector(selectPopup("fundsFormPopup"))
  const updatePopup = useAppSelector(selectPopup("updateFundsFormPopup"))
  const dispatch = useAppDispatch()
  const [data, setData] = useState<GroupSettingFormState>(createInitialFormState())
  const [loading, setLoading] = useState(false)
  const [groups, setGroups] = useState<GroupSettingInterface[]>([])
  const [groupCurrencies, setGroupCurrencies] = useState<CurrencyInterface[]>([])
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([])
  const [branches, setBranches] = useState<TenantBranchInterface[]>([])
  const handleClose = () =>{
    dispatch(
      closePopup({
        popup: "fundsFormPopup",
      })
    )
    dispatch(
      closePopup({
        popup: "updateFundsFormPopup",
      })
    )
    setData(createInitialFormState())
    setGroupCurrencies([])
    setSelectedCurrencies([])
  }
  const fetchBranches = async () => {
    const res = await CLIENT_COLLECTOR_REQ(GET_TENANT_BRANCHES_CREQ ,{})
    if(res.done) {
      setBranches(res.data.branches)
    }
  }
  const fetchGroups = async () => {
    const res = await CLIENT_COLLECTOR_REQ(GET_GROUPS_FOR_FUNDS_SELECT_LIST_CREQ, {type: acc_analy_type})
    if(res.done) {
      setGroups(res.data.groupSettings)
    }
  }
  useEffect(() => {
    if(popup.isOpen) {
      fetchBranches()
      fetchGroups()
    }
  }, [popup.isOpen])
  useEffect(() => {
    if(updatePopup.isOpen) {
      setData({
        ar_name: updatePopup.data?.ar_name || "",
        en_name: updatePopup.data?.en_name || "",
        notes: updatePopup.data?.notes || "",
        branch_id: updatePopup.data?.branch_id || '',
        cashier: updatePopup.data?.cashier || '',
        group_id: updatePopup.data?.group?.id || ''
      })
      setGroupCurrencies(updatePopup.data?.currencies || [])
      setSelectedCurrencies(updatePopup.data?.currencies?.map((e) => e.id) || [])
    }
  }, [updatePopup.isOpen, updatePopup.data])
  //* RENDER CURRENCIES AFTER SELECT GROUP
  useEffect(() => {
    if(data.group_id === '') {
      setGroupCurrencies([])
      return;
    }
    if(data.group_id && !updatePopup.isOpen) {
      setGroupCurrencies(groups.find((e) => e.id === data.group_id)?.account?.currencies || [])
    }
  }, [data.group_id]) 
  const handleOpenSnakeBar = (type: SnakeBarTypeEnum, message: string) => {
    dispatch(
      openSnakeBar({
        type,
        message,
      })
    )
  }
  const isValid = () => {
    const { ar_name, branch_id, group_id, cashier } = data
    if (branch_id.trim()?.length === 0) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Branch is required")
      return false
    }
    if (group_id.trim()?.length === 0) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Group is required")
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
    return true
  }
  const refetchData = async () => {
    const refreshed = await CLIENT_COLLECTOR_REQ(GET_FUNDS_CREQ, { type: acc_analy_type })
      if (refreshed?.done) {
        dispatch(
          fillTable({
            tableName: tableName,
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

    const payload: any = {
      branch_id: data.branch_id,
      group_id: data.group_id,
      ar_name: data.ar_name.trim(),
      en_name: data.en_name.trim()?.length > 0 ? data.en_name : undefined,
      cashier: data.cashier.trim(),
      notes: data.notes.trim()?.length > 0 ? data.notes : undefined,
      currencies_ids: JSON.stringify(selectedCurrencies)
    }

    setLoading(true)
    const res = await CLIENT_COLLECTOR_REQ(CREATE_FUND_CREQ, { data: payload })
    setLoading(false)

    if (res.done) {
      handleClose()
      handleOpenSnakeBar(SnakeBarTypeEnum.SUCCESS, "Fund created successfully")
      setData(createInitialFormState())
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
        popup: 'updateFundsFormPopup'
      }))
      await refetchData()
      return
    } else {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, res.message || "Failed to update fund")
    }
  }
  console.log(groupCurrencies);
  console.log(selectedCurrencies);
  if (!popup.isOpen) {
    return null
  }
  return (
    <BlackLayer onClick={handleClose}>
      <div
        className="w-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
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
        <div className="flex justify-between border-t border-gray-100 dark:border-gray-800 p-4 sm:p-6 max-h-[calc(100dvh-120px)] overflow-y-scroll custom-scrollbar gap-[50px]">
          <div>
            <div className="space-y-6">
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
                        options={groups?.map((e) => ({label:  (e.en_name || e.ar_name) + ' | ' + (e.account.en_name || e.account.ar_name) + ' | ' + (e.account.code), value: e.id}))} placeholder="Select Group" value={data.group_id} onChange={(e) => handleData(setData, 'group_id', e.target.value)} />
                      </div>
                      <div className="col-span-full">
                        <MultiSelect 
                          options={groupCurrencies.map((group: any) => ({
                            value: String(group.id), 
                            text: group.index + ' | ' + (group.en_name || group.ar_name), 
                            selected: group.selected
                          }))}
                          defaultSelected={selectedCurrencies}
                          label="Select Currencies"
                          disabled={updatePopup.isOpen}
                          onChange={(selectedIds) => {
                            const selected = groupCurrencies.filter((group: any) => 
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
      </div>
    </BlackLayer>
  )
}