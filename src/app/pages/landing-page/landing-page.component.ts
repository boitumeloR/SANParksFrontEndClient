import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  spin = true;
  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.spin = false;
    }, 1000);
  }

  Scroll($element: HTMLElement) {
    console.log($element);
    $element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
  }
}
