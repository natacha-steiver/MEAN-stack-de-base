import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs/Observable'; 
import {Tuto} from './tutos';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  
  constructor(private http: HttpClient) { }
  //NB express routing is mounted on /api path but angular paths are different, based on "/"
    
  //tuto
  
  getTutos(): Observable<Tuto[]>{
    return this.http.get<Tuto[]>('/api/tutos');
  }
  
  getTuto(id): Observable<any> {
    
    let API_URL = `/api/tutos/details/${id}`;
    return this.http.get(API_URL)
  }
  
  postTuto(_id,titre,texte,image): Observable<any> {
    const data={_id,titre,texte,image}
    return this.http.post('/api/tutos/add', data)
    
  }
  
  deleteTuto(id: any): Observable<{}> {
    return this.http.delete(`/api/tutos/details/${id}`)
  }
  
  
  
  updateTuto(titre, id,texte,image): Observable<any>  {
    const obj = {
      titre,texte,image
    };
    return this.http.put(`/api/tutos/details/${id}`, obj)
  }
  
  uploadPicture(img): Observable<any>  {
    return this.http.post(`/api/upload`, img)
  }
  
  
}
