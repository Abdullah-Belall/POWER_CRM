"use client"
import { useAppSelector } from "@/store/hooks/selector"
import { closePopup, selectPopup } from "@/store/slices/popups-slice"
import BlackLayer from "../black-layer"
import { useAppDispatch } from "@/store/hooks/dispatch"
import { MdOutlineClose  } from "react-icons/md";
import { useCallback, useEffect, useState } from "react"
import {  handleData } from "@/utils/base"
import Input from "../input/InputField"
import Label from "../Label"
import { CLIENT_COLLECTOR_REQ, COMMON_SEARCH } from "@/utils/requests/client-reqs/common-reqs"
import { SnakeBarTypeEnum } from "@/types/enums/common-enums"
import { openSnakeBar } from "@/store/slices/snake-bar-slice"
import { CREATE_CONTRACT } from "@/utils/requests/client-reqs/sales-reqs"
import { useRouter } from "next/navigation"
import { ServiceInterface, SystemInterface } from "@/types/interfaces/sales-interface"
import MultiSelect from "../MultiSelect"

export default function CustomerOfferFormPopup({  }: { type: "contract" | "offer" }) {
  const router = useRouter()
  const popup = useAppSelector(selectPopup('offerFormPopup'))
  const dispatch = useAppDispatch()
  const handleClose = useCallback(() => dispatch(closePopup({
    popup: 'offerFormPopup'
  })),[])
  const [data, setData] = useState({
    discount: "",
    vat: "14",
    w_tax: "",
  });

  const [services, setServices] = useState<ServiceInterface[]>([]);
  const [systems, setSystems] = useState<SystemInterface[]>([]);

  const [selectedServices, setSelectedServices] = useState<ServiceInterface[]>([]);
  const [selectedSystems, setSelectedSystems] = useState<SystemInterface[]>([]);
  const fetchSystemsData = async () => {
    const res = await CLIENT_COLLECTOR_REQ(COMMON_SEARCH, {
      body: {
        search_in: "systems",
        search_with: "",
        created_sort: "DESC",
      },
    });
    if (res.done) {
      setSystems(res.data?.data?.map((e: any) => ({...e, selected: false})))
      setData({
        discount: '',
        vat: '14',
        w_tax: ''
      })
    } else {
      router.push("/sign-in");
    }
  };
  const fetchServicesData = async () => {
    const res = await CLIENT_COLLECTOR_REQ(COMMON_SEARCH, {
      body: {
        search_in: "services",
        search_with: "",
        created_sort: "DESC",
      },
    });
    if (res.done) {
      setServices(res.data?.data)
    } else {
      router.push("/sign-in");
    }
  };
  useEffect(() => {
    fetchSystemsData()
    fetchServicesData()
  }, [])
  const fixed_total_price =
    (selectedSystems?.reduce(
      (acc, curr) => acc + Number(curr.price),
      0
    ) || 0) + (selectedServices.reduce((acc, curr) => acc + Number(curr.price), 0) || 0);
  const [totalPrice, setTotalPrice] = useState(0);
  useEffect(() => {
    let total = fixed_total_price;
    if (total <= 0) {
      setTotalPrice(0);
      return;
    }
    if (data.discount) {
      total -= total * (Number(data.discount) / 100);
    }
    if (data.vat) {
      total += total * (Number(data.vat) / 100);
    }
    if (data.w_tax) {
      total -= fixed_total_price * (Number(data.w_tax) / 100);
    }
    setTotalPrice(total);
  }, [fixed_total_price, data]);
  const vaildation = () => {
    return true;
  };
  const [loading, setLoading] = useState(false);
  const handleConfirm = async () => {
    if (loading) return;
    if (!vaildation()) return;
    setLoading(true);
    const res = await CLIENT_COLLECTOR_REQ(CREATE_CONTRACT, {
      data: {
        systems: JSON.stringify(selectedSystems?.map((e: any) => ({id: e.id, price: Number(e.price)}))),
        services: JSON.stringify(selectedServices?.map((e: any) => e.id)),
        customer_id: popup.data?.customer_id,
        discount: data.discount !== "" ? Number(data.discount) : undefined,
        vat: data.vat !== "" ? Number(data.vat) : undefined,
        w_tax: data.w_tax !== "" ? Number(data.w_tax) : undefined,
      },
    });
    if (res.done) {
      dispatch(
        closePopup({
          popup: "offerFormPopup",
        })
      );
      dispatch(
        openSnakeBar({
          type: SnakeBarTypeEnum.SUCCESS,
          message: 'Successfully Created Offer',
        })
      );
      setSelectedSystems([])
      setSelectedServices([])
      router.push(window.location.pathname + `?forRefresh=${Math.random()}`)
    } else {
      dispatch(
        openSnakeBar({
          type: SnakeBarTypeEnum.ERROR,
          message: res.message,
        })
      );
    }
    setLoading(false);
  };
  return popup.isOpen ? (<BlackLayer onClick={handleClose}>
    <div className="w-lg rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ">
      <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              Create New Offer
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
                <MultiSelect 
                  options={systems.map((sys: any) => ({
                    value: String(sys.id), 
                    text: sys.name + ' | ' + sys.price+ ' EGP', 
                    selected: sys.selected
                  }))} 
                  label="Select Systems" 
                  onChange={(selectedIds) => {
                    const selected = systems.filter((sys: any) => 
                      selectedIds.includes(String(sys.id))
                    );
                    setSelectedSystems(selected);
                  }}
                />
              </div>
              <div className="col-span-full flex flex-col gap-2">
                {selectedSystems.map((e, i) => 
                <div key={i} className="flex gap-1"><Input
                value={e.name}
                disabled
              /><Input
              value={e.price.toString()}
              onChange={(ePrice) => {
                const index = selectedSystems.findIndex((sys) => sys.id === e.id)
                const filterdSelected = selectedSystems.filter((sys) => sys.id !== e.id)
                filterdSelected.splice(index, 0, {...e, price: !isNaN(Number(ePrice.target.value)) &&
                  Number(ePrice.target.value) > 0
                  ? Number(ePrice.target.value)
                  : e.price})
                setSelectedSystems(filterdSelected)
              }}
            /></div>
                )}
              </div>
              <div className="col-span-full">
                <MultiSelect 
                  options={services.map((serv: any) => ({
                    value: String(serv.id), 
                    text: serv.title + ' | ' + serv.price+ ' EGP', 
                    selected: false
                  }))} 
                  label="Select Services" 
                  onChange={(selectedIds) => {
                    const selected = services.filter((serv: any) => 
                      selectedIds.includes(String(serv.id))
                    );
                    setSelectedServices(selected);
                  }}
                />
              </div>

              <div>
                <Label>Discount (%)</Label>
                <Input
                  placeholder="0"
                  value={data.discount}
                  onChange={(e) => handleData(setData, 'discount',!isNaN(Number(e.target.value)) &&
                  Number(e.target.value) <= 100 &&
                  Number(e.target.value) > 0
                  ? e.target.value
                  : "")}
                />
              </div>
              <div>
                <Label>VAT (%)</Label>
                <Input
                  placeholder="14"
                  value={data.vat}
                  onChange={(e) => handleData(setData, 'vat',!isNaN(Number(e.target.value)) &&
                  Number(e.target.value) <= 100 &&
                  Number(e.target.value) > 0
                  ? e.target.value
                  : "")}
                />
              </div>
              <div>
                <Label>W Tax (%)</Label>
                <Input
                  placeholder="0"
                  value={data.w_tax}
                  onChange={(e) => handleData(setData, 'w_tax', !isNaN(Number(e.target.value)) &&
                  Number(e.target.value) <= 100 &&
                  Number(e.target.value) > 0
                  ? e.target.value
                  : "")}
                />
              </div>
              <div className="col-span-full">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-400">
                      Total Price:
                    </span>
                    <span className="text-lg font-semibold text-gray-800 dark:text-white/90">
                      {totalPrice.toFixed(2)} EGP
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-span-full flex justify-center">
                <button 
                  onClick={handleConfirm} 
                  disabled={loading}
                  className="w-fit inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 disabled:cursor-not-allowed">
                  Create
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    </BlackLayer>) : ""
}