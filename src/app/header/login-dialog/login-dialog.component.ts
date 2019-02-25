import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {HttpConnection} from '../../communication/http-connection';
import {DataCacheHandlerService} from '../../data-cache/data-cache-handler.service';
import {User} from '../../data-cache/data-cache-handler.service';
import {DataCacheEvents} from "../../data-cache/data-cache-events";

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})

export class LoginDialogComponent implements OnInit {
  user =  new User();
  customer: string;
  userErrors = new User();
  checkMail = false;
  checkMailReg = false;
  loading = false;
  saveLogin = false;
  constructor(private dialogRef: MatDialogRef<LoginDialogComponent>,
              private http: HttpConnection,
              private dataCache: DataCacheHandlerService,
              private dataCacheEvents: DataCacheEvents) { }

  ngOnInit() {
    this.customer = this.dataCache.getDataStore('customer');
  }

  onSubmit() {
    this.loading = true;
    this.http.checkUser(this.customer, this.user).subscribe(data => {
      this.userErrors = new User();
      if (data.status === 'success') {
        this.dataCache.setDataStore('user', data.message);
        this.dataCacheEvents.userDataChanged.emit(data.message);
        if(this.saveLogin){
          localStorage.setItem('userShop', JSON.stringify(data.message));
        }
        this.dialogRef.close();
      } else if (data.status === 'error') {
        this.userErrors[data.message] = data.status;
      } else if (data.status === 'info') {
        this.checkMail = true;
      }
      console.log(data);
      this.loading = false;
    }, error => {
      console.log(error);
      this.loading = false;
    });
  }

  onSubmitAsGuest() {
    this.dataCache.setDataStore('user', this.user);
    this.dataCacheEvents.userDataChanged.emit(this.user);
    this.dialogRef.close();
  }

  onSubmitRegister() {
    this.http.registerUser(this.customer, this.user).subscribe( data => {
        this.checkMailReg = true;
    }, error => {
      console.log(error);
    });
  }

  sendNewPassword(){
    this.http.createNewPassword(this.customer, this.user).subscribe( data => {
      if (data.status === 'error') {
        this.userErrors[data.message] = data.status;
      } else if (data.status === 'info') {
        this.checkMail = true;
      }
    }, error => {
      console.log(error);
    });
  }
}
