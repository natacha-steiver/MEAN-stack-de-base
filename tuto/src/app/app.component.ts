import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title:'tuto';
  logged=false;
  constructor(private auth: AuthService, private router: Router) { }
  
  
  logout() {
    this.auth.logout();
    this.logged=false;
    this.router.navigate(['login']);
  }

  ngOnInit(): void {

   
    if (localStorage.getItem('access_token')) {
      this.logged=true;
    }else{
      this.logged=false;
      this.logout();
    }
             
  }

}
