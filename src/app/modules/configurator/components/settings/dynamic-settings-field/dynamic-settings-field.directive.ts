import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  OnInit,
  ViewContainerRef,
  Output,
  EventEmitter
} from '@angular/core';
import {SliderComponent} from '../slider/slider.component';
import {InputComponent} from '../input/input.component';
import {MiscComponent} from '../misc/misc.component';

const componentMapper = {
  slider: SliderComponent,
  input: InputComponent,
  misc: MiscComponent
};
@Directive({
  selector: '[dynamicSettingsField]'
})
export class DynamicSettingsFieldDirective implements OnInit {
  @Input() color: string;
  @Input() element: any;
  componentRef: any;
  @Output() productChangeEvent: EventEmitter<any> = new EventEmitter();
  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) {}
  ngOnInit() {
    const factory = this.resolver.resolveComponentFactory(
      componentMapper[this.element.type]
    );
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.sliderData = this.element;
    this.componentRef.instance.color = this.color;
    this.componentRef.instance.productChangeEvent.subscribe((event) => this.productChangeEvent.emit(event));
    if (this.element.type === 'input') {
      this.componentRef.instance.setFocus();
    }
  }
}
