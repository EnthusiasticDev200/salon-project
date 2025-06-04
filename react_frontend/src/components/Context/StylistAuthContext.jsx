import { createContext, useState } from "react";
import { stylistLogin, stylistLogout, stylistProfile, stylistRegister } from "../Request/api";

export const StylistAuthContext = createContext()

export const StylistAuthContextProvider = ({ children }) => {
  const [stylist, setStylist] = useState(null)

  const loginStylist = async (data) => {
    try {
      const response = await stylistLogin(data)

      if(response.status == 200) {
        setStylist(response.data.message)
        sessionStorage.setItem('stylistInfo', JSON.stringify(response.data.message))

        return { 
          success: true, 
          data: response.data 
        }
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed. Please try again.",
      };
    }
  }

  const logoutStylist = async () => {
    try {
      const response = await stylistLogout()

      if(response.status == 200) {
        setStylist(null)
        sessionStorage.removeItem('stylistInfo')

        return { 
          success: true, 
          data: response.data 
        }
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Logout failed. Please try again.",
      };
    }
  }

  const registerStylist = async (data) => {
    try {
      const response = await stylistRegister(data)

      if(response.status == 200 | 201) {
        return { 
          success: true, 
          data: response.data 
        }
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed. Please try again.",
      };
    }
  }

  const getStylistProfile = async () => {
    try {
      const response = await stylistProfile()

      if(response.status == 200 | 201) {
        return { 
          success: true, 
          data: response.data 
        }
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Profile request failed. Please try again.",
      };
    }
  }

  return (
    <StylistAuthContext.Provider value={{ stylist, setStylist, loginStylist, logoutStylist, registerStylist, getStylistProfile }}>
      { children }
    </StylistAuthContext.Provider>
  )
}