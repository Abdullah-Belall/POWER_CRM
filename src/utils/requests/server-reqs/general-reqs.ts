import { BASE_URL, errMsg } from "@/utils/base";
import axios from "axios";

export const ROLES_SERVER_REQ = async ({access_token}: {access_token: string}) => {
  try {
    const response: any = await axios.get(`${BASE_URL}/roles`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    console.log(response);
    return response?.data?.roles
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

export const USERS_SERVER_REQ = async ({access_token}: {access_token: string}) => {
  try {
    const response: any = await axios.get(`${BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response?.data?.users
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