import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
export interface SignUpAuth {
  UserID: number;
  Error: boolean;
  Message: string;
}

export interface CountryDropdown {
  CountryID: number;
  CountryName: string;
}

export interface SMSResult {
  ClientID: number;
  Error: boolean;
  Message: string;
}

export interface Session {
  Username: string;
  Password: string;
  SessionID: string;
  UserSecret: string;
  Error: string;
  SessionExpiry: Date;
  RoleID: number;
  isEmployee: boolean;
  isValidEmployee: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(private http: HttpClient) { }

  SignUpAuth(auth, server: string): Observable<SignUpAuth> {
    return this.http.post<SignUpAuth>(`${server}/api/Auth/RegisterUser`, auth, this.httpOptions);
  }

  SendSMS(userDetails, server): Observable<SMSResult> {
    return this.http.post<SMSResult>(`${server}/api/Auth/SendSMS`, userDetails, this.httpOptions);
  }

  VerifySMS(userDetails, server) {
    return this.http.post(`${server}/api/Auth/VerifyOTP`, userDetails, this.httpOptions);
  }

  SaveClient(clientDetails, server) {
    return this.http.post(`${server}/api/Auth/SaveClient`, clientDetails, this.httpOptions);
  }

  GetCountries(server) {
    return this.http.get(`${server}/api/Auth/GetCountries`);
  }

  Login(loginDetails: Session, server) {
    return this.http.post<Session>(`${server}/api/Auth/Login`, loginDetails, this.httpOptions);
  }

  LogOut(loginDetails: Session, server) {
    return this.http.post<Session>(`${server}/api/Auth/Logout`, loginDetails, this.httpOptions);
  }

  GetClientInfo(server, session) {
    return this.http.post<any>(`${server}/api/Auth/GetClient`, session, this.httpOptions);
  }

  UpdateClient(server, Client) {
    return this.http.post<any>(`${server}/api/Auth/UpdateClient`, Client, this.httpOptions);
  }

  SendLink(server: string, email: string) {
    return this.http.get<any>(`${server}/api/Auth/SendResetEmail?emailAddress=${email}`);
  }

  ResetPassword(server: string, password: any) {
    return this.http.post<any>(`${server}/api/Auth/ResetPassword`, password, this.httpOptions);
  }
}
