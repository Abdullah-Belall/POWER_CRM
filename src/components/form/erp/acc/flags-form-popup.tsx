"use client"
import { useEffect, useMemo, useState } from "react"
import { MdOutlineClose } from "react-icons/md"
import BlackLayer from "../../black-layer"
import Input from "../../input/InputField"
import Select from "../../Select"
import Checkbox from "../../input/Checkbox"
import { useAppSelector } from "@/store/hooks/selector"
import { useAppDispatch } from "@/store/hooks/dispatch"
import { closePopup, selectPopup } from "@/store/slices/popups-slice"
import { affectedFlagsTypesArr, handleData } from "@/utils/base"
import { CLIENT_COLLECTOR_REQ } from "@/utils/requests/client-reqs/common-reqs"
import { SnakeBarTypeEnum } from "@/types/enums/common-enums"
import { openSnakeBar } from "@/store/slices/snake-bar-slice"
import { fillTable } from "@/store/slices/tables-slice"
import { FlagsTypesEnum } from "@/types/enums/erp/flags-enum"
import { ADD_FLAGS_CREQ, GET_FLAGS_CREQ } from "@/utils/erp-requests/clients-reqs/accounts-reqs"

const createInitialFormState = () => ({
  type: "",
  ar_name: "",
  en_name: "",
  be_affected: false,
})

type FlagFormState = ReturnType<typeof createInitialFormState>

export default function FlagsFormPopup() {
  const popup = useAppSelector(selectPopup("flagsFormPopup"))
  const dispatch = useAppDispatch()
  const [data, setData] = useState<FlagFormState>(createInitialFormState())
  const [loading, setLoading] = useState(false)

  const handleClose = () =>
    dispatch(
      closePopup({
        popup: "flagsFormPopup",
      })
    )

  useEffect(() => {
    if (!popup.isOpen) {
      setData(createInitialFormState())
      return
    }

    if (popup.data) {
      setData({
        type: popup.data?.type || "",
        ar_name: popup.data?.ar_name || "",
        en_name: popup.data?.en_name || "",
        be_affected: Boolean(popup.data?.be_affected),
      })
    }
  }, [popup.isOpen, popup.data])

  const flagTypeOptions = useMemo(
    () =>
      Object.values(FlagsTypesEnum).map((type) => ({
        label: type,
        value: type,
      })),
    []
  )

  const handleOpenSnakeBar = (type: SnakeBarTypeEnum, message: string) => {
    dispatch(
      openSnakeBar({
        type,
        message,
      })
    )
  }

  const isValid = () => {
    const { type, ar_name } = data
    if (!type) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Flag type is required")
      return false
    }
    if (!ar_name.trim()) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Arabic name is required")
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (loading) return
    if (!isValid()) return

    const payload = {
      type: data.type as FlagsTypesEnum,
      ar_name: data.ar_name.trim(),
      en_name: data.en_name.trim() || undefined,
      be_affected: affectedFlagsTypesArr.includes(data.type as FlagsTypesEnum) ? data.be_affected : undefined,
    }

    setLoading(true)
    const res = await CLIENT_COLLECTOR_REQ(ADD_FLAGS_CREQ, { data: payload })
    setLoading(false)

    if (res.done) {
      handleOpenSnakeBar(SnakeBarTypeEnum.SUCCESS, "Flag saved successfully")
      handleClose()
      setData(createInitialFormState())
      const refreshed = await CLIENT_COLLECTOR_REQ(GET_FLAGS_CREQ, { type: payload.type })
      if (refreshed?.done) {
        dispatch(
          fillTable({
            tableName: "flagsTable",
            obj: {
              data: refreshed.data.flags,
              total: refreshed.data.total,
            },
          })
        )
      }
      return
    }

    handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, res.message || "Failed to save flag")
  }

  if (!popup.isOpen) {
    return null
  }

  return (
    <BlackLayer onClick={handleClose}>
      <div
        className="w-full max-w-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Flag Details</h3>
            <button
              onClick={handleClose}
              className="text-xl !bg-brand-500 hover:bg-brand-600! rounded-full text-white w-[30px] h-[30px] flex justify-center items-center"
            >
              <MdOutlineClose />
            </button>
          </div>
        </div>
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6 max-h-[calc(100dvh-120px)] overflow-y-scroll custom-scrollbar">
          <div className="space-y-6">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-8">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Basic Info</p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="col-span-full">
                      <Select
                        placeholder="Flag Type"
                        value={data.type}
                        options={flagTypeOptions}
                        onChange={(e) => handleData(setData, "type", e.target.value)}
                      />
                    </div>
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
                  </div>
                </div>


              {affectedFlagsTypesArr.includes(data.type as FlagsTypesEnum) ? <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Options</p>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={data.be_affected}
                      onChange={() => handleData(setData, "be_affected", !data.be_affected)}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Affected by operations</span>
                  </div>
                </div>: ''}
                

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
      </div>
    </BlackLayer>
  )
}

