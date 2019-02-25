import { Component, OnInit, Input, ElementRef } from '@angular/core';

@Component({
  selector: 'app-cabletab-view',
  templateUrl: './cabletab-view.component.html',
  styleUrls: ['./cabletab-view.component.scss']
})
export class CabletabViewComponent implements OnInit {
  @Input() itemData: any;
  constructor(private eleRef: ElementRef) { }

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
}
