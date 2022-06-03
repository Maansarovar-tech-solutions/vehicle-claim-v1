import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { BehaviorSubject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  private loggedToken: BehaviorSubject<any> = new BehaviorSubject<any>('');


  constructor(
    private spinner: NgxSpinnerService
  ) { }



  APIError(error: any) {
    console.log(error);

    if (error?.error?.Errors) {
      this.ValidationError(error);

    } else {
      let ErrorText = `<div class="my-1 losserrorlist">
      <div class="text-danger">URL:${error?.url}</div>
    </div>`;
      Swal.fire(
        `<h4>${error?.message}</h4>`,
        `${ErrorText}`,
        'error',
      )
    }

  }

  ValidationError(validation: any) {
    if (validation?.error?.Errors) {
      let ErroArray: any = validation?.error?.Errors;
      console.log(ErroArray);

      let ErrorsList = '';
      for (let i = 0; i < ErroArray.length; i++) {
        ErrorsList += `
      <div class="my-1 losserrorlist">
         <div class="text-danger"> Field: ${ErroArray[i].Field}</div>
         <div class="text-danger"> Error: ${ErroArray[i].ErrorDescription}</div>
      </div>`;

      }
      Swal.fire(
        '<h4 style="display:none">Please Fill Valid Value</h4>',
        `${ErrorsList}`,
        'error',
      )
    }
  }

  showError(error: any, errorMessage: any) {
    console.log(error.error.Errors);
    if (error?.error?.Errors) {
      let ErroArray = error?.error?.Errors
      let ErrorsList = '';

      for (let i = 0; i < ErroArray.length; i++) {
        ErrorsList += `
        <div class="my-1 losserrorlist">
           <div class="text-danger"> Field: ${ErroArray[i].Field}</div>
           <div class="text-danger"> Error: ${ErroArray[i].ErrorDescription}</div>
        </div>`;

      }
      Swal.fire(
        '<h4 style="display:none">Please Fill Valid Value</h4>',
        `${ErrorsList}`,
        'error',
      )
    }


    if (error.status == 401 || error.status == 400 || error.status == 500 || error.status == 501 || error.status == 503) {
      Swal.fire(
        `ErrorCode:${errorMessage.ErrorCode}`,
        `${errorMessage.Message}`,
        'error'
      )
    }

    if (error.status == 0) {
      Swal.fire(
        `Server Currently Down`,
        `${errorMessage.Message}`,
        'error'
      )
    }
  }




}
