import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpConnection } from '../../../../communication/http-connection';
import { DataCacheHandlerService } from '../../../../data-cache/data-cache-handler.service';
import { Order } from '../../shop/order';

@Component({
  selector: 'app-dialog-send-order',
  templateUrl: './dialog-send-order.component.html',
  styleUrls: ['./dialog-send-order.component.scss']
})
export class DialogSendOrderComponent implements OnInit {
  dialog: any;
  inProgress = true;
  success = false;
  customer: any;
  result: any;
  orderType: string;
  constructor(private dialogRef: MatDialogRef<DialogSendOrderComponent>,
              private http: HttpConnection,
              private dataCacheHandlerService: DataCacheHandlerService,
              @Inject(MAT_DIALOG_DATA) public data: Order) {
    this.dialog = this.dialogRef;
  }

  ngOnInit() {
    this.inProgress = true;
    this.orderType = this.data.orderType;
    this.data.orderNumber = Date.now().toString();
    this.http.sendOrder(this.dataCacheHandlerService.getDataStore('customer'), this.data, this.dataCacheHandlerService.getDataStore('user')).subscribe( data => {
      this.inProgress = false;
      this.success = true;
    }, error => {
      this.inProgress = false;
      this.success = false;
      console.log(error);
    });
  }
}
