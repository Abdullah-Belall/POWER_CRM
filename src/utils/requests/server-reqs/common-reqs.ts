"use server"

import { BASE_CRM_URL, errMsg } from "@/utils/base";
import axios from "axios";

export const CLIENT_OVERVIEW_PAGE_SREQ = async ({access_token}: {access_token: string}) => {
  try {
    const response: any = await axios.get(`${BASE_CRM_URL}/complaints/client-overview-page`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    console.log(response.data);
    return response?.data?.done
      ? { done: true, data: response?.data }
      : { done: false, message: errMsg, status: response.status };
  } catch (error: any) {
    console.error(error);
    return {
      done: false,
      message: error?.response?.data?.error?.message || errMsg,
      status: error.status,
    };
  }
};
