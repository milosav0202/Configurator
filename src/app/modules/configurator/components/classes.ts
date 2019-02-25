import { Artikel, Item } from '../shop/item';
import { Product } from '../shop/product';
import {EventEmitter} from "@angular/core";

export class SettingsData {
  image: string;
  title: string;
  text: string;
  sliderImages: any[] = [];
  inputMaxValue: number;
  value: any;
  unit: string;
  type: string;
  id: string;
  artikel: Artikel;
  hidden = true;
  params = {
    suggestion: false,
    selection: []
  };
  color: string;
  binding: string;
  variable: string;
  reloadSliders: string[];
  relatedItem: string;
}

export class BusketEventData {
  product: Product;
  button: string;
}

export class SliderSettings {
  allProducts: Artikel[];
  cableTabs: any;
  cover: any[];
  product: Product;
  imagePath: string;

  loadImage(settingsData : SettingsData) {
    let images;
    const profil = this.product.getItem('profil');
    let m_minPowerSupply;
    switch(settingsData.id) {
      case 'outsideProfil':
        images = [];
        settingsData.params.selection.forEach(function(artikel){
          images.push(artikel + ';' + this.imagePath + '/outsideProfil/'+artikel+'.png');
        });
        return images;
      case 'color':
        const subGroupProducts = this.allProducts.filter(product => {
                return product.Untergruppe === this.product.subGroup && product.Z_Profiltyp !== null && product.Z_Farbtemperatur___CRI !== null;
              }).sort((a, b) => (a.Z_Farbtemperatur___CRI > b.Z_Farbtemperatur___CRI) ? 1 : -1);
        images = subGroupProducts.map(artikel => artikel.Z_Farbtemperatur___CRI.split(',')[0]).filter((value, index, self) => self.indexOf(value) === index)
          .map(key => {
            let artikel = subGroupProducts.filter(artikel => artikel.Z_Farbtemperatur___CRI.split(',')[0] === key)[0];
            return artikel.Z_Farbtemperatur___CRI + ';' + artikel.Z_Farbtemperatur___CRI_Bild;
          });
        return images;
      case 'cover':
        return this.cover;
      case 'power':
        const powers = this.allProducts.filter((atikel: Artikel) => {
          return (atikel.UBezeichnung === profil.artikel.UBezeichnung && atikel.Z_Profiltyp !== null && atikel.Z_Farbtemperatur___CRI !== null
            && atikel.Z_Farbtemperatur___CRI.split(',')[0] === profil.color.split(',')[0]);
        }).sort((a, b) => (a.Z_Leistung___LED_Angaben > b.Z_Leistung___LED_Angaben) ? 1 : -1);
        images = powers.map((artikel)=> artikel.Z_Leistung___LED_Angaben).filter((value, index, self) => self.indexOf(value) === index)
                  .map((key) => {
                    let artikel = powers.filter(artikel => artikel.Z_Leistung___LED_Angaben === key)
                                  .sort((a, b) => (a.Z_Leistung___LED_Angaben < b.Z_Leistung___LED_Angaben) ? 1 : -1)[0];
                    return artikel.Z_Leistung___LED_Angaben + ';' + artikel.Z_Leistung___LED_Angaben_Bild;
                  });
        return images;
      case 'ip':
        images = [];
        if (profil.artikel) {
          images = profil.artikel.Z_M_gliche_Artikel_IP.split(',');
          if(images === "" || images[0] === ""){
            images = [];
            console.log("Artikel " + profil.artikel.ArtikelNrLAG +" fehlt Z_M_gliche_Artikel_IP ");
          }
          images.unshift('NoItem;' + this.imagePath + '/noItem/IP.png');
        }
        return images;
      case 'cableTab':
        images = [];
        if (profil.artikel) {
          /*Check Cabletap*/
          if (profil.artikel.Z_M_gliche_Kabelabgangstypen != null) {
            const possibleCableTab = profil.artikel.Z_M_gliche_Kabelabgangstypen.split(',');
            for (let i = 0; i < possibleCableTab.length; i++) {
                possibleCableTab[i] = possibleCableTab[i].replace(/\s/g, '');
                if (possibleCableTab[i].indexOf('_') !== -1) {
                    possibleCableTab[i] = possibleCableTab[i].split('_')[0].replace(/\s/g, '');
                }
            }
            let cableTab = (typeof this.cableTabs[profil.artikel.Untergruppe] !== 'undefined') ? this.cableTabs[profil.artikel.Untergruppe] : this.cableTabs['Normal'];
            for (let i = 0; i < cableTab.length; i++) {
                if (possibleCableTab.indexOf(cableTab[i].split(';')[0].trim()) !== -1) {
                    images.push(cableTab[i]);
                }
            }
          }
          else {
            console.log("Artikel " + profil.artikel.ArtikelNrLAG +" fehlt Z_M_gliche_Kabelabgangstypen ");
          }
        }
        return images;
      case 'powerSupply':
        let selected = false;
        m_minPowerSupply = this.product.getMinPowerSupply();
        images = this.allProducts.filter((artikel: Artikel) => {
                      if (artikel.Z_Leistung__Out___W > m_minPowerSupply && artikel.Z_Webshop_NT_Standardprofile === '1') {
                        return !(profil.color.split(',')[0].toUpperCase().indexOf('RGB') !== -1 && artikel.Z_Steuerungsart !== null && artikel.Z_Steuerungsart.toUpperCase().replace(/\s/g, '') === 'DALI/PUSH');
                      } else {
                        return false;
                      }
                  }).sort((a, b) => a.Z_Leistung__Out___W - b.Z_Leistung__Out___W).map((artikel: Artikel) => {
                      if (artikel.Z_Leistung__Out___W * 1.1 >= m_minPowerSupply && artikel.Z_Steuerungsart !== null && artikel.Z_Steuerungsart.toUpperCase().replace(/\s/g, '') === 'DALI/PUSH' && !selected) {
                          selected = true;
                          return artikel.ArtikelNrLAG + ';' + artikel.Bild2 + ';' + selected;
                      }
                      return artikel.ArtikelNrLAG + ';' + artikel.Bild2;
                  });
        images.unshift('NoItem;' + this.imagePath + '/noItem/PowerSupply.png');
        return images;
      case 'control':
        const cable = this.product.getItem('cable');
        const numberOfCanals = cable.artikel.Z_Anzahl_Adern - 1;
        m_minPowerSupply = this.product.getMinPowerSupply();
        const current = m_minPowerSupply / 24;
        images = this.allProducts.filter((artikel: Artikel) => {
                    if (artikel.Z_Anzahl_Kan_le > 0 && artikel.Z_Anzahl_Kan_le <= numberOfCanals && artikel.Z_Iout_max >= current) {
                      return !(this.product.existItem('powerSupply') && this.product.getItem('powerSupply').artikel !== null
                        && this.product.getItem('powerSupply').artikel.Z_Steuerungsart !== null
                        && this.product.getItem('powerSupply').artikel.Z_Steuerungsart.toUpperCase() === 'DALI / PUSH');
                    } else {
                      return false;
                    }
                }).sort((a: Artikel, b: Artikel) => {
                    return a.Z_Anzahl_Kan_le - b.Z_Anzahl_Kan_le;
                  }).map((artikel: Artikel) => artikel.ArtikelNrLAG + ';' + artikel.Bild2);

        images.unshift('NoItem;' + this.imagePath + '/noItem/Control.png');
        return images;
      case 'features':
        images = [];
        if (profil.artikel) {
          images = profil.artikel.Z_M_gliche_Artikel_Optionen.split(',');
        }
        if(images === "" || images[0] === ""){
          images = [];
          console.log("Artikel " + profil.artikel.ArtikelNrLAG +" fehlt Z_M_gliche_Artikel_Optionen ");
        }
        return images;
    }
  }

