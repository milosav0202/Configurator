import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatPaginator, MatSort} from '@angular/material';
import {DataCacheHandlerService} from '../data-cache/data-cache-handler.service';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.scss']
})
export class DownloadsComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  dataSource: any;
  displayedColumns: string[] = ['name'];
  customer: string;
  constructor(private dataCacheHandlerService: DataCacheHandlerService) { }

  ngOnInit() {
    this.customer = this.dataCacheHandlerService.getDataStore('customer');
    const files = this.dataCacheHandlerService.getDataStore('downloads');
    const downloadFiles = [];
    for (const fileName in files) {
      if (files.hasOwnProperty(fileName)) {
        downloadFiles.push(files[fileName]);
      }
    }

    this.dataSource = new MatTableDataSource(downloadFiles);
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

