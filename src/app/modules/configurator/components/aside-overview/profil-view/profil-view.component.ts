import {Component, OnInit, Input, ElementRef, Output, EventEmitter} from '@angular/core';
import {Item} from '../../../shop/item';
import {DialogOverMaxComponent} from '../../dialogs/dialog-over-max/dialog-over-max.component';
import {MatDialog} from '@angular/material';
import {DialogShowAtComponent} from '../../dialogs/dialog-show-at/dialog-show-at.component';

@Component({
  selector: 'app-profil-view',
  templateUrl: './profil-view.component.html',
  styleUrls: ['./profil-view.component.scss']
})
export class ProfilViewComponent implements OnInit {
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
