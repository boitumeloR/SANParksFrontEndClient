import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoginClientComponent } from './pages/login-client/login-client.component';
import { AvailableResultsComponent } from './pages/available-results/available-results.component';
import { ViewAvailableComponent } from './modals/view-available/view-available.component';
import { ItineraryComponent } from './pages/itinerary/itinerary.component';
import { WildcardPricingComponent } from './pages/wildcard-pricing/wildcard-pricing.component';
import { BookingPaymentComponent } from './pages/booking-payment/booking-payment.component';
import { WildcardFamilyOptionComponent } from './pages/wildcard-family-option/wildcard-family-option.component';
import { DependentsComponent } from './pages/dependents/dependents.component';
import { ViewWildcardComponent } from './pages/view-wildcard/view-wildcard.component';
import { PayWildcardComponent } from './pages/pay-wildcard/pay-wildcard.component';
import { ResultsFixComponent } from './pages/results-fix/results-fix.component';
import { RenewWildcardComponent } from './pages/renew-wildcard/renew-wildcard.component';
import { MyBookingsComponent } from './pages/my-bookings/my-bookings.component';
import { UpdateAccommodationComponent } from './pages/update-accommodation/update-accommodation.component';
import { UpdatedBookingComponent } from './pages/updated-booking/updated-booking.component';
import { ClaimRefundComponent } from './pages/claim-refund/claim-refund.component';
import { BookingSuccessComponent } from './pages/booking-success/booking-success.component';
import { ClosestGateComponent } from './pages/closest-gate/closest-gate.component';


const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent
  },
  {
    path: 'Home',
    component: LandingPageComponent
  },
  {
    path: 'Login',
    component: LoginClientComponent
  },
  {
    path: 'availableResults',
    component: ResultsFixComponent
  },
  {
    path: 'itinerary',
    component: ItineraryComponent
  },
  {
    path: 'wildcardPricing',
    component: WildcardPricingComponent
  },
  {
    path: 'bookingPayment',
    component: BookingPaymentComponent
  },
  {
    path: 'wildcardFamily',
    component: WildcardFamilyOptionComponent
  },
  {
    path: 'Dependents',
    component: DependentsComponent
  },
  {
    path: 'viewWildcard',
    component: ViewWildcardComponent
  },
  {
    path: 'wildcardPayment',
    component: PayWildcardComponent
  },
  {
    path: 'renewWildcard',
    component: RenewWildcardComponent
  },
  {
    path: 'myBookings',
    component: MyBookingsComponent
  },
  {
    path: 'updateAccommodation',
    component: UpdateAccommodationComponent
  },
  {
    path: 'updatedBooking',
    component: UpdatedBookingComponent
  },
  {
    path: 'claimRefund',
    component: ClaimRefundComponent
  },
  {
    path: 'bookingSuccess',
    component: BookingSuccessComponent
  },
  {
    path: 'closestGate',
    component: ClosestGateComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
