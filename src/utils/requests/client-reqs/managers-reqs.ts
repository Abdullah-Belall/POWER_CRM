import { BASE_URL, errMsg } from "@/utils/base";
import axios from "axios";
import { getCookie } from "./common-reqs";

export const MANAGER_COMPLAINTS_REQ = async (data: any) => {
  const query: string[] = [];
  data?.queries?.forEach((e: any) => {
    query.push(`${e.key}=${e.value}`);
  });
  try {
    const response = await axios.get(
      `${BASE_URL}/complaints/managers?${query?.join("&")}`,
      {
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      }
    );
    return response?.data?.complaints
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

export const START_SOLVE_COMPLAINT = async ({ complaint_id, data }: any) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/complaints-solving/${complaint_id}/start-solving`,
      data,
      {
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      }
    );
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


export const ADD_ROLE = async ({ data }: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/roles`, data, {
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

export const UPDATE_ROLE = async ({ data, role_id }: any) => {
  try {
    const response = await axios.patch(`${BASE_URL}/roles/${role_id}`, data, {
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

export const ADD_USER = async ({ data }: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/create`, data, {
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

export const UPDATE_USER = async ({ data,id }: any) => {
  try {
    const response = await axios.patch(`${BASE_URL}/users/${id}/edit`, data, {
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

export const GET_ROLES_REQ = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/roles`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return response?.data?.roles
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

export const GET_USERS_REQ = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
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