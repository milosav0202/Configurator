import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouteReuseStrategy, RouterModule, Routes} from '@angular/router';
import {CustomReuseStrategy} from '../../custom-reuse-strategy';
import {MainComponent} from './main/main.component';
import {SharedModule} from '../shared/shared.module';
import {RmaDialogComponent} from './rma/rma-dialog/rma-dialog.component';
import { RmaComponent } from './rma/rma.component';
import { OrdersComponent } from './orders/orders.component';
import {AuthGuard} from '../../auth-guard.service';

const routes: Routes = [
  {path: 'my-account', component: MainComponent, data: { shouldReuse: true }, canActivate: [AuthGuard]}
];

@NgModule({
    imports: [
      CommonModule,
      SharedModule,
      RouterModule.forChild(routes),
    ],
    declarations: [
      MainComponent,
      RmaComponent,
      OrdersComponent
    ],
    entryComponents: [ RmaDialogComponent],
    exports: [
      RouterModule
    ],
    providers: [
        {provide: RouteReuseStrategy, useClass: CustomReuseStrategy},
      AuthGuard
        ]
})
export class MyAccountModulerModule {

}
