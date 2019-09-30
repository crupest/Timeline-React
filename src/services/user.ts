import { BehaviorSubject, Observable } from "rxjs";
import { filter } from "rxjs/operators";
import axios from "axios";

import { apiBaseUrl } from "../config";

const TOKEN_STORAGE_KEY = "token";

const kCreateTokenUrl = "/token/create";
const kVerifyTokenUrl = "/token/verify";

export interface User {
  username: string;
  administrator: boolean;
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

export class UserService {
  private static instance: UserService;

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  private get createTokenUrl() {
    return apiBaseUrl + kCreateTokenUrl;
  }
  private get verifyTokenUrl() {
    return apiBaseUrl + kVerifyTokenUrl;
  }

  private userSubject = new BehaviorSubject<UserWithToken | null | undefined>(
    undefined
  );

  public readonly user$: Observable<UserWithToken | null> = this.userSubject.pipe(
    filter(value => value !== undefined)
  ) as Observable<UserWithToken | null>;

  public get currentUser(): UserWithToken | null | undefined {
    return this.userSubject.value;
  }

  public get token(): string | null {
    const user = this.currentUser;
    return user ? user.token : null;
  }

  private async verifyToken(token: string): Promise<User> {
    const res = await axios.post(this.verifyTokenUrl, {
      token
    } as VerifyTokenRequest);
    const d = res.data as VerifyTokenResponse;
    return d.user;
  }

  public async checkSavedLoginState(): Promise<void> {
    if (this.currentUser !== undefined) {
      console.log(
        "Already checked login state. If you are using hot state reload, you may safely ignore this!"
      );
      return;
    }

    const savedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    if (savedToken === null) {
      this.userSubject.next(null);
    } else {
      try {
        const user = await this.verifyToken(savedToken);
        this.userSubject.next({
          ...user,
          token: savedToken
        });
      } catch (e) {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
        this.userSubject.next(null);
        console.error(e);
      }
    }
  }

  public async login(
    credentials: LoginCredentials,
    rememberMe: boolean
  ): Promise<User> {
    if (this.currentUser) {
      throw Error("Already login!");
    }

    const res = await axios.post(
      this.createTokenUrl,
      credentials as CreateTokenRequest
    );
    const body = res.data as CreateTokenResponse;
    const token = body.token;
    if (rememberMe) {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    }
    this.userSubject.next({
      ...body.user,
      token
    });
    return body.user;
  }

  public logout(): void {
    if (!this.currentUser) {
      console.warn("Try to logout when not login.");
      return;
    }

    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    this.userSubject.next(null);
  }
}

export function generateAvartarUrl(username: string, token: string): string {
  return `${apiBaseUrl}/users/${username}/avatar?token=${token}`;
}
