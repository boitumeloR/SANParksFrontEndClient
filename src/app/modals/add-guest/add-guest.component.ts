import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-guest',
  templateUrl: './add-guest.component.html',
  styleUrls: ['./add-guest.component.scss']
})
export class AddGuestComponent implements OnInit {

  guestInfo: FormGroup;
  constructor(private bsModalRef: BsModalRef, private snack: MatSnackBar,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.guestInfo = this.formBuilder.group({
      country: [1, Validators.required],
      name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      surname: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      age: [null, Validators.compose([Validators.required, Validators.max(100)])],
      id: ['', Validators.compose([Validators.maxLength(20), Validators.required])]
    });
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
