export const kCreateTokenUrl = '/token/create';
export const kVerifyTokenUrl = '/token/verify';

export interface User {
  username: string;
  administrator: boolean;
}

export interface CreateTokenRequest {
  username: string;
  password: string;
}

export interface CreateTokenResponse {
  token: string;
  user: User;
}

export interface VerifyTokenRequest {
  token: string;
}

export interface VerifyTokenResponse {
  user: User;
}
