import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-dialog-show-at',
  templateUrl: './dialog-show-at.component.html',
  styleUrls: ['./dialog-show-at.component.scss']
})
export class DialogShowAtComponent implements OnInit {
  @ViewChild('textarea') textarea;
  dialog: any;
  document = document;
  atText: string;
  constructor(private dialogRef: MatDialogRef<DialogShowAtComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dialog = dialogRef;
  }

  ngOnInit() {
    this.atText = this.data;
  }

  selectText() {
    this.textarea.nativeElement.select();
    document.execCommand('copy');
  }
}
