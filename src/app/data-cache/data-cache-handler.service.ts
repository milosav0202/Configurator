import {Injectable} from '@angular/core';
import { DataCacheEvents} from './data-cache-events';
import {HttpConnection} from '../communication/http-connection';
import {Artikel} from '../modules/configurator/shop/item';

@Injectable({
    providedIn: 'root'
})
export class DataCacheHandlerService {
    private dataStore: {
        dataCache: DataCache[]
    };
    // private dataCacheStatusList: Map<string, CacheStatus> = new Map();

    constructor(private http: HttpConnection,
        private dataCacheEvents: DataCacheEvents) {
        this.dataStore = {dataCache: []};
    }

    initCache() {
        this.http.fetchInitDataFrmDB(this.getDataStore('customer')).subscribe((data: DataFromDb) => {
          this.setDataStore('products', data.Products);
          this.setDataStore('captures', data.Capture);
          this.setDataStore('downloads', data.Downloads);
          this.setDataStore('cableTab', data.CableTabs);
          this.setDataStore('cover', data.Covers);
          this.setDataStore('taxProduct', data.TaxProduct);
          this.dataCacheEvents.dataCacheInitialize.emit(100);
        }, error => {
          this.dataCacheEvents.dataCacheInitialize.emit(200);
        });

        this.http.getConfiguratorSettings().subscribe( conf => {
          this.setDataStore('configuratorSettings', conf);
        }, error => {
          console.log(error);
        });
    }

    setDataStore(id: string, data: any) {
        const dataCache = new DataCache();
        dataCache.id = id;
        dataCache.value = data;
        const store = this.getDataStore(id);
        if (store) {
            this.removeFromDataStore(id);
            this.dataStore.dataCache.push(dataCache);
        } else {
            this.dataStore.dataCache.push(dataCache);
        }
    }

    getDataStore(id: string): any {
        let store: DataCache = new DataCache();
        this.dataStore.dataCache.forEach((item, index) => {
            if (item.id === id) {
                store = this.dataStore.dataCache[index];
            }
        });
        return store.value;
    }

    removeFromDataStore(id: string) {
        this.dataStore.dataCache.forEach((item, index) => {
            if (item.id === id) {
                this.dataStore.dataCache.splice(index, 1);
            }
        });
    }
}

export class DataCache {
  id: string;
  value: any;
}

export interface DataFromDb {
  Config: any;
  Products: Artikel[];
  TaxProduct: Artikel;
  Capture: any;
  Downloads: any;
  CableTabs: any;
  Covers: any;
}

export class User {
  mail: string;
  password: string;
  firstname: string;
  lastname: string;
  KundenNr: string;
  KontaktNr: string;
  price: boolean;
  admin: boolean;
  capture: boolean;
  token: string;
  offer = false;

}

