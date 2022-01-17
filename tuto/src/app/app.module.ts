import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TutosComponent } from './tutos/tutos.component';
import { TutosDetailComponent } from './tutos-detail/tutos-detail.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FormsModule,ReactiveFormsModule  }   from '@angular/forms';
import { fas } from '@fortawesome/free-solid-svg-icons';
import {MatIconModule} from '@angular/material/icon';
import {faTrash } from '@fortawesome/free-solid-svg-icons';

import { JwtModule } from '@auth0/angular-jwt';
import { LoginComponent } from './login/login.component';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './token.interceptor'
import { UserListComponentComponent } from './user-list-component/user-list-component.component';
// ...
export function tokenGetter() {
  return localStorage.getItem('access_token');
}
@NgModule({
  declarations: [
    AppComponent,
    TutosComponent,
    TutosDetailComponent,
    LoginComponent,
    UserListComponentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatIconModule,
    AppRoutingModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:4000'],
        blacklistedRoutes: ['localhost:4000/api/auth']
      }
    })
    
  ],
  providers: [AuthService,
    AuthGuard,{
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }],
    bootstrap: [AppComponent]
  })
  export class AppModule {
    constructor() {
      // Add an icon to the library for convenient access in other components
      library.add(fas,faTrash );
    }
  }
