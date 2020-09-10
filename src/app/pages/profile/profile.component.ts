import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global/global.service';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UpdateClientComponent } from 'src/app/modals/update-client/update-client.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {


  bsModalRef: BsModalRef;
  clientInfo: any;
  constructor(private serv: AuthService, private global: GlobalService,
              private snack: MatSnackBar, private router: Router, private modalService: BsModalService) { }

  ngOnInit(): void {
    const session = sessionStorage.getItem('session');
    console.log('here');
    this.serv.GetClientInfo(this.global.GetServer(), session).subscribe(res => {
      if (res.Client) {
        console.log(res);
        this.clientInfo = res.Client;
        sessionStorage.setItem('session', JSON.stringify(res.Session));
      } else {
        this.router.navigateByUrl('Login');
      }
    });
  }

  UpdateClient() {
    const initialState = {
      backdrop: 'static'
    };
    this.bsModalRef = this.modalService.show(UpdateClientComponent,
      {
        class: 'modal-lg modal-dialog-centered',
        backdrop: 'static',
        initialState: {clientInfo: this.clientInfo}
      });
    this.bsModalRef.content.closeBtnName = 'Close';
  }

}