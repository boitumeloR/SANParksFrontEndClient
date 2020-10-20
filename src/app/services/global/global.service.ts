import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  // https://sanparksapi.azurewebsites.net/
  server = 'https://sanparksapi.azurewebsites.net';
  constructor() { }

  GetServer(): string {
    return this.server;
  }
}
