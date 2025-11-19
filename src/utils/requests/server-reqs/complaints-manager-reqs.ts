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
  console.log('SERVER REFRESH STARTED');
  const refresh_token = await getCookieServer(`refresh_token`);
  console.log('SERVER REFRESH refresh_token => ', refresh_token);
  try {
    const response = await axios.get(`${BASE_URL}/auth/refresh-token`, {
      headers: { cookie: `refresh_token=${refresh_token};` },
    });
    console.log('SERVER REFRESH response => ', response);
    return response?.data?.done
      ? response?.data
      : { done: false, message: errMsg, status: response.status };
  } catch (error: any) {
    console.log('SERVER REFRESH error => ', error);
    return {
      done: false,
      message: error?.response?.data?.error?.message || errMsg,
      status: error.status,
    };
  }
};
export const SERVER_COLLECTOR_REQ = async (varFunction: any, dataBody?: any) => {
  console.log('========== SERVER COLLECTOR =========');
  let access_token = await getCookieServer("access_token");
  console.log(`SERVER access_token => `, access_token);
  if (!access_token) {
    const refreshResponse = await REFRESH_TOKEN_REQ();
    console.log(`SERVER refreshResponse => `, refreshResponse);
    if (!refreshResponse.done) return { done: false, message: "Unauthorized.", status: 401 };
    access_token = refreshResponse.access_token;
  }
  const response = await varFunction({ ...dataBody, access_token });
  console.log(`SERVER response => `, response);
  if (!response.done && response.status === 401) {
    const refreshResponse = await REFRESH_TOKEN_REQ();
    console.log(`SERVER refreshResponse2 => `, refreshResponse);
    if (!refreshResponse.done) return { done: false, message: "Unauthorized.", status: 401 };
    access_token = refreshResponse.access_token;
    const retryResponse = await varFunction({ ...dataBody, access_token });
    console.log(`SERVER retryResponse => `, retryResponse);
    return retryResponse;
  }
  console.log(`============================`);
  return response;
};
//* COOKIES HANDLER
const getCookieServer = async (keyName: string): Promise<string | undefined> => {
  return (await cookies()).get(keyName)?.value;
};