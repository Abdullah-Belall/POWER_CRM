"use client"
import { useAppDispatch } from "@/store/hooks/dispatch"
import { useEffect, useState } from "react"
import Input from "../input/InputField"
import { handleData } from "@/utils/base"
import TextArea from "../input/TextArea"
import { SnakeBarTypeEnum } from "@/types/enums/common-enums"
import { openSnakeBar } from "@/store/slices/snake-bar-slice"
import { CLIENT_COLLECTOR_REQ } from "@/utils/requests/client-reqs/common-reqs"
import { CONFIRM_SIGNED_CONTRACT_REQ } from "@/utils/requests/client-reqs/managers-reqs"
import { closePopup } from "@/store/slices/popups-slice"
import { useRouter, useSearchParams } from "next/navigation"

const createInitialFormState = () => ({
  id: '',
  client_id: '',
  client_user_name: '',
  client_password: '',
  client_role_id: '',
  country: '',
  state: '',
  city: '',
  address_details: '',
  tax_id: '',
  tax_registry: '',
  main_servers_count: '',
  sub_devices_count: '',
  connect_way: '',
  contacter: '',
  contacter_phone: '',
  contacter_job: '',
  web_site: '',
  mail: '',
  name: '',
  company: '',
  phone: '+20',
  note: '',
});

type ConfirmSignedContractFormState = ReturnType<typeof createInitialFormState>;

export default function ConfirmSignedContractPage({ contract_id }: {contract_id: string}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [data, setData] = useState<ConfirmSignedContractFormState>(createInitialFormState());
  const [isAlreadyClient, setIsAlreadyClient] = useState(false)
  const handleOpenSnakeBar = (type: SnakeBarTypeEnum, message: string) => {
    dispatch(
      openSnakeBar({
        type,
        message,
      })
    );
  };
  const vaildation = () => {
    const {
      name,
      phone
    } = data;
    if (
      name.trim().length === 0
    ) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Select client for the complaint");
      return false;
    }
    if (phone.trim().length !== 13) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Invaild phone number");
      return false;
    }
    return true;
  };
  useEffect(() => {
    const client_id = searchParams.get('client_id')
    if(client_id) {
      handleData(setData, 'client_id', client_id)
      setIsAlreadyClient(true)
    } else {
      setIsAlreadyClient(false)
    }
  }, [])
  const [loading, setLoading] = useState(false);
  const handleDone = async () => {
    if (loading) return;
    if (!vaildation()) return false;
    const submitData: any = {
      ...data,
      phone: data.phone === "+20" ? undefined : data.phone,
      company: data.company.trim().length === 0 ? undefined: data.company,
      note: data.note.trim().length === 0 ? undefined: data.note,
    };
    delete submitData.id
    setLoading(true);
    const res = await CLIENT_COLLECTOR_REQ(CONFIRM_SIGNED_CONTRACT_REQ, { data: submitData, id: contract_id });
    if (res.done) {
      router.push(`/general/users`)
      dispatch(
        closePopup({
          popup: "customerFormPopup",
        })
      );
      setData(createInitialFormState())
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
  return (<div className="w-full mx-auto !h-fit border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ">
            <div className="px-6 py-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                  Potential Customer To Client
                </h3>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
              <div className="space-y-6">
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Customer Info</p>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="col-span-full">
                          <Input
                            placeholder="Customer Company Name"
                            value={data.company}
                            onChange={(e) => handleData(setData, "company", e.target.value)}
                          />
                        </div>
                        <div>
                          <Input
                            placeholder="Customer Name"
                            value={data.name}
                            onChange={(e) => handleData(setData, "name", e.target.value)}
                          />
                        </div>
                        <div>
                          <Input
                            placeholder="Customer Phone"
                            value={data.phone}
                            onChange={(e) => handleData(setData, "phone", e.target.value)}
                          />
                        </div>
                        <div className="col-span-full">
                          <TextArea
                            placeholder="Notes"
                            value={data.note}
                            onChange={(e) => handleData(setData, "note", e.target.value)}
                            rows={4}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Contract Credentials</p>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {
                          isAlreadyClient ? <div>
                          <Input
                            placeholder="Client ID"
                            value={data.client_id}
                            onChange={(e) => handleData(setData, "client_id", e.target.value)}
                          />
                        </div> : (<>
                          <div>
                          <Input
                            placeholder="Client Username"
                            value={data.client_user_name}
                            onChange={(e) => handleData(setData, "client_user_name", e.target.value)}
                          />
                        </div>
                        <div>
                          <Input
                            placeholder="Client Password"
                            value={data.client_password}
                            onChange={(e) => handleData(setData, "client_password", e.target.value)}
                          />
                        </div>
                        <div className="col-span-full">
                          <Input
                            placeholder="Client Role ID"
                            value={data.client_role_id}
                            onChange={(e) => handleData(setData, "client_role_id", e.target.value)}
                          />
                        </div>
                        </>)
                        }
                        
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Location Details</p>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <Input
                            placeholder="Country"
                            value={data.country}
                            onChange={(e) => handleData(setData, "country", e.target.value)}
                          />
                        </div>
                        <div>
                          <Input
                            placeholder="State"
                            value={data.state}
                            onChange={(e) => handleData(setData, "state", e.target.value)}
                          />
                        </div>
                        <div>
                          <Input
                            placeholder="City"
                            value={data.city}
                            onChange={(e) => handleData(setData, "city", e.target.value)}
                          />
                        </div>
                        <div className="col-span-full">
                          <TextArea
                            placeholder="Address Details"
                            value={data.address_details}
                            onChange={(e) => handleData(setData, "address_details", e.target.value)}
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Tax & Infrastructure</p>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <Input
                            placeholder="Tax ID"
                            value={data.tax_id}
                            onChange={(e) => handleData(setData, "tax_id", e.target.value)}
                          />
                        </div>
                        <div>
                          <Input
                            placeholder="Tax Registry"
                            value={data.tax_registry}
                            onChange={(e) => handleData(setData, "tax_registry", e.target.value)}
                          />
                        </div>
                        <div>
                          <Input
                            placeholder="Main Servers Count"
                            value={data.main_servers_count}
                            onChange={(e) => handleData(setData, "main_servers_count", e.target.value)}
                          />
                        </div>
                        <div>
                          <Input
                            placeholder="Sub Devices Count"
                            value={data.sub_devices_count}
                            onChange={(e) => handleData(setData, "sub_devices_count", e.target.value)}
                          />
                        </div>
                        <div className="col-span-full">
                          <Input
                            placeholder="Connection Way"
                            value={data.connect_way}
                            onChange={(e) => handleData(setData, "connect_way", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Contact Person</p>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <Input
                            placeholder="Contact Person Name"
                            value={data.contacter}
                            onChange={(e) => handleData(setData, "contacter", e.target.value)}
                          />
                        </div>
                        <div>
                          <Input
                            placeholder="Contact Person Job Title"
                            value={data.contacter_job}
                            onChange={(e) => handleData(setData, "contacter_job", e.target.value)}
                          />
                        </div>
                        <div>
                          <Input
                            placeholder="Contact Person Phone"
                            value={data.contacter_phone}
                            onChange={(e) => handleData(setData, "contacter_phone", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Digital Presence</p>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <Input
                            placeholder="Website"
                            value={data.web_site}
                            onChange={(e) => handleData(setData, "web_site", e.target.value)}
                          />
                        </div>
                        <div>
                          <Input
                            placeholder="Email"
                            value={data.mail}
                            onChange={(e) => handleData(setData, "mail", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-span-full flex justify-center">
                      <button onClick={handleDone} className="w-fit inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300">
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>)
    

}