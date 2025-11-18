'use server'
import axios from "axios";
import { BASE_URL, errMsg } from "@/utils/base";

export const SUPPORTER_COMPLAINTS_SERVER_REQ = async ({access_token}: {access_token: string}) => {
  try {
    const response: any = await axios.get(`${BASE_URL}/complaints`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response?.data?.complaints
      ? { done: true, data: response?.data }
      : { done: false, message: errMsg, status: response.status };
  } catch (error: any) {
    console.log(error);
    return {
      done: false,
      message: error?.response?.data?.error?.message || errMsg,
      status: error.status,
    };
  }
};