import { BASE_ERP_URL, errMsg } from "@/utils/base";
import { getCookie } from "@/utils/requests/client-reqs/common-reqs";
import axios from "axios";

export const GET_FLAGS_CREQ = async ({type}: any) => {
  try {
    const response = await axios.get(`${BASE_ERP_URL}/flags/${type}`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return response?.data?.flags
      ? { done: true, data: response.data }
      : { done: false, message: errMsg, status: response.status };
  } catch (error: any) {
    let message = errMsg;
    if (error?.response?.status !== 400) {
    }
    message = error?.response?.data?.message;
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};

export const ADD_FLAGS_CREQ = async ({data}: any) => {
  try {
    const response = await axios.post(`${BASE_ERP_URL}/flags`,data, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return response?.data?.done
      ? { done: true }
      : { done: false, message: errMsg, status: response.status };
  } catch (error: any) {
    let message = errMsg;
    if (error?.response?.status !== 400) {
    }
    message = error?.response?.data?.message;
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};

export const GET_CHARTS_OF_ACCOUNTS_CREQ = async () => {
  try {
    const response = await axios.get(`${BASE_ERP_URL}/chart-of-accounts`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return response?.data?.accounts
      ? { done: true, data: response.data }
      : { done: false, message: errMsg, status: response.status };
  } catch (error: any) {
    let message = errMsg;
    if (error?.response?.status !== 400) {
    }
    message = error?.response?.data?.message;
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};

export const GET_MAIN_ACCOUNTS_SELECT_LIST_CREQ = async (data: any) => {
  try {
    const response = await axios.get(`${BASE_ERP_URL}/chart-of-accounts/main-accounts-select-list?${data?.acc_analy_type? `acc_analy_type=${data?.acc_analy_type}&` : ''}${data?.acc_type? `acc_type=${data?.acc_type}` : ''}`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    console.log(response);
    return response?.data?.accounts
      ? { done: true, data: response.data }
      : { done: false, message: errMsg, status: response.status };
  } catch (error: any) {
    console.log(error);
    let message = errMsg;
    if (error?.response?.status !== 400) {
    }
    message = error?.response?.data?.message;
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};

export const GET_TREE_VIEW_CREQ = async () => {
  try {
    const response = await axios.get(`${BASE_ERP_URL}/chart-of-accounts/tree-view`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return response?.data?.done
      ? { done: true, data: response.data }
      : { done: false, message: errMsg, status: response.status };
  } catch (error: any) {
    let message = errMsg;
    if (error?.response?.status !== 400) {
    }
    message = error?.response?.data?.message;
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};

export const ADD_CHART_OF_ACCOUNT_CREQ = async ({data}: any) => {
  try {
    const response = await axios.post(`${BASE_ERP_URL}/chart-of-accounts`,data, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return response?.data?.done
      ? { done: true }
      : { done: false, message: errMsg, status: response.status };
  } catch (error: any) {
    let message = errMsg;
    if (error?.response?.status !== 400) {
    }
    message = error?.response?.data?.message;
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};

export const EDIT_ACCOUNT_CREQ = async ({data, id}: any) => {
  try {
    const response = await axios.patch(`${BASE_ERP_URL}/chart-of-accounts/${id}`,data, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return response?.data?.done
      ? { done: true }
      : { done: false, message: errMsg, status: response.status };
  } catch (error: any) {
    let message = errMsg;
    if (error?.response?.status !== 400) {
    }
    message = error?.response?.data?.message;
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};


export const GET_FLAGS_FOR_CREATE_ACCOUNT_CREQ = async () => {
  try {
    const response = await axios.get(`${BASE_ERP_URL}/flags/flags-for-accounts`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return response?.data?.account_types
      ? { done: true, data: response.data }
      : { done: false, message: errMsg, status: response.status };
  } catch (error: any) {
    let message = errMsg;
    if (error?.response?.status !== 400) {
    }
    message = error?.response?.data?.message;
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};


export const DELETE_ACC_CREQ = async ({ id }: { id: string }) => {
  try {
    const response = await axios.delete(`${BASE_ERP_URL}/chart-of-accounts/${id}`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return response?.data?.done
      ? { done: true, data: response.data }
      : { done: false, message: errMsg, status: response.status };
  } catch (error: any) {
    let message = errMsg;
    if (error?.response?.status !== 400) {
    }
    message = error?.response?.data?.message;
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};