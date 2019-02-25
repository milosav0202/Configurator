import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {  of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { DataCacheHandlerService} from './data-cache/data-cache-handler.service';

@Injectable()
export class AppConfig {
  constructor(private http: HttpClient, private dataCacheHandlerService: DataCacheHandlerService) {}

  public load() {
    return new Promise((resolve, reject) => {
      this.http.get(environment.urls.getCustomerNameAndConfig).pipe(map(res => res as any),
        catchError(error => of('Server error')))
        .subscribe(customer => {
          this.dataCacheHandlerService.setDataStore('customer', customer.Name);
          this.dataCacheHandlerService.setDataStore('config', customer.Config);
          this.loadStyling(customer.Config);
          resolve(true);
        });

    });
  }
  private loadStyling(conf) {
    // TODO: set customer color --> '_variables.scss';
  }
}
