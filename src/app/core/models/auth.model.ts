export interface LoginPayload {
    email: string;
    password: string;
  }
  
export interface LoginResponse {
  access_token: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export  interface ChangePasswordPayload {
  token: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}