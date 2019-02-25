import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import {DataCacheHandlerService} from '../../../../data-cache/data-cache-handler.service';
import { SettingsData, sliderSettings } from '../classes';
import { Product } from '../../shop/product';
import {Artikel} from '../../shop/item';
import { PageInfo } from '../../shop/shop.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @Input() color: string;
  @Input() set subGroup(group: string) {
    if (typeof group !== 'undefined') {
      this.product.subGroup = group;
      switch (this.pageInfo.page) {
        case 'normal':
          this.product.removeAllItems();
          if (+group < 2) {
            this.loadSettingsForLed(group);
          } else {
            this.loadSettingsForMisc(group);
          }
          this.showSettings();
          break;
        case 'edit':
          this.showSettings();
          if (+group < 2) {
            setTimeout(() => document.documentElement.scrollTop = document.documentElement.scrollHeight, 50);
            this.pageInfo.page = 'normal';
          }
          break;
        case 'search':
          if (+group < 2) {
              this.loadSettingsForLed(group);
          } else {
              this.loadSettingsForMisc(group);
              this.product.settingsData[0].value = this.pageInfo.params;
          }
          this.showSettings();
          this.pageInfo.page = 'normal';
      }
    } else {
      this.elements = [];
      this.subGroupProducts = [];
    }
  }
  @Input() product: Product;
  @Input() pageInfo: PageInfo;
  conf: any;
  allProducts: Artikel[];
  elements: SettingsData[] = [];
  subGroupProducts: any = [];
  @Output() productChangeEvent: EventEmitter<any> = new EventEmitter();
  constructor(private dataCache: DataCacheHandlerService) {

  }

  ngOnInit() {
    this.conf = this.dataCache.getDataStore('configuratorSettings');
    this.allProducts = this.dataCache.getDataStore('products');
    // initialize slidersImagesLoad
    sliderSettings.allProducts = this.dataCache.getDataStore('products');
    sliderSettings.cableTabs = this.dataCache.getDataStore('cableTab');
    sliderSettings.cover = this.dataCache.getDataStore('cover');
    sliderSettings.product = this.product;
    sliderSettings.imagePath = 'assets/configurator/settings-slider';
  }

  loadSettingsForLed(group): void {
    this.subGroupProducts = this.allProducts.filter(product => {
      return product.Untergruppe === group && product.Z_Profiltyp !== null && product.Z_Farbtemperatur___CRI !== null;
    }).sort((a, b) => (a.Z_Farbtemperatur___CRI > b.Z_Farbtemperatur___CRI) ? 1 : -1);

    // load settingsData to product from datacache
    this.product.settingsData = [];
    let settings = this.conf.settings[group];
    if (settings == null) {
      settings = this.conf.settings['default'];
    }

    for (const element in settings) {
      if (settings.hasOwnProperty(element)) {
        const name = settings[+element].split('%')[0];
        const params = settings[+element].split('%')[1];
        const elem = this.conf.elements[name];
        if (elem === null) {
          console.log('element does not exist for this setting ->>' + elem);
        } else {
          const settingsData = Object.assign(new SettingsData, elem);
          settingsData.id = name;
          settingsData.params = (params) ? JSON.parse(params) : settingsData.params;
          this.product.settingsData.push(settingsData);
        }
      }
    }
    this.firstStepLedSystem();
  }

  loadSettingsForMisc(group): void {
    this.subGroupProducts = this.allProducts.filter(product => {
      return product.Untergruppe === group && product.Z_Anzahl_Adern === null;
    }).sort((artikel1, artikel2) => artikel1.Z_Anzahl_Adern - artikel2.Z_Anzahl_Adern);
    const element = [];
    element.push({type: 'misc', artikel: this.subGroupProducts, hidden: false});
    this.product.settingsData = element;
  }

  productChange(event) {
    switch (event.type) {
      case 'misc':
        this.productChangeForMisc(event.data);
        break;
      case 'slider':
      case 'input':
        this.showNextAndMoveUpLedSystem(event.data);
        break;
    }
  }

  productChangeForMisc(data) {
    if (this.pageInfo.page !== 'edit') {
      this.product.updateItem('misc', data.artikel);
    } else {
      this.pageInfo.page = 'normal';
    }
  }

  firstStepLedSystem(): void {
    this.product.updateItem('profil', this.subGroupProducts[0]);

    this.product.settingsData.filter(slider => slider.id === 'lengthL1')[0].inputMaxValue = this.product.getItem('profil').maxLength1;
    if (this.product.settingsData.filter(slider => slider.id === 'lengthL3').length) {
        this.product.settingsData.filter(slider => slider.id === 'lengthL3')[0].inputMaxValue = this.product.getItem('profil').maxLength3;
    }

    this.product.sliderShow(0);
    this.product.getItem('profil').priceVisAfterPower = false;
  }

  showNextAndMoveUpLedSystem(currentSlider) {
    let nextElementKey = 0;
    this.product.settingsData.forEach((slider, index) => { if (slider.id === currentSlider.id) { nextElementKey = index + 1; }});

    const scrolling = !this.product.settingsAllVisible();

    if (currentSlider.id === 'cableTab' && (currentSlider.image.name.split('_')[0] === 'S' || currentSlider.image.name.split('_')[0] === 'NoItem')) {
      this.product.sliderHide(nextElementKey);
      this.product.sliderShow(nextElementKey + 1);
    } else {
        if (nextElementKey < this.product.settingsData.length) {
            this.product.sliderShow(nextElementKey);
        }
    }
    if (scrolling) {
      setTimeout(() => document.documentElement.scrollTop += 170, 50);
    }
    this.showSettings();
  }

  showSettings() {
    this.elements = this.product.settingsData.filter((slider) => !slider.hidden);
  }
}
