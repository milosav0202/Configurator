import { Component, OnInit } from '@angular/core';
import { DataCacheHandlerService} from '../../../data-cache/data-cache-handler.service';

@Component({
  selector: 'app-capture-overview',
  templateUrl: './capture-overview.component.html',
  styleUrls: ['./capture-overview.component.scss']
})
export class CaptureOverviewComponent implements OnInit {
  captures = [];

  constructor(private dataCacheHandlerService: DataCacheHandlerService) {

  }

  ngOnInit() {
    this.captures = this.dataCacheHandlerService.getDataStore('captures');
  }
}
