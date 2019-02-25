import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DataCacheHandlerService} from '../../../../../data-cache/data-cache-handler.service';
import { SettingsData, sliderSettings } from '../../classes';
import { environment } from '../../../../../../environments/environment';
import { Product } from '../../../shop/product';
import { Artikel } from '../../../shop/item';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {
  @Input() set sliderData(data: SettingsData) {
    this.settingsData = data;
    this.loadImage();
  }
  settingsData: SettingsData;
  imageSourceSettings: string;
  sliderImagesList: any[];
  sliderImages: any[] = [];
  product: Product;
  imagePath = 'assets/configurator/settings-slider';
  @Output() productChangeEvent: EventEmitter<any> = new EventEmitter();
  constructor(private dataCacheHandlerService: DataCacheHandlerService) {
    const conf = this.dataCacheHandlerService.getDataStore('configuratorSettings');
    this.imageSourceSettings = conf.imageSourceSettings;
    this.product = this.dataCacheHandlerService.getDataStore('product');
  }

  ngOnInit() {
    // auto-select if setting as prefered
    if (this.sliderImages.filter((img) => img.prefered || img.justOne).length) {
      this.imageItemClick(this.sliderImages.filter((img) => img.prefered || img.justOne)[0]);
    }
  }

  imageItemClick(event) {
    this.settingsData.value = event.name;
    this.updateProduct(event);
    this.productChangeEvent.emit({type: 'slider', data: {id: this.settingsData.id, image: event}});
  }

  loadImage() {
    // getting string images
    if (typeof this.settingsData.params.selection !== 'undefined' && this.settingsData.params.selection.length) {
      if (JSON.stringify(this.sliderImagesList) === JSON.stringify(this.settingsData.params.selection)) {
        return;
      }
      this.sliderImagesList = this.settingsData.params.selection;
    } else {
      if (JSON.stringify(this.sliderImagesList) === JSON.stringify(sliderSettings.loadImage(this.settingsData))) {
        return;
      }
      this.sliderImagesList = sliderSettings.loadImage(this.settingsData);
    }

    // converting string images into object images
    if (typeof this.sliderImagesList !== 'undefined') {
      const imgList = [];
      let src = '';
      let name = '';
      for (let i = 0; i < this.sliderImagesList.length; i++) {
          if (typeof this.settingsData.params.selection !== 'undefined' && this.settingsData.params.selection.length) {
            src = this.imagePath + this.sliderImagesList[i].split(';')[1];
          } else {
            src = this.sliderImagesList[i].split(';')[1].replace(/ +/g, '');
          }
          src = src.indexOf('.png') === -1 ? src + '.png' : src;
          name = this.sliderImagesList[i].split(';')[0];
          if (this.settingsData.value) {
            if (this.settingsData.id === 'features') {
              imgList.push({src: src, name: name, selected: this.settingsData.value.some(ele => ele == name)});
            } else {
              imgList.push({src: src, name: name, selected: name === this.settingsData.value});
            }
          } else {
            imgList.push({src: src, name: name, selected: this.sliderImagesList[i].split(';').length > 2, prefered: this.sliderImagesList[i].split(';').length > 2});
          }
      }

      // auto-select if existing just only one image
      if (imgList.length === 1 && !imgList[0].selected) {
        imgList[0].justOne = true;
        imgList[0].selected = true;
      }
      this.sliderImages = imgList;
    }
  }

  updateProduct(data) {
    ////// saving variable and setting image
    if (this.settingsData.binding) {
      const binding = this.product.getItem(this.settingsData.binding);
      if (this.settingsData.variable) {
        if (this.settingsData.id === 'ip') {
          binding[this.settingsData.variable] = (data.name === 'NoItem') ? '' : (data.name === '2002095') ? '65' : '67';
        } else {
          binding[this.settingsData.variable] = data.name;
        }
      }

      if (this.settingsData.binding === 'profil' && this.settingsData.relatedItem !== "cable") {
        let index = this.product.settingsData.findIndex(ele => ele.id == this.settingsData.id)
        binding.settingsImage[index] = {source: data.src};
        if (this.settingsData.id === 'color') {
          binding.priceVisAfterPower = false;
        }
        if (this.settingsData.id === 'power') {
          binding.priceVisAfterPower = true;
        }
      } else {  ////// cable
        binding.itemImage = data.src;
      }
    }

    ////// setting item and artikel
    if (this.settingsData.relatedItem) {
      /////// if not features
      if (this.settingsData.relatedItem !== 'features') {
        ////// if NoItem then remove item and hide slider
        if (data.name === 'NoItem') {
          this.product.removeItem(this.settingsData.relatedItem);
          if (this.sliderImages.length === 1) {
            this.product.sliderHide(this.settingsData.id);
          }
          if (this.settingsData.id === 'ip') {
            let index = this.product.settingsData.findIndex(ele => ele.id == this.settingsData.id) - this.product.settingsData.findIndex(ele => ele.id == 'color')
            this.product.getItem(this.settingsData.binding).settingsImage.splice(index,1);
          }
        }
        /////// if not NoItem then set item
        else {
          const item = this.product.getItem(this.settingsData.relatedItem);
          let artikel: Artikel;
          if (this.settingsData.id === 'powerSupply' && (typeof this.settingsData.params.selection !== 'undefined' && this.settingsData.params.selection.length)){
            artikel = sliderSettings.getArtikel('selectPowerSupply', data);
            item.bind = true;
          } else {
            artikel = sliderSettings.getArtikel(this.settingsData.id, data);
          }

          if (artikel) {
            artikel.Bild = data.src;
            this.product.updateItem(this.settingsData.relatedItem, artikel);
          }
        }
      }
      /////// if features
      else {
        this.updateFeatures(data);
      }
    }

    ////// setting sliders to reload
    if (this.settingsData.reloadSliders) {
      for (let i = 0; i < this.settingsData.reloadSliders.length; i++) {
        this.product.reloadSlider(this.settingsData.reloadSliders[i]);
      }
    }
  }

  updateFeatures(data) {
    this.settingsData.value = this.sliderImages.filter(ele => ele.selected).map(ele => ele.name);
    if (this.product.existItem('z_' + data.name)) {
        this.product.removeItem('z_' + data.name);
    } else {
        let artikel = sliderSettings.getArtikel(this.settingsData.id, data);
        artikel.Bild = data.src;
        this.product.updateItem('z_' + data.name, artikel);
    }
  }
}
