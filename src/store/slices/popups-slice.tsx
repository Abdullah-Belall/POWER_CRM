import { TreeNode } from "@/components/acc/tree-view/chart-accounts-tree-view";
import { ComplaintStatusEnum, ScreenViewerEnum } from "@/types/enums/complaints-enums";
import { ComplaintSolvingInterface } from "@/types/interfaces/complaints-manager-interfaces";
import { ChartOfAccountsInterface } from "@/types/interfaces/erp/chart-of-accounts-interface";
import { CSAPInterface } from "@/types/interfaces/erp/const-center-interface";
import { FundInterface } from "@/types/interfaces/funds-interface";
import { TenantBranchInterface } from "@/types/interfaces/tenants-interface";
import { MasterTransactionInterface } from "@/types/interfaces/transactions-interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface PopupState {
  managerComplaintFormPopup: {
    isOpen: boolean;
    data?: any
  };
  clientComplaintComplaintFormPopup: {
    isOpen: boolean;
    data?: any
  };
  assignComplaintFormPopup: {
    isOpen: boolean;
    data?: {
      complaint_id: string
    }
  };
  viewComplaintFormPopup: {
    isOpen: boolean;
    data?: {
      typeFor: 'client' | 'supporter' | 'manager';
      client?: {
        id: string,
        user_name: string,
        index: number
      },
      full_name: string,
      phone: string,
      title: string,
      details: string,
      status: ComplaintStatusEnum,
      screen_viewer: ScreenViewerEnum,
      screen_viewer_id: string,
      screen_viewer_password: string,
      server_viewer: string,
      server_viewer_id: string,
      server_viewer_password: string,
      intervention_date: Date | null,
      image1: string,
      image2: string,
    }
  };
  finishComplaintFormPopup: {
    isOpen: boolean;
    data?: {
      complaint_id: string;
      status: ComplaintStatusEnum
    }
  };
  customerFormPopup: {
    isOpen: boolean;
    data?: {
      id: string;
      name: string;
      company: string;
      note: string;
      phone: string
    }
  };
  assignSalerFormPopup: {
    isOpen: boolean;
    data?: {
      customer_id: string
    }
  };
  updateCustomerStatusFormPopup: {
    isOpen: boolean;
    data?: {
      customer_id: string
    }
  };
  offerFormPopup: {
    isOpen: boolean;
    data?: {
      customer_id: string
    }
  };
  discussionFormPopup: {
    isOpen: boolean;
    data?: {
      customer_id: string
    }
  };
  systemFormPopup: {
    isOpen: boolean;
    data?: any
  };
  roleForm: {
    isOpen: boolean;
    data?: {
      id: string,
      code: number;
      name: string,
      roles: string[]
    }
  };
  updateOfferStatus: {
    isOpen: boolean;
    data?: {
      contract_id: string
    }
  };
  userForm: {
    isOpen: boolean;
    data?: {
      id: string,
      user_name: string,
      email: string;
      phone: string,
      role_id: string
    }
  };
  refereComplaintFormPopup: {
    isOpen: boolean;
    data?: {
      complaint_id: string,
    }
  };
  roleAttributeFormPopup: {
    isOpen: boolean;
    data?: {
      user_id: string,
      user_roles: string[],
      user_name: string
    }
  };
  uploadExcelFile: {
    isOpen: boolean;
    data?: {
      onDone?: () => Promise<void>;
      endPoint?: string;
    }
  };
  viewComplaintSupportersHistoryPopup: {
    isOpen: boolean;
    data?: {
      solving: ComplaintSolvingInterface[];
      end_solve_at: Date | null
    }
  };
  userConnectionsFormPopup: {
    isOpen: boolean;
    data?: {
      user_id: string;
      telegram_chat_id: string;
      telegram_id: string;
    }
  };
  tenantFormPopup: {
    isOpen: boolean;
    data?: any
  },
  currencyFormPopup: {
    isOpen: boolean;
    data?: any
  },
  flagsFormPopup: {
    isOpen: boolean;
    data?: any
  },
  chartOfAccountsFormPopup: {
    isOpen: boolean;
    data?: TreeNode
  };
  deleteAccAlert: {
    isOpen: boolean;
    data?: {
      id: string
    }
  };
  deleteGroupAlert: {
    isOpen: boolean;
    data?: {
      id: string
    }
  };
  updateAccFormPopup: {
    isOpen: boolean;
    data?: ChartOfAccountsInterface
  }
  updateCostCenterFormPopup: {
    isOpen: boolean;
    data?: CSAPInterface
  }
  deleteCostCenterAlert: {
    isOpen: boolean;
    data?: {
      id: string
    }
  };
  costCenterFormPopup: {
    isOpen: boolean;
    data?: any
  };
  updateActivityFormPopup: {
    isOpen: boolean;
    data?: CSAPInterface
  }
  deleteActivityAlert: {
    isOpen: boolean;
    data?: {
      id: string
    }
  };
  activityFormPopup: {
    isOpen: boolean;
    data?: any
  };
  updateProjectFormPopup: {
    isOpen: boolean;
    data?: CSAPInterface
  }
  deleteProjectAlert: {
    isOpen: boolean;
    data?: {
      id: string
    }
  };
  deleteFundAlert: {
    isOpen: boolean;
    data?: {
      id: string
    }
  };
  projectFormPopup: {
    isOpen: boolean;
    data?: any
  };
  groupSettingFormPopup: {
    isOpen: boolean;
    data?: any
  };
  updateGroupSettingFormPopup: {
    isOpen: boolean;
    data?: {
      id: string;
      ar_name: string;
      en_name: string;
      account_id: string;
      is_stopped: boolean;
      notes: string;
    }
  };
  tenantBranchesFormPopup: {
    isOpen: boolean;
    data?: any
  };
  updateTenantBranchesFormPopup: {
    isOpen: boolean;
    data?: TenantBranchInterface
  };
  viewTenantBranchesFormPopup: {
    isOpen: boolean;
    data?: TenantBranchInterface
  };
  viewImagePopup: {
    isOpen: boolean;
    data?: {
      src: string
    }
  };
  fundsFormPopup: {
    isOpen: boolean;
    data?: FundInterface
  };
  updateFundsFormPopup: {
    isOpen: boolean;
    data?: FundInterface
  };
  bankfundFormPopup: {
    isOpen: boolean;
    data?: FundInterface
  };
  updateBankFundsFormPopup: {
    isOpen: boolean;
    data?: FundInterface
  };
  journalFormPopup: {
    isOpen: boolean;
    data?: MasterTransactionInterface
  };
  updateJournalFormPopup: {
    isOpen: boolean;
    data?: MasterTransactionInterface
  };
  deleteJournalAlert: {
    isOpen: boolean;
    data?: {
      id: string
    }
  };
}

