import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Item} from '../../../shop/item';
import {DataCacheHandlerService, User} from '../../../../../data-cache/data-cache-handler.service';
import {DataCacheEvents} from '../../../../../data-cache/data-cache-events';
import { SettingsData} from "../../classes";


@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
  @Input() item: Item;
  @Input() maxValue: number;
  @Input() minValue = 1;
  @Input() set value(data: number) {
    this.inputValue = data;
  }
  inputValue = 1;
  user: User;
  constructor(private dataCacheEvents: DataCacheEvents, private dataCache: DataCacheHandlerService) {
    this.dataCacheEvents.userDataChanged.subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit() {
    this.user = this.dataCache.getDataStore('user');
  }

  onSpinnerButtonClick(inputValue): void {
    if (inputValue < this.minValue) {
      inputValue = this.minValue;
    } else if (this.maxValue !== null && inputValue > this.maxValue) {
      inputValue = this.maxValue;
    }
    this.item.count = inputValue;

    /*update binded elements*/
    this.dataCacheEvents.countDataChanged.emit(this.item);
    this.dataCache.getDataStore('order').updatePrice();
  }
}
