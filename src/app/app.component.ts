import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Componentes } from './interfaces/interfaces';
import { ConfiguracionService } from './services/configuracion.service';
import { DataService } from './services/data.service';
import { SqliteService } from './services/sqlite.service';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  componentes:Observable<Componentes[]> ;
  constructor(private platform: Platform,
              
              private dataService:DataService,
              private sqliteServices:SqliteService,
              private configServ: ConfiguracionService
              ) {



  }  
  
  async ngOnInit() {
    if ( await this.platform.ready()){
        console.log('App OK');
        this.componentes = await this.dataService.getOpcionesMenu();
        await this.sqliteServices.fn_crear_db();
        await this.configServ.fn_crear_appconfig();
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        console.log(prefersDark);

        



        if (prefersDark.matches) {
          document.body.classList.toggle('dark', );
        
          
        }
    } ;


  }



}
