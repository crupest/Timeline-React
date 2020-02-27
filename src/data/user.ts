import axios, { AxiosError } from 'axios';
import { useState, useEffect } from 'react';
import { BehaviorSubject, Observable } from 'rxjs';

import { apiBaseUrl } from '../config';
import { pushAlert } from '../common/alert-service';
import { i18nPromise } from '../i18n';

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

function verifyToken(token: string): Promise<User> {
  return axios
    .post<VerifyTokenResponse>(verifyTokenUrl, {
      token: token
    } as VerifyTokenRequest)
    .then(res => res.data.user);
}

const TOKEN_STORAGE_KEY = 'token';

export function checkUserLoginState(): Promise<UserWithToken | null> {
  if (getCurrentUser() !== undefined)
    throw new Error("Already checked user. Can't check twice.");

  const savedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY);
  if (savedToken) {
    return verifyToken(savedToken)
      .then(
        u => {
          const user: UserWithToken = {
            ...u,
            token: savedToken
          };
          i18nPromise.then(t => {
            pushAlert({
              type: 'success',
              message: t('user.welcomeBack')
            });
          });
          return user;
        },
        (e: AxiosError) => {
          if (e.response != null) {
            window.localStorage.removeItem(TOKEN_STORAGE_KEY);
            i18nPromise.then(t => {
              pushAlert({
                type: 'danger',
                message: t('user.verifyTokenFailed')
              });
            });
          } else {
            i18nPromise.then(t => {
              pushAlert({
                type: 'danger',
                message: t('user.verifyTokenFailedNetwork')
              });
            });
          }

          return null;
        }
      )
      .then(u => {
        userSubject.next(u);
        return u;
      });
  }
  userSubject.next(null);
  return Promise.resolve(null);
}

export class BadCredentialError {
  constructor(public innerError: Error) {}

  message = 'login.badCredential';
}

export function userLogin(
  credentials: LoginCredentials,
  rememberMe: boolean
): Promise<UserWithToken> {
  if (getCurrentUser()) {
    throw new Error('Already login.');
  }
  return axios
    .post<CreateTokenResponse>(createTokenUrl, { ...credentials, expire: 30 })
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

export function useOptionalUser(): UserWithToken | null | undefined {
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

export function useUser(): UserWithToken | null {
  const [user, setUser] = useState<UserWithToken | null>(() => {
    const initUser = userSubject.value;
    if (initUser === undefined) {
      throw new Error(
        "This is a logic error in user module. Current user can't be undefined in useUser."
      );
    }
    return initUser;
  });
  useEffect(() => {
    const sub = user$.subscribe(u => {
      if (u === undefined) {
        throw new Error(
          "This is a logic error in user module. User emitted can't be undefined later."
        );
      }
      setUser(u);
    });
    return () => {
      sub.unsubscribe();
    };
  });
  return user;
}

export function fetchUser(username: string): Promise<User> {
  return axios
    .get<User>(`${apiBaseUrl}/users/${username}`)
    .then(res => res.data);
}
