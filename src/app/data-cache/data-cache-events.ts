import {EventEmitter, Injectable} from '@angular/core';
import {User} from './data-cache-handler.service';
import {Item} from "../modules/configurator/shop/item";

@Injectable()
export class DataCacheEvents {
  dataCacheInitialize: EventEmitter<number> = new EventEmitter();
  userDataChanged: EventEmitter<User> = new EventEmitter();
  countDataChanged: EventEmitter<Item> = new EventEmitter();
}
