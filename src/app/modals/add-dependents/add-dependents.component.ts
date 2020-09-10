import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Dependent } from 'src/app/services/Wildcard/wildcard.service';

@Component({
  selector: 'app-add-dependents',
  templateUrl: './add-dependents.component.html',
  styleUrls: ['./add-dependents.component.scss']
})
export class AddDependentsComponent implements OnInit {

  firstFormGroup: FormGroup;
  public event: EventEmitter<Dependent> = new EventEmitter<Dependent>();
  constructor(private bsModalRef: BsModalRef, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.firstFormGroup = this.formBuilder.group({
      DependentIDCode: ['', Validators.required],
      DependentName: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      DependentSurname: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      DependentEmailAddress: ['', Validators.compose([Validators.required, Validators.maxLength(50), Validators.email])],
      DependentCellphone: ['', Validators.compose([Validators.required, Validators.maxLength(15)])]
    });
  }

  confirm() {
    // do stuff
    this.close();
  }
  close() {
    this.bsModalRef.hide();
  }

  Save() {
    if (this.firstFormGroup.valid) {
      this.event.emit(this.firstFormGroup.value);
      this.close();
    }
  }

}
