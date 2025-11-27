"use server";
import {  BASE_CRM_URL, errMsg } from "@/utils/base";
import axios from "axios";

export const ALL_TENANTS_SERVER_REQ = async ({access_token}: {access_token: string}) => {
  try {
    const response: any = await axios.get(`${BASE_CRM_URL}/tenants`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response?.data?.tenants
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
