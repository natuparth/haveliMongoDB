import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './Services/authService/authguard.service';
import { ErrorComponent } from './error/error.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path : 'error' , component: ErrorComponent},
  { path: 'login', loadChildren: () => import('../app/login/auth.module').then(m => m.AuthModule) },
  { path: 'main', canActivate: [AuthGuard], loadChildren: './main/main.module#MainModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes , {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
