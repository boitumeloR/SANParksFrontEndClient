import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-guest',
  templateUrl: './add-guest.component.html',
  styleUrls: ['./add-guest.component.scss']
})
export class AddGuestComponent implements OnInit {

  constructor(private bsModalRef: BsModalRef, private snack: MatSnackBar) { }

  ngOnInit(): void {
  }

  confirm() {
    // do stuff
    this.snack.open('Successfuly Updated Guest', 'Okay', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
    this.close();
  }
  close() {
    this.bsModalRef.hide();
  }
}
