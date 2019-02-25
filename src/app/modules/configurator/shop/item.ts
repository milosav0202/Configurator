import { Input } from "@angular/core";

export class Item {
    type: string;
    type1: string;
    itemImage: string;
    settingsImage: any[] = [];
    count: number;
    @Input() set length1(length) {
      this.lengthL1 = length;
      this.length1m = Math.ceil(length / 1000);
      this.length1dm = Number((length / 1000).toFixed(1));
    }
    lengthL1 = "";
    lengthL2 = "";
    lengthL3 = "";
    length1m = 0;
    length1dm = 0;
    maxLength1: number;
    maxLength2: number;
    maxLength3: number;
    artikel: Artikel;
    priceVisAfterPower = false;
    length2Vis: boolean;
    length3Vis: boolean;
    unitL1: string;
    unitL2: string;
    unitL3: string;

    cableTab = '';
    color = '';
    cover = '';
    power = '';
    ipProtection = '';
    withCable = true;
    stock: number;
    stockMax = '';
    showDatasheets = false;
    bind = false;

    update(type, artikel) {
        this.type = type;
        if (type.match('z_')) {
            this.type1 = 'features';
        } else {
            this.type1 = type;
        }
        if (!artikel) {
            return;
        }
        this.setArtikel(artikel);
    }

    setArtikel(artikel: Artikel) {
        this.itemImage = artikel.Bild;
        this.count = 1;
        this.maxLength1 = artikel.Z_L_nge__mm;
        this.maxLength3 = 10;
        this.artikel = artikel;
        this.stock = artikel.VerfuegbarerBestand;
    }

    clone() {
        const cloneItem = new Item();
        cloneItem.loadDataFromJson(JSON.parse(JSON.stringify(this)));
        return cloneItem;
    }

    loadDataFromJson(jsonData) {
      Object.assign(this, jsonData);
    }
}


export class Artikel {
  DS: string;
  LDT: string;
  AT: string;
  Bild: string;
  Bild2: string;
  lengthL1: number;
  lengthL2: number;
  lengthL3: number;
  Bezeichnung1: string;
  Bezeichnung2: string;
  Bezeichnung3: string;
  Bezeichnung4: string;
  Bezeichnung5: string;
  Untergruppe: string;
  Z_Profiltyp: string;
  GroupeImage: string;
  UBezeichnung: string;
  GruppeLAG: string;
  Z_Farbtemperatur___CRI: string;
  Z_Anzahl_Adern: number;
  Z_Anzahl_Kan_le: number;
  Z_Farbtemperatur___CRI_Bild: string;
  Z_Leistung___LED_Angaben: string;
  Z_Leistung___LED_Angaben_Bild: string;
  Z_M_gliche_Artikel_IP: string;
  Z_M_gliche_integrierte_Netzteile: string;
  Z_M_gliche_Artikel_Kabel: string;
  Z_M_gliche_Kabelabgangstypen: string;
  Z_M_gliche_Artikel_Optionen: string;
  Z_Leistung__Out___W: number;
  Z_Steuerungsart: string;
  Z_Iout_max: number;
  Z_Webshop_NT_Standardprofile: string;
  Z_Formel_Webshop: string;
  EinheitPRO: string;
  Verkauf1: number;
  Z_vRG_pflichtig: boolean;
  ArtikelNrLAG: string;
  VerfuegbarerBestand: number;
  Z_L_nge__mm: number;
  Count: number;
}
