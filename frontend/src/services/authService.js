import axios from "axios";
import { toast } from "react-toastify";

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: `${BACKEND_URL}/users`,
  withCredentials: true
});

export const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

const handleError = (error) => {
  const message =
    (error.response && error.response.data && error.response.data.message) ||
    error.message ||
    error.toString();
  toast.error(message);
};

export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post(`/register`, userData);
    if (response.status === 201) {
      toast.success("User Registered successfully");
    }
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axiosInstance.post(`/login`, userData);
    if (response.status === 200) {
      toast.success("Login Successful");
    }
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const logoutUser = async () => {
  try {
    await axiosInstance.get(`/logout`);
  } catch (error) {
    handleError(error);
  }
};

export const forgotPassword = async (userData) => {
  try {
    const response = await axiosInstance.post(
      `/forgotpassword`,
      userData
    );
    toast.success(response.data.message);
  } catch (error) {
    handleError(error);
  }
};

export const resetPassword = async (userData, resetToken) => {
  try {
    const response = await axiosInstance.put(
      `/resetpassword/${resetToken}`,
      userData
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getLoginStatus = async () => {
  try {
    const response = await axiosInstance.get(`/loggedin`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getUser = async () => {
  try {
    const response = await axiosInstance.get(`/getuser`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateUser = async (formData) => {
  try {
    const response = await axiosInstance.patch(
      `/updateuser`,
      formData
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const changePassword = async (formData) => {
  try {
    const response = await axiosInstance.patch(
      `/changepassword`,
      formData
    );
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};
