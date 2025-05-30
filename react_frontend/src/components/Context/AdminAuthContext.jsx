import { createContext, useState } from "react";
import { addServices, adminLogin, adminRegister, adminUpdatePassword, services } from "../Request/api";

export const AdminAuthContext = createContext()

export const AdminAuthContextProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)

  const loginAdmin = async (data) => {
    try {
      const response = await adminLogin(data);
  
      if (response.status === 200) {
        setAdmin(response.data.message);
        sessionStorage.setItem("adminInfo", JSON.stringify(response.data.message));
  
        return { success: true, data: response.data };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed. Please try again.",
      };
    }
  }

  const registerAdmin = async (data) => {
    try {
      const response = await adminRegister(data);
  
      if (response.status === 200) {
        return { success: true, data: response.data };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed. Please try again.",
      };
    }
  }

  const changeAdminPsw = async (data) => {
    try {
      const response = await adminUpdatePassword(data);
  
      if (response.status === 200) {
        return { success: true, data: response.data };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message,
      };
    }
  }

  const serviceAdd = async (data) => {
    try {
      const response = await addServices(data);
  
      if (response.status === 200) {
        return { success: true, data: response.data };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message,
      };
    }
  }

  const getServices = async () => {
    try {
      const response = await services();
  
      if (response.status === 200) {
        return { success: true, data: response.data };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message,
      };
    }
  }

  return (
    <AdminAuthContext.Provider value={{ admin, setAdmin, loginAdmin, registerAdmin, changeAdminPsw, serviceAdd, getServices }}>
      { children }
    </AdminAuthContext.Provider>
  )
}