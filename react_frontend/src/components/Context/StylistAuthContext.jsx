import { createContext, useState } from "react";
import { stylistLogin, stylistRegister } from "../Request/api";

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

  return (
    <StylistAuthContext.Provider value={{ stylist, setStylist, loginStylist, registerStylist }}>
      { children }
    </StylistAuthContext.Provider>
  )
}