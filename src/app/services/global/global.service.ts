import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  server = 'https://sanparksfrontoffice.web.app';
  constructor() { }

  GetServer(): string {
    return this.server;
  }
}
