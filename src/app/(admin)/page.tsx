import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import RecentCustomers from "@/components/ecommerce/RecentCustomers";
import { CLIENT_OVERVIEW_PAGE_SREQ } from "@/utils/requests/server-reqs/common-reqs";
import { SERVER_COLLECTOR_REQ } from "@/utils/requests/server-reqs/complaints-manager-reqs";

export default async function Overview() {
  const res = await SERVER_COLLECTOR_REQ(CLIENT_OVERVIEW_PAGE_SREQ)
  if(!res.done){
    return <h1>Error</h1>
  }
  console.log(res.data);
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics data={{total_complaints: res.data?.total_complaints, total_completed_complaints: res.data?.total_completed_complaints}} />

        <MonthlySalesChart data={{monthly_complaints_graph: res.data?.monthly_complaints_graph || []}} />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget data={{ avg: Number(Number(((res.data?.total_completed_complaints || 0) / (res.data?.total_complaints || 1)) * 100).toFixed(2))}} />
      </div>

      {/* <div className="col-span-12">
        <StatisticsChart />
      </div> */}

      {/* <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div> */}

      <div className="col-span-12">
        <RecentCustomers data={{complaints: res.data?.complaints || []}} />
      </div>
    </div>
  );
}
