import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiIntercepter implements HttpInterceptor {
  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // const headers = req.headers
    // .set('Content-Type', 'application/json');
    // const authReq = req.clone({ headers });
    let reqObj = {
      fullPath: req.urlWithParams,
      params: req.params
    }
    console.log(`[ApiIntercepter]:: ${JSON.stringify(reqObj)}`)
    return next.handle(req);
  }
}