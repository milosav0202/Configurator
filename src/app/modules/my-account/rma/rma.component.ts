import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatSort, MatTableDataSource} from '@angular/material';
import {RmaDialogComponent} from './rma-dialog/rma-dialog.component';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {HttpConnection} from '../../../communication/http-connection';
import {RMA, RmaStates} from './rmaObj';
import {DataCacheHandlerService} from '../../../data-cache/data-cache-handler.service';

@Component({
  selector: 'app-rma',
  templateUrl: './rma.component.html',
  styleUrls: ['./rma.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})

export class RmaComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('table') tableContainer: ElementRef;
  ds: MatTableDataSource<RMA>;
  columnsToDisplay = ['number', 'user', 'date', 'deliverCode', 'state'];
  expandedElement: RMA;
  contentLoaded = false;
  contentError = false;
  rmaStates = new RmaStates().states;
  constructor(public dialog: MatDialog, private http: HttpConnection, private dataCache: DataCacheHandlerService) { }

  ngOnInit() {
    this.loadData();
  }

  applyFilter(filterValue: string) {

  }

  loadData(): void {
    this.contentLoaded = false;
    this.contentError = false;
    const user = this.dataCache.getDataStore('user');
    const cust = {Customer: this.dataCache.getDataStore('customer'), CustomerNr: user['KundenNr']};
    this.http.getRmas(cust).subscribe( rmas => {
        this.ds = new MatTableDataSource(rmas);
        this.ds.sort = this.sort;
        this.contentLoaded = true;
        setTimeout(() => {this.onResizeWindow()},500);
      },
      error => {
        this.contentLoaded = true;
        this.contentError = true;
      }
    );
  }

  openRmaDialog(): void {
    const dialog = this.dialog.open(RmaDialogComponent, {
      disableClose: true
    });

    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  ////// adjust height
  onResizeWindow() {
    this.tableContainer.nativeElement.style.height = (document.documentElement.clientHeight - 320) + 'px';
  }
}
