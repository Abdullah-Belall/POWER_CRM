"use server"
import { BASE_ERP_URL, errMsg } from "@/utils/base";
import axios from "axios";

export const GET_CURRENCIES_SREQ = async ({access_token}: {access_token: string}) => {
  try {
    const response: any = await axios.get(`${BASE_ERP_URL}/currency`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response?.data?.currencies
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