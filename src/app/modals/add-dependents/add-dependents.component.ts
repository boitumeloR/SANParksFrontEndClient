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
  public event: EventEmitter<any> = new EventEmitter<any>();
  constructor(private bsModalRef: BsModalRef, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.firstFormGroup = this.formBuilder.group({
      DependentIDCode: ['', Validators.required],
      DependentName: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      DependentSurname: ['', Validators.compose([Validators.required, Validators.maxLength(50)])]
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
      console.log(this.firstFormGroup.value);
      this.event.emit({FormSubmit: this.firstFormGroup.value});
      this.close();
    }
  }

}
