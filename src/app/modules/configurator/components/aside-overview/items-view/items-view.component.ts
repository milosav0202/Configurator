import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { Product } from '../../../shop/product';
import {DataCacheEvents} from "../../../../../data-cache/data-cache-events";
import {Item} from "../../../shop/item";
import {SettingsData} from "../../classes";

@Component({
  selector: 'app-items-view',
  templateUrl: './items-view.component.html',
  styleUrls: ['./items-view.component.scss']
})
export class ItemsViewComponent implements OnInit {
  @Input() overviewData: Product;
  items: any[] = [];
  color: string;

  constructor(private eleRef: ElementRef, private dataCache: DataCacheEvents) {
    this.dataCache.countDataChanged.subscribe( (actItem: Item) => {
      for (let item of this.overviewData.items){
        let binded = this.overviewData.settingsData.filter((elem: SettingsData) => {
          return elem.binding === actItem.type && elem.relatedItem;
        });
        for(let elem of binded){
          if (elem.relatedItem === item.type){
            if(item.type === "ip"){
              item.count = actItem.count * actItem.length1dm;
            }else {
              item.count = actItem.count;
            }
          }
        }
      }
      this.overviewData.checkCalculation();
    });
  }

  ngDoCheck(): void {
    this.overviewData.checkCalculation();
    if (this.overviewData.existItem('profil')) {
      this.overviewData.getItem('profil').showDatasheets = this.overviewData.getItem('profil').settingsImage.length >= 2;
    }
    this.items = this.overviewData.items.filter(item => item.type1 !== 'ip' && item.type1 !== 'outsideProfil');
    this.color = this.overviewData.color;
  }
  ngOnInit() {
  }
}
