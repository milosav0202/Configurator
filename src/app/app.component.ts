import {TranslateService} from '@ngx-translate/core';
import {Component, Inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DataCacheHandlerService, User} from './data-cache/data-cache-handler.service';
import {DataCacheEvents} from './data-cache/data-cache-events';
import {DeviceDetectorService} from 'ngx-device-detector';
import {Title} from "@angular/platform-browser";
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  language = '';
  contentLoaded = false;
  connectionError = false;
  deviceInfo: any;
  constructor(private translate: TranslateService,
              private dataCacheHandlerService: DataCacheHandlerService,
              private dataCacheEvents: DataCacheEvents,
              private router: Router,
              private deviceService: DeviceDetectorService,
              private titleService: Title,
              @Inject(DOCUMENT) private document: HTMLDocument) {
    this.language = navigator.language.split('-')[0];
    translate.setDefaultLang(this.language);
    this.dataCacheHandlerService.setDataStore('language', this.language);

    if (!this.deviceService.isMobile()) {
      this.dataCacheEvents.dataCacheInitialize.subscribe(data => {
        if (data === 200) {
          this.contentLoaded = true;
          this.connectionError = true;
        }
        if (data === 100) {
          this.contentLoaded = true;
          const user = localStorage.getItem('userShop');
          if (user !== '' && user !== 'undefined') {
            this.dataCacheHandlerService.setDataStore('user', JSON.parse(user));
            this.dataCacheEvents.userDataChanged.emit(JSON.parse(user));
          }
          this.router.navigate(['configurator/home']);
        }
      });
    } else {
      this.contentLoaded = true;
      this.router.navigate(['mobile']);
    }
  }
  

  changeLanguage(language: string): void {
    this.translate.use(language);
    this.language = language;
    this.dataCacheHandlerService.setDataStore('language', this.language);
  }

  ngOnInit() {
    this.dataCacheHandlerService.initCache();
    this.translate.get('KONFIGURATOR').subscribe((text:string) => {this.titleService.setTitle(text)})
    let customer = this.dataCacheHandlerService.getDataStore('customer');
    this.document.getElementById('appFavicon').setAttribute('href', 'assets/customers/' + customer + '/images/favicon.ico');
  }
}
