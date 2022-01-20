import { Component, OnInit,Pipe } from '@angular/core';
import { Tuto } from '../tutos';
import { ApiService } from '../api.service';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { AuthService } from '../auth.service';



@Component({
  selector: 'app-tutos',
  templateUrl: './tutos.component.html',
  styleUrls: ['./tutos.component.scss']
})
export class TutosComponent implements OnInit {
  
  title="The latest tutorials";
  tutos:Tuto[];
  tuto=[];
  tutoForm: FormGroup;
  fileName = '';
  mobile=false;
  logged=false;
  
  
  constructor(private auth: AuthService,private route: ActivatedRoute,private router: Router, private apiService: ApiService, private formBuilder: FormBuilder) {
    this.createForm();
  }
  
  
  logout() {
    this.auth.logout();
    this.logged=false;
    this.router.navigate(['login']);
  }

  createForm() {
    this.tutoForm = this.formBuilder.group({
      '_id': [null, Validators.min(3)],
      'titre' : [null, Validators.required],
      'texte' : [null, Validators.required],
      'image' : [null, Validators.required],
    });
  }
  deleteTutos(id) {
    //renvoit mauvais id
  //const id = this.route.snapshot.paramMap.get('id');

  this.apiService.deleteTuto(id)
    .subscribe(res => {
      // ne marche qu'avec des nulbers : this.conseils.splice(id, 1);
      this.getTutos();
      }, (err) => {
        console.log(err);
      }
    );

  }


  addTuto() {
    const _id = null;
    const titre = this.tutoForm.value["titre"];
    const texte = this.tutoForm.value["texte"];
    const image = this.fileName;
    
    this.apiService.postTuto(_id,titre,texte,image)
    .subscribe(res => {
      let id = res['_id'];
    }, (err) => {
      console.log("err: "+err);
    });
    
    this.getTutos();
    this.tutoForm.reset();
  }
  ngOnInit() {
    this.getTutos();
    if (window.screen.width < 992) { // 768px portrait
      this.mobile = true;
    }
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
        this.logout();
      },
      ()=>console.log('completed'+this.tutos[0]));
      
    }
    
    
    
    
  }
