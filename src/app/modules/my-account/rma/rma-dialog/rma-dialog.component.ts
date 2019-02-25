import { Component, OnInit, OnDestroy } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {HttpConnection} from '../../../../communication/http-connection';
import { UploadEvent, FileSystemFileEntry } from 'ngx-file-drop';
import {RMA} from '../rmaObj';
import {Dropbox} from 'dropbox';
import {fetch} from 'isomorphic-fetch';
import {DataCacheHandlerService} from '../../../../data-cache/data-cache-handler.service';

@Component({
  selector: 'app-rma',
  templateUrl: './rma-dialog.component.html',
  styleUrls: ['./rma-dialog.component.scss']
})
export class RmaDialogComponent implements OnInit, OnDestroy {
  files: any = [];
  filesUploaded: any = [];
  failures: any = [];
  contentLoaded = false;
  contentError = null;
  selectedItem: any;
  rma = new RMA();
  hrefRmaPdf = null;
  timeOfFailures = [
    'CONTROL_OUTGOING_GOODS',
    'COMMISIONING_ASSEMBLY',
    'DUTY'
  ];

  private units = [
    'bytes',
    'KB',
    'MB',
    'GB',
    'TB',
    'PB'
  ];

  constructor(private dialogRef: MatDialogRef<RmaDialogComponent>,
              private http: HttpConnection,
              public dialog: MatDialog,
              private dataCache: DataCacheHandlerService) { }

  ngOnInit() {
    this.contentLoaded = false;
    this.contentError = null;
    this.http.getRmaConfig().subscribe( data => {
       this.failures = data;
        this.contentLoaded = true;
      },
      error => {
        this.contentLoaded = true;
        this.contentError = error;
      }
    );
    this.rma.user = this.dataCache.getDataStore('user');
  }

  ngOnDestroy() {
    this.dialogRef.close(this.hrefRmaPdf);
  }

  public dropped(event: UploadEvent) {
    if (this.files.length >= 3) {
      alert('maximum 3 files');
      return;
    }
    for (const droppedFile of event.files) {
      if (this.files.filter(e => e.path === droppedFile.relativePath).length > 0) {
        continue;
      }
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
           const formData = new FormData();
           formData.append(droppedFile.relativePath, file, droppedFile.relativePath);
           this.files.push({path: droppedFile.relativePath, size: this.transform(file.size), formData: formData, file: file});

        });
      } else {
        alert('only Files are allowed');
      }
    }
  }

  transform(bytes: number = 0, precision: number = 2): string {
    if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes)) {
      return '?';
    }
    let unit = 0;
    while (bytes >= 1024) {
      bytes /= 1024;
      unit++;
    }

    return bytes.toFixed(+ precision) + ' ' + this.units[unit];
  }

  deleteUploadFile(item): void {
    this.files = this.files.filter(function( obj ) {
      return obj.path !== item.path;
    });

  }

  onSubmit() {
    this.contentLoaded = false;
     this.http.sendRma(this.rma, this.dataCache.getDataStore('language'), this.dataCache.getDataStore('customer')).subscribe( data => {
      this.contentLoaded = true;
        if (!data.error) {
          if (this.dataCache.getDataStore('config').modules.rma.dropbox) {
            this.uploadFileDropbox(this.rma.number, this.dataCache.getDataStore('config').modules.rma.dropbox);
          }
          this.hrefRmaPdf = data.message;
        }
    },
      error => {
        this.contentLoaded = true;
        this.contentError = error;
      });
  }

  uploadFileDropbox(folder, token): void {
     const dbx = new Dropbox({accessToken: token});
     for (const file of this.files) {
       dbx.filesUpload({path: '/' + folder + '/' + file.path, contents: file.file})
         .then((response) => {
           this.filesUploaded.push(file.path);
         })
         .catch((error) => {
           this.filesUploaded.push(error);
         });
     }
  }
}
