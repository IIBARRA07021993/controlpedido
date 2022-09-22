import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
 {
    path: '',
    redirectTo: 'login',
    //redirectTo: 'palet-ubi', 
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'pedidos/:id',
    loadChildren: () => import('./pages/pedidos/pedidos.module').then( m => m.PedidosPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  
  {
    path: 'pedido-edit/:tem/:emp/:ped/:dis',
    loadChildren: () => import('./pages/pedido-edit/pedido-edit.module').then( m => m.PedidoEditPageModule)
  },
  {
    path: 'configuraciones',
    loadChildren: () => import('./pages/configuraciones/configuraciones.module').then( m => m.ConfiguracionesPageModule)
  },
  {
    path: 'pedido-pal/:tem/:emp/:ped/:pre',
    loadChildren: () => import('./pages/pedido-pal/pedido-pal.module').then( m => m.PedidoPalPageModule)
  },
  {
    path: 'palet-ubi',
    loadChildren: () => import('./pages/palet-ubi/palet-ubi.module').then( m => m.PaletUbiPageModule)
  },
  {
    path: 'man-virtual',
    loadChildren: () => import('./pages/man-virtual/man-virtual.module').then( m => m.ManVirtualPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
