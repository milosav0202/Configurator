import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { DataCacheHandlerService} from '../../../../../data-cache/data-cache-handler.service';
import {SettingsData} from '../../classes';
import { MatDialog } from '@angular/material';
import { Overlay } from '@angular/cdk/overlay';
import {DialogOverMaxComponent} from '../../dialogs/dialog-over-max/dialog-over-max.component';
import { Product } from '../../../shop/product';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {
  @ViewChild('valueIn') inputElement: ElementRef;
  @Input() set sliderData(data: SettingsData) {
    this.settingsData = data;
  }
  settingsData: SettingsData;
  imageSourceSettings: string;
  product: Product;
  inputStyleError = "red";
  inputStyleOk = '#93C11C';
  inputStyle: string;
  @Output() productChangeEvent: EventEmitter<any> = new EventEmitter();
  constructor(private dataCacheHandlerService: DataCacheHandlerService,
              private alert: MatDialog,
              private overlay: Overlay) {

  }

  ngOnInit() {
    const conf = this.dataCacheHandlerService.getDataStore('configuratorSettings');
    this.imageSourceSettings = conf.imageSourceSettings;
    this.product = this.dataCacheHandlerService.getDataStore('product');
  }

  setFocus() {
    this.inputElement.nativeElement.focus();
  }

  checkInput(target) {
    target.value = target.value.replace(/[^0-9\.]/g, '');

    if(target.value !== this.settingsData.value){
      this.inputStyle = this.inputStyleError;
    }else{
      this.inputStyle = this.inputStyleOk;
    }
  }

  setValue(target): void {
    if (+target.value > this.settingsData.inputMaxValue) {
      if (this.settingsData.id === 'lengthL1') {
        const alertRef = this.alert.open(DialogOverMaxComponent, {width: '1000px', scrollStrategy: this.overlay.scrollStrategies.noop()});
        alertRef.afterClosed().subscribe(result => {
          if (result !== 'ok') {
            target.value = '';
            target.setFocus();
          }
          this.updateProduct(target.value);
          this.productChangeEvent.emit({type: 'input', data: {id: this.settingsData.id, value: target.value}});
        });
      } else {
        target.value = '';
        target.setFocus();
      }
    } else {
      if (typeof target.value !== "undefined" && target.value !== "" && +target.value > 0) {
        this.updateProduct(target.value);
        this.productChangeEvent.emit({type: 'input', data: {id: this.settingsData.id, value: target.value}});
      }
    }
  }

  updateProduct(value) {
    const binding = this.product.getItem(this.settingsData.binding);
    const related = this.product.getItem(this.settingsData.relatedItem);
    this.settingsData.value = value;
    this.inputStyle = this.inputStyleOk;
    switch (this.settingsData.id){
      case 'lengthL1':
            binding.length1 = value;
            binding.unitL1 = this.settingsData.unit;
            this.product.setMaxLengthL2(value);
            if (this.product.existItem('ip')) {
                this.product.getItem('ip').count = binding.count * binding.length1dm;
            }
            if (this.product.existItem('powerSupply') && this.product.getItem('powerSupply').bind) {
                this.product.checkCalculation();
            }
            if (this.product.existItem('outsideProfil')) {
              this.product.getItem('outsideProfil').lengthL1 = value;
            }
          break;
      case 'lengthL2':
            binding.lengthL2 = value;
            related.lengthL2 = value;
            related.unitL2 = this.settingsData.unit;
            related.length2Vis = (value > 0);
          break;
      case 'lengthL3':
            binding.lengthL3 = value;
            related.lengthL3 = value;
            related.unitL3 = this.settingsData.unit;
            related.length3Vis = (value > 0);
          break;
    }
  }
}
