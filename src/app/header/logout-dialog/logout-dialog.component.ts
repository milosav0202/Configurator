import { Component, OnInit } from '@angular/core';
import {DataCacheEvents} from '../../data-cache/data-cache-events'
import {MatDialogRef} from '@angular/material';
import {DataCacheHandlerService} from '../../data-cache/data-cache-handler.service';

@Component({
  selector: 'app-logout-dialog',
  templateUrl: './logout-dialog.component.html',
  styleUrls: ['./logout-dialog.component.scss']
})
export class LogoutDialogComponent implements OnInit {
  constructor(private dataCache: DataCacheHandlerService,
              private dialogRef: MatDialogRef<LogoutDialogComponent>,
              private dataCacheEvents: DataCacheEvents) {
  }

  ngOnInit() {
  }

  logout(): void {
    this.dataCache.removeFromDataStore('user');
    this.dataCacheEvents.userDataChanged.emit(null);
    localStorage.removeItem('userShop')
    this.dialogRef.close();
  }
}
