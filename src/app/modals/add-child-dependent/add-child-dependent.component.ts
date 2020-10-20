import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Dependent } from 'src/app/services/Wildcard/wildcard.service';

@Component({
  selector: 'app-add-child-dependent',
  templateUrl: './add-child-dependent.component.html',
  styleUrls: ['./add-child-dependent.component.scss']
})
export class AddChildDependentComponent implements OnInit {

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

      const obj = {
        DependentIDCode: this.firstFormGroup.get('DependentIDCode').value,
        DependentName: this.firstFormGroup.get('DependentName').value,
        DependentSurname: this.firstFormGroup.get('DependentSurname').value,
      };

      this.event.emit({FormSubmit: this.firstFormGroup.value});
      this.close();
    }
  }

}
