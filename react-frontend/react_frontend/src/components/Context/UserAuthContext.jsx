import { createContext, useState } from "react";
import { addAppointment, addReviews, customerLogin, customerLogout, customerProfile, customerRegister } from "../Request/api";

export const UserAuthContext = createContext()

export const UserAuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const loginUser = async (data) => {
    try {
      const response = await customerLogin(data)

      if(response.status == 200 || 201) {
        setUser(response.data.message)
        sessionStorage.setItem("userInfo", JSON.stringify(response.data.message))

        return { success: true, data: response.data };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed. Please try again.",
      };
    }
  }

  const logoutUser = async () => {
    try {
      const response = await customerLogout()

      if(response.status == 200 || 201) {
        setUser(null)
        sessionStorage.removeItem("userInfo")

        return { success: true, data: response.data };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed. Please try again.",
      };
    }
  }

  const registerUser = async (data) => {
    try {
      const response = await customerRegister(data)

      if(response.status == 200 || 201) {
        return { success: true, data: response.data };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed. Please try again.",
      };
    }
  }

  const userProfile = async () => {
    try {
      const response = await customerProfile()

      if(response.status == 200 || 201) {
        return { success: true, data: response.data };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Profile request failed. Please try again.",
      };
    }
  }

  const appointmentAdd = async (data) => {
    try {
      const response = await addAppointment(data)
      
      if(response.status == 200 || 201) {
        return { success: true, message: response.data.message }
      } else {
        return { success: false, message: response.data.message }
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Appointment failed. Please try again.",
      };
    }
  }

  const reviewAdd = async (data) => {
    try {
      const response = await addReviews(data)
      
      if(response.status == 200 || 201) {
        return { success: true, message: response.data.message }
      } else {
        return { success: false, message: response.data.message }
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Review adding failed. Please try again.",
      };
    }
  }

  return (
    <UserAuthContext.Provider value={{ user, setUser, loginUser, logoutUser, userProfile, registerUser, appointmentAdd, reviewAdd }}>
      { children }
    </UserAuthContext.Provider>
  )
}