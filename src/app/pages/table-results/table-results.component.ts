import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-table-results',
  templateUrl: './table-results.component.html',
  styleUrls: ['./table-results.component.scss']
})
export class TableResultsComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  availableResults: any;
  ngOnInit(): void {
    this.availableResults = JSON.parse(localStorage.getItem('availableResults'));
    console.log(this.availableResults);
  }

}
