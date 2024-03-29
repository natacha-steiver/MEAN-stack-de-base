import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable ,BehaviorSubject} from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) { }
  
  login(username: string, password: string): Observable<boolean> {
    const obj = {username: username, password: password};
    
    
    return this.http.post<{token: string}>('/api/auth', obj)
    .pipe(
      map(result => {
        localStorage.setItem('access_token', result.token);
        return true;
      })
      );
    }
    
    logout() {
      localStorage.removeItem('access_token');
    }
    
    public get loggedIn(): boolean {
      return (localStorage.getItem('access_token') !== null);
    }
    getToken(){
      return localStorage.getItem('access_token');
    }
  }
