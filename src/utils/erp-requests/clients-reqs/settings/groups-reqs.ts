import { BASE_ERP_URL, errMsg } from "@/utils/base";
import { getCookie } from "@/utils/requests/client-reqs/common-reqs";
import axios from "axios";

export const GET_GROUP_SETTING_CREQ = async ({type}: any) => {
  try {
    const response = await axios.get(`${BASE_ERP_URL}/group-setting/${type}`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return response?.data?.groupSettings
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

export const CREATE_GROUP_SETTING_CREQ = async ({data}: any) => {
  try {
    const response = await axios.post(`${BASE_ERP_URL}/group-setting`, data, {
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

export const UPDATE_GROUP_SETTING_CREQ = async ({data,id}: any) => {
  try {
    const response = await axios.patch(`${BASE_ERP_URL}/group-setting/${id}`, data, {
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

export const DELETE_GROUP_SETTING_CREQ = async ({id}: any) => {
  try {
    const response = await axios.delete(`${BASE_ERP_URL}/group-setting/${id}`, {
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