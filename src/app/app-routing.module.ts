import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {  TutosComponent } from './tutos/tutos.component';
import {  TutosDetailComponent } from './tutos-detail/tutos-detail.component';
import { LoginComponent } from './login/login.component';
import {UserListComponentComponent} from './user-list-component/user-list-component.component';
import { AuthGuard } from './auth.guard';

//!!! login s'affiche 2X avec lien retour vers backoffice
const routes: Routes = [
  { path: 'tutos', component: TutosComponent,canActivate: [AuthGuard] },
  { path: 'tutos/details/:id', component: TutosDetailComponent },
  { path: 'users', component: UserListComponentComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
