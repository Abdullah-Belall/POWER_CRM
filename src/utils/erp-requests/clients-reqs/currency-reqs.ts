import { BASE_ERP_URL, errMsg } from "@/utils/base";
import { getCookie } from "@/utils/requests/client-reqs/common-reqs";
import axios from "axios";

export const GET_CURRENCIES_CREQ = async () => {
  try {
    const response = await axios.get(`${BASE_ERP_URL}/currency`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return response?.data?.currencies
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

export const ADD_CURRENCY_CREQ = async ({data}: any) => {
  try {
    const response = await axios.post(`${BASE_ERP_URL}/currency`,data, {
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