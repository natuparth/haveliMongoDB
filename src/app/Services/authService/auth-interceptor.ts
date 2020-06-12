import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

@Injectable()

export class AuthInterceptor implements HttpInterceptor{
  constructor(private router: Router) {
  }
    intercept(req: HttpRequest<any>, next: HttpHandler){
    const authToken = localStorage.getItem('token');
    // console.log(authToken);
  const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authToken)
    });
return next.handle(authRequest).pipe(
  retry(1),
  catchError( (error: HttpErrorResponse) =>{
    let errorMessage = '';
    if (error.status === 0){
      localStorage.setItem('serverDown', 'true');
      errorMessage = 'Server is down';
    } else if (error.error.message.message.includes('jwt')){
      localStorage.clear();
      errorMessage = 'Your Authentication Token has expired';
    } else {
      errorMessage = error.error.message.message;
    }
    if(errorMessage==='Your Authentication Token has expired') {
      this.router.navigate(['login'] )
    }
    else
    this.router.navigate(['error'], { state: {message: errorMessage}} );
    return throwError(errorMessage);
  })
)
}

}