export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  token: string;
}

export interface authStoreInterface {
  user: User;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}
