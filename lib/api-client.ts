import axios from "axios";
import Cookies from "js-cookie";


export const apiClient = axios.create({

  baseURL: process.env.NEXT_PUBLIC_API_URL, 

  headers: {

    "Content-Type": "application/json",

  },


});


apiClient.interceptors.request.use((config) => {

  const token = Cookies.get("token");

  if (token && config.headers) {

    config.headers.Authorization = `Bearer ${token}`;


  }

  return config;

});


apiClient.interceptors.response.use(

  (response) => response,

  (error) => {

    if (error.response?.status === 401) {

      Cookies.remove("token");


    }

    return Promise.reject(error);
    
  }
);