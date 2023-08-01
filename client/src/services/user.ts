import axios from "axios";
import { LoginResponse, UserForm, UserPreferences } from "../types/User";

export async function login(email: string, password: string) {
  const response = await axios.post(`${import.meta.env.VITE_REST_API}login`, { email, password });
  return response.data as LoginResponse;
}

export async function register(userData: UserForm) {
  const response = await axios.post(`${import.meta.env.VITE_REST_API}register`, userData);
  return response.data as LoginResponse;
}

export async function updatePreferences(preferences: UserPreferences) {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${import.meta.env.VITE_REST_API}update-preferences`, preferences, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data as LoginResponse;
}