import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const productAxios = axios.create({
  baseURL: `${BACKEND_URL}/products/`,
  withCredentials: true,
});

export const createProduct = async (formData) => {
  const response = await productAxios.post("", formData);
  return response.data;
};

const getProducts = async () => {
  const response = await productAxios.get("");
  return response.data;
};

const deleteProduct = async (id) => {
  const response = await productAxios.delete(`${id}`);
  return response.data;
};

const getProduct = async (id) => {
  const response = await productAxios.get(`${id}`);
  return response.data;
};

const updateProduct = async (id, formData) => {
  const response = await productAxios.patch(`${id}`, formData);
  return response.data;
};

const productService = {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
};

export default productService;
