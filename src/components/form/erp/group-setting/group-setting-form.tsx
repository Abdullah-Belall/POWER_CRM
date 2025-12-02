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
import { ChartOfAccountsInterface } from "@/types/interfaces/erp/chart-of-accounts-interface"
import { AccAnalyticEnum, AccTypeEnum } from "@/types/enums/erp/acc-enums"
import BlackLayer from "../../black-layer"
import Input from "../../input/InputField"
import Select from "../../Select"
import { GET_MAIN_ACCOUNTS_SELECT_LIST_CREQ } from "@/utils/erp-requests/clients-reqs/accounts-reqs"
import { CREATE_GROUP_SETTING_CREQ, GET_GROUP_SETTING_CREQ, UPDATE_GROUP_SETTING_CREQ } from "@/utils/erp-requests/clients-reqs/settings/groups-reqs"
import TextArea from "../../input/TextArea"
import Checkbox from "../../input/Checkbox"

const createInitialFormState = () => ({
  ar_name: "",
  en_name: "",
  account_id: "",
  notes: '',
  is_stopped: false
})

type GroupSettingFormState = ReturnType<typeof createInitialFormState>

export default function GroupSettingFormPopup({ acc_analy_type, tableName }: { acc_analy_type: AccAnalyticEnum, tableName: keyof TablesDataState }) {
  const popup = useAppSelector(selectPopup("groupSettingFormPopup"))
  const updatePopup = useAppSelector(selectPopup("updateGroupSettingFormPopup"))
  const dispatch = useAppDispatch()
  const [data, setData] = useState<GroupSettingFormState>(createInitialFormState())
  const [loading, setLoading] = useState(false)
  const [accounts, setAccounts] = useState<ChartOfAccountsInterface[]>([])
  const handleClose = () =>{
    dispatch(
      closePopup({
        popup: "groupSettingFormPopup",
      })
    )
    dispatch(
      closePopup({
        popup: "updateGroupSettingFormPopup",
      })
    )
  }
  const fetchAccounts = async () => {
    const res = await CLIENT_COLLECTOR_REQ(GET_MAIN_ACCOUNTS_SELECT_LIST_CREQ, {acc_analy_type, acc_type: AccTypeEnum.SUB})
    if(res.done) {
      setAccounts(res.data.accounts)
    }
  }
  useEffect(() => {
    if(popup.isOpen) {
      fetchAccounts()
    }
  }, [popup.isOpen])
  useEffect(() => {
    if(updatePopup.isOpen) {
      setData({
        ar_name: updatePopup.data?.ar_name || "",
        en_name: updatePopup.data?.en_name || "",
        account_id: updatePopup.data?.account_id || "",
        notes: updatePopup.data?.notes || "",
        is_stopped: updatePopup.data?.is_stopped || false
      })
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
    const { ar_name, account_id } = data
    if (ar_name.trim()?.length === 0) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Arabic name is required")
      return false
    }
    if (account_id.trim()?.length === 0) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Account is required")
      return false
    }
    return true
  }
  const refetchData = async () => {
    const refreshed = await CLIENT_COLLECTOR_REQ(GET_GROUP_SETTING_CREQ, { type: acc_analy_type })
      if (refreshed?.done) {
        dispatch(
          fillTable({
            tableName: tableName,
            obj: {
              data: refreshed.data.groupSettings,
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
      account_id: data.account_id.trim()?.length > 0 ? data.account_id : undefined,
      notes: data.notes.trim()?.length > 0 ? data.notes : undefined,
      is_stopped: data.is_stopped
    }

    setLoading(true)
    const res = await CLIENT_COLLECTOR_REQ(CREATE_GROUP_SETTING_CREQ, { data: payload })
    setLoading(false)

    if (res.done) {
      handleClose()
      handleOpenSnakeBar(SnakeBarTypeEnum.SUCCESS, "Group setting created successfully")
      setData(createInitialFormState())
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
      en_name: data.en_name.trim()?.length > 0 ? data.en_name : undefined,
      is_stopped: data.is_stopped,
      notes: data.notes.trim()?.length > 0 ? data.notes : undefined,
    }
    
    setLoading(true)
    const res = await CLIENT_COLLECTOR_REQ(UPDATE_GROUP_SETTING_CREQ, { data: payload, id: updatePopup.data?.id })
    setLoading(false)
    if(res.done) {
      handleClose()
      handleOpenSnakeBar(SnakeBarTypeEnum.SUCCESS, "Group setting updated successfully")
      setData(createInitialFormState())
      dispatch(closePopup({
        popup: 'updateGroupSettingFormPopup'
      }))
      await refetchData()
      return
    } else {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, res.message || "Failed to update group setting")
    }
  }
  useEffect(() => {
    window.HSStaticMethods?.autoInit?.();
  }, []);
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
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Group Setting</h3>
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
                      <TextArea
                        placeholder="Notes"
                        value={data.notes}
                        onChange={(e) => handleData(setData, 'notes', e.target.value)}
                        rows={4}
                      />
                      </div>
                      <div className="col-span-full">
                        <Select 
                        disabled={updatePopup.isOpen}
                        options={accounts ? ([{
                          label: '',
                          value: ''
                        }, ...accounts?.map((e) => ({label: e.en_name || e.ar_name, value: e.id}))]) : []} placeholder="Main Cost center" value={data.account_id} onChange={(e) => handleData(setData, 'account_id', e.target.value)} />
                      </div>
                      <div>
                        <Checkbox 
                        checked={data.is_stopped}
                        label={'Stop the Group'}
                        onChange={() => handleData(setData, 'is_stopped', !data.is_stopped)}
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