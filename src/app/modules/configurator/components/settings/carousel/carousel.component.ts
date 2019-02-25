import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  @ViewChild('imgList') imgListUL: ElementRef;
  @Input()
  set imagesData(imagesData) {
    if (typeof imagesData !== 'undefined') {
      this._imagesData = imagesData;
      this.carouselOff = true;
      this.initCarousel();
    }
  }
  @Input() type: any = 'small';
  @Input() multiSelect = false;
  @Input() color: string;
  _imagesData: any = [];
  carouselOff: Boolean = true;
  currentPos: any = 0;
  carouselWidth: any = 0;
  frameWidth: any = 0;
  constructor() { }

  @Output() imgClick: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
  }

  initCarousel() {
    this.calculateWidth();
    this.imgListUL.nativeElement.style.transition = 'left 0s';
    this.currentPos = 0;
  }

  calculateWidth() {
    const liTags = this.imgListUL.nativeElement.getElementsByTagName('li') as HTMLCollectionOf<HTMLElement>;
    if (this._imagesData.length && liTags.length === this._imagesData.length && this._imagesData.every((ele, i) => liTags[i].querySelector('img').getAttribute('src') === ele.src)) {
      this.carouselWidth = 0;
      let b = false;
      for (let i = 0; i < liTags.length; i++) {
        if (liTags[i].offsetWidth === 0) { b = true; }
        this.carouselWidth += liTags[i].offsetWidth + 10;
      }
      this.carouselWidth += 10;
      this.imgListUL.nativeElement.style.width = this.carouselWidth + 'px';
      this.onResizeWindow();
      if (b) {
        setTimeout(() => this.calculateWidth(), 100);
        return;
      }
      if (!this.carouselOff) {
        this.showSelectedImage();
      }
    } else {
      setTimeout(() => this.calculateWidth(), 10);
    }
  }

  onSliderButtonClick(direction): void {
    const unit = (this.type === 'small') ? 100 : 240;
    this.moveCarousel(direction * unit);
  }

  moveCarousel(length) {
    const carouselContainer = this.imgListUL.nativeElement.parentElement;
    this.imgListUL.nativeElement.style.transition = 'left 0.5s';
    this.currentPos += length;
    if (this.currentPos > 0) {
      this.currentPos = 0;
    }
    if (this.currentPos < -(this.carouselWidth - carouselContainer.offsetWidth)) {
      this.currentPos = -(this.carouselWidth - carouselContainer.offsetWidth);
    }
  }

  showSelectedImage() {
    const liTags = this.imgListUL.nativeElement.getElementsByTagName('li') as HTMLCollectionOf<HTMLElement>;
    let pos = 0;
    let i;
    for (i = 0; i < this._imagesData.length; i++) {
      if (this._imagesData[i].selected) {
        break;
      }
      pos += liTags[i].offsetWidth + 10;
    }
    if (i !== liTags.length) {
      if ((pos + liTags[i].offsetWidth < (-this.currentPos + 60)) || ((-this.currentPos + this.frameWidth - 60) < pos)) {
        this.moveCarousel(-this.currentPos - pos + this.frameWidth / 2 - liTags[i].offsetWidth / 2);
      }
    }
  }

  onImageClick(image, ele): void {
    if (this.multiSelect) {
      if (image.selected) {
        image.selected = false;
      } else {
        image.selected = true;
      }
    } else {
      for (let i = 0; i < this._imagesData.length; i++) {
        this._imagesData[i].selected = false;
      }
      image.selected = true;
    }
    this.imgClick.emit(image);
  }

  onResizeWindow() {
    this.frameWidth = this.imgListUL.nativeElement.parentElement.offsetWidth;
    if (this.carouselWidth < this.frameWidth) {
      this.carouselOff = true;
      this.currentPos = 0;
    } else {
      this.carouselOff = false;
    }
  }
}
