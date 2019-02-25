import { Component, OnInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { Product } from '../../shop/product';
import { Order } from '../../shop/order';
import { BusketEventData } from '../classes';
import { DataCacheHandlerService } from '../../../../data-cache/data-cache-handler.service';

@Component({
  selector: 'app-aside-overview',
  templateUrl: './aside-overview.component.html',
  styleUrls: ['./aside-overview.component.scss']
})
export class AsideOverviewComponent implements OnInit {
  @Output() busketEvent: EventEmitter<BusketEventData> = new EventEmitter();
  @Input() product: Product;
  @Input() order: Order;
  color: string;
  constructor(private eleRef: ElementRef, private dataCache: DataCacheHandlerService) { }

  ngOnInit() {
  }

  ngAfterViewChecked(): void {
    this.product = this.dataCache.getDataStore('product');
    this.color = this.product.color;
  }

  addToBusket() {
    if (this.product.items.length) {
      this.busketEvent.emit({product: this.product, button: 'add'});
    }
  }

  updateProduct() {
    if (this.product.items.length) {
      this.busketEvent.emit({product: this.product, button: 'update'});
    }
  }

  cancel() {
    this.busketEvent.emit({product: this.product, button: 'cancel'});
  }
}
