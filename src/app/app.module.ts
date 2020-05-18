import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AvailabilityBoxComponent } from './availability-box/availability-box.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LandingPageComponent,
    AvailabilityBoxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
