"use server";
import {  BASE_CRM_URL, errMsg } from "@/utils/base";
import axios from "axios";
import { cookies } from "next/headers";
import { getCookie } from "../client-reqs/common-reqs";

export const MANAGER_COMPLAINTS_SERVER_REQ = async ({access_token}: {access_token: string}) => {
  try {
    const response: any = await axios.get(`${BASE_CRM_URL}/complaints/managers`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response?.data?.complaints
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
export const CLIENT_COMPLAINTS_SERVER_REQ = async ({access_token}: {access_token: string}) => {
  try {
    const response: any = await axios.get(`${BASE_CRM_URL}/complaints/clients`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response?.data?.complaints
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
const REFRESH_TOKEN_REQ = async () => {
  const refresh_token = await getCookieServer(`refresh_token`);
  try {
    const response = await axios.get(`${BASE_CRM_URL}/auth/refresh-token`, {
      headers: { cookie: `refresh_token=${refresh_token};` },
    });
    return response?.data?.done
      ? response?.data
      : { done: false, message: errMsg, status: response.status };
  } catch (error: any) {
    return {
      done: false,
      message: error?.response?.data?.error?.message || errMsg,
      status: error.status,
    };
  }
};
export const SERVER_COLLECTOR_REQ = async (varFunction: any, dataBody?: any) => {
  let access_token = await getCookieServer("access_token");
  if (!access_token) {
    const refreshResponse = await REFRESH_TOKEN_REQ();
    if (!refreshResponse.done) return { done: false, message: "Unauthorized.", status: 401 };
    access_token = refreshResponse.access_token;
  }
  const response = await varFunction({ ...dataBody, access_token });
  if (!response.done && response.status === 401) {
    const refreshResponse = await REFRESH_TOKEN_REQ();
    if (!refreshResponse.done) return { done: false, message: "Unauthorized.", status: 401 };
    access_token = refreshResponse.access_token;
    const retryResponse = await varFunction({ ...dataBody, access_token });
    return retryResponse;
  }
  return response;
};

export const UPLOAD_EXCEL_REQ = async ({ data, endPoint }: any) => {
  console.log('started');
  try {
    const response = await axios.post(
      `${BASE_CRM_URL}/${endPoint}/upload-excel`,
      data,
      {
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    // Only log serializable response data to avoid circular JSON issues
    console.log(response?.data);
    return response?.data?.done
      ? { done: true }
      : { done: false, message: errMsg, status: response.status };
  } catch (error: any) {
    // Avoid logging the full Axios error object (it contains circular references)
    console.error(error?.response?.data || error?.message || "Unknown error in UPLOAD_EXCEL_REQ");
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


//* COOKIES HANDLER
const getCookieServer = async (keyName: string): Promise<string | undefined> => {
  return (await cookies()).get(keyName)?.value;
};