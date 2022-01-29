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
  tutosBool=false;
  imageUrl="res.cloudinary.com/dvt1xs2hq/image/upload/images/";
  
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
     // 'image' : [null, Validators.required],
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
    const image = this.fileName.length>=1?this.fileName:"angu.png";
    if(titre.length>0 && texte.length ){
      this.apiService.postTuto(_id,titre,texte,image)
      .subscribe(res => {
        let id = res['_id'];
      }, (err) => {
        console.log("err: "+err);
      });
      
      this.getTutos();
      this.tutoForm.reset();
    }

  }
  ngOnInit() {
   
    this.getTutos();
    if (window.screen.width < 992) { // 768px portrait
      this.mobile = true;
    }
    if (this.tutos.length>0) { // 768px portrait
      this.tutosBool = true;
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
      (err)=>{
        console.log(err+"You are not authorized to view the content, session expired after 2 hours"),
        alert("You are not authorized to view the content, session expired after 2 hours");
        this.logout();
      },
      ()=>console.log('completed'));
      
    }
    
    
    
    
  }
