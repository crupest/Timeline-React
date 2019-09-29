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

  private _token: string | null = null;
  private userSubject = new BehaviorSubject<User | null | undefined>(undefined);

  public readonly user$: Observable<User | null> = this.userSubject.pipe(
    filter(value => value !== undefined)
  ) as Observable<User | null>;

  public get currentUser(): User | null | undefined {
    return this.userSubject.value;
  }

  public get token(): string | null {
    return this._token;
  }

  private checkLogin() {
    if (!this.token) throw Error("Can't do this when not login.");
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
        this._token = savedToken;
        this.userSubject.next(user);
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
    if (this.token) {
      throw Error("Already login!");
    }

    const res = await axios.post(
      this.createTokenUrl,
      credentials as CreateTokenRequest
    );
    const body = res.data as CreateTokenResponse;
    this._token = body.token;
    if (rememberMe) {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, body.token);
    }
    this.userSubject.next(body.user);
    return body.user;
  }

  public logout(): void {
    if (!this.token) {
      console.warn("Try to logout when not login.");
      return;
    }

    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    this._token = null;
    this.userSubject.next(null);
  }

  public generateAvartarUrl(username: string): string {
    this.checkLogin();
    return `${apiBaseUrl}/users/${username}/avatar?token=${this.token}`;
  }
}
