import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-dependents',
  templateUrl: './add-dependents.component.html',
  styleUrls: ['./add-dependents.component.scss']
})
export class AddDependentsComponent implements OnInit {

  firstFormGroup: FormGroup;
  constructor(private bsModalRef: BsModalRef, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
  }

  confirm() {
    // do stuff
    this.close();
  }
  close() {
    this.bsModalRef.hide();
  }

}
