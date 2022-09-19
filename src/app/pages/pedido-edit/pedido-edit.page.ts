import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx'
import { AlertController, IonInput } from '@ionic/angular';
import { Pedidosdet, Pellet } from 'src/app/interfaces/interfaces';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-pedido-edit',
  templateUrl: './pedido-edit.page.html',
  styleUrls: ['./pedido-edit.page.scss'],
})
export class PedidoEditPage implements OnInit {
  @ViewChild('codpal', {static: false}) codpal!: IonInput;

  pedido=  {
    c_codigo_tem: '',
    c_codigo_emp :'',
    c_codigo_pdo:'',
    v_nombre_dis:''
  }
  pedidos_det :Pedidosdet[] = [];
  codigo :string ='';
  pallet : Pellet[]= [];
  precentacion_add :string[] =[] ;

  constructor( 
                private apiserv:ApiService,
                private ultilService:UtilService,
                private barcodeScanner: BarcodeScanner,
                public alertController: AlertController,
                private activatedRoute: ActivatedRoute,
                private keyboard: Keyboard
                ) {  


                  
                }

async ngOnInit() {
 


  await this.f_get_parametros();
  console.log('f_get_parametros')
 //this.ultilService.showLoading('Cargando detalle..')
  await  this.fn_getPedidos_det(this.pedido.c_codigo_tem.trim() 
                                + this.pedido.c_codigo_emp.trim() 
                                +this.pedido.c_codigo_pdo.trim());

 // await this.ultilService.loading.dismiss();
 console.log('f_get_parametros')
  await this.codpal.setFocus() 
  
}


f_get_parametros(){
  return new Promise(  async (resolve)=>{
    this.pedido.c_codigo_tem = this.activatedRoute.snapshot.paramMap.get('tem')
    this.pedido.c_codigo_emp= this.activatedRoute.snapshot.paramMap.get('emp')
    this.pedido.c_codigo_pdo= this.activatedRoute.snapshot.paramMap.get('ped')
    this.pedido.v_nombre_dis= this.activatedRoute.snapshot.paramMap.get('dis')
    resolve(true);

  })
 

}

async enterkey(){

  console.log('paso 1')
  await  this.ultilService.showLoading('Valiando Pallet...')
  console.log('showLoading');
  await this.fn_usp_control_pedidos_app()
  console.log('paso 3')
  await this.ultilService.loading.dismiss();
  console.log('dismiss');
}



  fn_usp_control_pedidos_app(){
  return new Promise( async  (resolve ,reject)=>{
    var json = {
      c_codigo_tem: this.pedido.c_codigo_tem,
      c_codigo_emp: this.pedido.c_codigo_emp,
      c_codigo_pal: this.codigo,
      c_codigo_pdo: this.pedido.c_codigo_pdo }


        console.log(json)
        console.log(JSON.stringify(json))
        this.apiserv.StoredProcedureput( 'usp_control_pedidos_app?as_operation=1+&as_json='+JSON.stringify(json)
                                        
                                      ).subscribe( (resp:string )=>{
        
          console.log(resp)
          console.log('PASO 2')
          var arrayresp = resp.split('|');


          console.log(arrayresp);
            if (arrayresp.length > 0) {

                  if (arrayresp[0] == '1') {

                    this.ultilService.presentToastok( 
                      'Pallet Agregado' ,
                      arrayresp[1] ,  
                      2500 ,
                      'checkmark-outline' ,
                      'success');
                      
                      this.fn_getPedidos_det(this.pedido.c_codigo_tem.trim() 
                      + this.pedido.c_codigo_emp.trim() 
                      +this.pedido.c_codigo_pdo.trim());
                      
                      resolve(true);
                  }else{
                      this.ultilService.AlertaOK(
                      'Atención ',  'Agregar Pallet ',  arrayresp[1],   'OK')
                      resolve(true);
                  }

            }else{
              console.log('No regreso Respuesta el servicio usp_control_pedidos_app')
              resolve(false);
            }
          
      })

    



  })


}



async fn_scanner(){

  await this.barcodeScanner.scan().then( async barcodeData => {
      this.codigo  = barcodeData.text
      console.log('Barcode data', barcodeData);
     await this.enterkey()
 }).catch(err => {
     console.log('Error', err);
     alert( JSON.stringify(err) );
 });

}


fn_getPedidos_det(id:string){
      return new Promise(   (resolve)=>{
        this.pedidos_det= [];
        this.apiserv.getapi('v_pedidosappdet/' + id ).subscribe((resp :Pedidosdet[])=>{
        if (resp.length > 0 ) {
          resp.forEach(element => {
            this.pedidos_det.push(element)
          });
           console.log(this.pedidos_det); }

            resolve(true)
          })
        })
        
}

  
  async Alerta_Presentacion( ) {
    const alert = await this.alertController.create({
      mode :'ios',
      header:  'Atención',
      subHeader: 'Pedido : ' + this.pedido.c_codigo_pdo,
      message : 'Existen Presentación en el Pallet que no están en el pedido. ¿Desea agregar al pedido esta presentación?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: ( ) => {
          this.codigo =""
          this.codpal.setFocus()
           console.log( 'Alert canceled') ;
      
          
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.codigo =""
            this.codpal.setFocus()
            console.log( 'Alert confirmed');
          },
        },
      ],
    });
  
    await alert.present();
  
    const { role } = await alert.onDidDismiss();
    console.log( `Dismissed with role: ${role}`);
  }
}
