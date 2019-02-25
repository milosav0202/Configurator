import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouteReuseStrategy, RouterModule, Routes} from '@angular/router';
import {CustomReuseStrategy} from '../../custom-reuse-strategy';
import {ShopComponent } from './shop/shop.component';
import {MainComponent} from './main/main.component';
import {NavigationComponent} from './components/navigation/navigation.component';
import {SharedModule} from '../shared/shared.module';
import {BasketComponent} from './basket/basket.component';
import {CaptureOverviewComponent} from './capture-overview/capture-overview.component';
import {SettingsComponent} from './components/settings/settings.component';
import {InputComponent} from './components/settings/input/input.component';
import {SliderComponent} from './components/settings/slider/slider.component';
import {MiscComponent} from './components/settings/misc/misc.component';
import {DynamicSettingsFieldDirective} from './components/settings/dynamic-settings-field/dynamic-settings-field.directive';
import {DynamicSettingsComponent} from './components/settings/dynamic-settings/dynamic-settings.component';
import { CarouselComponent } from './components/settings/carousel/carousel.component';
import { AsideOverviewComponent } from './components/aside-overview/aside-overview.component';
import { ItemsViewComponent } from './components/aside-overview/items-view/items-view.component';
import { ItemViewDirective } from './components/aside-overview/item-view-directive/item-view.directive';
import { SpinnerComponent } from './components/aside-overview/spinner/spinner.component';
import { MiscViewComponent } from './components/aside-overview/misc-view/misc-view.component';
import { CabletabViewComponent } from './components/aside-overview/cabletab-view/cabletab-view.component';
import { ProfilViewComponent } from './components/aside-overview/profil-view/profil-view.component';
import { OtherViewComponent } from './components/aside-overview/other-view/other-view.component';
import { DialogOverMaxComponent } from './components/dialogs/dialog-over-max/dialog-over-max.component';
import { DialogSendOrderComponent } from './basket/dialog-send-order/dialog-send-order.component';
import { DialogAllDatasheetsComponent } from './basket/dialog-all-datasheets/dialog-all-datasheets.component';
import { DialogShowAtComponent } from './components/dialogs/dialog-show-at/dialog-show-at.component';
import { OrderViewComponent } from './components/order-view/order-view.component';

const routes: Routes = [{
  path: 'configurator', component: MainComponent,
  children: [
    {path: 'home', component: CaptureOverviewComponent , data: { shouldReuse: true}},
    {path: 'shop/:capture', component: ShopComponent, data: {shouldReuse: false}},
    {path: 'basket', component: BasketComponent , data: { shouldReuse: false}}
  ]
}];

@NgModule({
    imports: [
      CommonModule,
      SharedModule,
      RouterModule.forChild(routes)
    ],
    declarations: [
      MainComponent,
      CaptureOverviewComponent,
      NavigationComponent,
      SettingsComponent,
      InputComponent,
      SliderComponent,
      ShopComponent,
      BasketComponent,
      MiscComponent,
      DynamicSettingsFieldDirective,
      DynamicSettingsComponent,
      CarouselComponent,
      AsideOverviewComponent,
      ItemsViewComponent,
      ItemViewDirective,
      SpinnerComponent,
      MiscViewComponent,
      CabletabViewComponent,
      ProfilViewComponent,
      OtherViewComponent,
      DialogOverMaxComponent,
      DialogSendOrderComponent,
      DialogAllDatasheetsComponent,
      DialogShowAtComponent,
      OrderViewComponent
    ],
    exports: [
      RouterModule
    ],
    providers: [
      {provide: RouteReuseStrategy, useClass: CustomReuseStrategy}
    ],
    entryComponents: [
      InputComponent,
      SliderComponent,
      MiscComponent,
      MiscViewComponent,
      ProfilViewComponent,
      CabletabViewComponent,
      OtherViewComponent,
      DialogOverMaxComponent,
      DialogSendOrderComponent,
      DialogAllDatasheetsComponent,
      DialogShowAtComponent
    ]
})
export class ConfiguratorModule {

}
