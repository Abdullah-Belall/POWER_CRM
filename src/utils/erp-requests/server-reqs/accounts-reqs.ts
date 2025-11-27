"use server"
import { BASE_ERP_URL, errMsg } from "@/utils/base";
import axios from "axios";

export const GET_FLAGS_SREQ = async ({access_token,type}: {access_token: string,type: string}) => {
  try {
    const response: any = await axios.get(`${BASE_ERP_URL}/flags/${type}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response?.data?.flags
      ? { done: true, data: response?.data }
      : { done: false, message: errMsg, status: response.status };
  } catch (error: any) {
    return {
      done: false,
      message: error?.response?.data?.error?.message || errMsg,
      status: error.status,
    };
  }
};

export const GET_CHARTS_OF_ACCOUNTS_SREQ = async ({access_token}: {access_token: string}) => {
  try {
    const response: any = await axios.get(`${BASE_ERP_URL}/chart-of-accounts`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response?.data?.accounts
      ? { done: true, data: response?.data }
      : { done: false, message: errMsg, status: response.status };
  } catch (error: any) {
    console.error(error?.response?.data || error?.message || "Unknown error in GET_CHARTS_OF_ACCOUNTS_SREQ");
    return {
      done: false,
      message: error?.response?.data?.error?.message || errMsg,
      status: error.status,
    };
  }
};