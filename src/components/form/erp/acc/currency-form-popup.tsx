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
import { handleData } from "@/utils/base"
import { CLIENT_COLLECTOR_REQ } from "@/utils/requests/client-reqs/common-reqs"
import { ADD_CURRENCY_CREQ, GET_CURRENCIES_CREQ } from "@/utils/erp-requests/clients-reqs/currency-reqs"
import { SnakeBarTypeEnum } from "@/types/enums/common-enums"
import { openSnakeBar } from "@/store/slices/snake-bar-slice"
import { fillTable, getTable } from "@/store/slices/tables-slice"
import { CurrencyTypeEnum } from "@/types/enums/erp/currency-enum"

const createInitialFormState = () => ({
  ar_name: "",
  en_name: "",
  symbol: "",
  ar_change: "",
  en_change: "",
  type: CurrencyTypeEnum.LOCAL_CURRENCY,
  is_stock_currency: false,
  rate: "",
  max_exchange_limit: "",
  min_exchange_limit: "",
})

type CurrencyFormState = ReturnType<typeof createInitialFormState>

export default function CurrencyFormPopup() {
  const popup = useAppSelector(selectPopup("currencyFormPopup"))
  const dispatch = useAppDispatch()
  const [data, setData] = useState<CurrencyFormState>(createInitialFormState())
  const [loading, setLoading] = useState(false)
  const [disableRate, setDisableRate] = useState(false)
  const [disableType, setDisableType] = useState(false)
  const [disableIsStock, setDisableIsStock] = useState(false)
  const tableData = useAppSelector(getTable('currenciesTable'))
  const handleClose = () =>
    dispatch(
      closePopup({
        popup: "currencyFormPopup",
      })
    )

  useEffect(() => {
    if (!popup.isOpen) {
      setData(createInitialFormState())
      return
    }

    if (popup.data) {
      setData({
        ar_name: popup.data?.ar_name || "",
        en_name: popup.data?.en_name || "",
        symbol: popup.data?.symbol || "",
        ar_change: popup.data?.ar_change || "",
        en_change: popup.data?.en_change || "",
        type: popup.data?.type || CurrencyTypeEnum.LOCAL_CURRENCY,
        is_stock_currency: Boolean(popup.data?.is_stock_currency),
        rate: popup.data?.rate?.toString() || "",
        max_exchange_limit: popup.data?.max_exchange_limit?.toString() || "",
        min_exchange_limit: popup.data?.min_exchange_limit?.toString() || "",
      })
    }
  }, [popup.isOpen, popup.data])

  useEffect(() => {
    if(data.type === CurrencyTypeEnum.LOCAL_CURRENCY) {
      setData({...data, rate: '1', min_exchange_limit: '1', max_exchange_limit: '1'})
      setDisableRate(true)
    } else {
      setData({...data, rate: data.rate ?? "", min_exchange_limit: data.min_exchange_limit ?? "", max_exchange_limit: data.max_exchange_limit ?? ""})
      setDisableRate(false)
    }
  }, [data.type])

  useEffect(() => {
    if(tableData.total === 0) {
      setDisableRate(false)
      setDisableType(false)
      setDisableIsStock(false)
    } else {
      setDisableRate(false)
      handleData(setData, 'type', CurrencyTypeEnum.FOREIGN_CURRENCY)
      setDisableType(true)
      handleData(setData, 'is_stock_currency', false)
      setDisableIsStock(true)
    }
  }, [tableData, popup.isOpen])

  const currencyTypeOptions = useMemo(
    () =>
      Object.values(CurrencyTypeEnum).map((type) => ({
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
    const { ar_name, symbol, ar_change, type, rate, max_exchange_limit, min_exchange_limit } = data
    if (!ar_name.trim()) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Arabic name is required")
      return false
    }
    if (!symbol.trim()) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Currency symbol is required")
      return false
    }
    if (!ar_change.trim()) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Arabic change label is required")
      return false
    }
    if (!type) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Currency type is required")
      return false
    }
    if (!rate || Number.isNaN(Number(rate))) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Rate must be a valid number")
      return false
    }
    if (!max_exchange_limit || Number.isNaN(Number(max_exchange_limit))) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Max exchange limit must be a valid number")
      return false
    }
    if (!min_exchange_limit || Number.isNaN(Number(min_exchange_limit))) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Min exchange limit must be a valid number")
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (loading) return
    if (!isValid()) return

    const payload = {
      ar_name: data.ar_name.trim(),
      en_name: data.en_name.trim() || undefined,
      symbol: data.symbol.trim(),
      ar_change: data.ar_change.trim(),
      en_change: data.en_change.trim() || undefined,
      type: data.type,
      is_stock_currency: data.is_stock_currency,
      rate: Number(data.rate),
      max_exchange_limit: Number(data.max_exchange_limit),
      min_exchange_limit: Number(data.min_exchange_limit),
    }

    setLoading(true)
    const res = await CLIENT_COLLECTOR_REQ(ADD_CURRENCY_CREQ, { data: payload })
    setLoading(false)

    if (res.done) {
      handleOpenSnakeBar(SnakeBarTypeEnum.SUCCESS, "Currency saved successfully")
      handleClose()
      setData(createInitialFormState())
      const refreshed = await CLIENT_COLLECTOR_REQ(GET_CURRENCIES_CREQ)
      if (refreshed?.done) {
        dispatch(
          fillTable({
            tableName: "currenciesTable",
            obj: {
              data: refreshed.data.currencies,
              total: refreshed.data.total,
            },
          })
        )
      }
      return
    }

    handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, res.message || "Failed to save currency")
  }

  if (!popup.isOpen) {
    return null
  }
  return (
    <BlackLayer onClick={handleClose}>
      <div
        className="w-full max-w-4xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Currency Details</h3>
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
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Naming</p>
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
                    <div>
                      <Input
                        placeholder="Symbol"
                        value={data.symbol}
                        onChange={(e) => handleData(setData, "symbol", e.target.value)}
                      />
                    </div>
                    <div>
                      <Select
                        placeholder="Currency Type"
                        value={data.type}
                        options={currencyTypeOptions}
                        onChange={(e) => handleData(setData, "type", e.target.value)}
                        disabled={disableType}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Change Labels</p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <Input
                        placeholder="Arabic Change"
                        value={data.ar_change}
                        onChange={(e) => handleData(setData, "ar_change", e.target.value)}
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="English Change"
                        value={data.en_change}
                        onChange={(e) => handleData(setData, "en_change", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Exchange Limits</p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <Input
                        placeholder="Rate"
                        value={data.rate}
                        onChange={(e) => handleData(setData, "rate", e.target.value)}
                        disabled={disableRate}
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="Max Exchange Limit"
                        value={data.max_exchange_limit}
                        onChange={(e) => handleData(setData, "max_exchange_limit", e.target.value)}
                        disabled={disableRate}
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="Min Exchange Limit"
                        value={data.min_exchange_limit}
                        onChange={(e) => handleData(setData, "min_exchange_limit", e.target.value)}
                        disabled={disableRate}
                      />
                    </div>
                  </div>
                </div>

                {disableIsStock ? "" : <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Stock Options</p>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={data.is_stock_currency}
                      disabled={disableIsStock}
                      onChange={() => handleData(setData, "is_stock_currency", !data.is_stock_currency)}
                    />
                    <span className={`${disableIsStock && 'opacity-[.3]'} text-sm text-gray-700 dark:text-gray-300`}>Use in stock calculations</span>
                  </div>
                </div>}

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