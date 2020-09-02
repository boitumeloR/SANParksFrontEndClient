import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(private http: HttpClient) { }

  getDropDowns(server): Observable<any> {
    return this.http.get(`${server}/api/Booking/GetAvailabilityDropdowns`); // returns activityType array and acctype array
  }

  getCamps(parkID, server) {
    return this.http.get(`${server}/api/Booking/CampByPark?parkID=${parkID}`);
  }

  getActivityTypes(filters, server) {
    return this.http.get(`${server}/api/Booking/ActivitiesByFilter?parkID=${filters.parkID}&campID=${filters.campID}`);
  }

  getAccommodationTypes(filters, server) {
    return this.http.get(`${server}/api/Booking/AccommodationsByFilter?parkID=${filters.parkID}&campID=${filters.campID}`);
  }

  checkAvailability(availableData, server) {
    return this.http.post(`${server}/api/Booking/CheckAvailability`, availableData, this.httpOptions);
  }
}
