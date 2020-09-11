import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Session } from '../Auth/auth.service';

export interface Booking {
  ClientID: number;
  BookingID: number;
  EmployeeID: number;
  paymentToken: string;
  PaymentAmount: number;
  ConservationAmount: number;
  TotalAmount: number;
  AccommodationBookings: AccommodationBooking[];
  ActivityBookings: ActivityBooking[];
  DayVisits: DayVisitBooking[];
  Session: Session;
}

export interface AccommodationBooking {
  AccommodationTypeID: number;
  AccommodationTypeName: string;
  CampID: number;
  ParkID: number;
  ParkName: string;
  CampName: string;
  BaseRate: number;
  BookingQuantity: number;
  StartDate: Date;
  EndDate: Date;
  Guests: Guest[];
}

export interface ActivityBooking {
  ActivityID: number;
  ActivityName: string;
  SlotID: number;
  CampID: number;
  ParkName: string;
  ParkID: number;
  CampName: string;
  ActivityRate: number;
  StartDate: Date;
  Guests: Guest[];
}

export interface DayVisitBooking {
  ParkGateID: number;
  ParkGateName: string;
  ParkName: string;
  ParkID: number;
  Rate: number;
  Date: Date;
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

  getItineraryActivityData(server: string, accommodationInfo: ActivityBooking) {
    return this.http.post<number>(`${server}/api/Booking/ActivityItinerary`, accommodationInfo, this.httpOptions);
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

  SaveBooking(bookingData, server) {
    return this.http.post<any>(`${server}/api/Booking/SaveBooking`, bookingData, this.httpOptions);
  }

  getClientFromSession(Session, server) {
    return this.http.post<any>(`${server}/api/Booking/GetClientID`, Session, this.httpOptions);
  }

    getActivitySlots(server, ID, CAMP) {
    return this.http.get<any>(`${server}/api/Booking/GetActivitySlots?ActivityID=${ID}&CampID=${CAMP}`);
  }

  getClosestGates(server, IDs) {
    return this.http.post<any>(`${server}/api/Booking/ClosestGates`, IDs, this.httpOptions);
  }
}
