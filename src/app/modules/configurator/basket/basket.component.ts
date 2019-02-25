import { Component, OnInit, ElementRef } from '@angular/core';
import {Order} from '../shop/order';
import {DataCacheHandlerService, User} from '../../../data-cache/data-cache-handler.service';
import { Router, NavigationExtras } from '@angular/router';
import { Product } from '../shop/product';
import {MatDialog} from '@angular/material';
import {DialogAllDatasheetsComponent} from './dialog-all-datasheets/dialog-all-datasheets.component';
import { DialogSendOrderComponent } from './dialog-send-order/dialog-send-order.component';
import {DataCacheEvents} from '../../../data-cache/data-cache-events';
import {LoginDialogComponent} from "../../../header/login-dialog/login-dialog.component";

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {
  order: Order;
  config: any;
  customer: any;
  showDeliveryAddress = false;
  accordions: any = {};
  expand = false;
  user: User;
  constructor(private dataCacheHandlerService: DataCacheHandlerService,
              private dataCacheEvents: DataCacheEvents,
              private eleRef: ElementRef,
              private router: Router,
              private dialog: MatDialog) {
    this.dataCacheEvents.userDataChanged.subscribe(user => {
      this.user = user;
      this.order.fastline = false;
    });
  }

  ngOnInit() {
    this.order = this.dataCacheHandlerService.getDataStore('order');
    this.config = this.dataCacheHandlerService.getDataStore('config');
    this.user = this.dataCacheHandlerService.getDataStore('user');
  }

  onExpandCollaps(expand) {
    this.expand = expand;
    for (const position of this.order.positions) {
      position.visible = expand;
      for (const product of position.products) {
        product.visible = expand;
      }
    }
  }

  removeProduct(prod) {
    this.order.removeProduct(prod);
  }

  onCommentChange(ev) {
    try {
      this.order.comment = ev.target.value;
    } catch(e) {
      console.info('could not set textarea-value');
    }
  }

  editProduct(prod: Product) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        product: JSON.stringify(this.order.getProductInfo(prod)),
        replaceUrl: true
      }
    };
    this.order.editProduct = prod;
    this.router.navigate(['/configurator/shop/' + prod.capture], navigationExtras);
  }

  onPrint(): void {
    this.onExpandCollaps(true);
    setTimeout( window.print, 500);
  }

  onDeleteBasket(): void {
    this.order.removeAllPositions();
  }

  onDialogAllDatasheets(): void {
    this.dialog.open(DialogAllDatasheetsComponent, {data: this.order.positions, width: '700px'});
  }

  onSubmit() {
    if(this.dataCacheHandlerService.getDataStore('user') === null){
      this.dialog.open(LoginDialogComponent, {
      });
      return;
    }

    const sendOrderDialog = this.dialog.open(DialogSendOrderComponent, {data: this.order, width: '700px', panelClass: 'dialog-send-order'});
    sendOrderDialog.afterClosed().subscribe((success) => {
      if (success) {
        this.order = new Order(this.dataCacheHandlerService.getDataStore('taxProduct'));
        this.dataCacheHandlerService.setDataStore('order', this.order);
        localStorage.setItem('order', null);
      }
    });
  }
}
