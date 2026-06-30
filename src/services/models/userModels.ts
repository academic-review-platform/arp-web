// User Models
export interface UserProfile {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRequest {
  firstname?: string;
  lastname?: string;
  email?: string;
}
