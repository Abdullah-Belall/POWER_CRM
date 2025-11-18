import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { RoleInterface, UserInterface } from "@/types/interfaces/common-interfaces";
import { ManagerComplaintInterface } from "@/types/interfaces/complaints-manager-interfaces";
import { ContractInterface, DiscussionInterface, PotentialCustomerInterface } from "@/types/interfaces/sales-interface";
import { ClientComplaintInterface } from "@/types/interfaces/complaints-clients-interface";

interface TablesDataState {
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
