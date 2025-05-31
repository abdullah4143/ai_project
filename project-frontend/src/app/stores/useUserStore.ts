import { create } from 'zustand';
import Cookies from 'js-cookie';
import axios from 'axios';
import { API_CONFIG } from '@/config/api';

type UserData = {
  id: number;
  email: string;
  full_name: string;
  age: string;
  gender: string;
  interests: string[];
  accessToken: string;
};

type UserStore = {
  user: UserData | null;
  setUser: (userData: UserData) => void;
  updateUser: (data: Partial<UserData>) => void;
  resetUser: () => void;
  getUser: () => UserData | null;
  initializeFromCookie: () => Promise<void>;
};

const defaultUser: UserData = {
  id: 0,
  email: '',
  full_name: '',
  age: '',
  gender: '',
  interests: [],
  accessToken: '',
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,

  setUser: (userData) => {
    set({ user: userData });
    if (userData.accessToken) {
      Cookies.set('token', userData.accessToken, { expires: 7 });
    }
  },

  updateUser: (data) =>
    set((state) => {
      if (!state.user) return state;
      
      const updatedUser = { ...state.user, ...data };
      if (data.accessToken) {
        Cookies.set('token', data.accessToken, { expires: 7 });
      }
      return { user: updatedUser };
    }),

  resetUser: () => {
    Cookies.remove('token');
    set({ user: null });
  },

  getUser: () => get().user,

  initializeFromCookie: async () => {
    const token = Cookies.get('token');
    if (!token) {
      set({ user: null });
      return;
    }

    try {
      // Validate token by making a request to get user data
      const response = await axios.get(`${API_CONFIG.AUTH_API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data) {
        set({ 
          user: {
            ...response.data,
            accessToken: token
          }
        });
      } else {
        Cookies.remove('token');
        set({ user: null });
      }
    } catch (error) {
      Cookies.remove('token');
      set({ user: null });
    }
  },
}));
