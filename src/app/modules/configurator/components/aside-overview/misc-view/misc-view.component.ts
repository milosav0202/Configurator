import { Component, OnInit, Input, ElementRef } from '@angular/core';
import {Item} from '../../../shop/item';
import {DialogShowAtComponent} from '../../dialogs/dialog-show-at/dialog-show-at.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-misc-view',
  templateUrl: './misc-view.component.html',
  styleUrls: ['./misc-view.component.scss']
})
export class MiscViewComponent implements OnInit {
  @Input() itemData: Item;
  constructor(private eleRef: ElementRef, private dialog: MatDialog) { }

  ngOnInit() {
  }

  setColor(color) {
    this.eleRef.nativeElement.style.color = color;
    const dividers = this.eleRef.nativeElement.getElementsByTagName('mat-divider')  as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < dividers.length; i++) {
      dividers[i].style.borderColor = color;
    }
    const spinnerButtons = this.eleRef.nativeElement.getElementsByTagName('button')  as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < spinnerButtons.length; i++) {
      spinnerButtons[i].style.backgroundColor = color;
    }
  }

  openDialogShowAt(text: string) {
    this.dialog.open(DialogShowAtComponent, {data: text});
  }
}
