"use client"
import { useAppSelector } from "@/store/hooks/selector"
import { closePopup, selectPopup } from "@/store/slices/popups-slice"
import BlackLayer from "../black-layer"
import { useAppDispatch } from "@/store/hooks/dispatch"
import { MdOutlineClose  } from "react-icons/md";
import { useCallback, useEffect, useState } from "react"
import Input from "../input/InputField"
import { handleData } from "@/utils/base"
import { CLIENT_COLLECTOR_REQ } from "@/utils/requests/client-reqs/common-reqs"
import { SnakeBarTypeEnum } from "@/types/enums/common-enums"
import { openSnakeBar } from "@/store/slices/snake-bar-slice"
import { fillTable } from "@/store/slices/tables-slice"
import { ADD_TENANT_REQ, GET_TENANTS_REQ, UPDATE_TENANT_REQ } from "@/utils/requests/client-reqs/tenants-reqs"

const initialState = {
  domain: "",
  company_title: "",
  company_logo: "",
  phone: "",
  user_name: "",
  password: "",
};

export default function TenantFormPopup() {
  const popup = useAppSelector(selectPopup('tenantFormPopup'))
  const dispatch = useAppDispatch()
  const handleClose = useCallback(() => {
    dispatch(closePopup({
      popup: 'tenantFormPopup'
    }))
  },[dispatch])
  const [data, setData] = useState(initialState);
  useEffect(() => {
    if (popup.isOpen && popup.data) {
      setData({
        domain: popup.data.domain || "",
        company_title: popup.data.company_title || "",
        company_logo: popup.data.company_logo || "",
        phone: popup.data.phone || "",
        user_name: popup.data.user_name || "",
        password: popup.data.password || "",
      })
    }
    if (!popup.isOpen) {
      setData(initialState)
    }
  }, [popup.isOpen, popup.data])
  const handleOpenSnakeBar = (type: SnakeBarTypeEnum, message: string) => {
    dispatch(
      openSnakeBar({
        type,
        message,
      })
    );
  };
  const validateForm = () => {
    if (data.domain.trim().length === 0) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Domain is required");
      return false;
    }
    if (data.company_title.trim().length === 0) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Company title is required");
      return false;
    }
    if(data.user_name.trim().length < 4) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Company title is required");
      return false;
    }
    if(data.password.trim().length < 8 || data.password.trim().length > 24) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, 'Invaild Password');
      return false;
    }
    return true;
  };
  const [loading, setLoading] = useState(false);

  const refreshTable = async () => {
    const res = await CLIENT_COLLECTOR_REQ(GET_TENANTS_REQ);
    if (res.done) {
      dispatch(fillTable({
        tableName: 'tenantsTable',
        obj: {
          data: res.data.tenants,
          total: res.data.total,
        },
      }))
    }
  }

  const handleSubmit = async () => {
    if (loading) return;
    if (!validateForm()) return;
    const submitData: any = {
      domain: data.domain.trim(),
      company_title: data.company_title.trim(),
      company_logo: data.company_logo.trim() || undefined,
      phone: data.phone.trim() || undefined,
      user_name: data.user_name.trim(),
      password: data.password.trim(),
    };
    setLoading(true);
    const res = await CLIENT_COLLECTOR_REQ(
      popup.data ? UPDATE_TENANT_REQ : ADD_TENANT_REQ,
      popup.data ? { data: submitData, tenant_id: popup.data?.tenant_id } : { data: submitData }
    );
    if (res.done) {
      handleOpenSnakeBar(SnakeBarTypeEnum.SUCCESS, popup.data ? 'Tenant updated successfully' : 'Tenant created successfully')
      await refreshTable()
      handleClose();
      setData(initialState)
    } else {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, res.message || "Failed to save tenant");
    }
    setLoading(false);
  };
  return popup.isOpen ? (<BlackLayer onClick={handleClose}>
    <div className="w-md !h-fit border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ">
    <div className="px-6 py-5">
      <div className="flex items-center justify-between">
    <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
      {popup.data ? 'Edit Tenant' : 'Create Tenant'}
    </h3>
      <button onClick={handleClose} className="text-xl !bg-brand-500 hover:bg-brand-600! rounded-full text-white w-[30px] h-[30px] flex justify-center items-center">
        <MdOutlineClose />
      </button>
    </div>
    </div>
  <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6 max-h-[calc(100dvh-120px)] overflow-y-scroll custom-scrollbar">
    <div className="space-y-6">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="col-span-full">
            <Input placeholder="Tenant Domain" value={data.domain} onChange={(e) => handleData(setData, 'domain', e.target.value)} />
          </div>
          <div>
            <Input placeholder="Company Title" value={data.company_title} onChange={(e) => handleData(setData, 'company_title', e.target.value)} />
          </div>
          <div>
            <Input placeholder="Contact Phone" value={data.phone} onChange={(e) => handleData(setData, 'phone', e.target.value)} />
          </div>
          <div className="col-span-full">
            <Input placeholder="Company Logo URL" value={data.company_logo} onChange={(e) => handleData(setData, 'company_logo', e.target.value)} />
          </div>
          <div>
            <Input placeholder="User Name" value={data.user_name} onChange={(e) => handleData(setData, 'user_name', e.target.value)} />
          </div>
          <div>
            <Input placeholder="Password" value={data.password} onChange={(e) => handleData(setData, 'password', e.target.value)} />
          </div>
          <div className="col-span-full flex justify-center">
            <button type="button" onClick={handleSubmit} disabled={loading} className="w-fit inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300">
              {loading ? 'Saving...' : 'Submit'}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>

    </BlackLayer>) : ""
}