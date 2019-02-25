import { Component, OnInit } from '@angular/core';
import { DataCacheHandlerService} from '../../../../data-cache/data-cache-handler.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  captures = [];
  isCollapsed = true;
  constructor(private dataCacheHandlerService: DataCacheHandlerService) {

  }

  ngOnInit() {
    this.captures = this.dataCacheHandlerService.getDataStore('captures');
  }
}
