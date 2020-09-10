import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  server = 'https://localhost:44371';
  constructor() { }

  GetServer(): string {
    return this.server;
  }
}
