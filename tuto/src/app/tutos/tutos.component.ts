import { Component, OnInit } from '@angular/core';
import { Tuto } from '../tutos';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-tutos',
  templateUrl: './tutos.component.html',
  styleUrls: ['./tutos.component.scss']
})
export class TutosComponent implements OnInit {

title="Derniers tutoriels";
tutos:Tuto[];

constructor(  private route: ActivatedRoute,
  private apiService: ApiService,
 private router: Router) { }

ngOnInit() {
  this.getTutos();
  //this.deleteTutos();
  //this.tableau.push("hhhhhhhhhhhhhhhhhhhhhh","yyyy");
}

getTutos(){
this.apiService.getTutos().subscribe(
(response:Tuto[]) =>{ this.tutos=response

console.log(response)},
()=>console.log("error"),
()=>console.log('completed'+this.tutos[0]));
}


}
