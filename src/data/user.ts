import axios, { AxiosError } from 'axios';
import { useState, useEffect } from 'react';
import { BehaviorSubject, Observable } from 'rxjs';

import { apiBaseUrl } from '../config';

export interface UserAuthInfo {
  username: string;
  administrator: boolean;
}

export interface User {
  username: string;
  administrator: boolean;
  nickname: string;
  _links: {
    avatar: string;
    timeline: string;
  };
}

export interface UserWithToken extends User {
  token: string;
}

interface CreateTokenRequest {
  username: string;
  password: string;
}

interface CreateTokenResponse {
  token: string;
  user: User;
}

interface VerifyTokenRequest {
  token: string;
}

interface VerifyTokenResponse {
  user: User;
}

export type LoginCredentials = CreateTokenRequest;

const userSubject = new BehaviorSubject<UserWithToken | null | undefined>(
  undefined
);

export const user$: Observable<UserWithToken | null | undefined> = userSubject;

export function getCurrentUser(): UserWithToken | null | undefined {
  return userSubject.value;
}

const kCreateTokenUrl = '/token/create';
const kVerifyTokenUrl = '/token/verify';
const createTokenUrl = apiBaseUrl + kCreateTokenUrl;
const verifyTokenUrl = apiBaseUrl + kVerifyTokenUrl;

async function verifyToken(token: string): Promise<User> {
  const res = await axios.post(verifyTokenUrl, {
    token: token
  } as VerifyTokenRequest);
  const d = res.data as VerifyTokenResponse;
  return d.user;
}

const TOKEN_STORAGE_KEY = 'token';

export async function checkUserLoginState(): Promise<UserWithToken | null> {
  if (getCurrentUser() !== undefined)
    throw new Error("Already checked user. Can't check twice.");

  const savedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY);
  let user: UserWithToken | null = null;
  try {
    if (savedToken) {
      const res = await verifyToken(savedToken);
      user = {
        ...res,
        token: savedToken
      };
    }
  } catch (e) {
    console.error(e);
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
  userSubject.next(user);
  return user;
}

export class BadCredentialError {
  constructor(public innerError: Error) {}

  message = 'login.badCredential';
}

export function userLogin(
  credentials: LoginCredentials,
  rememberMe: boolean
): Promise<UserWithToken> {
  if (getCurrentUser() === undefined) {
    throw new Error('Please check user first.');
  }
  if (getCurrentUser()) {
    throw new Error('Already login.');
  }
  return axios
    .post<CreateTokenResponse>(createTokenUrl, credentials)
    .catch(e => {
      const error = e as AxiosError;
      if (error.response?.data?.code === 11010101) {
        throw new BadCredentialError(e);
      }
      throw e;
    })
    .then(res => {
      const body = res.data;
      const token = body.token;
      if (rememberMe) {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
      }
      const user = {
        ...body.user,
        token
      };
      userSubject.next(user);
      return user;
    });
}

export function userLogout(): void {
  if (getCurrentUser() === undefined) {
    throw new Error('Please check user first.');
  }
  if (getCurrentUser() === null) {
    throw new Error('No login.');
  }
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  userSubject.next(null);
}

export function useUser(): UserWithToken | null | undefined {
  const [user, setUser] = useState<UserWithToken | null | undefined>(
    userSubject.value
  );
  useEffect(() => {
    const sub = user$.subscribe(u => setUser(u));
    return () => {
      sub.unsubscribe();
    };
  });
  return user;
}

export async function fetchUser(username: string): Promise<User> {
  const res = await axios.get<User>(`${apiBaseUrl}/users/${username}`);
  return res.data;
}
