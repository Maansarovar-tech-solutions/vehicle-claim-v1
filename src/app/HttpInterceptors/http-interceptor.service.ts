import { ErrorPopupComponent } from './../Shared/Modal/error-popup/error-popup.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ErrorService } from '../Errors/error.service';
import { MatDialog } from '@angular/material/dialog';
import * as Mydatas from '../../assets/app-config.json';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  service_count = 0;
  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;
  constructor(
    public router: Router,
    private errorService: ErrorService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog
  ) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.service_count++;
    this.spinner.show();


    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if(event.body?.IsError){
              let ErrorMessage:any =event.body?.ErrorMessage;
              if(event.url != `${this.ApiUrl1}api/chassissearch`){
              this.openDialog(ErrorMessage)
              }

          }
        }
        return event;
      }),
      finalize(() => {
        this.service_count--;
        if (this.service_count === 0) {
          this.spinner.hide();
        }
      }),
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          this.errorService.APIError(error);
        }
        return throwError(error.message);
      })
    );
  }

  openDialog(data:any) {
    this.dialog.open(ErrorPopupComponent, {
      // width: '100%',
      data: data,
    });
  }
}
