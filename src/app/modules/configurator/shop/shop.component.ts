import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import {DataCacheHandlerService} from '../../../data-cache/data-cache-handler.service';
import { ActivatedRoute, Router } from '@angular/router';
import {Order} from './order';
import {Product} from './product';
import { BusketEventData } from '../components/classes';
import { Artikel } from './item';

export class PageInfo {
  page: string = 'normal';
  params: any;
}

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})

export class ShopComponent implements OnInit, OnDestroy {
  capture: string;
  selectedGroup: string;
  private paramSub: any;
  private queryParamSub: any;
  subGroupImages: any = [];
  product: Product;
  order: Order;
  color: string;
  pageInfo: PageInfo = new PageInfo();

  constructor(private dataCacheHandlerService: DataCacheHandlerService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.order = this.dataCacheHandlerService.getDataStore('order');
    if (this.dataCacheHandlerService.getDataStore('product')) {
      this.product = this.dataCacheHandlerService.getDataStore('product');
    } else {
      this.product = new Product();
      this.dataCacheHandlerService.setDataStore('product', this.product);
    }
    this.paramSub = this.route.params.subscribe(params => {
      this.capture = params['capture'];
      this.initData();
      this.pageInfo.page = 'normal';
      if (this.dataCacheHandlerService.getDataStore('searchResult')) {
        this.pageInfo.params = this.dataCacheHandlerService.getDataStore('searchResult');
        this.pageInfo.page = 'search';
        this.dataCacheHandlerService.removeFromDataStore('searchResult');
      }
    });
    this.queryParamSub = this.route.queryParams.subscribe(params => {
      if (params['product']) {
        const editProduct = this.order.getProductFromInfo(JSON.parse(params['product'])).clone();
        this.pageInfo.params = editProduct;
        this.pageInfo.page = 'edit';
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.pageInfo.page === 'edit') {
      this.product = Object.assign(this.product, this.pageInfo.params);
      this.product.edit = true;
      this.selectedGroup = this.product.items[0].artikel.Untergruppe;
      this.subGroupImages.filter(img => img.name === this.product.items[0].artikel.Untergruppe)[0].selected = true;
    }
    if (this.pageInfo.page === 'search') {
      this.selectedGroup = this.pageInfo.params.Untergruppe;
      this.subGroupImages.filter(img => img.name === this.pageInfo.params.Untergruppe)[0].selected = true;
    }
  }

  ngOnDestroy() {
    this.paramSub.unsubscribe();
    this.queryParamSub.unsubscribe();
  }

  busketEventHandler(data: BusketEventData) {
    switch (data.button) {
      case 'add':
        this.order.addProduct(data.product);
        break;
      case 'update':
        this.order.updateProduct(data.product);
        break;
      case 'cancel':
        // Empty
    }
    this.product = new Product();
    this.dataCacheHandlerService.setDataStore('product', this.product);
    this.initData();
  }

  initData() {
    this.product.removeAllItems();
    this.product.capture = this.capture;
    const captures = this.dataCacheHandlerService.getDataStore('captures');
    const group = captures.find(obj => {
      return obj.GruppeLAG === this.capture;
    });
    delete this.selectedGroup;
    this.color = ('RGB(' + group.color + ')');
    this.product.tab = group.Name;
    this.product.color = 'RGB(' + group.color + ')';
    this.loadData();
  }

  loadData(): void {
    this.subGroupImages = [];
    let productsForGroup;
    const m_customer = this.dataCacheHandlerService.getDataStore('customer');
    const allProducts = this.dataCacheHandlerService.getDataStore('products');

    if (this.capture === '1') {
      productsForGroup = allProducts.filter(artikel => {
        if (artikel.Untergruppe && artikel.Untergruppe.indexOf('_') !== -1) {
          artikel.Untergruppe = artikel.Untergruppe.replace(' ', '');
          return (artikel.GruppeLAG === this.capture && artikel.Z_Profiltyp !== null && artikel.Z_Farbtemperatur___CRI !== null);
        } else {
          return (artikel.GruppeLAG === this.capture && artikel.Untergruppe.split('.')[1].trim().length === 2 && artikel.Z_Profiltyp !== null && artikel.Z_Farbtemperatur___CRI !== null);
        }
      });
    } else {
      productsForGroup = allProducts.filter(artikel => {
        return artikel.GruppeLAG === this.capture && artikel.Z_Anzahl_Adern === null;
      });
    }

    this.subGroupImages = productsForGroup.map(artikel => artikel.Untergruppe).filter((value, index, self) => self.indexOf(value) === index)
    .sort((Untergruppe1, Untergruppe2) => Untergruppe1 < Untergruppe2 ? -1 : Untergruppe1 > Untergruppe2 ? 1 : 0).map(Untergruppe => {
      let artikel = productsForGroup.filter(artikel => artikel.Untergruppe === Untergruppe)[0];
      return {
        src: artikel.GroupeImage,
        name: Untergruppe,
        selected: false,
        caption: artikel.UBezeichnung
      }
    });
  }
}
