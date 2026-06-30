export interface LoginRequest {
  email: string;
  password: string;
}

export interface authResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
  }
};

export interface RegisterRequest {
  firstname: string;
  lastname: string;
  email: string;
  passwordHash: string;
}
