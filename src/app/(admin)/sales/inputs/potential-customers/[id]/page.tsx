'use client'
import AddDiscussionBtn from "@/components/form/customers/actions/add-discussion-btn";
import AddOfferBtn from "@/components/form/customers/actions/add-offer-btn";
import UpdateCustomerStatusBtn from "@/components/form/customers/actions/update-customer-status-btn";
import CustomerOfferStatusFormPopup from "@/components/form/customers/customer-offer-status-form";
import CustomerStatusFormPopup from "@/components/form/customers/customer-status-form";
import CustomerDisussionFormPopup from "@/components/form/customers/discussion-form";
import CustomerOfferFormPopup from "@/components/form/customers/offer-form";
import CustomerOffersTable from "@/components/tables/sales/inputs/customer-offers-table";
import DiscussionsTable from "@/components/tables/sales/inputs/discussions-table";
import { PotentialCustomerStatusEnum } from "@/types/enums/potential-customers-enums";
import { checkNull, formatDate, StatusViewer } from "@/utils/base";
import { CLIENT_COLLECTOR_REQ } from "@/utils/requests/client-reqs/common-reqs";
import { CUSTOMER_PROFILE_CREQ } from "@/utils/requests/client-reqs/sales-reqs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CustomerPage() {
  const params = useParams()
  const router = useRouter()
  const [data, setData] = useState<any>()
  const fetchData = async () => {
    const res = await CLIENT_COLLECTOR_REQ(CUSTOMER_PROFILE_CREQ, {id: params?.id})
    if(res.done) {
      setData(res.data)
    } else {
      router.push('/signin')
    }
  }
  useEffect(() => {
    fetchData()
  }, [])
  return (
    <>
    <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h2
            className="text-xl font-semibold text-gray-800 dark:text-white/90"
            x-text="pageName"
          >
            Potential Customer Page
          </h2>
        </div>
        <div className="space-y-6">
          <div className="flex flex-col justify-between gap-6 rounded-2xl border border-gray-200 bg-white px-6 py-5 sm:flex-row sm:items-center dark:border-gray-800 dark:bg-white/3">
            <div className="flex flex-col gap-2.5 divide-gray-300 sm:flex-row sm:divide-x dark:divide-gray-700">
              <div className="flex items-center gap-2 sm:pr-3">
                <span className="text-base font-medium text-gray-700 dark:text-gray-400">
                  Customer ID : #{data?.index}
                </span>
                <StatusViewer status={data?.status as PotentialCustomerStatusEnum} />
              </div>
              <p className="text-sm text-gray-500 sm:pl-3 dark:text-gray-400">
                Date: {formatDate(data?.created_at || '')}
              </p>
            </div>
            <UpdateCustomerStatusBtn customer_id={data?.id as string} />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-8 2xl:col-span-9">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
                <div className="mb-5 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Offers
                  </h2>
                  <AddOfferBtn customer_id={data?.id as string} />
                </div>
                <CustomerOffersTable data={{contracts: data?.contracts || [], total: data?.contracts?.length}} />
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
                <div className="mb-5 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Discussions
                  </h2>
                  <AddDiscussionBtn customer_id={data?.id} />
                </div>
                <DiscussionsTable data={{discussions: data?.discussions || [], total: data?.discussions?.length}} />
              </div>
            </div>
            <div className="space-y-6 lg:col-span-4 2xl:col-span-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
                <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
                  Customer Details
                </h2>
                <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                  <li className="flex items-start gap-5 py-2.5">
                    <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                      Name
                    </span>
                    <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                      {data?.name}
                    </span>
                  </li>
                  <li className="flex items-start gap-5 py-2.5">
                    <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                      Email
                    </span>
                    <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                    {checkNull(data?.mail, '-')}
                    </span>
                  </li>
                  <li className="flex items-start gap-5 py-2.5">
                    <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                      Phone
                    </span>
                    <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                    {checkNull(data?.phone, '-')}
                    </span>
                  </li>
                  <li className="flex items-start gap-5 py-2.5">
                    <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                      Note
                    </span>
                    <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                    {checkNull(data?.note, '-')}
                    </span>
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
                <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
                  Saler Details
                </h2>
                <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                  <li className="flex items-start gap-5 py-2.5">
                    <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                      ID
                    </span>
                    <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                      #{data?.saler?.index}
                    </span>
                  </li>
                  <li className="flex items-start gap-5 py-2.5">
                    <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                      Name
                    </span>
                    <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                      {data?.saler?.user_name}
                    </span>
                  </li>
                  <li className="flex items-start gap-5 py-2.5">
                    <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                      Email
                    </span>
                    <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                    {checkNull(data?.saler?.email, '-')}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <CustomerStatusFormPopup refetch={fetchData} />
    <CustomerDisussionFormPopup refetch={fetchData} />
    <CustomerOfferFormPopup refetch={fetchData} />
    <CustomerOfferStatusFormPopup refetch={fetchData} />
    </>
  )

}