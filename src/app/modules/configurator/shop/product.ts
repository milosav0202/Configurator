import {Item} from './item';
import { SettingsData } from '../components/classes';

export class Product {
  items: Item[] = [];
  positionName = '';
  color: string;
  capture: string;
  subGroup: string;
  tab = '';
  price: number;
  taxProducts: number;
  visible = false;

  // for update
  edit: boolean = false;
  settingsData: SettingsData[];

  updateItem(type, artikel) {
    this.getItem(type).setArtikel(artikel);
    this.checkCalculation();
  }

  getItem(type) {
    if(typeof type === 'undefined'){
      return null;
    }
    if (!this.existItem(type)) {
      const newItem: Item = new Item();
      newItem.update(type, null);
      this.items.push(newItem);
    }
    return this.items.filter(item => item.type === type)[0];
  }

  existItem(type) {
    return this.items.filter(item => item.type === type).length !== 0;
  }

  removeItem(type) {
    this.items = this.items.filter(item => item.type !== type);
  }

  removeAllItems() {
    this.items = [];
  }

  checkCalculation() {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].artikel != null && this.items[i].artikel.Z_Formel_Webshop != null && this.items[i].artikel.Z_Formel_Webshop.startsWith('@meter')) {
        const add = Number(this.items[i].artikel.Z_Formel_Webshop.split('+')[1]);
        const profil = this.getItem('profil');
        this.items[i].count = profil.count * profil.length1m + add;
      }
      if (this.items[i].type === 'powerSupply' && this.items[i].bind) {
        const profil = this.getItem('profil');
        let leistung = profil.artikel.Z_Leistung___LED_Angaben.split(',')[0];
        if (leistung.indexOf('x') !== -1) {
            leistung = String(Number(leistung.split('x')[0]) * Number(leistung.split('x')[1]));
        }
        const minPower = profil.length1m * Number(leistung);
        let amount = profil.count;
        if (minPower * 1.1 >= 60) {
          amount = Math.ceil(minPower * 1.1 / Number(this.items[i].artikel.Z_Leistung__Out___W));
          amount = profil.count * amount;
        }
        this.items[i].count = amount;
      }
    }
  }

  getMinPowerSupply() {
    let minPower;
    const profil = this.getItem('profil');
    let leistung = profil.artikel.Z_Leistung___LED_Angaben.split(',')[0];
    if (leistung.indexOf('x') !== -1) {
      minPower = Number(leistung.split('x')[0]) * Number(leistung.split('x')[1]);
    } else {
      minPower = Number(leistung) * profil.length1dm;
    }
    return ((minPower < 1) ? 10 : minPower);
  }

  clone() {
    const cloneProduct = new Product();
    cloneProduct.loadDataFromJson(JSON.parse(JSON.stringify(this)));
    return cloneProduct;
  }

  loadDataFromJson(jsonData) {
    Object.assign(this, jsonData);
    this.items = [];
    let newItem;
    for (let i = 0; i < jsonData.items.length; i++) {
      newItem = new Item();
      newItem.loadDataFromJson(jsonData.items[i]);
      this.items.push(newItem);
    }
  }

  sliderShow(sliderId) {
    let index;
    if (typeof sliderId !== 'number') {
      index = this.settingsData.findIndex(slider => slider.id === sliderId);
      if (index < 0) return false;
    } else {
      index = sliderId;
    }
    this.settingsData[index].hidden = false;
    return true;
  }

  sliderHide(sliderId) {
    let index;
    if (typeof sliderId !== 'number') {
      index = this.settingsData.findIndex(slider => slider.id === sliderId);
      if (index < 0) return false;
    } else {
      index = sliderId;
    }
    this.settingsData[index].value = null;
    this.settingsData[index].hidden = true;
    return true;
  }

  reloadSlider(sliderId) {
    let index = this.settingsData.findIndex(slider => slider.id === sliderId);
    if (index < 0) return false;
    this.settingsData[index] = Object.assign(new SettingsData(), this.settingsData[index]);
  }

  setMaxLengthL2(value) {
    const lengthL2SliderData = this.settingsData.filter(slider => slider.id === 'lengthL2')[0];
    lengthL2SliderData.inputMaxValue = value;
    this.getItem('cable').maxLength2 = value;
    if (!lengthL2SliderData.hidden && lengthL2SliderData.value > value) {
      lengthL2SliderData.value = value;
    }
  }

  settingsAllVisible() {
    return this.settingsData.every((ele) => !ele.hidden);
  }
}
