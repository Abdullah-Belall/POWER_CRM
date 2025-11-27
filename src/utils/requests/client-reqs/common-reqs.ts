"use client"
import { BASE_CRM_URL, errMsg } from "@/utils/base";
import axios from "axios";

export const SIGN_OUT = async () => {
  try {
    const response = await axios.get(`${BASE_CRM_URL}/auth/sign-out`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
      withCredentials: true,
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

export const SIGN_IN = async ({ data }: any) => {
  try {
    const response = await axios.post(`${BASE_CRM_URL}/auth/sign-in`, data, {
      withCredentials: true,
    });
    return response?.data?.done
      ? { done: true, data: response.data }
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

export const CURR_USER_PROFILE = async ({domain}: any) => {
  try {
    const response = await axios.get(`${BASE_CRM_URL}/users/profile?domain=${domain}`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return response?.data?.id
      ? { done: true, data: response.data }
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

export const GET_ANALYTICS = async () => {
  try {
    const response = await axios.get(`${BASE_CRM_URL}/complaints/analytics`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return response?.data?.done
      ? { done: true, data: response.data }
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

export const COMMON_SEARCH = async ({
  body,
  queries,
}: {
  body: {
    search_in: string;
    search_with: string;
    column?: string;
    created_sort?: "ASC" | "DESC";
  };
  queries?: { key: string; value: string }[];
}) => {
  const mainQuery: string[] = [];
  if (queries && queries.length > 0) {
    for (const query of queries) {
      mainQuery.push(`${query.key}=${query.value}&`);
    }
  }
  try {
    const response = await axios.post(`${BASE_CRM_URL}/common/common-search?${mainQuery}`, body, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return response?.data?.data
      ? { done: true, data: response.data }
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

export const CREATE_COMPLAINT = async ({ data }: any) => {
  try {
    const response = await axios.post(`${BASE_CRM_URL}/complaints/create`, data, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return response?.data?.id
      ? { done: true, data: response.data }
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

export const CHANGE_PASSWORD = async ({ data }: any) => {
  try {
    const response = await axios.post(`${BASE_CRM_URL}/auth/change-password`, data, {
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

export const REFRESH_TOKEN_REQ = async () => {
  try {
    const response = await axios.get(`${BASE_CRM_URL}/auth/refresh-token`, {
      withCredentials: true
    });
    if (response?.data?.access_token) {
      setCookie("access_token", response?.data?.access_token);
    }
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

export const GET_USERS = async (data: { roleAttributes?: string }) => {
  try {
    const response = await axios.get(
      `${BASE_CRM_URL}/users?${data?.roleAttributes ? `roleAttributes=` + data?.roleAttributes : ""}`,
      {
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      }
    );
    return response?.data?.users
      ? { done: true, data: response.data }
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

//* MAIN FUNCTION (USED FOR ALL REQUESTS THAT NEED ACCESS_TOKEN)
export const CLIENT_COLLECTOR_REQ = async (varFunction: any, dataBody?: any) => {
  console.log('CLIENT COLLECTOR');
  const access_token = getCookie("access_token");
  console.log('c1');
  if (!access_token) {
  console.log('c2');
    const refreshResponse = await REFRESH_TOKEN_REQ();
    if (!refreshResponse.done) return { done: false, message: "Unauthorized.", status: 401 };
  }
  console.log('c3');
  const response = await varFunction(dataBody);
  console.log(response);
  console.log('c4');
  if (!response.done && response.status === 401) {
  console.log('c5');
    const refreshResponse = await REFRESH_TOKEN_REQ();
    if (!refreshResponse.done) return { done: false, message: "Unauthorized.", status: 401 };
  console.log('FUNC FUnc');
    const retryResponse = await varFunction(dataBody);
    return retryResponse;
  }
  return response;
};
//* COOKIES HANDLERS
export const setCookie = (keyName: string, value: string) => {
  document.cookie = `${keyName}=${value}; path=/; max-age=${15 * 60}; SameSite=Strict`;
};
export const getCookie = (keyName: string): string | null => {
  const cookie = document.cookie.split("; ").find((row) => row.startsWith(`${keyName}=`));
  return cookie ? cookie.split("=")[1] : null;
};
