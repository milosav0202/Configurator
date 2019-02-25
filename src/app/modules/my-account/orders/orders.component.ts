import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatTableDataSource} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {HttpConnection} from '../../../communication/http-connection';
import {DataCacheHandlerService} from '../../../data-cache/data-cache-handler.service';
import {ORDER, OrderStates} from './orderObj';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})

export class OrdersComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('table') tableContainer: ElementRef;
  ds: MatTableDataSource<ORDER>;
  columnsToDisplay = ['number', 'user', 'date', 'state'];
  expandedElement: ORDER;
  contentLoaded = false;
  contentError = false;
  OrderStates = new OrderStates().states;
  constructor(private http: HttpConnection, private dataCache: DataCacheHandlerService) { }

  ngOnInit() {
    this.loadData();
  }

  applyFilter(filterValue: string) {

  }

  loadData(): void {
    this.contentLoaded = false;
    this.contentError = false;
    const user = this.dataCache.getDataStore('user');
    const data = {Customer: this.dataCache.getDataStore('customer'), CustomerNr: user['KundenNr']};
    this.http.getOrders(data).subscribe( orders => {
      if (orders.status === 'success') {
        this.ds = new MatTableDataSource(orders.message);
        this.ds.sort = this.sort;
        this.contentLoaded = true;
      } else {
        this.contentLoaded = true;
        this.contentError = true;
      }
      },
      error => {
        this.contentLoaded = true;
        this.contentError = true;
      }
    );
  }

  ////// adjust height
  onResizeWindow() {
    this.tableContainer.nativeElement.style.height = (document.documentElement.clientHeight - 320) + 'px';
  }
}
