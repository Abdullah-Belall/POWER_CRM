import { BASE_ERP_URL, errMsg } from "@/utils/base";
import { getCookie } from "@/utils/requests/client-reqs/common-reqs";
import axios from "axios";

export const GET_ACTIVITIES_CREQ = async () => {
  try {
    const response = await axios.get(`${BASE_ERP_URL}/activities`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return response?.data?.activities
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

export const GET_MAIN_ACTIVITIES_SELECT_LIST_CREQ = async () => {
  try {
    const response = await axios.get(`${BASE_ERP_URL}/activities/main-activities-select-list`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return response?.data?.activities
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

export const GET_ACTIVITIES_TREE_VIEW_CREQ = async () => {
  try {
    const response = await axios.get(`${BASE_ERP_URL}/activities/tree-view`, {
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

export const ADD_ACTIVITY_CREQ = async ({data}: any) => {
  try {
    const response = await axios.post(`${BASE_ERP_URL}/activities`,data, {
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

export const EDIT_ACTIVITY_CREQ = async ({data, id}: any) => {
  try {
    const response = await axios.patch(`${BASE_ERP_URL}/activities/${id}`,data, {
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

export const DELETE_ACTIVITY_CREQ = async ({ id }: { id: string }) => {
  try {
    const response = await axios.delete(`${BASE_ERP_URL}/activities/${id}`, {
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
