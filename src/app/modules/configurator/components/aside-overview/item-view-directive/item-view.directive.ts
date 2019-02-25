import { Directive, Input, ComponentFactoryResolver, ComponentRef, OnInit, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { MiscViewComponent } from '../misc-view/misc-view.component';
import { ProfilViewComponent } from '../profil-view/profil-view.component';
import { OtherViewComponent } from '../other-view/other-view.component';
import { CabletabViewComponent } from '../cabletab-view/cabletab-view.component';

const componentMapper = {
  misc: MiscViewComponent,
  profil: ProfilViewComponent,
  cable: CabletabViewComponent,
  powerSupply: OtherViewComponent,
  control: OtherViewComponent,
  features: OtherViewComponent
};

@Directive({
  selector: '[dynamicItemView]'
})
export class ItemViewDirective implements OnInit {

  @Input() item: any;
  @Input() color: string;
  componentRef: any;
  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) { }

  ngOnInit() {
    const factory = this.resolver.resolveComponentFactory(
      componentMapper[this.item.type1]
    );
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.itemData = this.item;
    this.componentRef.instance.setColor(this.color);
  }
}
