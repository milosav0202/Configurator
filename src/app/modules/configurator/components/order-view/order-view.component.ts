import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import {HttpClient} from "@angular/common/http";

const tcpStateToIconMapper = {
0: {icon: 'close', class: 'init'},
1: {icon: 'pause', class: 'wait'},
2: {icon: 'play_arrow', class: 'inprogress'},
3: {icon: 'stop', class: 'done'},
4: {icon: 'stop', class: 'stopped'},
5: {icon: 'accessibility', class: 'assigned'},
99: {icon: 'remove', class: 'notexist'}
};

@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.scss']
})

export class OrderViewComponent implements OnInit {
  contentLoaded = false;
  centers: string[];
  displayedColumns: string[];
  dataSource = new MatTableDataSource<Order>();
  expandedElement: Order | null;
  appConfig = {'stations': [{
    "key": "10",
    "name": "AVOR",
    "routerLink": "avor"
  }, {
  "key": "20",
  "name": "Profilcenter",
  "routerLink": "profilcenter"
}, {
  "key": "30",
    "name": "Kabelcenter",
    "routerLink": "kabelcenter"
}, {
  "key": "40",
    "name": "Mechanik",
    "routerLink": "mechanik"
}, {
  "key": "50",
    "name": "Konfektion",
    "routerLink": "konfektion"
}, {
  "key": "51",
    "name": "Verguss",
    "routerLink": "groutingcenter"
}, {
  "key": "60",
    "name": "Testcenter",
    "routerLink": "testcenter"
}, {
  "key": "61",
    "name": "TestcenterMobile",
    "routerLink": "testcentermobile"
}, {
  "key": "70",
    "name": "Warenausgang",
    "routerLink": "warenausgang"}
    ], "states": {
      "INIT": 0,
      "WAIT": 1,
      "INPROGRESS": 2,
      "DONE": 3,
      "STOPPED": 4,
      "APPROVAL": 5,
      "ASSIGNED": 6,
      "NOTEXIST": 99
    }};
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.contentLoaded = false;
    this.loadData();
  }

  loadData() {
    this.http.get('./assets/avorOrders.json').subscribe( (data: any) =>{
      
      this.centers = data.orderTypes;
      this.prepareTableData(data.orders);
      this.contentLoaded = true;
      setTimeout( d=>{ this.loadData();}, 5000);
    }, error => {
      this.contentLoaded = true;
    });

  }

  prepareTableData(orders) {
    let data = [];
    ////// prepare the columns to display
    this.displayedColumns = ['orderNumber', 'orderType', 'deliver', 'oEstimatedTime', 'requiredTime','TotalSW'];
    for (let id in this.appConfig.stations) {
      if (+this.appConfig.stations[id].key % 10 === 0) {
        this.displayedColumns.push(this.appConfig.stations[id].name);
      }
    }
    this.displayedColumns.push('oTcpState');
    this.displayedColumns.push('action');
    const ordersNew = orders.filter( order=> !order.orderNumber.includes('?'));

    this.dataSource.data = ordersNew;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getTcpStateImage(element, stationId){
    var tcpState = 0;
    if(typeof element === 'object') {
      tcpState = element.stations.find(sta => {
        return sta.id === +stationId;
      }).tcpState;
    } else {
      tcpState = element;
    }
    let stateName =  Object.keys(this.appConfig.states).find(key => this.appConfig.states[key] === +tcpState);
    return 'assets/images/tcpStates/'+stateName.toLowerCase()+'.png'
  }

  getTransportImage(transport){
    if (typeof transport === 'undefined' || transport === null) {
      return 'assets/images/transport/transport.png';
    }

    switch (transport.toUpperCase()) {
      case 'DHL':
      case 'DHL SPERR':
      case 'DHL SPER 3':
        return 'assets/images/transport/dhl.png';
      case 'SELBSTAB':
        return 'assets/images/transport/selfService.png';
      case 'MULTI':
        return 'assets/images/transport/spc.png';

      default:
        return 'assets/images/transport/transport.png';
    }

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openPopupRenew(ele) {
    console.log(ele);
  }
}

export class Order {
  start: string;
  dateSort: string;
  deliver: string;
  orderNumber: string;
  oTcpState: number;
  transport: string;
  orderType: string;
  oEstimatedTime: string;
  Referenztext: string;
  TotalSW: number;
  requiredTime: number;
  stations: Station [];
}

export class Station {
  id: number;
  startdate: string;
  tcpState: number;
  name: string;
  estimatedTime:number;
  pieces: number;
  piecesDone: number;
  dhlcode: string;
  elapsedTime: string;
  estimatedStart: string;
}
