import { ComplaintStatusEnum, ScreenViewerEnum } from "@/types/enums/complaints-enums";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface PopupState {
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
  addCustomerFormPopup: {
    isOpen: boolean;
    data?: any
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
  updateOfferStatus: {
    isOpen: boolean;
    data?: {
      contract_id: string
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
  addCustomerFormPopup: {
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
  }
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
