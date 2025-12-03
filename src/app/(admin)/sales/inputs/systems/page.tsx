"use client"
import SystemFormPopup from "@/components/form/system/system-form";
import SystemsTableActions from "@/components/sales/inputs/systems/systemsTableActions";
import SystemsTable from "@/components/tables/sales/inputs/systems-table"
import { CLIENT_COLLECTOR_REQ, COMMON_SEARCH } from "@/utils/requests/client-reqs/common-reqs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

export default function Systems() {
  const router = useRouter()
  const [data, setData] = useState({systems: [], total: 0})
  const fetchData = async () => {
    const res = await CLIENT_COLLECTOR_REQ(COMMON_SEARCH, {
      body: {
        search_in: "systems",
        search_with: "",
        created_sort: "DESC",
      },
    });
    if (res.done) {
      setData({
        systems: res.data?.data,
        total: res.data?.total
      })
    } else {
      router.push("/signin");
    }
  };
  useEffect(() => {
    fetchData()
  },[])
    return (
    <>
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-800 dark:text-white/90">
              Overview
            </h2>
          </div>
          <div>
            <a
              className="bg-brand-500 shadow-theme-xs hover:bg-brand-600 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition"
              href="/create-invoice"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M5 10.0002H15.0006M10.0002 5V15.0006"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Create an Invoice
            </a>
          </div>
        </div>
        <div className="grid grid-cols-1 rounded-xl border border-gray-200 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-y-0 dark:divide-gray-800 dark:border-gray-800">
          <div className="border-b p-5 sm:border-r lg:border-b-0">
            <p className="mb-1.5 text-sm text-gray-400 dark:text-gray-500">Overdue</p>
            <h3 className="text-3xl text-gray-800 dark:text-white/90">$120.80</h3>
          </div>
          <div className="border-b p-5 lg:border-b-0">
            <p className="mb-1.5 text-sm text-gray-400 dark:text-gray-500">
              Due within next 30 days
            </p>
            <h3 className="text-3xl text-gray-800 dark:text-white/90">0.00</h3>
          </div>
          <div className="border-b p-5 sm:border-r sm:border-b-0">
            <p className="mb-1.5 text-sm text-gray-400 dark:text-gray-500">
              Average time to get paid
            </p>
            <h3 className="text-3xl text-gray-800 dark:text-white/90">24 days</h3>
          </div>
          <div className="p-5">
            <p className="mb-1.5 text-sm text-gray-400 dark:text-gray-500">
              Upcoming Payout
            </p>
            <h3 className="text-3xl text-gray-800 dark:text-white/90">$3,450.50</h3>
          </div>
        </div>
      </div>
      <div>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
    <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Potential Customers
        </h3>
      </div>
      <SystemsTableActions />
    </div>
    <div>
    <SystemsTable data={data} />
    </div>
      </div>
    </div>
    <SystemFormPopup />
    </>
  )
}