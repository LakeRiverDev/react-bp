import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

axios.defaults.withCredentials = true;

// Интерцептор запросов:
api.interceptors.request.use(
  (config) => {
    const access_token = localStorage.getItem("access_token");
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Интерцептор ответов:
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log(`Пользователь не авторизован: ${error}`);
    }
    return Promise.reject(error);
  }
);

// Функция для получения данных
export const fetchData = async (endpoint) => {
  const response = await api.get(endpoint);
  return response.data;
};

// Функция для отправки данных
export const postData = async (endpoint, newData) => {
  const response = await api.post(endpoint, newData);
  return response.data;
};

// Функция для обновления данных
export const updateData = async (endpoint, id, updatedData) => {
  const response = await api.patch(`${endpoint}/${id}`, updatedData);
  return response.data;
};

//Функция для удаления данных
export const deleteData = async (endpoint, id) => {
  const response = await api.delete(`${endpoint}/${id}`);
  return response.data;
};

// Словарь ошибок
export const ERRORS_MESSAGES = {
  RESOURCE_USER_ALREADY_EXISTS: "Пользователь с таким Email уже существует!",
  RESOURCE_USER_NOT_FOUND: "Пользователь не найден!",
  RESOURCE_USER_NOT_AUTHORIZED: "Пользователь не авторизован!",
  RESOURCE_USER_PASSWORD_INCORRECT: "Неверный пароль!",
};

export const getErrorMessage = (key) => {
  return ERRORS_MESSAGES[key] || "Неизвестная ошибка";
};
