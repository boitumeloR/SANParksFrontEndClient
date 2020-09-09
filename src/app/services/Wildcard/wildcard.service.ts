import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Session } from '../Auth/auth.service';


export interface Category {
  WildcardCategoryID: number;
  WilcardCategoryName: string;
  ParksCovered: string[];
  DefaultRate: number;
  Clusters: Cluster[];
}

export interface Cluster {
  WildcardClusterID: number;
  WildcardClusterName: string;
}

export interface Wildcard {
  CategoryID: number;
  ClusterID: number;
  WildcardID: number;
  ClientID: number;
  paymentToken: string;
  Amount: number;
  Session: Session;
  Dependents: Dependent[];
}

export interface Dependent {
  DependentName: string;
  DependentSurname: string;
  DependentIDCode: string;
  DependentCellphone: number;
  DependentEmailAddress: string;
}

@Injectable({
  providedIn: 'root'
})
export class WildcardService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content=Type': 'application/json'
    })
  };
  constructor(private http: HttpClient) { }

  getCategories(server): Observable<any> {
    return this.http.get(`${server}/api/Wildcard/GetCategories`);
  }

  getAmount(server, obj): Observable<number> {
    return this.http.get<number>(`${server}/api/Wildcard/GetAmount?ClusterID=${obj.ClusterID}&CategoryID=${obj.CategoryID}`);
  }

  SaveWildcard(wildcard: Wildcard, server: string): Observable<any> {
    return this.http.post<any>(`${server}/api/Wildcard/PurchaseWildcard`, wildcard, this.httpOptions);
  }

  SearchWildcard(session, server: string): Observable<any> {
    return this.http.post<any>(`${server}/api/Wildcard/SearchWildcard`, session, this.httpOptions);
  }

  RenewWildcard(wildcard: Wildcard, server) {
    return this.http.post<any>(`${server}/api/Wildcard/RenewWildcard`, wildcard, this.httpOptions);
  }
}
