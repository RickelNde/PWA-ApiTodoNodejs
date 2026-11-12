export type User = {
  id: string;
  firstName: string;
  lastName:string;
  passWord: string;
  email:string
  roleId: string;
  created_At: Date;
  updated_At: Date;
};

export interface CreateUserRequest {
    firstName: string;
  lastName:string;
  passWord: string;
  email:string
  };

export type UserResponse = {
  id: string;
  firstName: string;
  lastName:string;
  passWord: string;
  email:string
  roleId: string;
  created_At: Date;
  updated_At: Date;
};

