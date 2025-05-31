import { API_CONFIG } from '../config/api';
import Cookies from 'js-cookie';

export type SignupPayload = {
  email: string;
  full_name: string;
  age: string;
  gender: string;
  interests: string[];
  password:string;
};

export type LoginResponse = {
    email: string,
    full_name: string,
    age: string,
    gender: string,
    interests: string[],
    accessToken: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};


export const signup = async (data: SignupPayload): Promise<LoginResponse> => {
  const res = await fetch(`${API_CONFIG.AUTH_API_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Signup failed');
  }

  return res.json();
};


export const login = async (data: LoginPayload): Promise<LoginResponse> => {
  const res = await fetch(`${API_CONFIG.AUTH_API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Login failed');
  }

  const responseData = await res.json();
  
  // Store the token in cookies
  if (responseData.accessToken) {
    Cookies.set('token', responseData.accessToken, { expires: 7 });
  }

  return responseData;
};
