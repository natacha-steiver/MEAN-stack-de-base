  import { Component, OnInit,Renderer2, ElementRef, } from '@angular/core';
  import { ApiService } from '../api.service';
  import {  FormBuilder, FormGroup, Validators } from '@angular/forms';
  import { ActivatedRoute,Router } from '@angular/router';
  import { AuthService } from '../auth.service';



  @Component({
    selector: 'app-tutos-detail',
    templateUrl: './tutos-detail.component.html',
    styleUrls: ['./tutos-detail.component.scss']
  })
  export class TutosDetailComponent implements OnInit {
    title: "tutoriel";
    tuto=[];
    tutoForm: FormGroup;
    titre:string='tet';
    texte:string;
    image:string;
    id:any;
    fileName = '';
    mobile=false;
    logged=false;

    constructor(private auth: AuthService,private renderer:Renderer2,private el:ElementRef ,private route: ActivatedRoute,private router: Router, private apiService: ApiService, private formBuilder: FormBuilder) {
      this.createForm();
    }

    createForm() {
      this.tutoForm = this.formBuilder.group({
        '_id': [null, Validators.min(3)],
        'titre' : [null, Validators.required],
        'texte' : [null, Validators.required],
        'image': [null,Validators.min(3)]
      });
      
    }
    
    
    logout() {
      this.auth.logout();
      this.logged=false;
      this.router.navigate(['login']);
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

    update(img){
      
      const id = this.route.snapshot.paramMap.get('id');
      const titre = this.tutoForm.value["titre"];
      const texte = this.tutoForm.value["texte"];
      const image = this.fileName.length>=1?this.fileName:img;
      this.apiService.updateTuto(titre,id,texte,image).subscribe(res => {
        this.getTuto();
        this.router.navigate(['/tutos']);
        //console.log("update ok")
      }, (err) => {
        console.log(err);
      });
      this.tutoForm.reset();
    }

          deleteTutos(id) {
            //renvoit mauvais id
          //const id = this.route.snapshot.paramMap.get('id');
          this.apiService.deleteTuto(id)
            .subscribe(res => {
              // ne marche qu'avec des nulbers : this.conseils.splice(id, 1);
              this.router.navigate(['/tutos']);
              }, (err) => {
                console.log(err);
              }
            );

          }

         getTuto(){
          const id = this.route.snapshot.paramMap.get('id');
          this.apiService.getTuto(id).subscribe(
            (tuto)=>{
              
              
              console.log(tuto);
              
              this.tuto=tuto;
            },
            ()=>{
              console.log("Vous n'êtes pas autorisé à voir le contenu"),
              alert("Vous n'êtes pas autorisé à voir le contenu");
              this.logout();
            },
            ()=>console.log('completed')
            );
            
          }
      


       ngOnInit(): void {

         this.getTuto();
         if (window.screen.width < 992) { // 768px portrait
           this.mobile = true;
         }
                  
       }



  }
