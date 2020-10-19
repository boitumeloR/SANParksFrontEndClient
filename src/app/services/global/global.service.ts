import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  server = 'https://sanparksapi.azurewebsites.net';
  constructor() { }

  GetServer(): string {
    return this.server;
  }
}
