import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { RoleInterface, UserInterface } from "@/types/interfaces/common-interfaces";
import { ManagerComplaintInterface } from "@/types/interfaces/complaints-manager-interfaces";
import { ContractInterface, DiscussionInterface, PotentialCustomerInterface, SystemInterface } from "@/types/interfaces/sales-interface";
import { ClientComplaintInterface } from "@/types/interfaces/complaints-clients-interface";
import { TenantBranchInterface, TenantInterface } from "@/types/interfaces/tenants-interface";
import { CurrencyInterface } from "@/types/interfaces/erp/currencies-interface";
import { FlagInterface } from "@/types/interfaces/erp/flag-interface";
import { ChartOfAccountsInterface } from "@/types/interfaces/erp/chart-of-accounts-interface";
import { CSAPInterface } from "@/types/interfaces/erp/const-center-interface";
import { GroupSettingInterface } from "@/types/interfaces/erp/group-interface";

export interface TablesDataState {
  managerComplaintsTable: {
    total: number;
    data: ManagerComplaintInterface[];
  };
  supporterComplaintsTable: {
    total: number;
    data: ManagerComplaintInterface[];
  };
  clientComplaintsTable: {
    total: number;
    data: ClientComplaintInterface[];
  };
  managerUsersTable: {
    total: number;
    data: UserInterface[];
  };
  managerRolesTable: {
    total: number;
    data: RoleInterface[];
  };
  potentialCustomerTable: {
    total: number;
    data: PotentialCustomerInterface[];
  };
  customerOffersTable: {
    total: number;
    data: ContractInterface[];
  };
  customerDiscutionsTable: {
    total: number;
    data: DiscussionInterface[];
  };
  systemsTable: {
    total: number;
    data: SystemInterface[];
  };
  rolesTable: {
    total: number;
    data: RoleInterface[];
  };
  usersTable: {
    total: number;
    data: UserInterface[];
  };
  tenantsTable: {
    total: number;
    data: TenantInterface[];
  };
  currenciesTable: {
    total: number;
    data: CurrencyInterface[];
  };
  flagsTable: {
    total: number;
    data: FlagInterface[];
  };
  chartOfAccountsTable: {
    total: number;
    data: ChartOfAccountsInterface[];
  };
  costCenterTable: {
    total: number;
    data: CSAPInterface[];
  };
  activitiesTable: {
    total: number;
    data: CSAPInterface[];
  };
  projectsTable: {
    total: number;
    data: CSAPInterface[];
  };
  cashGroupTable: {
    total: number;
    data: GroupSettingInterface[];
  };
  customersGroupTable: {
    total: number;
    data: GroupSettingInterface[];
  };
  suppliersGroupTable: {
    total: number;
    data: GroupSettingInterface[];
  };
  employeeGroupTable: {
    total: number;
    data: GroupSettingInterface[];
  };
  expensessGroupTable: {
    total: number;
    data: GroupSettingInterface[];
  };
  incomeGroupTable: {
    total: number;
    data: GroupSettingInterface[];
  };
  assitsGroupTable: {
    total: number;
    data: GroupSettingInterface[];
  };
  depetsGroupTable: {
    total: number;
    data: GroupSettingInterface[];
  };
  creditGroupTable: {
    total: number;
    data: GroupSettingInterface[];
  };
  tenantBranchesTable: {
    total: number;
    data: TenantBranchInterface[];
  };
}

const initialState: TablesDataState = {
  managerComplaintsTable: {
    total: 0,
    data: [],
  },
  supporterComplaintsTable: {
    total: 0,
    data: [],
  },
  clientComplaintsTable: {
    total: 0,
    data: [],
  },
  managerUsersTable: {
    total: 0,
    data: [],
  },
  managerRolesTable: {
    total: 0,
    data: [],
  },
  potentialCustomerTable: {
    total: 0,
    data: [],
  },
  customerOffersTable: {
    total: 0,
    data: [],
  },
  customerDiscutionsTable: {
    total: 0,
    data: [],
  },
  rolesTable: {
    total: 0,
    data: [],
  },
  systemsTable: {
    total: 0,
    data: [],
  },
  usersTable: {
    total: 0,
    data: [],
  },
  tenantsTable: {
    total: 0,
    data: [],
  },
  currenciesTable: {
    total: 0,
    data: [],
  },
  flagsTable: {
    total: 0,
    data: [],
  },
  chartOfAccountsTable: {
    total: 0,
    data: [],
  },
  costCenterTable: {
    total: 0,
    data: [],
  },
  activitiesTable: {
    total: 0,
    data: [],
  },
  projectsTable: {
    total: 0,
    data: [],
  },
  cashGroupTable: {
    total: 0,
    data: [],
  },
  customersGroupTable: {
    total: 0,
    data: [],
  },
  suppliersGroupTable: {
    total: 0,
    data: [],
  },
  employeeGroupTable: {
    total: 0,
    data: [],
  },
  expensessGroupTable: {
    total: 0,
    data: [],
  },
  incomeGroupTable: {
    total: 0,
    data: [],
  },
  assitsGroupTable: {
    total: 0,
    data: [],
  },
  depetsGroupTable: {
    total: 0,
    data: [],
  },
  creditGroupTable: {
    total: 0,
    data: [],
  },
  tenantBranchesTable: {
    total: 0,
    data: [],
  }
};

const tableDataSlice = createSlice({
  name: "tableData",
  initialState,
  reducers: {
    fillTable: (
      state,
      action: PayloadAction<{
        tableName: keyof TablesDataState;
        obj: {
          total: number;
          data: any[];
        };
      }>
    ) => {
      state[action.payload.tableName] = action.payload.obj;
    },
  },
});

export const { fillTable } = tableDataSlice.actions;
export const getTable =
  <K extends keyof TablesDataState>(tableName: K) =>
  (state: RootState) =>
    state.tableData[tableName] as TablesDataState[K];

export default tableDataSlice.reducer;
