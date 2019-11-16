import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate{

  constructor(private authService: AuthService){

  }
canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
  : boolean |UrlTree | Observable<boolean | UrlTree> | Promise<boolean |UrlTree> {

    return this.authService.getUserAuthenticated();

  }






}
