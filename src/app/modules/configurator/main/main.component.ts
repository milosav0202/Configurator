import { Component, Input, OnInit } from '@angular/core';
import {Order} from '../shop/order';
import { DataCacheHandlerService } from '../../../data-cache/data-cache-handler.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  constructor(private dataCache: DataCacheHandlerService) {
    if (!this.dataCache.getDataStore('order')) {
      let newOrder = new Order(this.dataCache.getDataStore('taxProduct'));
      newOrder.loadFromLocalStorage();
      this.dataCache.setDataStore('order', newOrder);
    }
  }

  ngOnInit() {
  }
}
