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
import { RenewWildcardComponent } from './pages/renew-wildcard/renew-wildcard.component';
import { GlobalConfirmComponent } from './modals/global-confirm/global-confirm.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { MyBookingsComponent } from './pages/my-bookings/my-bookings.component';
import { ViewBookingComponent } from './modals/view-booking/view-booking.component';
import { UpdateAccommodationComponent } from './pages/update-accommodation/update-accommodation.component';
import { ClaimRefundComponent } from './pages/claim-refund/claim-refund.component';
import { UpdatedBookingComponent } from './pages/updated-booking/updated-booking.component';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import { AddActivityBookingComponent } from './modals/add-activity-booking/add-activity-booking.component';
import { BookingSuccessComponent } from './pages/booking-success/booking-success.component';
import { ClosestGateComponent } from './pages/closest-gate/closest-gate.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { HttpClientModule } from '@angular/common/http';
import { TableResultsComponent } from './pages/table-results/table-results.component';
import {TableModule} from 'primeng/table';
import {PaginatorModule} from 'primeng/paginator';
import { AddChildGuestComponent } from './modals/childGuest/add-child-guest/add-child-guest.component';
import { AddDayVisitComponent } from './modals/add-day-visit/add-day-visit.component';
import { LoginModalComponent } from './modals/login-modal/login-modal.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { UpdateClientComponent } from './modals/update-client/update-client.component';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  timeGridPlugin,
  listPlugin,
  bootstrapPlugin
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
    SignUpComponent,
    RenewWildcardComponent,
    GlobalConfirmComponent,
    MyBookingsComponent,
    ViewBookingComponent,
    UpdateAccommodationComponent,
    ClaimRefundComponent,
    UpdatedBookingComponent,
    AddActivityBookingComponent,
    BookingSuccessComponent,
    ClosestGateComponent,
    NotFoundComponent,
    TableResultsComponent,
    AddChildGuestComponent,
    AddDayVisitComponent,
    LoginModalComponent,
    ProfileComponent,
    UpdateClientComponent
  ],
  imports: [
    MatSnackBarModule,
    FullCalendarModule,
    MatButtonModule,
    MatIconModule,
    MatTreeModule,
    AccordionModule.forRoot(),
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
    NgxStripeModule.forRoot(environment.stripeKey),
    BsDropdownModule.forRoot(),
    NgxIntlTelInputModule,
    HttpClientModule,
    TableModule,
    PaginatorModule
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
