import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {FormControl } from '@angular/forms';
import {MatDialog} from '@angular/material';
import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';
import {DataCacheEvents} from '../data-cache/data-cache-events';
import {DataCacheHandlerService, User} from '../data-cache/data-cache-handler.service';
import {LoginDialogComponent} from './login-dialog/login-dialog.component';
import {LogoutDialogComponent} from './logout-dialog/logout-dialog.component';
import {Order} from '../modules/configurator/shop/order';
import { Artikel } from '../modules/configurator/shop/item';
import { Router, NavigationExtras } from '@angular/router';

// TODO: search input is not working properly after selecting a artikel --> select whole array instead of single product
// TODO: mat-menu design adjustments

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input()  language: string;
  @Output() lanChanged = new EventEmitter<string>();
  value = '';
  imprint = '';
  itemCount = 0;
  countVisible = false;
  myControl = new FormControl();
  products: Artikel[];
  artikels: string[] = [];
  filteredOptions: Observable<string[]>;
  customer = '';
  user: User;

  constructor(private dataCacheEvents: DataCacheEvents,
              private dataCacheHandlerService: DataCacheHandlerService,
              public dialog: MatDialog,
              private router: Router) {
    this.dataCacheEvents.dataCacheInitialize.subscribe(data => {
      this.products =  this.dataCacheHandlerService.getDataStore('products');
      for (const artikel of this.products) {
        this.artikels.push(artikel.ArtikelNrLAG + ' - ' + artikel.Bezeichnung1);
      }

      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value)
        )
      );
    });


    this.dataCacheEvents.userDataChanged.subscribe(user => {
      this.user = user;
    });

    this.imprint = this.dataCacheHandlerService.getDataStore('config').AGB;
    this.customer = this.dataCacheHandlerService.getDataStore('customer');
  }

  @HostListener('window:beforeunload', ['$event']) unloadHandler(event: Event) {
    localStorage.setItem('userShop', JSON.stringify(this.dataCacheHandlerService.getDataStore('user')));
  }

  ngOnInit() {
    this.user = this.dataCacheHandlerService.getDataStore('user');
  }

  ngDoCheck(): void {
    const order: Order = this.dataCacheHandlerService.getDataStore('order');
    if (typeof order !== 'undefined') {
      this.itemCount = order.getBusketCount();
      if (this.itemCount) {
        this.countVisible = true;
      } else {
        this.countVisible = false;
      }
    }
  }

  private _filter(value): string[] {
    const filterValue = value.toLowerCase();
    return this.artikels.filter(option => option.toLowerCase().includes(filterValue));
  }

  search(searchKey) {
    let searchResult = this.products.filter(artikel => (artikel.ArtikelNrLAG + ' - ' + artikel.Bezeichnung1) === searchKey);
    if (searchResult.length) {
      this.dataCacheHandlerService.setDataStore('searchResult', searchResult[0]);
      this.router.navigateByUrl('/configurator/home').then(() => {
        this.router.navigate(['/configurator/shop/' + searchResult[0].GruppeLAG]);
      });
    }
  }

  changeLanguage(language: string) {
    this.language = language;
    this.lanChanged.emit(this.language);
  }

  openLoginDialog(): void {
    this.dialog.open(LoginDialogComponent, {
    });
  }

  openLogoutDialog(): void {
    this.dialog.open(LogoutDialogComponent, {
  });
}
}
