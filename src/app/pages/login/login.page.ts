import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';



import { ApiService } from 'src/app/services/api.service';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';
import { ConfiguracionesPage } from '../configuraciones/configuraciones.page';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  usuario = {
    user: 'ADMIN',
    password: 'ccons'
  }

  constructor(
    private router: Router,
    private apiService: ApiService,
    private ultilService: UtilService,
    public popoverController: PopoverController,
    private modalController: ModalController,
    private configServ: ConfiguracionService,



  ) { }


  /* 
ionViewDidEnter() {
 console.log('Home page did enter');
 }
 ionViewDidLeave() {
 console.log('Home page did leave');
 }
 ionViewWillEnter() {
 console.log('Home page will enter');
 }
 ionViewWillLeave() {
 console.log('Home page will leave');
 }*/

 

  ngOnInit() {

  }

  async login() {
    await this.ultilService.showLoading('Validando Usuario...')
    console.log('showLoading');
    await this.configServ.getappconfig()
    console.log('getappconfig');
    await this.fn_valida_login().then(async (resolve) => {
      console.log('valida_login');
      if (resolve) {
        await this.fn_getusuariologin();
        console.log('getusuariologin');
      }
    });

    await this.ultilService.loading.dismiss();
    console.log('dismiss');
  }

  fn_configuraciones() {
    this.router.navigateByUrl('configuraciones');
  }

  fn_valida_login() {
    return new Promise((resolve) => {
      if (typeof environment.url_api_app === 'undefined' || environment.url_api_app == '') {

        this.ultilService.presentToast(
          'Configuracion',
          'Falta Configuracion del Api',
          1500,
          'warning-outline',
          'danger');
        resolve(false)
      }


      if (typeof this.usuario.user === 'undefined' || this.usuario.user == '') {

        this.ultilService.presentToast(
          'Invalido',
          'Usuario No valido',
          1500,
          'warning-outline',
          'danger');
        resolve(false)
      }

      if (typeof this.usuario.password === 'undefined' || this.usuario.password == '') {

        this.ultilService.presentToast(
          'Contraseña Invalida',
          'Contraseña Invalida',
          1500,
          'warning-outline',
          'danger');
        resolve(false)
      }

      resolve(true)
    })
  }




  fn_getusuariologin() {
    return new Promise((resolve) => {
      this.apiService.getapi('assusuarios/login?codigo=' + this.usuario.user.toUpperCase().trim())
        .subscribe((resp: any) => {
          console.log(resp);
          if (resp.length == 0) {

            this.ultilService.presentToast(
              'Invalido',
              'Usuario No valido',
              1500,
              'warning-outline',
              'danger');
            resolve(false)

          } else {

            let contra: string = resp[0]
            console.log(contra);

            if (contra.trim() == this.usuario.password.trim()) {
              environment.usuario_login = this.usuario.user
              this.usuario.user = ''
              this.usuario.password = ''
              this.router.navigateByUrl('inicio');
              resolve(true)

            } else {
              this.ultilService.presentToast(
                'Contraseña Invalida',
                'Contraseña Invalida',
                1500,
                'warning-outline',
                'danger');
              resolve(false)
            }


          }

        }, (error) => {
          console.error(JSON.stringify(error))
          this.ultilService.presentToast(
            'Error',
            'Ocurrio un error en la peticion al API',
            1500,
            'warning-outline',
            'danger');
          resolve(false)

        })

    })
  }


  async fn_modalConfig() {
    const modal = await this.modalController.create({
      component: ConfiguracionesPage
    });
    await modal.present();


    modal.onWillDismiss().then(data => {
      console.log(data);
    }).catch(error => {
      console.log(error);
    })

  }

}
