"use client"
import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { MdOutlineClose } from "react-icons/md"
import BlackLayer from "../black-layer"
import Input from "../input/InputField"
import { useAppSelector } from "@/store/hooks/selector"
import { useAppDispatch } from "@/store/hooks/dispatch"
import { closePopup, selectPopup } from "@/store/slices/popups-slice"
import { handleData } from "@/utils/base"
import { CLIENT_COLLECTOR_REQ } from "@/utils/requests/client-reqs/common-reqs"
import { SnakeBarTypeEnum } from "@/types/enums/common-enums"
import { openSnakeBar } from "@/store/slices/snake-bar-slice"
import { ADD_TENANT_BRANCH_CREQ, EDIT_TENANT_BRANCH_CREQ, GET_TENANT_BRANCHES_CREQ } from "@/utils/requests/client-reqs/tenants-reqs"
import { fillTable } from "@/store/slices/tables-slice"
import Checkbox from "../input/Checkbox"

const createInitialFormState = () => ({
  tenant_id: "",
  ar_name: "",
  en_name: "",
  country: "",
  state: "",
  city: "",
  address_details: "",
  tax_id: "",
  tax_registry: "",
  logo: "",
  tax_branch_code: "",
  user_num: "",
  password: "",
  OS: "",
  version: "",
  serial: "",
})

type TenantBranchFormState = ReturnType<typeof createInitialFormState>

