import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';
import {DataCacheHandlerService} from './data-cache/data-cache-handler.service';

@Injectable()
export class AuthGuard implements CanActivate {


  constructor(private dataCache: DataCacheHandlerService, private _router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.dataCache.getDataStore('user')) {
      return true;
    }

    // navigate to login page
    this._router.navigate(['configurator/home']);
    // you can save redirect url so after authing we can move them back to the page they requested
    return false;
  }
}
