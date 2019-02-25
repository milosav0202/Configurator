import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpConnection {
  headers: HttpHeaders;
  headersFromData: HttpHeaders;
  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.headersFromData = new HttpHeaders().set( 'Content-Type', 'application/x-www-form-urlencoded;charset=utf-8;');
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }

  public fetchInitDataFrmDB(customer): Observable<any> {
    const cust = {name: customer};
    return this.http.post(environment.urls.api.shop + 'getDataFromDb.php', JSON.stringify(cust) , {headers: this.headers})
      .pipe(
        catchError(this.handleError)
      );
  }

  public getConfiguratorSettings(): Observable<any> {
    return this.http.get('./assets/configurator/LED_Settings.json')
      .pipe(
        catchError(this.handleError)
      );
  }

  public sendRma(rma, language, customer): Observable<any> {
    const data = {rma: rma, language: language, customer: customer};
    return this.http.post(environment.urls.api.rma + 'sendRma.php', JSON.stringify(data) , {headers: this.headers})
      .pipe(
        catchError(this.handleError)
      );
  }

  public getRmas(user): Observable<any> {
    return this.http.post(environment.urls.api.rma + 'getRmas.php', JSON.stringify(user) , {headers: this.headers})
      .pipe(
        catchError(this.handleError)
      );
  }

  public getRmaConfig(): Observable<any> {
    return this.http.get(environment.urls.api.rma + 'getRmaConfig.php')
      .pipe(
        catchError(this.handleError)
      );
  }

  public getOrders(user): Observable<any> {
    return this.http.post(environment.urls.api.order + 'getOrders.php', JSON.stringify(user) , {headers: this.headers})
      .pipe(
        catchError(this.handleError)
      );
  }

  public checkUser(customer, user): Observable<any> {
    const data = {customer: customer, user: user};
    return this.http.post(environment.urls.api.login + 'checkUser.php', JSON.stringify(data) , {headers: this.headers})
      .pipe(
        catchError(this.handleError)
      );
  }

  public registerUser(customer, user): Observable<any> {
    const data = {customer: customer, user: user};
    return this.http.post(environment.urls.api.login + 'registerUser.php', JSON.stringify(data) , {headers: this.headers})
      .pipe(
        catchError(this.handleError)
      );
  }

  public createNewPassword(customer, user): Observable<any> {
    const data = {customer: customer, user: user};
    return this.http.post(environment.urls.api.login + 'createPasswordMail.php', JSON.stringify(data) , {headers: this.headers})
      .pipe(
        catchError(this.handleError)
      );
  }

  public logoutUser(customer, user): Observable<any> {
    const data = {customer: customer, user: user};
    return this.http.post(environment.urls.api.login + 'logoutUser.php', JSON.stringify(data) , {headers: this.headers})
      .pipe(
        catchError(this.handleError)
      );
  }

  public sendOrder(customer, order, user): Observable<any> {
    const data = {customer: customer, order: order, user: user};
    return this.http.post(environment.urls.api.shop + 'createOrder/create.php', JSON.stringify(data) , {headers: this.headers})
      .pipe(
        catchError(this.handleError)
      );
  }
}