type OpenPopupPayload = {
  [K in keyof PopupState]: {
    popup: K;
    data?: PopupState[K]["data"];
  }
}[keyof PopupState];

const initialState: PopupState = {
  journalFormPopup: {
    isOpen: false,
  },
  updateJournalFormPopup: {
    isOpen: false,
  },
  deleteJournalAlert: {
    isOpen: false,
  },
  managerComplaintFormPopup: {
    isOpen: false,
  },
  clientComplaintComplaintFormPopup: {
    isOpen: false,
  },
  assignComplaintFormPopup: {
    isOpen: false,
  },
  viewComplaintFormPopup: {
    isOpen: false,
  },
  finishComplaintFormPopup: {
    isOpen: false,
  },
  customerFormPopup: {
    isOpen: false,
  },
  assignSalerFormPopup: {
    isOpen: false,
  },
  updateCustomerStatusFormPopup: {
    isOpen: false,
  },
  offerFormPopup: {
    isOpen: false,
  },
  discussionFormPopup: {
    isOpen: false,
  },
  systemFormPopup: {
    isOpen: false,
  },
  updateOfferStatus: {
    isOpen: false,
  },
  roleForm: {
    isOpen: false,
  },
  userForm: {
    isOpen: false,
  },
  refereComplaintFormPopup: {
    isOpen: false,
  },
  roleAttributeFormPopup: {
    isOpen: false,
  },
  uploadExcelFile: {
    isOpen: false,
  },
  viewComplaintSupportersHistoryPopup: {
    isOpen: false,
  },
  userConnectionsFormPopup: {
    isOpen: false,
  },
  tenantFormPopup: {
    isOpen: false,
  },
  currencyFormPopup: {
    isOpen: false,
  },
  flagsFormPopup: {
    isOpen: false,
  },
  chartOfAccountsFormPopup: {
    isOpen: false,
  },
  deleteAccAlert: {
    isOpen: false,
  },
  updateAccFormPopup: {
    isOpen: false,
  },
  deleteCostCenterAlert: {
    isOpen: false,
  },
  costCenterFormPopup: {
    isOpen: false,
  },
  updateCostCenterFormPopup: {
    isOpen: false,
  }
  ,
  deleteActivityAlert: {
    isOpen: false,
  },
  activityFormPopup: {
    isOpen: false,
  },
  updateActivityFormPopup: {
    isOpen: false,
  },
  updateProjectFormPopup: {
    isOpen: false,
  },
  deleteProjectAlert: {
    isOpen: false,
  },
  projectFormPopup: {
    isOpen: false,
  },
  groupSettingFormPopup: {
    isOpen: false,
  }
  ,
  updateGroupSettingFormPopup: {
    isOpen: false,
  }
  ,
  deleteGroupAlert: {
    isOpen: false,
  },
  tenantBranchesFormPopup: {
    isOpen: false,
  },
  updateTenantBranchesFormPopup: {
    isOpen: false,
  }
  ,
  viewTenantBranchesFormPopup: {
    isOpen: false,
  },
  viewImagePopup: {
    isOpen: false,
  }
  ,
  fundsFormPopup: {
    isOpen: false,
  }
  ,
  updateFundsFormPopup: {
    isOpen: false,
  },
  deleteFundAlert: {
    isOpen: false,
  },
  bankfundFormPopup: {
    isOpen: false,
  },
  updateBankFundsFormPopup: {
    isOpen: false,
  },
};

const popupSlice = createSlice({
  name: "popup",
  initialState,
  reducers: {
    openPopup: (state, action: PayloadAction<OpenPopupPayload>) => {
      const { popup, data } = action.payload;
      state[popup].isOpen = true;
      state[popup].data = data as any;
    },
    closePopup: (state, action: PayloadAction<{ popup: keyof typeof initialState }>) => {
      state[action.payload.popup].isOpen = false;
      state[action.payload.popup].data = undefined;
    },
  },
});

export const { openPopup, closePopup } = popupSlice.actions;

export default popupSlice.reducer;

export const selectPopup = <K extends keyof PopupState>(popup: K) =>
  (state: { popup: PopupState }): PopupState[K] =>
    state.popup[popup];
