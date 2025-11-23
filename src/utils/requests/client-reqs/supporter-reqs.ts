import { BASE_URL, errMsg } from "@/utils/base";
import axios from "axios";
import { getCookie } from "./common-reqs";

export const SUPPORTER_NOTIFI = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/complaints/supporter-notifi`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
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

export const SUPPORTER_COMPLAINTS = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/complaints`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
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

export const FINISH_SOLVE = async ({ data }: any) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/complaints/${data?.id}/finish`,
      { status: data?.status },
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

export const ASSIGN_SUPPORTER = async ({ data }: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/complaints-assigner/assign`, data, {
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

export const REFERE_COMPLAINT = async ({ complaint_id, supporter_id }: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/complaints-solving/${complaint_id}/refer-to/${supporter_id}`, {}, {
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

export const REFERE_RESPONED = async ({ solvingId, data }: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/complaints-solving/${solvingId}/refer-response`, data, {
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