import {create} from 'zustand';
import {persist} from 'zustand/middleware';

import type { authStoreInterface, User } from './models/authStoreModels';

export const useAuthStore = create<authStoreInterface>()(
  persist(
    (set) => ({
      user: {} as User,
      isAuthenticated: false,
      login: (user: User) => {
        console.log('user:',user)
        set({ user, isAuthenticated: true })},
      logout: () => set({ user: {} as User, isAuthenticated: false }),
    }),
    { name: "auth" }
  )
);