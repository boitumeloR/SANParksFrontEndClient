import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './sub-components/header/header.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { AvailabilityBoxComponent } from './sub-components/availability-box/availability-box.component';
import { LoginClientComponent } from './pages/login-client/login-client.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SpinnerComponent } from './sub-components/spinner/spinner.component';
import { SocialLoginModule, AuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { environment } from 'src/environments/environment';
import { AvailableResultsComponent } from './pages/available-results/available-results.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ViewAvailableComponent } from './modals/view-available/view-available.component';
import { ModalModule, BsModalRef } from 'ngx-bootstrap/modal';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ViewAvailableImgComponent } from './modals/view-available-img/view-available-img.component';
import { AddBookingComponent } from './modals/add-booking/add-booking.component';
import { ItineraryComponent } from './pages/itinerary/itinerary.component';
import { RemoveGuestConfirmComponent } from './modals/remove-guest-confirm/remove-guest-confirm.component';
import { AddGuestComponent } from './modals/add-guest/add-guest.component';
import { WildcardPricingComponent } from './pages/wildcard-pricing/wildcard-pricing.component';
import {MatStepperModule} from '@angular/material/stepper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BookingPaymentComponent } from './pages/booking-payment/booking-payment.component';
import { NgxStripeModule } from 'ngx-stripe';
import { WildcardFamilyOptionComponent } from './pages/wildcard-family-option/wildcard-family-option.component';
import { AddDependentsComponent } from './modals/add-dependents/add-dependents.component';
import { DependentsComponent } from './pages/dependents/dependents.component';
import { ViewWildcardComponent } from './pages/view-wildcard/view-wildcard.component';
import { ViewWildcardDetailsComponent } from './modals/view-wildcard-details/view-wildcard-details.component';
import { AddChildDependentComponent } from './modals/add-child-dependent/add-child-dependent.component';
import { PayWildcardComponent } from './pages/pay-wildcard/pay-wildcard.component';
import { AvailableBoxFixComponent } from './sub-components/available-box-fix/available-box-fix.component';
import { ResultsFixComponent } from './pages/results-fix/results-fix.component';
import {MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { SignUpComponent } from './modals/sign-up/sign-up.component';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  timeGridPlugin,
  listPlugin
]);
const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(environment.googleApiUrl)
  }
]);

export function provideConfig() {
  return config;
}


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LandingPageComponent,
    AvailabilityBoxComponent,
    LoginClientComponent,
    SpinnerComponent,
    AvailableResultsComponent,
    ViewAvailableComponent,
    ViewAvailableImgComponent,
    AddBookingComponent,
    ItineraryComponent,
    RemoveGuestConfirmComponent,
    AddGuestComponent,
    WildcardPricingComponent,
    BookingPaymentComponent,
    WildcardFamilyOptionComponent,
    AddDependentsComponent,
    DependentsComponent,
    ViewWildcardComponent,
    ViewWildcardDetailsComponent,
    AddChildDependentComponent,
    PayWildcardComponent,
    AvailableBoxFixComponent,
    ResultsFixComponent,
    SignUpComponent
  ],
  imports: [
    FullCalendarModule,
    MatButtonModule,
    MatIconModule,
    MatTreeModule,
    BsDatepickerModule.forRoot(),
    CarouselModule.forRoot(),
    ModalModule.forRoot(),
    CollapseModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SocialLoginModule,
    CommonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    NgxStripeModule.forRoot(environment.stripeKey)
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [
    BsModalRef,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