export default function TenantBranchFormPopup() {
  const params = useParams()
  const popup = useAppSelector(selectPopup("tenantBranchesFormPopup"))
  const updatePopup = useAppSelector(selectPopup("updateTenantBranchesFormPopup"))
  const viewPopup = useAppSelector(selectPopup("viewTenantBranchesFormPopup"))
  const dispatch = useAppDispatch()
  const [data, setData] = useState<TenantBranchFormState>(createInitialFormState())
  const [loading, setLoading] = useState(false)
  const [useTaxLink, setUseTaxLink] = useState(false)

  const handleClose = () => {
    dispatch(
      closePopup({
        popup: "viewTenantBranchesFormPopup",
      })
    )
    dispatch(
      closePopup({
        popup: "tenantBranchesFormPopup",
      })
    )
    dispatch(
      closePopup({
        popup: "updateTenantBranchesFormPopup",
      })
    )
  }

  useEffect(() => {
    const popupDate = updatePopup.data || viewPopup.data
    if(popupDate && (updatePopup.isOpen || viewPopup.isOpen)) {
      setData({
        tenant_id: '',
        ar_name: popupDate?.ar_name || '',
        en_name: popupDate?.en_name || '',
        country: popupDate?.country || '',
        state: popupDate?.state || '',
        city: popupDate?.city || '',
        address_details: popupDate?.address_details || '',
        tax_id: popupDate?.tax_id || '',
        tax_registry: popupDate?.tax_registry || '',
        logo: popupDate?.logo || '',
        tax_branch_code: popupDate?.tax_branch_code || '',
        user_num: popupDate?.user_num?.toString() || '',
        password: popupDate?.password || '',
        OS: popupDate?.OS || '',
        version: popupDate?.version || '',
        serial: popupDate?.serial || '',
      })
      if(popupDate.tax_branch_code) {
        setUseTaxLink(true)
      }
    }
  }, [popup.isOpen, popup.data, params?.id])

  const handleOpenSnakeBar = (type: SnakeBarTypeEnum, message: string) => {
    dispatch(
      openSnakeBar({
        type,
        message,
      })
    )
  }

  const isValid = () => {
    const { ar_name, country, state, city, address_details } = data
    if (ar_name.trim()?.length === 0) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Arabic name is required")
      return false
    }
    if (country.trim()?.length === 0) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Country is required")
      return false
    }
    if (state.trim()?.length === 0) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "State is required")
      return false
    }
    if (city.trim()?.length === 0) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "City is required")
      return false
    }
    if (address_details.trim()?.length === 0) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Address details is required")
      return false
    }
    return true
  }

  const refetchData = async () => {
    if (!params?.id) return
    const refreshed = await CLIENT_COLLECTOR_REQ(GET_TENANT_BRANCHES_CREQ, { tenant_id: params?.id })
    if (refreshed?.done) {
      dispatch(
        fillTable({
          tableName: "tenantBranchesTable",
          obj: {
            data: refreshed.data.branches,
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
      tenant_id: params?.id,
      ar_name: data.ar_name.trim(),
      en_name: data.en_name.trim()?.length > 0 ? data.en_name.trim() : undefined,
      country: data.country.trim(),
      state: data.state.trim(),
      city: data.city.trim(),
      address_details: data.address_details.trim(),
      tax_id: data.tax_id.trim()?.length > 0 ? data.tax_id.trim() : undefined,
      tax_registry: data.tax_registry.trim()?.length > 0 ? data.tax_registry.trim() : undefined,
      logo: data.logo.trim()?.length > 0 ? data.logo.trim() : undefined,
    }

    if (useTaxLink) {
      payload.tax_branch_code = data.tax_branch_code.trim()?.length > 0 ? data.tax_branch_code.trim() : undefined
      payload.user_num = data.user_num.trim()?.length > 0 ? parseInt(data.user_num) : undefined
      payload.password = data.password.trim()?.length > 0 ? data.password.trim() : undefined
      payload.OS = data.OS.trim()?.length > 0 ? data.OS.trim() : undefined
      payload.version = data.version.trim()?.length > 0 ? data.version.trim() : undefined
      payload.serial = data.serial.trim()?.length > 0 ? data.serial.trim() : undefined
    }

    setLoading(true)
    const res = await CLIENT_COLLECTOR_REQ(ADD_TENANT_BRANCH_CREQ, { data: payload })
    setLoading(false)

    if (res.done) {
      handleOpenSnakeBar(SnakeBarTypeEnum.SUCCESS, "Branch created successfully")
      setData(createInitialFormState())
      setUseTaxLink(false)
      await refetchData()
      handleClose()
      return
    }

    handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, res.message || "Failed to create branch")
  }

  const handleUpdate = async () => {
    if (loading) return
    if (!isValid()) return

    const payload: any = {
      ar_name: data.ar_name.trim(),
      en_name: data.en_name.trim()?.length > 0 ? data.en_name.trim() : undefined,
      country: data.country.trim(),
      state: data.state.trim(),
      city: data.city.trim(),
      address_details: data.address_details.trim(),
      tax_id: data.tax_id.trim()?.length > 0 ? data.tax_id.trim() : undefined,
      tax_registry: data.tax_registry.trim()?.length > 0 ? data.tax_registry.trim() : undefined,
      logo: data.logo.trim()?.length > 0 ? data.logo.trim() : undefined,
    }

    if (useTaxLink) {
      payload.tax_branch_code = data.tax_branch_code.trim()?.length > 0 ? data.tax_branch_code.trim() : undefined
      payload.user_num = data.user_num.trim()?.length > 0 ? parseInt(data.user_num) : undefined
      payload.password = data.password.trim()?.length > 0 ? data.password.trim() : undefined
      payload.OS = data.OS.trim()?.length > 0 ? data.OS.trim() : undefined
      payload.version = data.version.trim()?.length > 0 ? data.version.trim() : undefined
      payload.serial = data.serial.trim()?.length > 0 ? data.serial.trim() : undefined
    }

    setLoading(true)
    const res = await CLIENT_COLLECTOR_REQ(EDIT_TENANT_BRANCH_CREQ, { data: payload, id: updatePopup.data?.id })
    setLoading(false)
    if (res.done) {
      handleOpenSnakeBar(SnakeBarTypeEnum.SUCCESS, "Branch updated successfully")
      setData(createInitialFormState())
      setUseTaxLink(false)
      await refetchData()
      handleClose()
      return
    }
    handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, res.message || "Failed to update branch")
  }

  if (!popup.isOpen) {
    return null
  }

  return (
    <BlackLayer onClick={handleClose}>
      <div
        className="min-w-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              {popup.data?.id ? "Edit Branch" : "Create Branch"}
            </h3>
            <button
              onClick={handleClose}
              className="text-xl !bg-brand-500 hover:bg-brand-600! rounded-full text-white w-[30px] h-[30px] flex justify-center items-center"
            >
              <MdOutlineClose />
            </button>
          </div>
        </div>
        <div className="flex justify-between border-t border-gray-100 dark:border-gray-800 p-4 sm:p-6 max-h-[calc(100dvh-120px)] overflow-y-scroll custom-scrollbar">
          <div className="w-full">
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
                          disabled={viewPopup.isOpen}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleData(setData, "ar_name", e.target.value)}
                        />
                      </div>
                      <div>
                        <Input
                          placeholder="English Name"
                          value={data.en_name}
                          disabled={viewPopup.isOpen}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleData(setData, "en_name", e.target.value)}
                        />
                      </div>
                      <div className="col-span-full">
                        <Input
                          placeholder="Logo URL"
                          value={data.logo}
                          disabled={viewPopup.isOpen}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleData(setData, "logo", e.target.value)}
                        />
                      </div>
                      <p className="col-span-full text-sm font-semibold text-gray-600 dark:text-gray-300">Address Details</p>
                      <div className="col-span-full">
                        <Input
                          placeholder="Country"
                          value={data.country}
                          disabled={viewPopup.isOpen}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleData(setData, "country", e.target.value)}
                        />
                      </div>
                      <div>
                        <Input
                          placeholder="State"
                          value={data.state}
                          disabled={viewPopup.isOpen}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleData(setData, "state", e.target.value)}
                        />
                      </div>
                      <div>
                        <Input
                          placeholder="City"
                          value={data.city}
                          disabled={viewPopup.isOpen}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleData(setData, "city", e.target.value)}
                        />
                      </div>
                      <div className="col-span-full">
                        <Input
                          placeholder="Address Details"
                          value={data.address_details}
                          disabled={viewPopup.isOpen}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleData(setData, "address_details", e.target.value)}
                        />
                      </div>
                      <p className="col-span-full text-sm font-semibold text-gray-600 dark:text-gray-300">Taxes Details</p>
                      <div>
                        <Input
                          placeholder="Tax ID"
                          value={data.tax_id}
                          disabled={viewPopup.isOpen}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleData(setData, "tax_id", e.target.value)}
                        />
                      </div>
                      <div>
                        <Input
                          placeholder="Tax Registry"
                          value={data.tax_registry}
                          disabled={viewPopup.isOpen}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleData(setData, "tax_registry", e.target.value)}
                        />
                      </div>
                      <div className="col-span-full">
                        <Checkbox
                          label="Use the link with taxes"
                          checked={useTaxLink}
                          disabled={viewPopup.isOpen}
                          onChange={() => setUseTaxLink(!useTaxLink)}
                        />
                      </div>
                      {useTaxLink && (
                        <>
                          <div>
                            <Input
                              placeholder="Tax Branch Code"
                              value={data.tax_branch_code}
                          disabled={viewPopup.isOpen}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleData(setData, "tax_branch_code", e.target.value)}
                            />
                          </div>
                          <div>
                            <Input
                              placeholder="User Number"
                              value={data.user_num}
                          disabled={viewPopup.isOpen}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleData(setData, "user_num", e.target.value)}
                            />
                          </div>
                          <div>
                            <Input
                              placeholder="Password"
                              type="password"
                              value={data.password}
                          disabled={viewPopup.isOpen}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleData(setData, "password", e.target.value)}
                            />
                          </div>
                          <div>
                            <Input
                              placeholder="OS"
                              value={data.OS}
                          disabled={viewPopup.isOpen}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleData(setData, "OS", e.target.value)}
                            />
                          </div>
                          <div>
                            <Input
                              placeholder="Version"
                              value={data.version}
                          disabled={viewPopup.isOpen}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleData(setData, "version", e.target.value)}
                            />
                          </div>
                          <div>
                            <Input
                              placeholder="Serial"
                              value={data.serial}
                          disabled={viewPopup.isOpen}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleData(setData, "serial", e.target.value)}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {
                    viewPopup.isOpen ? "" : <div className="col-span-full flex justify-center mb-3">
                    <button
                      onClick={updatePopup.isOpen ? handleUpdate : handleSubmit}
                      className="w-fit inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : updatePopup.isOpen ? "Edit" : "Submit"}
                    </button>
                  </div>
                  }
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </BlackLayer>
  )
}

