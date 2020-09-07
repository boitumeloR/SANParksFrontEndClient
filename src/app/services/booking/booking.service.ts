import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Booking {
  ClientID: number;
  BookingID: number;
  EmployeeID: number;
  paymentToken: any;
  PaymentAmount: number;
  ConservationAmount: number;
  TotalAmount: number;
  AccommodationBookings: AccommodationBooking[];
  ActivityBookings: any;
  DayVisits: any;
}

export interface AccommodationBooking {
  AccommodationTypeID: number;
  AccommodationTypeName: string;
  CampID: number;
  ParkName: string;
  CampName: string;
  BaseRate: number;
  BookingQuantity: number;
  StartDate: Date;
  EndDate: Date;
  Guests: Guest[];
}

export interface Guest {
  GuestName: string;
  GuestSurname: string;
  GuestIDCode: string;
  GuestAge: number;
  CountryID: number;
}
@Injectable({
  providedIn: 'root'
})
export class BookingService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Comes back with parkName, campName and rate info for accType
  getItineraryAccommodationData(server: string, accommodationInfo: AccommodationBooking) {
    return this.http.post<number>(`${server}/api/Booking/AccommodationItinerary`, accommodationInfo, this.httpOptions);
  }
  getConservationFees(guests: Guest[], server: string): Observable<any> {
    return this.http.post(`${server}/api/Booking/GetConservationFees`, guests, this.httpOptions);
  }

  dummy(server, session) {
    return this.http.post<any>(`${server}/api/Booking/dummy`, session, this.httpOptions);
  }
  WildcardExists(server: string, session) {
    return this.http.post<any>(`${server}/api/Booking/WildcardExists`, session, this.httpOptions);
  }
}
