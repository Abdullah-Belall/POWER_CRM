"use client"
import { BASE_URL, errMsg } from "@/utils/base";
import axios from "axios";

export const SIGN_OUT = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/auth/sign-out`, {
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
  console.log('SIGN IN STARTED');
  try {
    const response = await axios.post(`${BASE_URL}/auth/sign-in`, data, {
      withCredentials: true,
    });
  console.log('SIGN IN RESPONSE => ',response);
    return response?.data?.done
      ? { done: true, data: response.data }
      : { done: false, message: errMsg, status: response.status };
  } catch (error: any) {
    console.log('SIGN IN error => ',error);
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

export const CURR_USER_PROFILE = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/users/profile`, {
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
    const response = await axios.get(`${BASE_URL}/complaints/analytics`, {
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
    const response = await axios.post(`${BASE_URL}/common/common-search?${mainQuery}`, body, {
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
    const response = await axios.post(`${BASE_URL}/complaints/create`, data, {
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
    const response = await axios.post(`${BASE_URL}/auth/change-password`, data, {
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
  console.log('CLIENT REFRESH TOKEN STARTED');
  try {
    const response = await axios.get(`${BASE_URL}/auth/refresh-token`, {
      withCredentials: true
    });
    console.log('CLIENT REFRESH response => ', response);
    if (response?.data?.access_token) {
      setCookie("access_token", response?.data?.access_token);
    }
    return response?.data?.done
      ? { done: true }
      : { done: false, message: errMsg, status: response.status };
  } catch (error: any) {
    console.log('CLIENT REFRESH error => ', error);
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
      `${BASE_URL}/users?${data?.roleAttributes ? `roleAttributes=` + data?.roleAttributes : ""}`,
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
  console.log('========== CLIENT COLLECTOR REQ ============');
  const access_token = getCookie("access_token");
  console.log('CLIENT access_token => ', access_token, !access_token);
  if (!access_token) {
    console.log('CLIENT NO ACCESS_tOKEN');
    const refreshResponse = await REFRESH_TOKEN_REQ();
    console.log('CLIENT refreshResponse => ', refreshResponse);
    if (!refreshResponse.done) return { done: false, message: "Unauthorized.", status: 401 };
  }
  const response = await varFunction(dataBody);
  console.log('CLIENT response => ', response);
  if (!response.done && response.status === 401) {
    console.log('CLIENT STATUS 401');
    const refreshResponse = await REFRESH_TOKEN_REQ();
    console.log('CLIENT refreshResponse => ', refreshResponse);
    if (!refreshResponse.done) return { done: false, message: "Unauthorized.", status: 401 };
    const retryResponse = await varFunction(dataBody);
    console.log('CLIENT retryResponse => ', retryResponse);
    return retryResponse;
  }
  console.log(`============================`);
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
