import { Injectable } from '@angular/core';

export interface Booking {
  ClientID: number;
  BookingID: number;
  EmployeeID: number;
  paymentToken: any;
  AccommodationBookings: AccommodationBooking[];
  ActivityBookings: any;
  DayVisits: any;
}

export interface AccommodationBooking {
  AccommodationTypeID: number;
  CampID: number;
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

  constructor() { }
}
