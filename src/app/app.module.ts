import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppConfig } from './app.conf';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import {RouteReuseStrategy, RouterModule, Routes} from '@angular/router';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from './app.material';
import { DataCacheEvents } from './data-cache/data-cache-events';
import { DataCacheHandlerService } from './data-cache/data-cache-handler.service';
import {CustomReuseStrategy} from './custom-reuse-strategy';
import {LoginDialogComponent} from './header/login-dialog/login-dialog.component';
import {ConfiguratorModule} from './modules/configurator/configurator.module';
import {MyAccountModulerModule} from './modules/my-account/my-account.module';
import {SharedModule} from './modules/shared/shared.module';
import {RmaDialogComponent} from './modules/my-account/rma/rma-dialog/rma-dialog.component';
import {DownloadsComponent} from './downloads/downloads.component';
import {HttpConnection} from './communication/http-connection';
import { FileDropModule } from 'ngx-file-drop';
import { LogoutDialogComponent } from './header/logout-dialog/logout-dialog.component';
import { DeviceDetectorModule } from 'ngx-device-detector';
import {AuthGuard} from './auth-guard.service';

export function loadConfigService(appConfig: AppConfig): Function {
  return () => {
    return appConfig.load();
  };
}

const routes: Routes = [
  {path: 'configurator', component: ConfiguratorModule, data: { shouldReuse: true }},
  {path: 'my-account', component: MyAccountModulerModule, data: { shouldReuse: true }},
  {path: 'downloads', component: DownloadsComponent, data: { shouldReuse: true }}
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginDialogComponent,
    RmaDialogComponent,
    DownloadsComponent,
    LogoutDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    ConfiguratorModule,
    MyAccountModulerModule,
    FileDropModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MaterialModule,
    BrowserAnimationsModule,
    DeviceDetectorModule.forRoot(),
    RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload', initialNavigation: false, useHash: true}),
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: loadConfigService , deps: [AppConfig], multi: true },
    {provide: RouteReuseStrategy, useClass: CustomReuseStrategy},
    DataCacheHandlerService,
    HttpConnection,
    DataCacheEvents,
    AppConfig,
    AuthGuard
  ],
  entryComponents: [ LoginDialogComponent, LogoutDialogComponent],
  bootstrap: [AppComponent]
})

export class AppModule {
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
