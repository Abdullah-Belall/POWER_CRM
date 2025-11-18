"use server";
import { BASE_URL, errMsg } from "@/utils/base";
import axios from "axios";
import { cookies } from "next/headers";

export const MANAGER_COMPLAINTS_SERVER_REQ = async ({access_token}: {access_token: string}) => {
  try {
    const response: any = await axios.get(`${BASE_URL}/complaints/managers`, {
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
export const CLIENT_COMPLAINTS_SERVER_REQ = async ({access_token}: {access_token: string}) => {
  try {
    const response: any = await axios.get(`${BASE_URL}/complaints/clients`, {
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
const REFRESH_TOKEN_REQ = async () => {
  console.log('two1');
  const refresh_token = await getCookieServer(`refresh_token`);
  try {
    const response = await axios.get(`${BASE_URL}/auth/refresh-token`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${refresh_token}`
      }
    });
    console.log('two2 => ', response);
    return response?.data?.done
      ? response?.data
      : { done: false, message: errMsg, status: response.status };
  } catch (error: any) {
    console.log('two3 => ', error);
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
//* COOKIES HANDLER
const getCookieServer = async (keyName: string): Promise<string | undefined> => {
  return (await cookies()).get(keyName)?.value;
};