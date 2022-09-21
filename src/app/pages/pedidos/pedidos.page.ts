import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Componentes } from 'src/app/interfaces/interfaces';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';
import { PedidoEditPage } from '../pedido-edit/pedido-edit.page';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})
export class PedidosPage implements OnInit {

pedidos :Observable<any>
ls_estatus : string;
titulo :string =''
icono :string =''
texto_filtro:string =''
usuario_login : string



  constructor(  private   router : Router  ,
                private apiserv : ApiService,
                private activatedRoute: ActivatedRoute,
                private actionSheetController: ActionSheetController,
                private modalController: ModalController,
                private dataService:DataService
               ) { }

  async  ngOnInit() {
    this.usuario_login = environment.usuario_login
    this.ls_estatus =  this.activatedRoute.snapshot.paramMap.get('id');
    await this.getPedidos()
    console.log('getPedidos');

  }


  async getPedidos(){
    return  new Promise((resolve ) => {
      this.setTitulo();
      this.pedidos = this.apiserv.getapi('v_pedidosapp')
      resolve(true)
    })}

   async doRefresh(event){

      console.log(event);
      await this.getPedidos();
      console.log('getPedidos');
      await  event.target.complete();
      console.log('event.target.complete');

    }

  setTitulo(){

    switch (this.ls_estatus) {
      case '1':  
          this.titulo ='Pendientes'
          this.icono ='copy-outline'
        break;
      case '2':  
          this.titulo ='Surtiendo'
          this.icono ='duplicate-outline'
        break;
      case '3':  
          this.titulo ='Surtido'
          this.icono ='shield-checkmark-outline'
        break;
      default:   
          this.titulo ='Pendientes'
          this.icono ='copy-outline'
        break;
    }
  }


 
  
  fn_surtir_ped(pedido){
    console.log(pedido);
    
    this.router.navigateByUrl(
      'pedido-edit/'  
      +pedido.c_codigo_tem +'/'  
      +pedido.c_codigo_emp +'/'  
      +pedido.c_codigo_pdo+'/'  
      +pedido.v_nombre_dis
      
    );
   // this.modal_pedido_edit(pedido);
  }


   async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      mode:'ios',
      header: 'Estatus Pedido',
      subHeader:'Seleccione un Estatus',
      buttons: [{
        text: 'Pendiente',
        icon: 'copy-outline',
        cssClass: 'pendiente',
        data: '1',
        handler: () => {
          console.log('Pendiente clicked');
        }
      }, {
        text: 'Surtiendo',
        icon: 'duplicate-outline',
        cssClass: 'surtiendo',
        data: '2',
        handler: () => {
          console.log('Surtiendo clicked');
        }
      }, {
        text: 'Surtido',
        icon: 'shield-checkmark-outline',
        cssClass: 'surtido',
        data: '3',
        handler: () => {
          console.log('Surtido clicked');
        }
      }]
    });
    await actionSheet.present();

    const { data } = await actionSheet.onDidDismiss();
    console.log( 'estatus = ' + data );
    this.ls_estatus =  data
    await this.getPedidos();
    console.log('getPedidos');

  }

  fn_filtro_pedido(evento){
      console.log(evento);
      this.texto_filtro = evento.detail.value;
  }


  async modal_pedido_edit (pedido){
    console.log(pedido);
    const modal = await this.modalController.create({
    component:PedidoEditPage ,
    componentProps:{pedido} }   );
    await modal.present();
      modal.onWillDismiss().then(data => {
        console.log(data);
      }).catch(error => {
        console.log(error);
      })
    
    
    
  }

}




