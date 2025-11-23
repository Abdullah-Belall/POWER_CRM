'use server'
import { BASE_URL, errMsg } from "@/utils/base";
import axios from "axios";

export const POTENTIAL_CUSTOMERS_SERVER_REQ = async ({access_token}: {access_token: string}) => {
  try {
    const response: any = await axios.get(`${BASE_URL}/potential-customers`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response?.data?.customers
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

export const GET_CONTRACT_SERVER_REQ = async ({access_token, id}: {access_token: string, id: string}) => {
  try {
    const response: any = await axios.get(`${BASE_URL}/contracts/${id}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response?.data?.id
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

export const CUSTOMER_PROFILE_SERVER_REQ = async ({access_token, id}: {access_token: string, id: string}) => {
  try {
    const response: any = await axios.get(`${BASE_URL}/potential-customers/${id}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response?.data?.id
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

export const SYSTEMS_SERVER_REQ = async ({access_token}: {access_token: string}) => {
  try {
    const response: any = await axios.get(`${BASE_URL}/systems`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response?.data?.id
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

