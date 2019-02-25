import {Component, OnInit} from '@angular/core';
import {DataCacheHandlerService} from '../../../data-cache/data-cache-handler.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  modules: any = [];

  constructor(private dataCache: DataCacheHandlerService) {

  }

  ngOnInit() {
    const mods = this.dataCache.getDataStore('config').modules;
    for (const module of mods) {
      this.modules.push(module);
    }
  }

}
