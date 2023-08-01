export interface User {
  id: number,
  name: string,
  email: string,
  preferences: string,
}

export interface UserForm {
  name: string,
  email: string,
  password: string
}

export interface LoginResponse {
  user: User,
  token: string
}

export interface UserState {
  user: User|null
}

export interface UserPreferences {
  categories: number[],
  authors: number[],
  sources: number[]
}