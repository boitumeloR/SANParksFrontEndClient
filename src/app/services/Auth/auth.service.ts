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
}