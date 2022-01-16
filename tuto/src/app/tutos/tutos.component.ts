import { Component, OnInit,Pipe } from '@angular/core';
import { Tuto } from '../tutos';
import { ApiService } from '../api.service';

import { map } from 'rxjs/operators';

import {FormControl,FormsModule,FormGroupDirective,ReactiveFormsModule, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

import { ActivatedRoute,Router } from '@angular/router';
import { Location } from '@angular/common';




@Component({
  selector: 'app-tutos',
  templateUrl: './tutos.component.html',
  styleUrls: ['./tutos.component.scss']
})
export class TutosComponent implements OnInit {

title="Derniers tutoriels";
tutos:Tuto[];
tuto=[];
tutoForm: FormGroup;
fileName = '';


constructor(private route: ActivatedRoute,private router: Router, private apiService: ApiService, private formBuilder: FormBuilder) {
this.createForm();
}
createForm() {
this.tutoForm = this.formBuilder.group({
'_id': [null, Validators.min(3)],
'titre' : [null, Validators.required],
'texte' : [null, Validators.required],
'image' : [null, Validators.required],
});
}
addTuto() {
  const _id = null;
  const titre = this.tutoForm.value["titre"];
  const texte = this.tutoForm.value["texte"];
  const image = this.fileName;

  this.apiService.postTuto(_id,titre,texte,image)
    .subscribe(res => {
        let id = res['_id'];
        
    //    this.router.navigate(['tutos', id]);
      }, (err) => {
        console.log("err: "+err);
      });
   
      this.getTutos();

}
ngOnInit() {
  this.getTutos();

  //this.deleteTutos();
  //this.tableau.push("hhhhhhhhhhhhhhhhhhhhhh","yyyy");
}
onFileSelected(event) {

  const file:File = event.target.files[0];

  if (file) {

      this.fileName = file.name;

      const formData = new FormData();

      formData.append("file", file);

      const upload$ =   this.apiService.uploadPicture(formData) ;

      upload$.subscribe();
  }
}


getTutos(){
this.apiService.getTutos().subscribe(
(response:Tuto[]) =>{


console.log(response);

this.tutos=response;
},
()=>{
  console.log("Vous n'êtes pas autorisé à voir le contenu"),
  alert("Vous n'êtes pas autorisé à voir le contenu");
},
()=>console.log('completed'+this.tutos[0]));

}




}