  getArtikel(sliderId, data) {
    let artikels;
    const profil = this.product.getItem('profil');
    switch(sliderId) {
      case 'power':
        artikels = this.allProducts.filter((artikel: Artikel) => {
          return artikel.UBezeichnung === profil.artikel.UBezeichnung && artikel.Z_Profiltyp !== null &&
                  artikel.Z_Farbtemperatur___CRI !== null && artikel.Z_Farbtemperatur___CRI.split(',')[0] === profil.color.split(',')[0] &&
                  artikel.Z_Leistung___LED_Angaben === profil.power;
        });
        return artikels[0]
      case 'ip':
      case 'outsideProfil':
        artikels = this.allProducts.filter(artikel => {
          return artikel.ArtikelNrLAG === data.name;
        });
        return artikels[0]
      case 'cableTab':
        const possilbeCable = profil.artikel.Z_M_gliche_Artikel_Kabel;
        if (possilbeCable !== null) {
            artikels = this.allProducts.filter((artikel: Artikel) => {
                return artikel.ArtikelNrLAG === possilbeCable;
            });
        } else {
            artikels = this.allProducts.filter((artikel) => {
                return artikel.Z_Anzahl_Adern > 4;
            });
        }
        return artikels[0]
      case 'powerSupply':
        artikels = this.allProducts.filter((artikel: Artikel) => {
            return artikel.ArtikelNrLAG === data.name;
        });
        return artikels[0];
      case 'selectPowerSupply':
        const possiblePowerSupply = profil.artikel.Z_M_gliche_integrierte_Netzteile;
        if (possiblePowerSupply === null){
          console.log("Artikel " + profil.artikel.ArtikelNrLAG +"fehlen Z_M_gliche_integrierte_Netzteile")
        }
        const prods = this.allProducts.filter((artikel: Artikel) => {
            if (data.name.toUpperCase() === 'ON_OFF') {
                return possiblePowerSupply.match(artikel.ArtikelNrLAG) && (artikel.Z_Steuerungsart ===  null);
            } else {
                return possiblePowerSupply.match(artikel.ArtikelNrLAG) && (artikel.Z_Steuerungsart === data.name);
            }
        }).sort((a, b) => {
            return a.Z_Leistung__Out___W - b.Z_Leistung__Out___W;
          });
        let artikel = prods[prods.length - 1];
        let leistung = profil.artikel.Z_Leistung___LED_Angaben.split(',')[0];
        if (leistung.indexOf('x') !== -1) {
            leistung = (Number(leistung.split('x')[0]) * Number(leistung.split('x')[1])).toString();
        }
        const minPower = profil.length1m * Number(leistung);
        if (minPower * 1.1 < 60) {
            artikel = prods[0];
        }
        return artikel;
      case 'control':
        artikels = this.allProducts.filter((artikel) => {
            return artikel.ArtikelNrLAG === data.name;
        });
        return artikels[0];
      case 'features':
        artikels = this.allProducts.filter((artikel) => {
            return artikel.ArtikelNrLAG === data.name;
        });
        return artikels[0];
    }
  }
}

export const sliderSettings: SliderSettings = new SliderSettings();
