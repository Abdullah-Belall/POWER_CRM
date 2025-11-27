import { BASE_CRM_URL, errMsg } from "@/utils/base";
import axios from "axios";
import { getCookie } from "./common-reqs";

export const CONFIRM_SIGNED_CONTRACT = async ({ data,contract_id }: any) => {
  try {
    const response = await axios.post(`${BASE_CRM_URL}/contracts/${contract_id}/confirm-signed`, data, {
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