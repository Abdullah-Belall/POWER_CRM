"use client";
import { BASE_CRM_URL, errMsg } from "@/utils/base";
import axios from "axios";
import { getCookie } from "./common-reqs";

export const GET_TENANTS_REQ = async () => {
  try {
    const response = await axios.get(`${BASE_CRM_URL}/tenants`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return response?.data?.tenants
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

export const ADD_TENANT_REQ = async ({ data }: any) => {
  try {
    const response = await axios.post(`${BASE_CRM_URL}/tenants`, data, {
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

export const UPDATE_TENANT_REQ = async ({ data, tenant_id }: any) => {
  try {
    const response = await axios.patch(`${BASE_CRM_URL}/tenants/${tenant_id}`, data, {
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


export const ADD_TENANT_BRANCH_CREQ = async ({data}: any) => {
  try {
    const response = await axios.post(`${BASE_CRM_URL}/tenant-branches`,data, {
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

export const EDIT_TENANT_BRANCH_CREQ = async ({data, id}: any) => {
  try {
    const response = await axios.patch(`${BASE_CRM_URL}/tenant-branches/${id}`,data, {
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

export const GET_TENANT_BRANCHES_CREQ = async ({ tenant_id }: { tenant_id: string }) => {
  try {
    const response = await axios.get(`${BASE_CRM_URL}/tenant-branches${tenant_id ? `/${tenant_id}` : ""}`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return response?.data?.branches
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