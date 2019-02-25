import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import {SettingsData} from '../../classes';
import { DataCacheHandlerService } from '../../../../../data-cache/data-cache-handler.service';
import { Artikel } from '../../../shop/item';

@Component({
  selector: 'app-misc',
  templateUrl: './misc.component.html',
  styleUrls: ['./misc.component.scss']
})
export class MiscComponent implements OnInit {
  @Input() set sliderData(data: SettingsData) {
    if (typeof data !== 'undefined') {
      this.settingsData = data;
      this.products = data.artikel;
      if (data.value) {
        for (let i = 0; i < this.products.length; i++) {
          if (JSON.stringify(this.products[i]) === JSON.stringify(data.value)) {
            this.settingsData.value = this.products[i];
          }
        }
      } else {
        this.settingsData.value = this.products[0];
      }
    }
    this.onResizeWindow();
  }
  @Input() color: string;
  settingsData: SettingsData;
  products: any;
  stock: any;
  conf: any;
  @Output() productChangeEvent: EventEmitter<any> = new EventEmitter();
  @ViewChild('misc') miscContainer: ElementRef;
  @ViewChild('image') imageContainer: ElementRef;
  constructor(dataCache: DataCacheHandlerService) {
    this.conf = dataCache.getDataStore('config');
  }

  ngOnInit() {
    this.onItemChange();
    this.setStock();
  }

  onItemChange() {
    this.productChangeEvent.emit({type: 'misc', data: {artikel: this.settingsData.value}});
  }

  setStock() {
    const artikel: Artikel = this.settingsData.value;
    this.stock = artikel.VerfuegbarerBestand > 0 ? artikel.VerfuegbarerBestand : null;
    if (this.stock > this.conf.stockMax) {
      this.stock = ' > ' + this.conf.stockMax;
    }
  }

  ////// adjust height
  onResizeWindow() {
    this.miscContainer.nativeElement.style.height = (document.documentElement.clientHeight - 470) + "px";
    const img = this.imageContainer.nativeElement.getElementsByTagName('img') as HTMLCollectionOf<HTMLElement>;
    if (this.imageContainer.nativeElement.getElementsByTagName('img')[0].clientHeight !== 0) {
      this.imageContainer.nativeElement.style.paddingTop = ((this.imageContainer.nativeElement.offsetHeight - this.imageContainer.nativeElement.getElementsByTagName('img')[0].clientHeight) / 2) + "px";
    }
  }
}
