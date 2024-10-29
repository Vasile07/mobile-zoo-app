import axiosInstance from '../common/axiosInstance';

export interface AuthProps {
  token: string;
}

export const login: (email?: string, password?: string) => Promise<AuthProps> = (email, password) => {
  console.log("LOGIIIIIIN")
  return axiosInstance.post("/users/login",{email: email, password: password});
}
