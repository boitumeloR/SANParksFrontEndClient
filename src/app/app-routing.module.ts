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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
